function angleToRPM(angle)
{
    var rpm = defaultValues.rpmAngleFactor*(angle - limits.angleMin)
    return Math.round(rpm)
}

function rpmToAngle(rpm)
{
    var angle
    angle = limits.angleMin + rpm * defaultValues.invRpmAngleFactor
    return Math.round(angle)
}

function calculateSpeed(gear, rpm)
{
    var gearIndex = (defaultValues.gearRatios.length + gear) % defaultValues.gearRatios.length
    var speed_kmph = defaultValues.rpmToSpeedFactor*defaultValues.gearRatios[gearIndex]*rpm
    return Math.round(speed_kmph)
}

function speedToAngle(speed)
{
    var localSpeed = speed
    if (speed < 0)
    {
        localSpeed = -speed
    }
    var angle
    angle = defaultValues.speedNeedleAngle + localSpeed * defaultValues.speedAngleFactor
    return Math.round(angle)
}

function getStateString(inputGear, inputRpm)
{
    if (inputGear === undefined)
    {
        inputGear = gear.currentGear
    }

    if (inputRpm === undefined)
    {
        inputRpm = rotationPerMinute.rpm//angleToRPM(rotationAmount.angle)
    }

    let verbose = false;
    let stateString = "State: " + currentState.state + ", Current Mode: " + getCarModesClassEnumString(currentCarMode.currentModeJs)
    let gearString = ", Gear: " + inputGear;

    var rpm = inputRpm
    let speedString = ""
    if (verbose)
    {
        let speedKmphString = ", Speed: " + calculateSpeed(inputGear, inputRpm) + " km/h"
        let speedKmphAngleString = ", Speed Angle: " + speedToAngle(currentSpeed.speed) + " deg"
        speedString = speedKmphString + speedKmphAngleString
    }
    else
    {
        speedString = ", Speed: " + calculateSpeed(inputGear, inputRpm) + " km/h"
    }

    let gasString = ", Gas: " + gasAmount.gas;

    let engineRotationString = ""
    if (verbose)
    {
        let engineRPMString = ", Engine Rotation: " + inputRpm + " rpm"
        let engineRPMAngleString = ", Rotation Angle: " + rotationAmount.angle.toString() + " deg"
        engineRotationString = engineRPMString + engineRPMAngleString
    }
    else
    {
        engineRotationString = ", RPM: " + rpm
    }

    let accelerationString = ", Accelerating: " + acceleration.active.toString();

    let resultStateString = stateString + gearString + engineRotationString + gasString + speedString + accelerationString;
    return resultStateString
}

function printState(inputGear, inputRpm)
{
    console.log(getStateString(inputGear, inputRpm))
}

function switchCarModeJs(modeToSwitch)
{
    let carMode = currentCarMode.currentModeJs
    if (carMode === modeToSwitch)
    {
        return
    }

    let nextState = "Next State: ";
    let resultString = "";

    switch(modeToSwitch) {
    case getCarModesClassEnum("PARK"):
        resultString = nextState + "Park"
        gear.currentGear = 0;
        acceleration.active = false
        break;
    case getCarModesClassEnum("NEUTRAL"):
        resultString = nextState + "Neutral"
        gear.currentGear = 0;
        acceleration.active = false
        break;
    case getCarModesClassEnum("DRIVE"):
        resultString = nextState + "Drive"
        gear.currentGear = 1;
        acceleration.active = false
        break;
    case getCarModesClassEnum("REVERSE"):
        resultString = nextState + "Reverse"
        gear.currentGear = -1;
        acceleration.active = false
        break;
    default:
        console.log("Warning: Undefined car mode!(" + modeToSwitch + ").")
    }

    currentCarMode.currentModeJs = modeToSwitch
}

function switchCarState(stateToSwitch)
{
    if (currentState.state === stateToSwitch)
    {
        return
    }

    if (!canSwitchCarState())
    {
        console.log("Info: Can not switch to " + currentState.state.toString() + " state, should be in Park mode in order to switch states! (Currently in " + getCarModesClassEnumString(currentCarMode.currentModeJs) + " mode)")
        return
    }

    switch(stateToSwitch) {
    case "OFF":
        currentState.state = "OFF"
        break;
    case "ON":
        currentState.state = "ON"
        break;
    default:
        console.log("Warning: Undefined car state: " + currentState.state + ".")
    }
}

function canSwitchCarState()
{
    if (currentCarMode.currentModeJs === getCarModesClassEnum("PARK"))
    {
        return true;
    }

    return false;
}

function switchGasControlState(stateToSwitch)
{
    if (gasControlState.state === stateToSwitch)
    {
        return
    }

    if (!canSwitchGasState())
    {
        console.log("Info: Can not switch to " + gasControlState.state.toString() + " state, should NOT be in Park mode in order to switch states! (Currently in " + getCarModesClassEnumString(currentCarMode.currentModeJs) + " mode)")
        return
    }

    switch(stateToSwitch) {
    case "IDLE":
        gasControlState.state = "IDLE"
        break;
    case "GAS":
        gasControlState.state = "GAS"
        break;
    case "INERT":
        gasControlState.state = "INERT"
        break;
    case "BREAK":
        gasControlState.state = "BREAK"
        break;
    default:
        console.log("Warning: Undefined gas control state: " + gasControlState.state + ".")
    }
}

function canSwitchGasState()
{
    if (currentCarMode.currentModeJs !== getCarModesClassEnum("PARK"))
    {
        return true;
    }

    return false;
}

function canIncreaseGas()
{
    if (currentCarMode.currentModeJs === getCarModesClassEnum("PARK"))
    {
        console.log("Can not increase gas, car is in Park mode. (Switch to Neutral, Drive or Reverse mode.)")
        return false;
    }

    if (gasControlState.state !== "GAS")
    {
        console.log("Can not increase gas, gas control is in " + gasControlState.state.toString() + " state. (Switch to GAS state first)")
        return false;
    }

    return true;
}

function increaseGas()
{
    if (!canIncreaseGas())
    {
        return
    }

    gasAmount.gas++
    if (gasAmount.gas > limits.gasMax)
    {
        gasAmount.gas = limits.gasMax
    }
}

function canMoveShifterToParkMode()
{
    if (Math.abs(currentSpeed.speed) >= 10.0)
    {
        return false
    }

    return true
}

function onMoveShifterToParkMode()
{
    if (!canMoveShifterToParkMode())
    {
        console.log("Can not move shifter to Park mode while driving. (Press Break and stop the car or move to Neutral mode instead.)");
        return
    }
    switchCarModeJs(getCarModesClassEnum("PARK"))
}

function onMoveShifterToReverseMode()
{
    switchCarModeJs(getCarModesClassEnum("REVERSE"))
}

function onMoveShifterToNeutralMode()
{
     switchCarModeJs(getCarModesClassEnum("NEUTRAL"))
}

function onMoveShifterToDriveMode()
{
    switchCarModeJs(getCarModesClassEnum("DRIVE"))
}

function keyPressed(key)
{
    return String.fromCharCode(key)
}

function updateKeyStatus(key, color)
{
    keyText.text = keyPressed(key)
    if (color !== undefined)
    {
        keyText.color = color
    }
}

function help()
{
    let helpString =    "\n" +
                        "Help: \n" +
                        "Press '+' to turn the engine on.\n" +
                        "Press '+' again to turn it off.\n" +
                        "Use P key to put the vehicle into Park mode.\n" +
                        "Use R key to put the vehicle into Reverse mode (driving backwars).\n" +
                        "Use N key to put the vehicle into Neutral mode (for short stops).\n" +
                        "Use D key to put the vehicle into Drive mode.\n" +
                        "Use Up   (" + String.fromCharCode(24) + ") arrow key to increase the engine rotation (gas).\n" +
                        "Use Down (" + String.fromCharCode(25) + ") arrow key to decrease the engine rotation (break).\n" +
                        "Press T key to output speed calculation scan test for different gears and rotations.\n" +
                        "(Reference link: https://www.rac.co.uk/drive/advice/learning-to-drive/how-to-drive-an-automatic/)\n";
    console.log(helpString)
}

.import "HelperFunctions.js" as HelperFunctions

function checkKeyReleased(event) {
    HelperFunctions.updateKeyStatus(event.key, "#FF0000")
    switch(event.key) {
    case Qt.Key_Up:
        HelperFunctions.updateKeyStatus(24, "#FF0000")

        if (currentCarMode.currentModeJs === getCarModesClassEnum("PARK")) {
            return
        }

        if (gasControlState.state === "GAS") {
            HelperFunctions.switchGasControlState("INERT")
            acceleration.active = false
            updateGas()

            HelperFunctions.printState()
            event.accepted = true
        }
        break;
    case Qt.Key_Down:
        HelperFunctions.updateKeyStatus(25, "#FF0000")
        break;
    default:
    }
}

function checkKeyPressed(event) {
    HelperFunctions.updateKeyStatus(event.key, "#00FF00")
    let carMode = currentCarMode.currentMode

    if (event.key === Qt.Key_Plus) {
      onStartCarButtonPressed()
      event.accepted = true
      return;
    }

    if (currentState.state === "OFF") {
        return;
    }

    switch (event.key) {
    case (Qt.Key_Up):
        HelperFunctions.updateKeyStatus(24)
        onGasPedalPressed()
        event.accepted = true
        break;
    case (Qt.Key_Down):
        HelperFunctions.updateKeyStatus(25)
        onBreakPedalPressed()
        event.accepted = true
        break;
    case (Qt.Key_P):
        HelperFunctions.onMoveShifterToParkMode()
        if (currentCarMode.currentModeJs === getCarModesClassEnum("PARK")) {
            hideRearCameraView()
            higlightParkingSign()
        }
        event.accepted = true
        break;
    case (Qt.Key_R):
        HelperFunctions.onMoveShifterToReverseMode()
        hideParkingSignHiglight()
        showRearCameraView()
        event.accepted = true
        break;
    case (Qt.Key_N):
        HelperFunctions.onMoveShifterToNeutralMode()
        hideParkingSignHiglight()
        hideRearCameraView()
        event.accepted = true
        break;
    case (Qt.Key_D):
        HelperFunctions.onMoveShifterToDriveMode()
        hideParkingSignHiglight()
        hideRearCameraView()
        event.accepted = true
        break;
    case (Qt.Key_T):
        testSpeedCalculation()
        break;
    default:
        console.log("Key " + String.fromCharCode(event.key) +" not supported")
    }

    updateCarData()
    HelperFunctions.printState()
}

function onStartCarButtonPressed() {
    switch (currentState.state) {
    case "OFF":
        HelperFunctions.switchCarState("ON")
        break;
    case "ON":
        HelperFunctions.switchCarState("OFF")
        break;
    default:
        console.log("Undefined car state: '" + currentState.state.toString() + "'")
    }
}

function onGasPedalPressed() {
    HelperFunctions.switchGasControlState("GAS")
    if (gasControlState.state === "GAS") {
        acceleration.active = true;
    }
    rotationAmount.angle = engineRotationNeedle.rotationAmountAngle
    HelperFunctions.increaseGas()
    acceleration.active = true;
}

function onBreakPedalPressed() {
    HelperFunctions.switchGasControlState("BREAK")
    acceleration.active = false;
    deccelerate()
}

function showRearCameraView() {
    rearCameraView.visible = true
    rearCameraView.opacity = 0.8
    //dashboard.visible = false
    viewFinder.visible = true
    viewFinder.opacity = 0.7
}

function hideRearCameraView() {
    rearCameraView.visible = false
    dashboard.visible = true
    viewFinder.visible = false
}

function higlightParkingSign() {
    parkRect.visible = true
}

function hideParkingSignHiglight() {
    parkRect.visible = false
}

function decreaseGas() {
    gasAmount.gas--
    if (gasAmount.gas < limits.gasMin) {
        gasAmount.gas = limits.gasMin
        HelperFunctions.switchGasControlState("INERT")
        currentSpeed.speed = HelperFunctions.calculateSpeed(gear.currentGear, rotationPerMinute.rpm)
    }
}

function deccelerate() {
    if (acceleration.active) {
        return
    }

    if (currentCarMode.currentModeJs === getCarModesClassEnum("PARK")) {
        console.log("Car parked, Gas Amount: ..." + gasAmount.gas)
        return
    }

    if (gasControlState.state === "INERT" || gasControlState.state === "BREAK") {
        decreaseGas()
    }
    else {
        console.log("Current state: " + currentState.state.toString())
    }
}

function updateGas() {
    if (currentCarMode.currentModeJs === getCarModesClassEnum("PARK")) {
        return
    }

    if (!acceleration.active) {
        gasAmount.gas -= limits.gasMax * 1.0/20/constants.msPerSecond * gasTimer.interval/2.0
        if (gasAmount.gas < 0.0) {
            gasAmount.gas = 0.0
        }

        updateCarData()
    }
}

function updateCarData() {
    rotationPerMinute.rpm = defaultValues.idleRotationSpeed + gasAmount.gas * defaultValues.rotationPerGasUnitMultiplier
    rotationAmount.angle = HelperFunctions.rpmToAngle(rotationPerMinute.rpm)
    currentSpeed.speed = HelperFunctions.calculateSpeed(gear.currentGear, rotationPerMinute.rpm)
    speedNeedle.rotationAmountAngle = HelperFunctions.speedToAngle(currentSpeed.speed)
    updateGear(gear.currentGear, rotationPerMinute.rpm)
    HelperFunctions.printState()
}

function testSpeedCalculation() {
    var lastSpeed = 0
    var nextSpeed = lastSpeed
    var rpm = defaultValues.rpm;
    for (var gear = limits.gearMin; gear < limits.gearMax; gear++) {
        console.log("Gear: " + gear)
        if (gear <= 1) {
            rpm = defaultValues.rpm;
        }
        while (rpm < limits.rpmMax) {
            lastSpeed = HelperFunctions.calculateSpeed(gear, rpm)
            nextSpeed = HelperFunctions.calculateSpeed(gear + 1, rpm - defaultValues.rpmStep)
            HelperFunctions.printState(gear, rpm)
            if (shouldUpdateGearUp(gear, rpm)) {
                lastSpeed = nextSpeed
                console.log("Next " + HelperFunctions.getStateString(gear + 1, rpm - defaultValues.rpmStep))
                rpm -= defaultValues.rpmStep;
                break
            }

            rpm += defaultValues.rpmStep
        }
    }
}

function shouldUpdateGearUp(gear, rpm) {
    if (gear < 1 || gear > limits.gearMax - 2) {
        return false
    }

    if  (rpm >= defaultValues.gearShiftRPMThreshold) {
        return true
    }

    return false
}

function shouldUpdateGearDown(gear, rpm) {
    if (gear < 2 || gear > limits.gearMax - 1) {
        return false
    }

    if  (rpm <= defaultValues.gearShiftRPMThreshold - defaultValues.rpmStep) {
        return true
    }

    return false
}

function updateGearUp(inputGear, inputRpm) {
    gear.currentGear = inputGear + 1
    rotationPerMinute.rpm -= defaultValues.rpmStep
    gasAmount.gas = gasAmount.gas - defaultValues.gearShiftGasStep
}

function updateGearDown(inputGear, inputRpm) {
    gear.currentGear = inputGear - 1
    rotationPerMinute.rpm -= defaultValues.rpmStep
    gasAmount.gas = gasAmount.gas + defaultValues.gearShiftGasStep
}

function updateGear(gear, rpm) {
    if (shouldUpdateGearUp(gear, rpm)) {
        updateGearUp(gear, rpm)
    }
    else if (shouldUpdateGearDown(gear, rpm)) {
        updateGearDown(gear, rpm)
    }
}

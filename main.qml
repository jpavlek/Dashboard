import QtQuick 2.9
import QtQuick.Window 2.2
import "CarControlLogic.js" as CarControlLogic
import "HelperFunctions.js" as HelperFunctions
import QtMultimedia 5.12
import qml.guide 1.0
Window {
    visible: true
    width: 905; height: 267
    title: qsTr("Armaturenbrett")

    DashboardBackground {
        id: dashboard
        Component.onCompleted: HelperFunctions.help()
    }

    Rectangle {
        id: parkRect
        width: 35; height: 35
        x: 227; y: 189
        radius: width/4
        color: "#77FFAA"
        opacity: 0.2
        visible: false
    }

    AnalogNeedle {
        id: engineRotationNeedle
        x: 282; y: 160
        rotationAmountAngle: rotationAmount.angle

        Behavior on rotationAmountAngle {
            NumberAnimation {
                id: currentNeedleRotation
                duration: 300
                easing.type: Easing.Linear
            }
        }

    }

    AnalogNeedle {
        id: speedNeedle
        x: 605; y: 160
        rotationAmountAngle: HelperFunctions.speedToAngle(currentSpeed.speed)

        Behavior on rotationAmountAngle {
            NumberAnimation {
                duration: 500
            }
        }
    }

    Text {
        width: 32
        id: speedText
        text: currentSpeed.speed
        x: 418; y: 223
        font.family: "Helvetica";
        font.pointSize: 13.4;
        font.bold: true
        horizontalAlignment: Text.AlignRight
        color: "#BBBBBB"
    }

    Text {
        width: 64
        id: mileageKmText
        text: defaultValues.mileageKm + currentSpeed.speed
        x: 293; y: 223
        font.family: "Helvetica";
        font.pointSize: 13.4;
        font.bold: true
        horizontalAlignment: Text.AlignRight
        color: "white"

        function setTextJs()
        {
            currentMileageKm.mileageKm += Math.abs(currentSpeed.speed)*textTimer.interval/3600000.0
            mileageKmText.text = Math.round(currentMileageKm.mileageKm)
        }
    }

    Timer {
        id: textTimer
        interval: 15000
        repeat: true
        running: true
        triggeredOnStart: true
        onTriggered: mileageKmText.setTextJs()
    }

    Timer {
        id: gasTimer
        interval: 100
        repeat: true
        running: true
        triggeredOnStart: true
        onTriggered: CarControlLogic.updateGas()
    }


    KeyInputController {
        id: eventKeyPressed
    }

    Item {
        id: rotationAmount
        property int angle: HelperFunctions.rpmToAngle(limits.rpmMin)
    }

    Item {
        id: rotationPerMinute
        property int rpm: limits.rpmMin
    }

    Item {
        id: gasAmount
        property real gas: limits.gasMin
    }

    Item {
        id: gear
        property int currentGear: defaultValues.gear
    }

    Item {
        id: currentCarMode
        property var currentModeJs: getCarModesClassEnum("PARK")
    }

    Item {
        id: acceleration
        property bool active: false
    }

    Item {
        id: currentSpeed
        property real speed: defaultValues.speed
    }

    Item {
        id: currentMileageKm
        property real mileageKm: defaultValues.mileageKm
    }

    Constants {
        id: constants
    }

    Limits {
        id: limits
    }

    DefaultValues {
        id: defaultValues
    }

    CarControlStates {
        id: currentState
    }

    GasControlStates {
        id: gasControlState
    }

    Rectangle {
        id: statusRect
        width: 36; height: 36
        color: "#AAAAAA"
        anchors.right: parent.right
        anchors.top: parent.top
        Text {
            id: statusText
            text: qsTr("OFF")
            anchors.centerIn: parent
            font.family: "Helvetica"
        }
    }

    Rectangle {
        id: keyRect
        width: 36; height: 36
        color: "#0C0B0D"
        opacity: (currentState.state === "OFF")? 0.8 : dashboard.opacity
        anchors.right: statusRect.left
        anchors.top: parent.top
        Text {
            id: keyText
            text: qsTr("")
            anchors.centerIn: parent
            font.family: "Helvetica";
        }
        border.width: 2
        border.color: "#666666"
    }

    Image {
        id: rearCameraView
        source: "/Resources/RearCameraView.jpg"
        x: 0; y: 0
        width: 905; height: 267
        visible: false
    }

    Camera {
        id: rearCamera
    }

    VideoOutput {
        id: viewFinder
        source: rearCamera
        anchors.left: rearCameraView.horizontalCenter
        anchors.right: rearCameraView.right
        anchors.top: rearCameraView.top
        anchors.bottom: rearCameraView.bottom
        opacity: 1.0
        visible: false
        z: 1
    }

    function getCarModesClassEnum(modeName)
    {
        let result = undefined
        switch (modeName)
        {
        case "PARK":
            result = CarModesClassEnum.PARK
            break;
        case "REVERSE":
            result = CarModesClassEnum.REVERSE
            break;
        case "NEUTRAL":
            result = CarModesClassEnum.NEUTRAL
            break;
        case "DRIVE":
            result = CarModesClassEnum.DRIVE
            break;
        }

        return result
    }

    function getCarModesClassEnumString(modeName)
    {
        let result = ""
        switch (modeName)
        {
        case CarModesClassEnum.PARK:
            result = "Park"
            break;
        case CarModesClassEnum.REVERSE:
            result = "Reverse"
            break;
        case CarModesClassEnum.NEUTRAL:
            result = "Neutral"
            break;
        case CarModesClassEnum.DRIVE:
            result = "Drive"
            break;
        }

        return result
    }
}

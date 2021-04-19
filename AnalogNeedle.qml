import QtQuick 2.9

// Analog index image (rpm)
Image {
    id: index
    source: "/Resources/Index.png"
    x: 0; y: 0
    transform: indexRotation

    // Rotation of the analog index image (rpm) with defined center of rotation
    Rotation {
        id: indexRotation
        origin.x: 7; origin.y: 7
        angle: rotationAmountAngle
    }

    property real rotationAmountAngle: (currentCarMode.currentModeJs === getCarModesClassEnum("PARK"))? CarControlLogic.rpmToAngle(limits.rpmMin): acceleration.active? rotationAmount.angle: CarControlLogic.rpmToAngle(defaultValues.idleRotationSpeed)
}


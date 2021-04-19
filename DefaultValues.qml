import QtQuick 2.9

Item {
    property int idleRotationSpeed: 800
    property int rpm: 1000
    property int rpmStep: 1000
    property int gearShiftRPMThreshold: 3000

    property int gear: 0

    property real gearRatio_1:  2.97
    property real gearRatio_2:  2.07
    property real gearRatio_3:  1.43
    property real gearRatio_4:  1.0
    property real gearRatio_5:  0.84
    property real gearRatio_6:  0.56
    property real gearRatio_R: -3.38

    property real invGearRatio_0: 0.0
    property real invGearRatio_1: 1.0/gearRatio_1
    property real invGearRatio_2: 1.0/gearRatio_2
    property real invGearRatio_3: 1.0/gearRatio_3
    property real invGearRatio_4: 1.0/gearRatio_4
    property real invGearRatio_5: 1.0/gearRatio_5
    property real invGearRatio_6: 1.0/gearRatio_6
    property real invGearRatio_R: 1.0/gearRatio_R

    property var gearRatios: [invGearRatio_0, invGearRatio_1, invGearRatio_2, invGearRatio_3, invGearRatio_4, invGearRatio_5, invGearRatio_6, invGearRatio_R]

    property real rearAxleRatio : 3.64
    property real invRearAxleRatio : 1.0/rearAxleRatio

    property real tireInchSize : 18.0

    property real rpmToSpeedFactor : constants.cmPerInch*Math.PI*constants.mpsTokmphFactor*invRearAxleRatio*tireInchSize/constants.cmPerMeter/constants.minPerHour
    property real speed: 0.0

    property real speedNeedleAngle: 120.0
    property real rpmAngleDivision: 193.0
    property int rpmScaleMultiplier: 5
    property real rpmAngleFactor: rpmScaleMultiplier*rpm/rpmAngleDivision
    property real invRpmAngleFactor: 1.0/rpmAngleFactor

    property real speedAngleFactor: 0.965

    property real gearShiftGasStep: 40.0
    property real rotationPerGasUnitMultiplier: 25.0

    property real mileageKm: 104250.0
}

import QtQuick 2.9

Item {
    property real minPerHour: 60.0
    property real secPerMin: 60.0
    property real cmPerInch: 2.54
    property real cmPerMeter: 100.0
    property real mpsTokmphFactor: 3.6
    property real msPerSecond: 1000.0
    property real msPerHour: msPerSecond * secPerMin * minPerHour
}

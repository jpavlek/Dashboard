import QtQuick 2.9

State
{
    name: "OFF"
    PropertyChanges { target: dashboard; opacity: 0.5}
    PropertyChanges { target: statusRect; color : "#AAAAAA"}
    PropertyChanges { target: statusText; text : "OFF"}
}

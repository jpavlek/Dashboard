import QtQuick 2.9

State
{
    name: "ON"
    PropertyChanges { target: dashboard; opacity: 0.9}
    PropertyChanges { target: statusRect; color : "#FFFFFF"}
    PropertyChanges { target: statusText; text : "ON"}
}

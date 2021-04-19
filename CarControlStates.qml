import QtQuick 2.9

Item {
    state: "OFF"
    states: [
        State {
            name: "OFF"
            PropertyChanges { target: dashboard; opacity: 0.8}
            PropertyChanges { target: statusRect; color : "#AAAAAA"}
            PropertyChanges { target: statusText; text : "OFF"}
        },
        State {
            name: "ON"
            PropertyChanges { target: dashboard; opacity: 1.0}
            PropertyChanges { target: statusRect; color : "#FFFFFF"}
            PropertyChanges { target: statusText; text : "ON"}
        }
    ]
}

import QtQuick 2.9

Item {
    state: "IDLE"
    states: [
        State {
            name: "IDLE"
            PropertyChanges { target: dashboard; opacity: 0.9}
            PropertyChanges { target: statusRect; color : "#FFFF00"}
            PropertyChanges { target: statusText; text : "IDLE"}
        },
        State {
            name: "GAS"
            PropertyChanges { target: dashboard; opacity: 1.0}
            PropertyChanges { target: statusRect; color : "#00FF00"}
            PropertyChanges { target: statusText; text : "GAS"}
        },
        State {
            name: "INERT"
            PropertyChanges { target: dashboard; opacity: 0.85}
            PropertyChanges { target: statusRect; color : "#FF7700"}
            PropertyChanges { target: statusText; text : "INERT"}
        },
        State {
            name: "BREAK"
            PropertyChanges { target: dashboard; opacity: 0.75}
            PropertyChanges { target: statusRect; color : "#AA0000"}
            PropertyChanges { target: statusText; text : "BREAK"}
        }
    ]
}

import QtQuick 2.9
import QtQuick.Window 2.2
import "CarControlLogic.js" as CarControlLogic

// Key input controller
Item {
    id: eventKeyPressed
    anchors.fill: parent
    focus: true
    Keys.onReleased: {
        CarControlLogic.checkKeyReleased(event)
    }
    Keys.onPressed: {
        CarControlLogic.checkKeyPressed(event)
    }
}


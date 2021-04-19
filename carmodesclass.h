#pragma once

#include <QObject>

class CarModesClass
{
    Q_GADGET
public:
    enum Value
    {
        PARK,
        REVERSE,
        NEUTRAL,
        DRIVE
    };
    Q_ENUM(Value)
private:
    explicit CarModesClass();
};

#ifndef MOTORSPEED_H_
#define MOTORSPEED_H_

#include <Servo.h>
#include "config.h"

//Define sensor Motor

#define RIGHT_MOTOR 0
#define LEFT_MOTOR 2

void setupmotor();
void setSpeedsMotor(int leftSp,int rightSp);
#endif

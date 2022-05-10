#ifndef MOTORSPEED_H_
#define MOTORSPEED_H_

#include <Servo.h>

//Define sensor Motor

 #define RIGHT_MOTOR 2
 #define LEFT_MOTOR 0


void setupmotor();
void setSpeedsMotor(int leftSp,int rightSp);
#endif

#ifndef MOTORMOVEMENTCONTROLLER_H_
#define MOTORMOVEMENTCONTROLLER_H_

#include "motorSpeed.h"
#include "sensorFollow.h" 

/*
  Following Line - Controller
*/

extern int error;
extern int lastError;
extern int derivate;
extern long integral;
extern float kp;
extern float ki;
extern float kd;
extern bool checkControl;
extern bool overIntersection;

/*
  Movement Controller
*/
bool followLine(int speed);
bool control(int speed);
bool turn(int direction,int speed);
bool timedMove(int speed,  int time, long *timeElapsed);
bool timedTurn(int direction,int speed, int time, long *timeElapsed);
void foreverForward(int speed);
#endif

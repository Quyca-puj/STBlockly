#ifndef MOTORMOVEMENTCONTROLLER_H_
#define MOTORMOVEMENTCONTROLLER_H_

#include "motorSpeed.h"
#include "sensorFollow.h"
#include "config.h"

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
extern int error;
extern float kp;
extern float ki;
extern float kd;
extern int lastError;
extern int last_proportional;
extern long integral;
extern bool checkControl;

bool followLine(int speed);
bool control(int speed);
bool turn(int direction,int speed);
bool timedMove(int speed,  int time, long *timeElapsed);
bool timedTurn(int direction,int speed, int time, long *timeElapsed);
void foreverForward(int speed);
bool STDelay(long, long *);
#endif

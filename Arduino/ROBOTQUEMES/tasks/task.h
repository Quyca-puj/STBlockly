#ifndef TASK_H_
#define TASK_H_

#include <Arduino.h>
#include "../RobotConstants.h"

struct Task
{
    char command[BUFFER_SIZE];
    char type[BUFFER_SIZE];
    long speed;
    long time;
    long period;
    char emo1[BUFFER_SIZE];
    char emo2[BUFFER_SIZE];
    int ack;
    Task(String command, int ack);
    Task();
};

#endif

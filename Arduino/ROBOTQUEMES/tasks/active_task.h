#ifndef ACTIVE_TASK_H_
#define ACTIVE_TASK_H_

#include <Arduino.h>
#include "../RobotConstants.h"

class ActiveTask
{
public:
    char command[BUFFER_SIZE];
    int ack;
    ActiveTask(String command, int ack);
    ActiveTask();
};

#endif

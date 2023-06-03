#ifndef TASK_QUEUE_H_
#define TASK_QUEUE_H_

#include "../RobotConstants.h"
#include "../utils.h"
#include "task.h"

class TaskQueue
{
public:
    int pendingTasks;
    Task* runningTasks[PARALLEL_CUSTOM_SIZE];
    TaskQueue();
    bool isEmpty();
    void push(Task* task);
    Task* peekPrevious();
    Task* pop();
};

#endif

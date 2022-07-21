#ifndef UTILS_H_
#define UTILS_H_
#include <Arduino.h>
#include "RobotConstants.h"
#define shouldLog true
#define PARALLEL_CUSTOM_SIZE 10

void STprint(String msg);
void STprint(char * msg);
void STprint(int msg);
void STprint(long msg);
void STprint(unsigned long msg);

class Task
{
public:
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

class ActiveTask
{
public:
    char command[BUFFER_SIZE];
    int ack;
    ActiveTask(String command, int ack);
    ActiveTask();
};

class TaskList
{
public:
    int pendingTasks;
    ActiveTask* runningTasks[PARALLEL_CUSTOM_SIZE];
    TaskList();
    void addNewTask(Task* task);
    int searchAck(String command);
    void removeTask(String task);
};

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

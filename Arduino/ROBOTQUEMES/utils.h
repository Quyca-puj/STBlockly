#ifndef UTILS_H_
#define UTILS_H_
#include <Arduino.h>
#include "RobotConstants.h"
#include "tasks/task.h"

#define shouldLog true

void STprint(String msg);
void STprint(int msg);
void STprint(long msg);
void STprint(unsigned long msg);

#endif

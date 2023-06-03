#include "task.h"

Task::Task()
{
  strcmp(this->command,EMPTY_STRING);
  strcmp(this->type,EMPTY_STRING);
  this->ack = -1;
  strcmp(this->emo1,EMPTY_STRING);
  strcmp(this->emo2,EMPTY_STRING);
  this->speed = -1;
  this->time = -1;
  this->period = -1;
}

Task::Task(String command, int ack)
{
  command.toCharArray(this->command, BUFFER_SIZE);
  this->ack = ack;
  strcmp(this->type,EMPTY_STRING);
}

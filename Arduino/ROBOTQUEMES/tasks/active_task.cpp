#include "active_task.h"

ActiveTask::ActiveTask()
{
  strcmp(this->command,EMPTY_STRING);
  this->ack = -1;
}

ActiveTask::ActiveTask(String command, int ack)
{
  command.toCharArray(this->command, BUFFER_SIZE);
  this->ack = ack;
}

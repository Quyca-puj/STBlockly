#include "task_list.h"

TaskList::TaskList()
{
  pendingTasks = 0;
}

void TaskList::addNewTask(Task *task)
{
  runningTasks[pendingTasks] = new ActiveTask(String(task->command), task->ack);
  pendingTasks++;
}

int TaskList::searchAck(String command)
{
  char aux[BUFFER_SIZE];
  command.toCharArray(aux,BUFFER_SIZE);
  for (int i = 0; i < pendingTasks; i++)
  {
    STprint("searchACK");
    STprint(runningTasks[i]->command);
    STprint(aux);
    STprint(strcmp(runningTasks[i]->command, aux)==0);
    if (strcmp(runningTasks[i]->command, aux)==0)
    {
      return runningTasks[i]->ack;
    }
  }
  return -1;
}
void TaskList::removeTask(String task)
{
  int pos = 0;
  char aux[BUFFER_SIZE];
  task.toCharArray(aux,BUFFER_SIZE);
  for (int i = 0; i < pendingTasks; i++)
  {
    if (strcmp(runningTasks[i]->command, aux)==0)
    {
      pos = i;
    }
  }
  delete(runningTasks[pos]);
  for (int i = pos; i < pendingTasks; i++)
  {
    runningTasks[i] = runningTasks[i + 1];
  }
  pendingTasks--;
}

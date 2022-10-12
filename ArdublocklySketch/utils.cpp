#include "utils.h"
/*
 * Print util
 */
void STprint(String msg)
{
  if (shouldLog)
  {
    Serial.println(msg);
  }
}
/*
 * Print util
 */
void STprint(char *msg)
{
  if (shouldLog)
  {
    Serial.println(msg);
  }
}
/*
 * Print util
 */
void STprint(int msg)
{
  if (shouldLog)
  {
    Serial.println(msg);
  }
}
/*
 * Print util
 */
void STprint(long msg)
{
  if (shouldLog)
  {
    Serial.println(msg);
  }
}
/*
 * Print util
 */
void STprint(unsigned long msg)
{
  if (shouldLog)
  {
    Serial.println(msg);
  }
}
/*
 * Task Creator
 */
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
/*
 * Task Creator
 */
Task::Task(String command, int ack)
{
  command.toCharArray(this->command, BUFFER_SIZE);
  this->ack = ack;
  strcmp(this->type,EMPTY_STRING);
}
/*
 * ActiveTask Creator
 */
ActiveTask::ActiveTask()
{
  strcmp(this->command,EMPTY_STRING);
  this->ack = -1;
}
/*
 * ActiveTask Creator
 */
ActiveTask::ActiveTask(String command, int ack)
{
  command.toCharArray(this->command, BUFFER_SIZE);
  this->ack = ack;
}
/*
 * TaskList Creator
 */
TaskList::TaskList()
{
  pendingTasks = 0;
}
/*
 * Adds a new task and converts it to an active task in the underlaying array
 */
void TaskList::addNewTask(Task *task)
{
  runningTasks[pendingTasks] = new ActiveTask(String(task->command), task->ack);
  pendingTasks++;
}


/*
 * It searches a valid ack for a given command.
 */
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
/*
 * It removes an active task from the underlaying array
 */
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
/*
 * checks if TaskQueue is empty
 */
bool TaskQueue::isEmpty(){
  return pendingTasks < 1 ;
}

/*
 * TaskQueue constructor
 */
TaskQueue::TaskQueue(){
  pendingTasks = 0;
}

/*
 * Pushes a new task
 */
void TaskQueue::push(Task *task){
  STprint("TaskQueue::push");
  runningTasks[pendingTasks] = task;
  STprint("TaskQueue::push 2");
  pendingTasks++;
  STprint("TaskQueue::push 3");
}

/*
 * Peeks a previous task
 */
Task* TaskQueue::peekPrevious(){
  return runningTasks[0];
}
/*
 * pops the head and returns that task.
 */
Task* TaskQueue::pop(){
  Task * task = runningTasks[0];
  for (int i = 0; i < pendingTasks; i++)
  {
    runningTasks[i] = runningTasks[i + 1];
  }

  pendingTasks--;

  return task;
}

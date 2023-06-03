#ifndef ROBOT_H_
#define ROBOT_H_
#include "nodeWiFi.h"
#include "RobotConstants.h"
#include "motorMovementController.h"
#include "FacesLed.h"
#include "utils.h"
#include "JointExtra.h"
#include "config.h"

#include "tasks/task.h"
#include "tasks/task_list.h"
#include "tasks/task_queue.h"

class Robot
{
  RobotConfig rc;

  int currentArgs;
  bool movementCurrentState;
  String command;
  long mvtTimer;
  long emotionTimer;
  long emotionPeriod;
  int movementRobot;
  String arguments[MAX_ARGS];
  String emotion;
  bool shouldAnswer;
  bool isTimedAction;
  int macroStep;
  String emoSwitch;
  bool motorInactive;
  bool screenInactive;
  TaskList runningMvt;
  TaskList runningEmotions;
  TaskList runningCustoms;
  TaskList runningBasics;
  bool isMvtExpropiative;
  bool isEmoExpropiative;
  WiFiClient returnSock;
  int returnPort;
  String returnIP;
  // cppQueue taskQueue = cppQueue(sizeof(Task), QUEUE_SIZE, FIFO, false);
  TaskQueue taskQueue;
private:
  // motors
  bool getMotorsStatus();
  void checkMotorCommands(String msg, bool checkStatus, WiFiClient client);

  // movement
  bool robotForward();
  bool robotTurn(int dir);
  bool robotTimedMove(int dir);
  bool robotTimedTurn(int dir);
  bool robotStopMovement();
  void robotForeverMove(int dir);

  // faces
  bool readFaces(String msg);
  bool readFaces(String msg, WiFiClient);
  bool switchFaces(String emo1, String emo2, long time, long period);

  // task
  bool isFeasible(Task *msg);
  bool isFeasibleMvt(Task *msg);
  bool isFeasibleEmotion(Task *msg);
  bool isFeasibleCustom(Task *msg);
  void unwrapTask(Task *task);
  Task *msgToTask(String msg);
  void answerCommand(TaskList *list,String task, WiFiClient client);
  void answerPendingByType(TaskList *list, WiFiClient client);


  void calibration();
  void connectClient();
  void checkEmotionCommands(String msg, bool checkStatus, WiFiClient client);
  void checkCustomCommands(String msg, bool checkStatus, WiFiClient client);
  void robotBasicCommands(String msg, bool checkStatus, WiFiClient client);
  void readCustomVariablesMotors(String msg, WiFiClient client);
  void readCustomVariablesSensors(String msg, WiFiClient client);
  void JointServoMsg(String msg, WiFiClient client);
  void processCommands(String msg, bool checkStatus, WiFiClient client);
  bool isMvtAction(String command);
  bool isMvtTimedAction(String command);
  bool isEmoAction(String command);
  bool isCustomAction(String command);
  bool isBasicAction(String command);
  bool robotDelay(long time, long *timeElapsed);
  void answerAllPending(WiFiClient client);
public:
  String ip;
  String alias;
  String activeEmo;
  long mvtTimeElapsed;
  long emoTimeElapsed;
  long emoAuxTimeElapsed;
  long customTimeElapsed;
  bool inAction;
  bool reverseActive;
  bool forwardActive;
  bool rightActive;
  bool leftActive;
  bool isInAction();
  Robot();
  void setupRobot(int serial, String givenAlias, String ssid, String password);
  void processMsg(String msg, bool checkStatus, WiFiClient client);
  bool adelante_atras();
  bool tuntun();
  bool cuadrado();
  bool popurri();
};
#endif

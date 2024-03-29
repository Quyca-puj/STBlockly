#ifndef ROBOT_H_
#define ROBOT_H_
#include "nodeWifi.h"
#include "RobotConstants.h"
#include "motorMovementController.h"
#include "FacesLed.h"
#include "utils.h"
#include "JointExtra.h"
#include <cppQueue.h>

class Robot
{

  int speeds;
  int receivedMsg;
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
  String emoSwitch;
  bool motorInactive;
  bool screenInactive;
  TaskList runningMvt;
  TaskList runningEmotions;
  TaskList runningCustoms;
  TaskList runningBasics;
  Task *basicExpro;
  Task *mvtExpro;
  Task *customExpro;
  Task *emotionalExpro;
  bool isMvtExpropiative;
  bool isEmoExpropiative;
  WiFiClient returnSock;
  int returnPort;
  String returnIP;
  TaskQueue taskQueue;
private:
  bool robotForward();
  bool robotTurn(int dir);
  bool robotTimedMove(int dir);
  bool robotTimedTurn(int dir);
  bool robotStopMovement();
  void robotForeverMove(int dir);
  Task *msgToTask(String msg);
  void calibration();
  bool readFaces(String msg);
  void connectClient();
  void checkMotorCommands(String msg, bool checkStatus, WiFiClient client);
  void checkEmotionCommands(String msg, bool checkStatus, WiFiClient client);
  void checkCustomCommands(String msg, bool checkStatus, WiFiClient client);
  void robotBasicCommands(String msg, bool checkStatus, WiFiClient client);
  void readCustomVariablesMotors(String msg, WiFiClient client);
  void readCustomVariablesSensors(String msg, WiFiClient client);
  void JointServoMsg(String msg, WiFiClient client);
  bool readFaces(String msg, WiFiClient);
  void processCommands(String msg, bool checkStatus, WiFiClient client);
  void answerCommand(TaskList *list,String task, WiFiClient client);
  bool isFeasible(Task *msg);
  bool isFeasibleMvt(Task *msg);
  bool isFeasibleEmotion(Task *msg);
  bool isFeasibleCustom(Task *msg);
  bool isMvtAction(String command);
  bool isMvtTimedAction(String command);
  bool isEmoAction(String command);
  bool isCustomAction(String command);
  bool isBasicAction(String command);
  bool switchFaces(String emo1, String emo2, long time, long period);
  bool robotDelay(long time, long *timeElapsed);
  void unwrapTask(Task *task);
  void answerAllPending(WiFiClient client);
  void answerPendingByType(TaskList *list, WiFiClient client);
  void answerCommandWithInfo(TaskList *list, String task, WiFiClient client, String answer);
  void processMultipleMsgs(String *msg);
  void switchFacesAsync(String emo1, String emo2, long period);
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
  void processMsg(String msg, bool checkStatus, WiFiClient client);void adelante_atras(WiFiClient client);
int adelante_atrasStep;
void tuntun(WiFiClient client);
int tuntunStep;
void cuadrado(WiFiClient client);
int cuadradoStep;
void popurri(WiFiClient client);
int popurriStep;
boolean action;
};
#endif

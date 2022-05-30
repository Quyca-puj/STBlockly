#ifndef ROBOT_H_
#define ROBOT_H_
#include "nodeWifi.h"
#include "motorMovementController.h" 
#include "FacesLed.h"
#include "JointExtra.h"
#define CALIBRATION_SPEED 50
#define MAX_ARGS 4
#define EMOTION_STR "emotions"


class Robot{

  int speeds;
  int currentArgs;
  bool movementCurrentState; 
  String command;
  int timer;
  int movementRobot;
  String arguments[MAX_ARGS];
  String emotion;
  unsigned long currentMillis;  
  unsigned long prevMillis;  
  bool timeFlag; 
  bool shouldAnswer;
  
  public:
  Robot();
  void setupRobot(int serial, String ssid, String password);
  void processMsg(String msg, WiFiClient client);
  void robotBasicCommands(String msg); 
  void readCustomVariablesMotors(String msg,WiFiClient client); 
  void readCustomVariablesSensors(String msg,WiFiClient client);
  void JointServoMsg(String msg,WiFiClient client); 
  void readFaces(String msg, WiFiClient); 
  void processCommands(String msg);
  private:
  void robotForward(); 
  void robotTurn(int dir); 
  void robotTimedMove(int dir); 
  void robotTimedTurn(int dir); 
  void robotStopMovement();
  void processMsgString(String msg); 
  void calibration();
  void readFaces(String msg);
};
#endif

#ifndef ROBOT_H_
#define ROBOT_H_
#include "nodeWifi.h"
#include "motorMovementController.h" 
#include "FacesLed.h"
#include "JointExtra.h"
#define CALIBRATION_SPEED 50
#define MAX_ARGS 4


class Robot{

  int speeds;
  int currentArgs;
  bool movementCurrentState; 
  String command;
  int timer;
  String arguments[MAX_ARGS];
  unsigned long currentMillis;  
  unsigned long prevMillis;  
  bool timeFlag; 
  
  public:
  Robot(int serial, String ssid, String password);
  void processMsg(String msg, WiFiClient client);
  void robotMovement(String msg); 
  void readCustomVariablesMotors(String msg,WiFiClient client); 
  void readCustomVariablesSensors(String msg,WiFiClient client);
  void JointServoMsg(String msg,WiFiClient client); 
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

#include "Robot.h"


bool rec_flag = false;

bool Robot::processCommands(String command, bool checkStatus) {
  bool toRet = false;
  STprint("command");
  STprint(command);
  STprint("Status");
  STprint(checkStatus);
  STprint("inAction");
  STprint(inAction);
  STprint("isTimedAction");
  STprint(isTimedAction);
  STprint("forwardActive");
  STprint(forwardActive);
  STprint("rightActive");
  STprint(rightActive);
  STprint("leftActive");
  STprint(leftActive);
  STprint("reverseActive");
  STprint(reverseActive);
  STprint("motorInactive");
  STprint(motorInactive);
  STprint("macroRunning");
  STprint(macroRunning);
  STprint("macroInExec");
  STprint(macroInExec);
  STprint("macroStep");
  STprint(macroStep);
  if (!checkStatus || (checkStatus && inAction)) {
    if (checkStatus) {
      STprint("Checking Status");
    } else {
      STprint("Starting Command");
    }
    if (command.equals("intento2") || command.equals("intento1") && !macroRunning) {
      macroRunning = true;
        if(!checkStatus){
          macroInExec=command;
        }
    }
    if (macroRunning) {

      if (command.equals("intento2") || macroInExec.equals("intento2")) {

        toRet = intento2();
      }
      else  if (command.equals("intento1") || macroInExec.equals("intento1")) {
        toRet = intento1();
      }
    } else {
      toRet = robotBasicCommands(command, checkStatus);
    }
  }
  inAction =  reverseActive || forwardActive ||  rightActive ||  leftActive || macroRunning; 
  return toRet;
}


bool Robot::intento2() {
  bool toRet = false;
  bool nextStep = false;
  switch (macroStep) {
    case 0:
      timer = 5;
      nextStep = robotTimedMove(1);
      break;
    case 1:
      nextStep = robotStopMovement();
      break;
    case 2:
      nextStep = robotForward();
      break;
    case 3:
      timer = 10;
      nextStep = robotTimedTurn(1);
      break;
    default:
      macroRunning = false;
      macroStep = 0;
      toRet = true;
      break;
  }
  if (nextStep) {
    macroStep++;
  }
  return toRet;
}


bool Robot::intento1() {
  bool toRet = false;
  switch (macroStep) {
    case 0:
      toRet = robotTurn(-1);
      break;
    case 1:
      timer = 10;
      toRet = robotTimedMove(-1);
      break;
    case 2:
      timer = 20;
      toRet = robotTimedTurn(-1);
      break;
    default:
      macroRunning = false;
      macroStep = 0;
      break;
  }
  if (toRet) {
    macroStep++;
  }
  return toRet;
}




Robot robot;
WiFiClient client;

void setup() {
  robot.setupRobot(115200, "morado", "JuanLeon", "12345678");
}

void loop() {
  String messages = "";
  if (client) {
    if (client.connected()) {
      while (client.available() > 0) {
        char c = client.read();
        messages.concat(c);
        rec_flag = true;
      }
      if (!messages.indexOf(robot.alias) || (robot.inAction && messages.equals(""))) {
        robot.processMsg(messages, !rec_flag, client);
        messages = "";
        rec_flag = false;
      }
    }
  } else {
    client = wifiServer.available();
  }

}

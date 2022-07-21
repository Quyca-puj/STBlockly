#include "Robot.h"

bool Robot::isCustomAction(String command)
{
  // return command.equals() || command.equals()...;
  return false;
}

bool Robot::isFeasibleCustom(Task *msg)
{
  bool toRet = false;
  /*
    if(msg.command.equals("macro")){
      toRet = motorInactive || isMvtExpropiative;
    } else if (msg.command.equals("t1")){
      toRet = screenInactive || isEmoExpropiative;
    } else if (msg.command.equals("t2")){
      toRet = (screenInactive || isEmoExpropiative) && (motorInactive || isMvtExpropiative;);
    }
  */
  return toRet;
}

void Robot::checkCustomCommands(String msg, bool checkStatus, WiFiClient client)
{
  /*
    if(msg.equals("macro") || (checkStatus && activeMacro)){
      macro();
    }
  */
  return;
}

Robot robot;
bool rec_flag = false;

void setup()
{
  robot.setupRobot(115200, "morado", "JuanLeon", "12345678");
}

void loop()
{
  WiFiClient client = wifiServer.available();
  String messages = "";
  if (client)
  {
    while(client.connected())
    {
      while (client.available() > 0)
      {
        char c = client.read();
        messages.concat(c);
        rec_flag = true;
      }

      if (!messages.indexOf(robot.alias) || (messages.equals("") && robot.isInAction()))
      {
        robot.processMsg(messages, !rec_flag, client);
        messages = "";
        rec_flag = false;
      }
     
    }
    Serial.println("Client Disconnected");
    client.stop();
  }else if (robot.isInAction()){
    robot.processMsg(messages, true, client);
  }
}

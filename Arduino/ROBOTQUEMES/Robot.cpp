#include "Robot.h"

Robot::Robot(int serial, String ssid, String password) {
  Serial.begin(serial);
  delay(1000);
  WifiConnection(ssid, password);
  setupmotor();
  setupSensors();
  setupFaces();
  JointSetup();
  currentMillis = 0;
  timeFlag = false;
}


void Robot::processMsg(String msg, WiFiClient client) {
  command = "";
  processMsgString(msg);
  if (command.length() > 0) {
    readCustomVariablesSensors(msg, client);
    processCommands(command);
    client.println(arguments[currentArgs-1]);
  }
}

void Robot::calibration() {
  for (uint16_t i = 0; i < 390; i++)
  {
    if ((i > 0 && i <= 30) || (i > 60 && i <= 90) || (i > 120 && i <= 150) || (i > 180 && i <= 210) || (i > 240 && i <= 270) || (i > 300 && i <= 330) || (i > 360 && i <= 390)) {
      // avanzar
      setSpeedsMotor(CALIBRATION_SPEED, CALIBRATION_SPEED);
    } else {
      // retroceder
      setSpeedsMotor(-CALIBRATION_SPEED, -CALIBRATION_SPEED);
    }
    qtr.calibrate();
    delay(20);
  }
  setSpeedsMotor(0, 0); // Finalizacion de la calibración
}

void Robot::robotMovement(String msg) {

  if (msg.equals("forward")) {
    robotForward();
  } else if (msg.equals("right")) {
    robotTurn(1);
  } else if (msg.equals("left")) {
    robotTurn(-1);
  } else if (msg.equals("stop")) {
    robotStopMovement();
  } else if (msg.equals("t_reverse")) {
    robotTimedMove(-1);
    delay(1500);
  } else if (msg.equals("t_forward")) {
    robotTimedMove(1);
    delay(1500);
  } else if (msg.equals("t_left")) {
    robotTimedTurn(-1);
    delay(1500);
  } else if (msg.equals("t_right")) {
    robotTimedTurn(1);
    delay(1500);
  }

}

void Robot::robotForward(){
    while (!followLine(speeds)) {
      delay(50);
    }
}
void Robot::robotTurn(int dir){
    while (!turn(dir, speeds)) {
      delay(50);
    }
}
void Robot::robotTimedMove(int dir){
  timeFlag=true;
  currentMillis = millis();
  
}
void Robot::robotTimedTurn(int dir){
  timeFlag=true;
  currentMillis = millis();
  while(timeFlag){
        if (currentMillis - prevMillis >= timer) {
         //previousOnBoardLedMillis += onBoardLedInterval;

    }
  }
  
}

void Robot::robotStopMovement(){
  setSpeedsMotor(0, 0);
}

void Robot::readCustomVariablesMotors(String msg, WiFiClient client) {
  String messageint = "";
  bool digit = false;
  if (!msg.indexOf("speed")) {
    for (char single : msg) {
      if (isDigit(single)) {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true) {
      speeds = messageint.toInt();
      client.println(speeds);
      messageint = "";
    }
  }
  if (msg.equals("check")) {
    checkControl = !checkControl;
  }
  if (!msg.indexOf("kp")) {
    for (char single : msg) {
      if (isDigit(single) || single == '.') {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true) {
      kp = messageint.toFloat();
      client.println(kp);
      messageint = "";
    }
  }
  if (!msg.indexOf("kd")) {
    for (char single : msg) {
      if (isDigit(single) || single == '.') {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true) {
      kd = messageint.toFloat();
      client.println(kd);
      messageint = "";
    }
  }
  if (!msg.indexOf("ki")) {
    for (char single : msg) {
      if (isDigit(single) || single == '.') {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true) {
      ki = messageint.toFloat();
      client.println(ki);
      messageint = "";
    }
  }
}

void Robot::readCustomVariablesSensors(String msg, WiFiClient client) {
  if (!msg.indexOf("calibration")) {
    String messageintID = "";
    int tabs{0};
    for (char index : msg) {
      if (isSpace(index)) {
        tabs++;
      }
      if (tabs == 1) {
        messageintID.concat(index);
      }
    }
    calibration();
    client.println(messageintID);
  }
  if (msg.equals("sensorReadFrontL")) {
    ReadValues();
    client.println(sensorValues[0]);
  }
  if (msg.equals("sensorReadFrontR")) {
    ReadValues();
    client.println(sensorValues[1]);
  }
  if (msg.equals("sensorReadBackL")) {
    ReadValues();
    client.println(sensorValues[2]);
  }
  if (msg.equals("sensorReadBackR")) {
    ReadValues();
    client.println(sensorValues[3]);
  }
}

void Robot::JointServoMsg(String msg, WiFiClient client) {
  String messageint = "";
  bool digit = false;
  int positionJoint;
  int periodJoint;
  if (!msg.indexOf("EXTRAJOINTSTATIC")) {
    for (char single : msg) {
      if (isDigit(single)) {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true) {
      positionJoint = messageint.toInt();
      client.println("DynamicMotor");
      JointStatic(positionJoint);
      messageint = "";
    }
  }
  if (!msg.indexOf("EXTRAJOINTDYNAMIC")) {
    for (char single : msg) {
      if (isDigit(single)) {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true) {
      periodJoint = messageint.toInt();
      timetransition = millis();
      client.println("DynamicMotor");
      JointDynamic(periodJoint);
      messageint = "";
    }
  }
}
void Robot::processMsgString(String msg) {
  String messageintSpeed = "";
  String messageintID = "";
  int tabs{0};
  currentArgs=0;
  for (int i = 0; i < MAX_ARGS; i ++) {
    arguments[i]="";
  }

  for (char index : msg) {
    if (isSpace(index)) {
      tabs++;
    } else {
      switch (tabs) {
        case 0:
          command.concat(index);
          break;
        default:
          arguments[tabs-1].concat(index);
          break;
      }
    }

  }

  if(currentArgs>1){
    speeds = arguments[0].toInt();
      if(currentArgs>2){
        timer = arguments[1].toInt();
      }
  }
  currentArgs=tabs-1;
}


void Robot::readFaces(String msg) {
      if(!msg.indexOf("happy")) {
          int myarray[NUMPIXELS] ={0};
          int indexarray[16] ={13, 14, 17, 18, 19, 21, 22, 25, 33, 41, 42, 43, 45, 46, 53, 54};
          int color[3] = {255,255,0};
          int contador=0;
          for(int i=0; i<NUMPIXELS; i++) {       
                  if (i== indexarray[contador]) {
                        myarray[i] =1;
                        contador++;
                        if(contador > 15) {
                          contador=15;
                        }
                  }
           }
          facesDraw(myarray,color,50);
          Serial.println("happy");
        }

        if(!msg.indexOf("sad")) {
          int myarray[NUMPIXELS] ={0};
          int indexarray[16] ={13, 14, 17, 18, 19, 21, 22, 27, 35, 41, 42, 43, 45, 46, 53, 54};
          int color[3] = {0,0,255};
          int contador=0;
          for(int i=0; i<NUMPIXELS; i++) {       
                  if (i== indexarray[contador]) {
                        myarray[i] =1;
                        contador++;
                        if(contador > 15) {
                          contador=15;
                        }
                  }
           }
          facesDraw(myarray,color,50);
          Serial.println("sad");
        }
        if(!msg.indexOf("angry")) {
          int myarray[NUMPIXELS] ={0};
          int indexarray[12] ={6, 9, 14, 18, 21, 26, 34, 42, 45, 49, 54, 62};
          int color[3] = {255,0,0};
          int contador=0;
          for(int i=0; i<NUMPIXELS; i++) {       
                  if (i== indexarray[contador]) {
                        myarray[i] =1;
                        contador++;
                        if(contador > 11) {
                          contador=11;
                        }
                  }
           }
          facesDraw(myarray,color,50);
          Serial.println("angry");
        }

        if(!msg.indexOf("neutral")) {
          int myarray[NUMPIXELS] ={0};
          int indexarray[12] ={13, 14, 18, 21, 22, 26, 34, 42, 45, 46, 53, 54};
          int color[3] = {0,255,0};
          int contador=0;
          for(int i=0; i<NUMPIXELS; i++) {       
                  if (i== indexarray[contador]) {
                        myarray[i] =1;
                        contador++;
                        if(contador > 11) {
                          contador=11;
                        }
                  }
           }
          facesDraw(myarray,color,50);
          Serial.println("neutral");
        }
  }

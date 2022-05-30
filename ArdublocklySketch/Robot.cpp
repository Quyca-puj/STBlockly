#include "Robot.h"

Robot::Robot() {
  
  speeds=50;
  movementRobot=0;
  emotion="";
  movementCurrentState = false;
  currentMillis = 0;
  timeFlag = false;
}

void Robot::setupRobot(int serial, String ssid, String password){
  Serial.begin(serial);
  delay(1000);
  WifiConnection(ssid, password);
  setupmotor();
  setupSensors();
  setupFaces();
  JointSetup();
}


void Robot::processMsg(String msg, WiFiClient client) {
  command = "";
  emotion="";
  processMsgString(msg);
  shouldAnswer = true;
  Serial.println("processMsg entered");
  Serial.println("Speed");
  Serial.println(speeds);
  Serial.println("timer");
  Serial.println(timer);
  Serial.println("emotion");
  Serial.println(emotion);
  if (command.length() > 0) {
    readCustomVariablesSensors(msg, client);
    processCommands(command);
    if(shouldAnswer){
      Serial.println(arguments[currentArgs-1]);
      client.println(arguments[currentArgs-1]);
    }

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

void Robot::robotBasicCommands(String msg) {

Serial.println(msg);
  if (msg.equals("forward")) {
    Serial.println("forward entered");
    robotForward();
  } else if (msg.equals("right")) {
    Serial.println("right entered");
    robotTurn(1);
  } else if (msg.equals("left")) {
    Serial.println("left entered");
    robotTurn(-1);
  } else if (msg.equals("stop")) {
    Serial.println("stop entered");
    robotStopMovement();
  } else if (msg.equals("t_reverse")) {
    Serial.println("t_reverse entered");
    robotTimedMove(-1);
    delay(1500);
  } else if (msg.equals("t_forward")) {
    Serial.println("t_forward entered");
    robotTimedMove(1);
    delay(1500);
  } else if (msg.equals("t_left")) {
    Serial.println("t_left entered");
    robotTimedTurn(-1);
    delay(1500);
  } else if (msg.equals("t_right")) {
    Serial.println("t_right entered");
    robotTimedTurn(1);
    delay(1500);
  }else if (msg.equals(EMOTION_STR)) {
    Serial.println("emotions entered");
    shouldAnswer = false;
    readFaces(emotion);
    delay(1500);
  }

}

void Robot::robotForward(){
    if (followLine(speeds)) {
      setSpeedsMotor(0,0);
    }
}
void Robot::robotTurn(int dir){
    if (!turn(dir, speeds)) {
      setSpeedsMotor(0,0);
    }
}
void Robot::robotTimedMove(int dir){
  timedMove(dir*speeds, timer);
  setSpeedsMotor(0,0);
}
void Robot::robotTimedTurn(int dir){
  timedTurn(dir,speeds, timer);
  setSpeedsMotor(0,0);
  
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
    String messageint="";
    bool digit=false;
    int positionJoint;
    int periodJoint;
    if(!msg.indexOf("static")){
       for (char single : msg){
          if(isDigit(single)){
            digit=true;
            messageint.concat(single);
          }
        }
        if(digit=true){
          positionJoint= messageint.toInt();  
          JointStatic(positionJoint);
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
  currentArgs=tabs;
  if(currentArgs>1){
    if(command.equals(EMOTION_STR)){
      emotion = arguments[0];
    }else{
      speeds = arguments[0].toInt();
      if(currentArgs>2){
        timer = arguments[1].toInt();
      }
    }
  }
  
Serial.println("args entered");
    for (int i = 0; i < currentArgs; i ++) {
      Serial.println(arguments[i]);
  }
}


void Robot::readFaces(String msg) {
  Serial.println("readFaces entered");
  Serial.println(msg);
      if(msg.equals("happy")) {
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

        if(msg.equals("sad")) {
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
        if(msg.equals("angry")) {
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

        if(msg.equals("neutral")) {
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

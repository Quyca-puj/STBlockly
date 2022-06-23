#include "Robot.h"


Robot::Robot() {
  // Inicializacion de las variables de control
  timeElapsed = 0;
  speeds = 50;
  movementRobot = 0;
  timer = 0;
  emotion = "";
  movementCurrentState = false;
  isTimedAction = false;
  motorInactive = true;
  inAction = false;
  reverseActive = false;
  forwardActive = false;
  rightActive = false;
  leftActive = false;
}

void Robot::setupRobot(int serial, String givenAlias, String ssid, String password) {
  //Inicio del Serial, conexion a wifi e inicializacion de motores.
  Serial.begin(serial);
  WifiConnection(ssid, password);
  ip = WiFi.localIP().toString();
  Serial.print("Version ");
  Serial.println(VERSION);
  Serial.print("IP: ");
  Serial.println(ip);
  Serial.print("Alias ");
  Serial.println(givenAlias);
  delay(4000);
  alias = givenAlias;
  setupmotor();
  setupSensors();
  setupFaces();
  JointSetup();
}


void Robot::processMsg(String msg, bool checkStatus , WiFiClient client) {
  bool answer = false;
  if (!checkStatus) { // If- revisa si hay comando nuevo por procesar (checkStatus = false)
    command = "";
    emotion = "";
    STprint(msg);
    STprint("processMsg entered");
    processMsgString(msg);
    shouldAnswer = true;
    STprint("Speed");
    STprint(speeds);
    STprint("timer");
    STprint(timer);
    STprint("emotion");
    STprint(emotion);
    STprint("toReturn");
    STprint(arguments[currentArgs - 1]);
  }// end if
  //procesar comandos y revision de comandos en ejecucion
  answer = processCommands(command, checkStatus);
  if (shouldAnswer && answer) {
    STprint("Answering");
    //si hay ack pendiente de los motores principales y hay respuesta, responder con ese ack.
    if (lastMotorAck > -1) {
      STprint(lastMotorAck);
      client.println(lastMotorAck);
      lastMotorAck = -1;
      motorInactive = true;
      isTimedAction = false;
      timer = 0;
    } else {
      STprint(arguments[currentArgs - 1]);
      client.println(arguments[currentArgs - 1]);
    }

    STprint("Answered");
  }
  command = ""; //vaciar comando
  // determinar si hay acciones en ejecucion.

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
  STprint("calibration end");
}

bool Robot::robotBasicCommands(String msg, bool checkStatus) {
  bool toRet = false; // variable a retornar. True si se finaliza al menos un comando.
  if (msg.equals("calibration")) { // if para calibracion
    STprint("calibration entered");
    calibration();
    toRet = true;
  } else {
    // if else de las funciones relacionadas al motor principal. Se maneja con else if porque solo puede haber una accion en el motor activa.
    if ((msg.equals("forward") && motorInactive) || (forwardActive && !isTimedAction && checkStatus)) { // en general se revisa si llego el comando y el motor esta inactivo
      //o si el movimiento hacia adelante esta activo, la accion es temporal o no y se esta revisando el estado.
      STprint("forward entered");
      isTimedAction = false;
      toRet = robotForward();
      forwardActive = !toRet;
    }else if ((msg.equals("right") && motorInactive) || (rightActive && !isTimedAction && checkStatus)) {
      STprint("right entered");
      isTimedAction = false;
      toRet = robotTurn(1);
      rightActive = !toRet;
    }else if ((msg.equals("left") && motorInactive) || (leftActive && !isTimedAction && checkStatus)) {
      STprint("left entered");
      isTimedAction = false;
      toRet = robotTurn(-1);
      leftActive = !toRet;
    }else if ((msg.equals("t_reverse") && motorInactive) || (reverseActive && isTimedAction && checkStatus)) {
      isTimedAction = true;
      STprint("t_reverse entered");
      toRet = robotTimedMove(-1);
      reverseActive = !toRet;
    }else if ((msg.equals("t_forward") && motorInactive) || (forwardActive && isTimedAction && checkStatus)) {
      isTimedAction = true;
      STprint("t_forward entered");
      toRet = robotTimedMove(1);
      forwardActive = !toRet;
    }else if ((msg.equals("t_left") && motorInactive) || (leftActive && isTimedAction && checkStatus)) {
      isTimedAction = true;
      STprint("t_left entered");
      toRet = robotTimedTurn(-1);
      leftActive = !toRet;
    }else if ((msg.equals("t_right") && motorInactive) || (rightActive && isTimedAction && checkStatus)) {
      isTimedAction = true;
      STprint("t_right entered");
      toRet = robotTimedTurn(1);
      rightActive = !toRet;
    }else if ((msg.equals("forever_forward") && motorInactive)) {
      isTimedAction = false;
      STprint("forever_forward entered");
      robotForeverMove(1);
    }else if ((msg.equals("forever_reverse") && motorInactive)) {
      isTimedAction = false;
      STprint("forever_reverse entered");
      robotForeverMove(-1);
    }
    // determinar si el motor esta activo
    motorInactive = !(rightActive || leftActive || forwardActive || reverseActive);
    
    if (msg.equals("stop")) {
      STprint("stop entered");
      isTimedAction = false;
      toRet = robotStopMovement();
      forwardActive = !toRet;
      rightActive = !toRet;
      leftActive = !toRet;
      reverseActive = !toRet;
    }
    
    if (msg.equals(EMOTION_STR)) {
      STprint("emotions entered");
      shouldAnswer = false;
      readFaces(emotion);
    }
  }
  return toRet;
}

void Robot::robotForeverMove(int dir) {
  STprint("robotFor Command");
  foreverForward(speeds *dir);
}

bool Robot::robotForward() {
  STprint("robotForward Command");
  return followLine(speeds);
}
bool Robot::robotTurn(int dir) {
  STprint("robotTurn Command");
  return !turn(dir, speeds);
}
bool Robot::robotTimedMove(int dir) {
  STprint("robotTimedMove Command");
  return timedMove(dir * speeds, timer * 1000, &timeElapsed);
}
bool Robot::robotTimedTurn(int dir) {
  STprint("robotTimedTurn Command");
  return timedTurn(dir, speeds, timer * 1000, &timeElapsed);
}

bool Robot::robotStopMovement() {
  STprint("robotStopMovement Command");
  setSpeedsMotor(0, 0);
  return true;
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
    STprint("calibration entered");
    calibration();
    client.println(arguments[currentArgs - 1]);
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
  if (!msg.indexOf("static")) {
    for (char single : msg) {
      if (isDigit(single)) {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true) {
      positionJoint = messageint.toInt();
      JointStatic(positionJoint);
      messageint = "";
    }
  }
}
void Robot::processMsgString(String msg) {
  String messageintSpeed = "";
  String messageintID = "";
  int tabs{0};
  currentArgs = 0;
  for (int i = 0; i < MAX_ARGS; i ++) { //inicilziacion del arreglo de parametros
    arguments[i] = "";
  }

  for (char index : msg) { // recorrer la cadena
    if (isSpace(index)) { //separar por espacios
      tabs++;
    } else {
      switch (tabs) {
        case 0: //caso 0 es el id, no se guarda
          break;
        case 1: //caso 1 es el comando
          command.concat(index);
          break;
        default: // del 1 en adelante son parametros
          arguments[tabs - 2].concat(index);
          break;
      }
    }

  }
  currentArgs = tabs - 1;
  if (currentArgs > 1) {
    if (command.equals(EMOTION_STR)) { //segun el comando se toman los params necesarios
      emotion = arguments[0];
    } else {
      lastMotorAck = arguments[currentArgs - 1].toInt();
      speeds = arguments[0].toInt();
      if (currentArgs > 2) {
        timer = arguments[1].toInt();
      }
    }
  }

  STprint(currentArgs);
  STprint("args entered");
  for (int i = 0; i < currentArgs; i ++) {
    STprint(arguments[i]);
  }
}


void Robot::readFaces(String msg) {
  STprint("readFaces entered");
  STprint(msg);
  if (msg.equals("happy")) {
    int myarray[NUMPIXELS] = {0};
    int indexarray[16] = {13, 14, 17, 18, 19, 21, 22, 25, 33, 41, 42, 43, 45, 46, 53, 54};
    int color[3] = {255, 255, 0};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++) {
      if (i == indexarray[contador]) {
        myarray[i] = 1;
        contador++;
        if (contador > 15) {
          contador = 15;
        }
      }
    }
    facesDraw(myarray, color, 50);
    STprint("happy");
  }else if (msg.equals("sad")) {
    int myarray[NUMPIXELS] = {0};
    int indexarray[16] = {13, 14, 17, 18, 19, 21, 22, 27, 35, 41, 42, 43, 45, 46, 53, 54};
    int color[3] = {0, 0, 255};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++) {
      if (i == indexarray[contador]) {
        myarray[i] = 1;
        contador++;
        if (contador > 15) {
          contador = 15;
        }
      }
    }
    facesDraw(myarray, color, 50);
    STprint("sad");
  }else if (msg.equals("angry")) {
    int myarray[NUMPIXELS] = {0};
    int indexarray[12] = {6, 9, 14, 18, 21, 26, 34, 42, 45, 49, 54, 62};
    int color[3] = {255, 0, 0};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++) {
      if (i == indexarray[contador]) {
        myarray[i] = 1;
        contador++;
        if (contador > 11) {
          contador = 11;
        }
      }
    }
    facesDraw(myarray, color, 50);
    STprint("angry");
  }else if (msg.equals("neutral")) {
    int myarray[NUMPIXELS] = {0};
    int indexarray[12] = {13, 14, 18, 21, 22, 26, 34, 42, 45, 46, 53, 54};
    int color[3] = {0, 255, 0};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++) {
      if (i == indexarray[contador]) {
        myarray[i] = 1;
        contador++;
        if (contador > 11) {
          contador = 11;
        }
      }
    }
    facesDraw(myarray, color, 50);
    STprint("neutral");
  }
}

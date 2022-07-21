#include "Robot.h"

Robot::Robot()
{
  // Inicializacion de las variables de control
  emoTimeElapsed = 0;
  emoAuxTimeElapsed = 0;
  mvtTimeElapsed = 0;
  customTimeElapsed = 0;
  speeds = 50;
  movementRobot = 0;
  mvtTimer = 0;
  emotionTimer = 0;
  emotionPeriod = 0;
  emotion = "";
  movementCurrentState = false;
  isTimedAction = false;
  motorInactive = true;
  reverseActive = false;
  forwardActive = false;
  rightActive = false;
  leftActive = false;
  isMvtExpropiative = true;
  isEmoExpropiative = true;
}

void Robot::connectClient()
{
  if (!returnSock || !returnSock.connected())
  {
    if (!returnSock.connect(returnIP, returnPort))
    {
      STprint("Connection to host failed");
      return;
    }
    else
    {
      STprint("Connected");
    }
  }
}
void Robot::setupRobot(int serial, String givenAlias, String ssid, String password)
{
  // Inicio del Serial, conexion a wifi e inicializacion de motores.
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

bool Robot::isFeasible(Task *msg)
{
  bool toRet = false;
  STprint("in isFeasible");
  STprint(msg->type);
  if (strcmp(msg->type, TYPE_MOVEMENT) == 0)
  {
    toRet = isFeasibleMvt(msg);
    if (toRet)
    {
      runningMvt.addNewTask(msg);
    }
  }
  else if (strcmp(msg->type, TYPE_EMOTION) == 0)
  {
    toRet = isFeasibleEmotion(msg);
    if (toRet)
    {
      runningEmotions.addNewTask(msg);
    }
  }
  else if (strcmp(msg->type, TYPE_CUSTOM) == 0)
  {
    toRet = isFeasibleCustom(msg);
    if (toRet)
    {
      runningCustoms.addNewTask(msg);
    }
  }
  else if (strcmp(msg->type, TYPE_BASIC) == 0)
  {
    toRet = true;
    runningBasics.addNewTask(msg);
  }
  return toRet;
}

bool Robot::isFeasibleMvt(Task *msg)
{
  return isMvtExpropiative || (!isMvtExpropiative && motorInactive);
}
bool Robot::isFeasibleEmotion(Task *msg)
{
  STprint("isFeasibleEmotion");
  STprint(isEmoExpropiative);
  STprint(screenInactive);
  return isEmoExpropiative || (!isEmoExpropiative && screenInactive);
}

void Robot::processMsg(String msg, bool checkStatus, WiFiClient client)
{
  bool answer = false;
  Task *aux;
  STprint("taskQueue.pendingTasks");
  STprint(taskQueue.pendingTasks);
  STprint("runningBasics.pendingTasks");
  STprint(runningBasics.pendingTasks);
  STprint("runningMvt.pendingTasks");
  STprint(runningMvt.pendingTasks);
  STprint("runningEmotions.pendingTasks");
  STprint(runningEmotions.pendingTasks);
  STprint("runningCustoms.pendingTasks");
  STprint(runningCustoms.pendingTasks);
  if (!checkStatus)
  { // If- revisa si hay comando nuevo por procesar (checkStatus = false)
    // Conversion del comando a una tarea
    STprint("Incoming");
    STprint(msg);

    STprint("Before msgToTask");
    Task *task = msgToTask(msg);
    STprint("After msgToTask");
    STprint(task->command);
    taskQueue.push(task);
    STprint("After push");
  } // end if
  // procesar comandos y revision de comandos en ejecucion
  STprint("taskQueue.pendingTasks 1");
  STprint(taskQueue.pendingTasks);
  if (!taskQueue.isEmpty())
  {
    STprint("After Task Empty");
    aux = taskQueue.peekPrevious();
    // taskQueue.peekPrevious(aux);
    STprint("Task Peeked");
    STprint(aux->command);
    STprint(aux->type);
    STprint("Checking isFeasible");
    if (isFeasible(aux))
    {
      STprint("Task Feasible");
      aux = taskQueue.pop();
      // taskQueue.pop(aux);
      unwrapTask(aux);
      STprint("Speed");
      STprint(speeds);
      STprint("mvtTimer");
      STprint(mvtTimer);
      STprint("emotionTimer");
      STprint(emotionTimer);
      STprint("emotion");
      STprint(emotion);
      STprint("toReturn");
      STprint(arguments[currentArgs - 1]);
      checkStatus = false;
    }
  }
  processCommands(command, checkStatus, client);
  command = ""; // vaciar comando
  // determinar si hay acciones en ejecucion.
}

void Robot::unwrapTask(Task *task)
{
  command = String(task->command);
  if (strcmp(task->type, TYPE_MOVEMENT) == 0)
  {
    if (task->speed > 0)
    {
      speeds = task->speed;
    }
    if (task->time > 0)
    {
      mvtTimer = task->time;
    }
  }
  if (strcmp(task->type, TYPE_EMOTION) == 0)
  {
    if (strcmp(task->command, EMOTION_STR) == 0)
    {
      if (strlen(task->emo1) > 1)
      {
        emotion = task->emo1;
      }
    }
    else if (strcmp(task->command, EMOTION_SWITCH) == 0)
    {
      if (strlen(task->emo1) > 1)
      {
        emotion = task->emo1;
      }
      if (strlen(task->emo2) > 1)
      {
        emoSwitch = task->emo2;
      }
      if (task->time > 0)
      {
        emotionTimer = task->time;
      }
      if (task->period > 0)
      {
        emotionPeriod = task->period;
      }
    }
  }
  if (strcmp(task->type, TYPE_CUSTOM) == 0)
  {
    if (task->speed > 0)
    {
      speeds = task->speed;
    }
  }
  delete(task);
}
void Robot::answerCommand(TaskList *list, String task, WiFiClient client)
{
  STprint("list size");
  STprint(list->pendingTasks);
  int ack = list->searchAck(task);
  if (ack != -1) {
    list->removeTask(task);
    STprint("task");
    STprint(task);
    STprint("Answering");
    STprint(ack);
    STprint("list size");
    STprint(list->pendingTasks);

    // si hay ack pendiente de los motores principales y hay respuesta, responder con ese ack.
    if (returnSock && returnSock.connected())
    {
      returnSock.println(ack);
    }
    else
    {
      client.println(ack);
    }
    STprint("Answered");
  }
}

void Robot::calibration()
{
  for (uint16_t i = 0; i < 390; i++)
  {
    if ((i > 0 && i <= 30) || (i > 60 && i <= 90) || (i > 120 && i <= 150) || (i > 180 && i <= 210) || (i > 240 && i <= 270) || (i > 300 && i <= 330) || (i > 360 && i <= 390))
    {
      // avanzar
      setSpeedsMotor(CALIBRATION_SPEED, CALIBRATION_SPEED);
    }
    else
    {
      // retroceder
      setSpeedsMotor(-CALIBRATION_SPEED, -CALIBRATION_SPEED);
    }
    qtr.calibrate();
    delay(20);
  }
  setSpeedsMotor(0, 0); // Finalizacion de la calibración
  STprint("calibration end");
}

void Robot::checkEmotionCommands(String msg, bool checkStatus, WiFiClient client)
{
  bool toRet = false;
  if (msg.equals(EMOTION_STR))
  {
    STprint("emotions entered");
    readFaces(emotion);
    screenInactive = true;
    runningEmotions.removeTask(EMOTION_STR);
  }
  else if (msg.equals(EMOTION_SWITCH) || runningEmotions.searchAck(EMOTION_SWITCH) != -1)
  {
    isEmoExpropiative = false;
    screenInactive = false;
    STprint("switchFaces entered");
    toRet = switchFaces(emotion, emoSwitch, 1000 * emotionTimer, 1000 * emotionPeriod);
    if (toRet)
    {
      activeEmo = "";
      emotion = "";
      emoSwitch = "";
      emotionTimer= 0;
      emotionPeriod = 0;
      emoTimeElapsed = 0;
      emoAuxTimeElapsed = 0;
      screenInactive = true;
      answerCommand(&runningEmotions, EMOTION_SWITCH, client);
    }
  }
  else if (msg.equals(EMOTION_OFF))
  {
    STprint("emotions_off entered");
    screenInactive = true;
    readFaces(EMOTION_STOP);
    runningEmotions.removeTask(EMOTION_STR);
  }
}

void Robot::checkMotorCommands(String msg, bool checkStatus, WiFiClient client)
{
  bool toRet = false;
  // if else de las funciones relacionadas al motor principal. Se maneja con else if porque solo puede haber una accion en el motor activa.
  if ((msg.equals(MVT_FORWARD)) || (forwardActive && !isTimedAction && checkStatus))
  { // en general se revisa si llego el comando y el motor esta inactivo
    // o si el movimiento hacia adelante esta activo, la accion es temporal o no y se esta revisando el estado.
    isMvtExpropiative = false;
    STprint("forward entered");
    isTimedAction = false;
    toRet = robotForward();
    forwardActive = !toRet;
    if (toRet)
    {
      answerCommand(&runningMvt, MVT_FORWARD, client);
    }
  }
  else if ((msg.equals(MVT_RIGHT)) || (rightActive && !isTimedAction && checkStatus))
  {
    isMvtExpropiative = false;
    STprint("right entered");
    isTimedAction = false;
    toRet = robotTurn(1);
    rightActive = !toRet;
    if (toRet)
    {
      answerCommand(&runningMvt, MVT_RIGHT, client);
    }
  }
  else if ((msg.equals(MVT_LEFT)) || (leftActive && !isTimedAction && checkStatus))
  {
    isMvtExpropiative = false;
    STprint("left entered");
    isTimedAction = false;
    toRet = robotTurn(-1);
    leftActive = !toRet;
    if (toRet)
    {
      answerCommand(&runningMvt, MVT_LEFT, client);
    }
  }
  else if ((msg.equals(MVT_TIMEDREVERSE)) || (reverseActive && isTimedAction && checkStatus))
  {
    isTimedAction = true;
    isMvtExpropiative = false;
    STprint("t_reverse entered");
    toRet = robotTimedMove(-1);
    reverseActive = !toRet;
    if (toRet)
    {
      isTimedAction = false;
      answerCommand(&runningMvt, MVT_TIMEDREVERSE, client);
    }
  }
  else if ((msg.equals(MVT_TIMEDFORWARD)) || (forwardActive && isTimedAction && checkStatus))
  {
    isTimedAction = true;
    isMvtExpropiative = false;
    STprint("t_forward entered");
    toRet = robotTimedMove(1);
    forwardActive = !toRet;
    if (toRet)
    {
      isTimedAction = false;
      answerCommand(&runningMvt, MVT_TIMEDFORWARD, client);
    }
  }
  else if ((msg.equals(MVT_TIMEDLEFT)) || (leftActive && isTimedAction && checkStatus))
  {
    isTimedAction = true;
    isMvtExpropiative = false;
    STprint("t_left entered");
    toRet = robotTimedTurn(-1);
    leftActive = !toRet;
    if (toRet)
    {
      isTimedAction = false;
      answerCommand(&runningMvt, MVT_TIMEDLEFT, client);
    }
  }
  else if ((msg.equals(MVT_TIMEDRIGHT)) || (rightActive && isTimedAction && checkStatus))
  {
    isTimedAction = true;
    isMvtExpropiative = false;
    STprint("t_right entered");
    toRet = robotTimedTurn(1);
    rightActive = !toRet;
    if (toRet)
    {
      isTimedAction = false;
      answerCommand(&runningMvt, MVT_TIMEDRIGHT, client);
    }
  }

  if ((msg.equals(MVT_ROLL)))
  {
    forwardActive = true;
    isTimedAction = false;
    isMvtExpropiative = true;
    STprint("forever_forward entered");
    robotForeverMove(1);
    runningMvt.removeTask(MVT_ROLL);
  }
  else if ((msg.equals(MVT_REVERSEROLL)))
  {
    reverseActive = true;
    isTimedAction = false;
    isMvtExpropiative = true;
    STprint("forever_reverse entered");
    robotForeverMove(-1);
    runningMvt.removeTask(MVT_REVERSEROLL);
  }

  motorInactive = getMotorsStatus();
}

void Robot::robotBasicCommands(String msg, bool checkStatus, WiFiClient client)
{
  bool toRet = false;
  if (msg.equals(BASIC_CALIB))
  { // if para calibracion
    STprint("calibration entered");
    calibration();
    answerCommand(&runningBasics, BASIC_CALIB, client);
  }
  else if (msg.equals(BASIC_STOP_ALL))
  {
    STprint("stop_all entered");
    isTimedAction = false;
    robotStopMovement();
    readFaces(EMOTION_STOP);
    isMvtExpropiative = false;
    isEmoExpropiative = false;
    screenInactive = true;
    answerAllPending(client);
    runningBasics.removeTask(BASIC_STOP_ALL);
  }
  else if (msg.equals(BASIC_CONNECT))
  {
    STprint("Connect entered");
    connectClient();
    toRet = true;
    answerCommand(&runningBasics, BASIC_CONNECT, client);
  }
  else if (msg.equals(BASIC_STOP_MVT))
  {
    STprint("stop_mvt entered");
    isTimedAction = false;
    robotStopMovement();
    isMvtExpropiative = false;
    runningBasics.removeTask(BASIC_STOP_MVT);
  }
}

void Robot::robotForeverMove(int dir)
{
  STprint("robotFor Command");
  foreverForward(speeds * dir);
}

bool Robot::robotForward()
{
  STprint("robotForward Command");
  return followLine(speeds);
}
bool Robot::robotTurn(int dir)
{
  STprint("robotTurn Command");
  return turn(dir, speeds);
}
bool Robot::robotTimedMove(int dir)
{
  STprint("robotTimedMove Command");
  return timedMove(dir * speeds, mvtTimer * 1000, &mvtTimeElapsed);
}
bool Robot::robotTimedTurn(int dir)
{
  STprint("robotTimedTurn Command");
  return timedTurn(dir, speeds, mvtTimer * 1000, &mvtTimeElapsed);
}

bool Robot::robotStopMovement()
{
  STprint("robotStopMovement Command");
  setSpeedsMotor(0, 0);
  forwardActive = false;
  rightActive = false;
  leftActive = false;
  reverseActive = false;
  isMvtExpropiative = false;
  motorInactive = getMotorsStatus();
  return true;
}

bool Robot::getMotorsStatus() {
  return !(rightActive || leftActive || forwardActive || reverseActive);
}
void Robot::readCustomVariablesMotors(String msg, WiFiClient client)
{
  String messageint = "";
  bool digit = false;
  if (!msg.indexOf("speed"))
  {
    for (char single : msg)
    {
      if (isDigit(single))
      {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true)
    {
      speeds = messageint.toInt();
      client.println(speeds);
      messageint = "";
    }
  }
  if (msg.equals("check"))
  {
    checkControl = !checkControl;
  }
  if (!msg.indexOf("kp"))
  {
    for (char single : msg)
    {
      if (isDigit(single) || single == '.')
      {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true)
    {
      kp = messageint.toFloat();
      client.println(kp);
      messageint = "";
    }
  }
  if (!msg.indexOf("kd"))
  {
    for (char single : msg)
    {
      if (isDigit(single) || single == '.')
      {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true)
    {
      kd = messageint.toFloat();
      client.println(kd);
      messageint = "";
    }
  }
  if (!msg.indexOf("ki"))
  {
    for (char single : msg)
    {
      if (isDigit(single) || single == '.')
      {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true)
    {
      ki = messageint.toFloat();
      client.println(ki);
      messageint = "";
    }
  }
}

void Robot::readCustomVariablesSensors(String msg, WiFiClient client)
{
  if (!msg.indexOf("calibration"))
  {
    STprint("calibration entered");
    calibration();
    client.println(arguments[currentArgs - 1]);
  }
  if (msg.equals("sensorReadFrontL"))
  {
    ReadValues();
    client.println(sensorValues[0]);
  }
  if (msg.equals("sensorReadFrontR"))
  {
    ReadValues();
    client.println(sensorValues[1]);
  }
  if (msg.equals("sensorReadBackL"))
  {
    ReadValues();
    client.println(sensorValues[2]);
  }
  if (msg.equals("sensorReadBackR"))
  {
    ReadValues();
    client.println(sensorValues[3]);
  }
}

void Robot::JointServoMsg(String msg, WiFiClient client)
{
  String messageint = "";
  bool digit = false;
  int positionJoint;
  int periodJoint;
  if (!msg.indexOf("static"))
  {
    for (char single : msg)
    {
      if (isDigit(single))
      {
        digit = true;
        messageint.concat(single);
      }
    }
    if (digit = true)
    {
      positionJoint = messageint.toInt();
      JointStatic(positionJoint);
      messageint = "";
    }
  }
}

bool Robot::readFaces(String msg)
{
  STprint("readFaces entered");
  STprint(msg);
  if (msg.equals(EMOTION_VERYHAPPY))
  {
    int myarray[NUMPIXELS] = {0};
    int indexarray[16] = {13, 14, 17, 18, 19, 21, 22, 25, 33, 41, 42, 43, 45, 46, 53, 54};

    int color[3] = {255, 255, 0};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++)
    {
      if (i == indexarray[contador])
      {
        myarray[i] = 1;
        contador++;
        if (contador > 15)
        {
          contador = 15;
        }
      }
    }
    facesDraw(myarray, color, 25);
    STprint(EMOTION_VERYHAPPY);
  }
  else if (msg.equals(EMOTION_HAPPY))
  {
    int myarray[NUMPIXELS] = {0};
    int indexarray[14] = {13, 14, 17, 18, 21, 22, 25, 33, 41, 42, 45, 46, 53, 54};

    int color[3] = {255, 255, 60};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++)
    {
      if (i == indexarray[contador])
      {
        myarray[i] = 1;
        contador++;
        if (contador > 15)
        {
          contador = 15;
        }
      }
    }
    facesDraw(myarray, color, 20);
    STprint(EMOTION_HAPPY);
  }
  else if (msg.equals(EMOTION_SAD))
  {
    int myarray[NUMPIXELS] = {0};
    int indexarray[14] = {13, 14, 18, 19, 21, 22, 27, 35, 42, 43, 45, 46, 53, 54};
    int color[3] = {0, 0, 200};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++)
    {
      if (i == indexarray[contador])
      {
        myarray[i] = 1;
        contador++;
        if (contador > 15)
        {
          contador = 15;
        }
      }
    }
    facesDraw(myarray, color, 10);
    STprint(EMOTION_SAD);
  }
  else if (msg.equals(EMOTION_VERYSAD))
  {
    int myarray[NUMPIXELS] = {0};
    int indexarray[16] = {13, 14, 17, 18, 19, 21, 22, 27, 35, 41, 42, 43, 45, 46, 53, 54};
    int color[3] = {0, 0, 255};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++)
    {
      if (i == indexarray[contador])
      {
        myarray[i] = 1;
        contador++;
        if (contador > 15)
        {
          contador = 15;
        }
      }
    }
    facesDraw(myarray, color, 5);
    STprint(EMOTION_VERYSAD);
  }
  else if (msg.equals(EMOTION_ANGRY))
  {
    int myarray[NUMPIXELS] = {0};
    int indexarray[12] = {6, 9, 14, 18, 21, 26, 34, 42, 45, 49, 54, 62};
    int color[3] = {255, 0, 0};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++)
    {
      if (i == indexarray[contador])
      {
        myarray[i] = 1;
        contador++;
        if (contador > 11)
        {
          contador = 11;
        }
      }
    }
    facesDraw(myarray, color, 50);
    STprint(EMOTION_ANGRY);
  }
  else if (msg.equals(EMOTION_NEUTRAL))
  {
    int myarray[NUMPIXELS] = {0};
    int indexarray[12] = {13, 14, 18, 21, 22, 26, 34, 42, 45, 46, 53, 54};
    int color[3] = {0, 255, 0};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++)
    {
      if (i == indexarray[contador])
      {
        myarray[i] = 1;
        contador++;
        if (contador > 11)
        {
          contador = 11;
        }
      }
    }
    facesDraw(myarray, color, 15);
    STprint(EMOTION_NEUTRAL);
  }
  else if (msg.equals(EMOTION_SURPRISED))
  {
    int myarray[NUMPIXELS] = {0};
    int indexarray[18] = {13, 14, 17, 18, 19, 21, 22, 25, 27, 33, 35, 41, 42, 43, 45, 46, 53, 54};
    int color[3] = {0, 225, 165};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++)
    {
      if (i == indexarray[contador])
      {
        myarray[i] = 1;
        contador++;
        if (contador > 17)
        {
          contador = 17;
        }
      }
    }
    facesDraw(myarray, color, 20);
    STprint(EMOTION_SURPRISED);
  }
  else if (msg.equals(EMOTION_SICK))
  {
    int myarray[NUMPIXELS] = {0};
    int indexarray[16] = {13, 14, 17, 18, 19, 21, 22, 27, 35, 41, 42, 43, 45, 46, 53, 54};
    int color[3] = {93, 74, 217};
    int contador = 0;
    for (int i = 0; i < NUMPIXELS; i++)
    {
      if (i == indexarray[contador])
      {
        myarray[i] = 1;
        contador++;
        if (contador > 15)
        {
          contador = 15;
        }
      }
    }
    facesDraw(myarray, color, 7);
    STprint(EMOTION_SICK);
  }
  else if (msg.equals(EMOTION_OFF))
  {
    int myarray[NUMPIXELS] = {0};
    int color[3] = {0, 0, 0};
    facesDraw(myarray, color, 0);
    STprint(EMOTION_OFF);

  }

  return true;
}

void Robot::processCommands(String command, bool checkStatus, WiFiClient client)
{
  STprint("command");
  STprint(command);
  STprint("Status");
  STprint(checkStatus);
  STprint("screenInactive");
  STprint(screenInactive);
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
  STprint("runningMvt.pendingTasks");
  STprint(runningMvt.pendingTasks);
  STprint("runningEmotions.pendingTasks");
  STprint(runningEmotions.pendingTasks);
  STprint("runningCustoms.pendingTasks");
  STprint(runningCustoms.pendingTasks);
  STprint("macroStep");
  STprint(macroStep);
  if (checkStatus)
  {
    STprint("Checking Status");
  }
  else
  {
    STprint("Starting Command");
  }

  robotBasicCommands(command, checkStatus, client);

  if (runningMvt.pendingTasks > 0)
  {
    checkMotorCommands(command, checkStatus, client);
  }
  if (runningEmotions.pendingTasks > 0)
  {
    checkEmotionCommands(command, checkStatus, client);
  }
  if (runningCustoms.pendingTasks > 0)
  {
    checkCustomCommands(command, checkStatus, client);
  }
}

/*
   Logica para conversion de comandos a tareas nativas. Incluye identificación de tipo de tarea - Va afuera
*/
Task* Robot::msgToTask(String msg)
{
  int tabs{0};
  currentArgs = 0;

  for (int i = 0; i < MAX_ARGS; i++)
  { // inicialziacion del arreglo de parametros
    arguments[i] = "";
  }
  Task *task = new Task();
  for (char index : msg)
  { // recorrer la cadena
    if (isSpace(index))
    { // separar por espacios
      tabs++;
    }
    else
    {
      switch (tabs)
      {
        case 0: // caso 0 es el id, no se guarda
          break;
        case 1: // caso 1 es el comando
          command.concat(index);
          break;
        default: // del 1 en adelante son parametros
          arguments[tabs - 2].concat(index);
          break;
      }
    }
  }
  currentArgs = tabs - 1;

  if (currentArgs > 0)
  {
    if (isMvtAction(command))
    {
      strcpy(task->type, TYPE_MOVEMENT);
      if (arguments[0].equals(EMPTY_PARAM))
      {
        task->speed = speeds;
      }
      else
      {
        task->speed = arguments[0].toInt();
      }
      if (isMvtTimedAction(command))
      {
        task->time = arguments[1].toInt();
      }
    }
    else if (isEmoAction(command))
    {
      strcpy(task->type, TYPE_EMOTION);
      if (command.equals(EMOTION_SWITCH))
      {
        arguments[0].toCharArray(task->emo1, BUFFER_SIZE);
        arguments[1].toCharArray(task->emo2, BUFFER_SIZE);
        task->time = arguments[2].toInt();
        task->period = arguments[3].toInt();
      }
      else if (command.equals(EMOTION_STR))
      {
        arguments[0].toCharArray(task->emo1, BUFFER_SIZE);
      }
    }
    else if (isCustomAction(command))
    {
      strcpy(task->type, TYPE_CUSTOM);
      if (currentArgs > 1)
      {
        if (arguments[0].equals(EMPTY_PARAM))
        {
          task->speed = speeds;
        }
        else
        {
          task->speed = arguments[0].toInt();
        }
      }
    }
    else if (isBasicAction(command))
    {
      strcpy(task->type, TYPE_BASIC);
      if (command.equals(BASIC_CONNECT))
      {
        returnIP = arguments[0];
        returnPort = arguments[1].toInt();
      }
    }
    command.toCharArray(task->command, BUFFER_SIZE);
    task->ack = arguments[currentArgs - 1].toInt();
  }
  command = "";
  return task;
}

bool Robot::isMvtAction(String command)
{
  return command.equals(MVT_FORWARD) || command.equals(MVT_LEFT) || command.equals(MVT_RIGHT) || command.equals(MVT_ROLL) || command.equals(MVT_REVERSEROLL) || isMvtTimedAction(command);
}

bool Robot::isMvtTimedAction(String command)
{
  return command.equals(MVT_TIMEDFORWARD) || command.equals(MVT_TIMEDREVERSE) || command.equals(MVT_TIMEDLEFT) || command.equals(MVT_TIMEDRIGHT);
}

bool Robot::isEmoAction(String command)
{
  return command.equals(EMOTION_STR) || command.equals(EMOTION_SWITCH) || command.equals(EMOTION_OFF);
}

bool Robot::isBasicAction(String command)
{
  return command.equals(BASIC_STOP_ALL) || command.equals(BASIC_CALIB) || command.equals(BASIC_STOP_MVT) || command.equals(BASIC_CONNECT);
}

bool Robot::switchFaces(String emo1, String emo2, long time, long period)
{
  STprint("switchFaces in");
  boolean toRet = robotDelay(time, &emoTimeElapsed);
  if (toRet)
  {
    screenInactive = !toRet;
    emoTimeElapsed = 0;
    emoAuxTimeElapsed = 0;
    activeEmo = "";
    STprint("Ended Time");
  }
  else
  {

    boolean periodDone = robotDelay(period, &emoAuxTimeElapsed);
    if (periodDone)
    {
      STprint("Changing Face");

      if (activeEmo.equals(emo1))
      {
        emoAuxTimeElapsed = 0;
        activeEmo = emo2;
        readFaces(emo2);
      }
      else
      {
        emoAuxTimeElapsed = 0;
        activeEmo = emo1;
        readFaces(emo1);
      }
    }
    else
    {
      if (activeEmo.isEmpty())
      {
        STprint("Start switch Face");

        activeEmo = emo1;
        readFaces(emo1);
      }
    }
    STprint(activeEmo);
  }
  return toRet;
}
bool Robot::robotDelay(long time, long *timeElapsed)
{
  return STDelay(time, timeElapsed);
}

void Robot::answerAllPending(WiFiClient client)
{
  ActiveTask *aux;
  for (int i = 0; i < runningBasics.pendingTasks; i++)
  {
    aux = runningBasics.runningTasks[i];
    answerCommand(&runningBasics, String(aux->command), client);
  }
  for (int i = 0; i < runningMvt.pendingTasks; i++)
  {
    aux = runningMvt.runningTasks[i];
    answerCommand(&runningMvt, String(aux->command), client);
  }
  for (int i = 0; i < runningEmotions.pendingTasks; i++)
  {
    aux = runningEmotions.runningTasks[i];
    answerCommand(&runningEmotions, String(aux->command), client);
  }
  for (int i = 0; i < runningCustoms.pendingTasks; i++)
  {
    aux = runningCustoms.runningTasks[i];
    answerCommand(&runningCustoms, String(aux->command), client);
  }
}

void Robot::answerPendingByType(TaskList *list, WiFiClient client)
{
  ActiveTask *aux;
  for (int i = 0; i < list->pendingTasks; i++)
  {
    aux = list->runningTasks[i];

    answerCommand(list, String(aux->command), client);
  }
}
bool Robot::isInAction()
{
  return runningBasics.pendingTasks > 0 || runningMvt.pendingTasks > 0 || runningEmotions.pendingTasks > 0 || runningCustoms.pendingTasks > 0 || taskQueue.pendingTasks > 0;
}

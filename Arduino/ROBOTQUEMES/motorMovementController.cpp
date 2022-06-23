#include "motorMovementController.h"
#include "utils.h"
/*
  Following Line - Controller
*/

extern int error = 0;
extern float kp = 0.1;
extern float ki = 0.0001;
extern float kd = 0.3;
extern int lastError = 0;
extern int last_proportional = 0;
extern long integral = 0;
unsigned long Time1;
int period1 = 70;
bool overIntersection = true;
extern bool checkControl = false;
/*
  Movement Controller
*/
bool finds = false;
bool followLine(int speed) {
  int rightMotorSpeed, leftMotorSpeed, motorSpeed;
  // definición de las constantes del control:*****************************************************************************mejora mandar de parametros los ks

  ReadValues();
  //Detect Black Color by the Front Sensor
  if (overIntersection == true) {
    ReadValues();
    if (sensorValues[2] < 1000 && sensorValues[3] < 1000 ) {
      overIntersection = false;
      return false;
    }
    setSpeedsMotor(speed, speed);
    delay(50);
  }

  if (sensorValues[2] >= 1500 ^ sensorValues[3] >= 1500 ) {
    if (sensorValues[2] >= 1500 && finds == false) {
      Time1 = millis();
      finds = true;
    }
    if (finds == true && sensorValues[3]) {
      if (millis() - Time1 <= period1) {
        sensorValues[2] = 2000;
        sensorValues[3] = 2000;
      }
      finds = false;
    }
    if (sensorValues[3] >= 1500 && finds == false) {
      Time1 = millis();
      finds = true;
    }
    if (finds == true && sensorValues[2]) {
      if (millis() - Time1 <= period1) {
        sensorValues[2] = 2000;
        sensorValues[3] = 2000;
      }
      finds = false;
    }
  }
  if (sensorValues[2] >= 1500 && sensorValues[3] >= 1500 ) {
    setSpeedsMotor(0, 0);
    overIntersection = true;
    return true;
  } else {
    uint16_t SS[2];
    SS[0] = sensorValues[0];
    SS[1] = sensorValues[1];
    error = qtr.readLineBlack(SS) - 500;
    integral = integral + error;
    if ((error * integral) < 0) integral = 0;

    motorSpeed =  (error * kp) + ki * integral + (kd * (error - lastError));

    lastError = error;
    if (!checkControl) {
      rightMotorSpeed = speed - motorSpeed;
      leftMotorSpeed = speed + motorSpeed;
    } else {
      rightMotorSpeed = speed + motorSpeed;
      leftMotorSpeed = speed - motorSpeed;
    }
    //-***-
    // restringimos la velocidad a los rangos del motor 0 and MAX_SPEED.
    if (rightMotorSpeed > 255) {
      rightMotorSpeed = 255;
    }
    if (leftMotorSpeed > 255) {
      leftMotorSpeed = 255;
    }
    if (rightMotorSpeed < 0) {
      rightMotorSpeed = 0;
    }
    if (leftMotorSpeed < 0) {
      leftMotorSpeed = 0;
    }
    /*     if(sensorValues[2] < 1500 && sensorValues[3] >1500 &&(sensorValues[0] < 1500 || sensorValues[1]<1500)){
            setSpeedsMotor(leftMotorSpeed*(1+0.5),rightMotorSpeed*0.1);
          }else{
            if(sensorValues[2] > 1500 && sensorValues[3] <1500 &&(sensorValues[0] < 1500 || sensorValues[1]<1500)){
              setSpeedsMotor(leftMotorSpeed*0.1,rightMotorSpeed*(1+0.5));
            }else{

            }
          }*/
    setSpeedsMotor(leftMotorSpeed, rightMotorSpeed);
    delay(50);
    return false;
  }
}

bool turn(int direction, int speed) {
  ReadValues();
  while (overIntersection == true) {
    ReadValues();
    if (sensorValues[0] < 1000 && sensorValues[1] < 1000 ) {
      overIntersection = false;
      return false;
    }
    setSpeedsMotor(direction * speed, -direction * speed);
    delay(50);
  }
  if (sensorValues[0] >= 1500 ^ sensorValues[1] >= 1500 ) {
    if (sensorValues[0] >= 1500 && finds == false) {
      Time1 = millis();
      finds = true;
    }
    if (finds == true && sensorValues[1]) {
      if (millis() - Time1 <= period1) {
        sensorValues[0] = 2000;
        sensorValues[1] = 2000;
      }
      finds = false;
    }
    if (sensorValues[1] >= 1500 && finds == false) {
      Time1 = millis();
      finds = true;
    }
    if (finds == true && sensorValues[0]) {
      if (millis() - Time1 <= period1) {
        sensorValues[1] = 2000;
        sensorValues[0] = 2000;
      }
      finds = false;
    }
  }
  if (sensorValues[0] >= 1500 && sensorValues[1] >= 1500 ) {
    setSpeedsMotor(0, 0);
    overIntersection = true;
    return true;
  } else {
    setSpeedsMotor(direction * speed, -direction * speed);
    delay(50);
    return false;
  }
}

bool timedMove(int speed,  int time, long *timeElapsed) {
  STprint("timeElapsed");
  STprint(*timeElapsed);
  STprint("time");
  STprint(time);
  STprint("speed");
  STprint(speed);
  if (*timeElapsed == 0) {
    *timeElapsed = millis();
    setSpeedsMotor(speed, speed);
  }
  STprint(*timeElapsed);
  STprint(millis());
  boolean toRet = millis() - *timeElapsed >= time;
  if (toRet) {
    *timeElapsed = 0;
    setSpeedsMotor(0, 0);
  }
  return toRet;
}

bool timedTurn(int direction, int speed, int time,  long *timeElapsed) {
  STprint("timeElapsed");
  STprint(*timeElapsed);
  STprint("time");
  STprint(time);
  STprint("speed");
  STprint(speed);
  if (*timeElapsed == 0) {
    *timeElapsed = millis();
    setSpeedsMotor(direction * speed, -direction * speed);
  }
  boolean toRet = millis() - *timeElapsed >= time;
  if (toRet) {
    *timeElapsed = 0;
    setSpeedsMotor(0, 0);
  }
  return toRet;
}


void foreverForward(int speed){
  setSpeedsMotor(speed, speed);
}

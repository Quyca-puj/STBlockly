#include "motorSpeed.h"

/* Define again Servo*/
Servo rightServo;
Servo leftServo;
void setupmotor(){
  leftServo.attach(LEFT_MOTOR);
  rightServo.attach(RIGHT_MOTOR);
  leftServo.write(config.getConfig(ConfigOptions::SPEED_OFFSET_LEFT));
  rightServo.write(config.getConfig(ConfigOptions::SPEED_OFFSET_RIGHT));
}
void setSpeedsMotor(int leftSp,int rigthSp){
  //***********************************************************************************
      // Define the result varible for left speed.
      int leftS = 0;
    
      // Define the result varible for rigth speed.
      int rigthS = 0;
    
      // Check if speed more than 0.
      if (leftSp >= 0)
      {
        // Scale it to use it with the servo (value between 0 and 90 -> 0 to 90).
        leftS = config.getConfig(ConfigOptions::SPEED_OFFSET_LEFT) - map(leftSp, 0, 255, 0, 90);
      }
      else
      {
        // Scale it to use it with the servo (value between 0 and 90 -> 90 to 180).
        leftS = map( (leftSp * -1) , 0, 255, 0, 90) + config.getConfig(ConfigOptions::SPEED_OFFSET_LEFT);
      }
    
      // Check if speed more than 0.
      if (rigthSp >= 0)
      {
        // Scale it to use it with the servo (value between 0 and 90 -> 90 to 180).
        rigthS =  map(rigthSp, 0, 255, 0, 90) + config.getConfig(ConfigOptions::SPEED_OFFSET_RIGHT);
      }
      else
      {
        // Scale it to use it with the servo (value between 0 and 90 -> 0 to 90).
        rigthS = config.getConfig(ConfigOptions::SPEED_OFFSET_RIGHT) - map( (rigthSp * -1) , 0, 255, 0, 90);
      }
    
      // Set the results speeds.
      leftServo.write(leftS);
      rightServo.write(rigthS);
}

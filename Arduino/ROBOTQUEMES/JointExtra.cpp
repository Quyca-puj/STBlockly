#include "JointExtra.h"

//Define servo Joint
Servo JointServo;
int constrainposition[2]{70,90};
bool JointDirection=false;
int JointPosition=60;
unsigned long timetransition;

void JointDynamic(int JointPeriod){
  if(millis() - timetransition > JointPeriod){
    timetransition=millis();
    if(JointDirection){
      JointPosition -=10;
    }else{
      JointPosition += 10;
    }
    if(JointPosition <= constrainposition[0]) {
      JointDirection = true;
    }
    if(JointPosition >= constrainposition[1]) {
      JointDirection = false;
    }
  }
  JointServo.write(JointPosition);
}

void JointStatic(int gradePosition){
  JointServo.write(gradePosition);
}

void JointSetup(){
  JointServo.attach(JOINT_MOTOR);
  JointServo.write(JointPosition);
}

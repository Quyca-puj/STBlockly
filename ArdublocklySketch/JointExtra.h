#ifndef JOINTEXTRA_H_
#define JOINTEXTRA_H_
#include <Servo.h>


  //DEFINE GLOBALS
  #define JOINT_MOTOR 4

  /*
    Servo Setup
  */
  //Define servo Joint
  extern Servo JointServo;
  extern int constrainposition[2];
  extern bool JointDirection;
  extern int JointPosition;
  extern unsigned long timetransition;

  void JointDynamic(int JointPeriod);
  void JointStatic(int gradePosition);
  void JointSetup();
#endif

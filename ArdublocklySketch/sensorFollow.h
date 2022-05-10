#ifndef SENSORFOLLOW_H_
#define SENSORFOLLOW_H_

#include <QTRSensors.h>

//Define sensor Motor

#define D5 14 //Frente Derecho
#define D6 12 // Espalda Derecho
#define D1 5  //Frente Izquierdo
#define D0 16 //Espalda Izquierdo

extern QTRSensors qtr;
#define NUM_SENSORS   4 
extern uint16_t sensorValues[NUM_SENSORS];
void setupSensors();

void ReadValues();


#endif

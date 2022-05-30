#include "sensorFollow.h"

QTRSensors qtr;

uint16_t sensorValues[NUM_SENSORS];

void setupSensors(){
  qtr.setTypeRC();
  qtr.setSensorPins((const uint8_t[]){D1,D5,D0,D6},NUM_SENSORS);
}

void ReadValues(){
  qtr.read(sensorValues);
}

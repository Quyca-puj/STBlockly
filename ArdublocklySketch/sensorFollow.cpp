#include "sensorFollow.h"

QTRSensors qtr;

uint16_t sensorValues[NUM_SENSORS];
/*
 * Sets up sensors
 */
void setupSensors(){
  qtr.setTypeRC();
  qtr.setSensorPins((const uint8_t[]){D1,D5,D0,D6},NUM_SENSORS);
}

/*
 * Reads calibrated values for black and white.
 */
void ReadValues(){
  qtr.readCalibrated(sensorValues);
}

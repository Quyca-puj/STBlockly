#ifndef FACESLED_H_
#define FACESLED_H_
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif

  //Pinout Pixel
  #define PINFACES 3
  #define NUMPIXELS 64

  extern Adafruit_NeoPixel FacesInterface;
  
  void facesDraw(int ledsArray[NUMPIXELS],int color[3],int intensity);
  void setupFaces();
#endif

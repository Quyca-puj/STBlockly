#include "FacesLed.h"

extern Adafruit_NeoPixel FacesInterface(NUMPIXELS,PINFACES,NEO_GRB + NEO_KHZ800);

  
void facesDraw(int ledsArray[NUMPIXELS],int color[3],int intensity){
  for(int i=0;i<NUMPIXELS;i++){
    if(ledsArray[NUMPIXELS-i]==1){
      FacesInterface.setPixelColor(i,FacesInterface.Color(color[0],color[1],color[2]));       
    }else{
      FacesInterface.setPixelColor(i,FacesInterface.Color(0,0,0)); 
    }     
  }
  FacesInterface.setBrightness(intensity);
  FacesInterface.show();
}

void setupFaces(){
  FacesInterface.begin();
  FacesInterface.clear();
  int ledsArray[NUMPIXELS]{0};
  int colors[3]{0};
  facesDraw(ledsArray,colors,0); 
}

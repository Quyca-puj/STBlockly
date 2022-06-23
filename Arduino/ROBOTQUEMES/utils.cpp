#include "utils.h"
void STprint(String msg){
  if(shouldLog){
    Serial.println(msg);
  }
}

void STprint(int msg){
  if(shouldLog){
    Serial.println(msg);
  }
}

void STprint(long msg){
  if(shouldLog){
    Serial.println(msg);
  }
}

void STprint(unsigned long msg){
  if(shouldLog){
    Serial.println(msg);
  }
}

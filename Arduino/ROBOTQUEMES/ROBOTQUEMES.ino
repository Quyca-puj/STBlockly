#include "Robot.h"


/*General Variables to control messages*/
bool rec_flag =false;

void Robot::processCommands(String msg){
robotMovement(command);
readFaces(command);
}

Robot robot(115200,"ciscoTest", "");
void setup() {
 
}

void loop() {  
   WiFiClient client = wifiServer.available();
   String messages="";
  if(client){
    while (client.connected()) {
      while (client.available()>0) {
        char c = client.read();
        messages.concat(c);
        rec_flag = true;
      }
      if(rec_flag ==true){
        Serial.println("Message");
        robot.processMsg(messages, client);
        messages="";
        rec_flag=false;
      }
      delay(10);
    }
    Serial.println("Client Disconnected");
    rec_flag=false;
    client.stop(); 
  }
}

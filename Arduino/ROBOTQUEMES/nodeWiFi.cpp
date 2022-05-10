#include "nodeWifi.h"

// WiFiClient client;
extern WiFiServer wifiServer(PORT);
void WifiConnection(String ssid, String password){
 // const char* host = "192.168.1.105";
//  const uint16_t port = 6000;
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting..");
  }
 
  Serial.print("Connected to WiFi. IP:");
  Serial.println(WiFi.localIP());
 
  wifiServer.begin();
 /* while (!client.connect(host, port)) {
    Serial.println("connection failed");
    delay(5000);
  }*/
}

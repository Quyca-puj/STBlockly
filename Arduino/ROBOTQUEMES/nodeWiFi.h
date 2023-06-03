#ifndef NODEWIFI_H_
#define NODEWIFI_H_

#include <ESP8266WiFi.h>

//Define PORT AND IP PARAMETERS

#define PORT 6000

//extern WiFiClient client;
extern WiFiServer wifiServer;

void WifiConnection(String ssid, String password);

#endif

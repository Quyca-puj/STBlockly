'use strict';

goog.require('Blockly.Java');

Blockly.Java['mvt_avanzar'] = function(block) {
  var dropdown_movement = block.getFieldValue('Movement');
  var dropdown_emotion = block.getFieldValue('Emotion');

  var code = 'showEmotion("'+dropdown_emotion+'");\n';
  var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
  code+=aux_code;
  return code;
};

Blockly.Java['mvt_girar'] = function(block) {
  var dropdown_movement = block.getFieldValue('Movement');
  var dropdown_emotion = block.getFieldValue('Emotion');

  var code = 'showEmotion("'+dropdown_emotion+'");\n';
  var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
  code+=aux_code;
  return code;
};

Blockly.Java['mvt_avanzar_tiempo'] = function(block) {
  var dropdown_movement = block.getFieldValue('Movement');
  var time = block.getFieldValue('TIME');

  var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
  code+=aux_code;
  return code;
};

Blockly.Java['mvt_girar_tiempo'] = function(block) {
  var dropdown_movement = block.getFieldValue('Movement');
  var time = block.getFieldValue('TIME');

  var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
  code+=aux_code;
  return code;
};

Blockly.Java['mvt_stop'] = function(block) {
  var code='robotMovement("stop", client);\n';
  return code;
};

Blockly.Java['hablar'] = function(block) {
  var value_tosay = Blockly.Java.valueToCode(block, 'ToSay', Blockly.Java.ORDER_ATOMIC);
  var code = 'textToSpeech('+value_tosay+');\n';
  return code;
};


 Blockly.Java['st_command_call'] = function(block) {
  var funcName = Blockly.Java.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var code = 'sendCommand("' + funcName + '");\n';
  return code;
};


  Blockly.Java['setupsmarttown'] = function(block) {
    var text_wifiname = block.getFieldValue('wifiName');
    var text_pass = block.getFieldValue('pass');

    var setupCode = 'Serial.begin(115200);\n'+
    'delay(1000);\n'+
    'WifiConnection();\n'+
    'setupMotor();\n'+
    'setupSensors();\n'+
    'setupFaces();\n'+
    'JointSetup();\n';

    var includeCode='#include "nodeWifi.h"\n'+
    '#include "motorMovementController.h"\n'+
    '#include "FacesLed.h"\n'+
    '#include "JointExtra.h"\n';

    var declCode='#define ssid "'+text_wifiname+'"\n'+
    '#define password "'+text_pass+'"';

    var robotMvtFunc = 'void robotMovement(String msg,WiFiClient client){\n'+
    '      String idMessage;\n'+
    '      if(!msg.indexOf("forward")){\n'+
    '          Serial.println("Word Found");\n'+
    '          idMessage=stringFindWord(msg);\n'+
    '          Serial.print("Speed");\n'+
    '          Serial.println(speeds);\n'+
    '          while(!followLine(speeds)){\n'+
    '             delay(50);\n'+
    '          } \n'+
    '          client.println(idMessage);\n'+
    '      }\n'+
    '      if (!msg.indexOf("reverse")){\n'+
    '          String idMessage;\n'+
    '          idMessage=stringFindWord(msg);\n'+
    '          setSpeedsMotor(-speeds,-speeds);\n'+
    '          delay(1500);\n'+
    '          client.println(idMessage);\n'+
    '      }\n'+
    '      \n'+
    '      if(!msg.indexOf("right")){\n'+
    '          String idMessage;\n'+
    '          idMessage=stringFindWord(msg);\n'+
    '          while(!turn(1,speeds)){\n'+
    '            delay(50);\n'+
    '          }\n'+
    '          client.println(idMessage);\n'+
    '      }\n'+
    '      if(!msg.indexOf("left")){\n'+
    '          String idMessage;\n'+
    '          idMessage=stringFindWord(msg);\n'+
    '          while(!turn(-1,speeds)){\n'+
    '            delay(50);\n'+
    '          }\n'+
    '          client.println(idMessage);\n'+
    '      }\n'+
    '      if(!msg.indexOf("stop")){\n'+
    '        String idMessage;\n'+
    '        idMessage=stringFindWord(msg);\n'+
    '        setSpeedsMotor(0,0);\n'+
    '        client.println(idMessage);\n'+
    '      }\n'+
    '}\n';

    var motorsFunc='void readCustomVariablesMotors(String msg,WiFiClient client){\n'+
'  String messageint="";\n'+
'  bool digit=false;\n'+
'  if(!msg.indexOf("speed")){\n'+
'        for (char single : msg){\n'+
'          if(isDigit(single)){\n'+
'            digit=true;\n'+
'            messageint.concat(single);\n'+
'          }\n'+
'        }\n'+
'        if(digit=true){\n'+
'          speeds= messageint.toInt();  \n'+
'          client.println(speeds);\n'+
'          messageint = "";\n'+
'        }\n'+
'      }\n'+
'      if(msg.equals("check")){\n'+
'        checkControl = !checkControl;\n'+
'      }\n'+
'      if(!msg.indexOf("kp")){\n'+
'        for (char single : msg){\n'+
'          if(isDigit(single) || single =="."){\n'+
'            digit=true;\n'+
'            messageint.concat(single);\n'+
'          }\n'+
'        }\n'+
'        if(digit=true){\n'+
'          kp= messageint.toFloat();  \n'+
'          client.println(kp);\n'+
'          messageint = "";\n'+
'        }\n'+
'      }\n'+
'      if(!msg.indexOf("kd")){\n'+
'        for (char single : msg){\n'+
'          if(isDigit(single) || single =="."){\n'+
'            digit=true;\n'+
'            messageint.concat(single);\n'+
'          }\n'+
'        }\n'+
'        if(digit=true){\n'+
'          kd= messageint.toFloat();  \n'+
'          client.println(kd);\n'+
'          messageint = "";\n'+
'        }\n'+
'      }\n'+
'      if(!msg.indexOf("ki")){\n'+
'        for (char single : msg){\n'+
'          if(isDigit(single) || single =="."){\n'+
'            digit=true;\n'+
'            messageint.concat(single);\n'+
'          }\n'+
'        }\n'+
'        if(digit=true){\n'+
'          ki= messageint.toFloat();  \n'+
'          client.println(ki);\n'+
'          messageint = "";\n'+
'        }\n'+
'      }\n'+
'}\n';

    var sensorsFunc='void readCustomVariablesSensors(String msg,WiFiClient client){\n'+
    '      if(!msg.indexOf("calibration")){\n'+
    '        String messageintID="";\n'+
    '        int tabs{0};\n'+
    '        for (char index: msg){\n'+
    '          if(isSpace(index)){\n'+
    '            tabs++;\n'+
    '          }\n'+
    '          if (tabs==1){\n'+
    '            messageintID.concat(index);\n'+
    '          }\n'+
    '        }  \n'+
    '        calibration();\n'+
    '        client.println(messageintID);\n'+
    '      }    \n'+
    '      if(msg.equals("sensorReadFrontL")){\n'+
    '        ReadValues();\n'+
    '        client.println(sensorValues[0]);   \n'+
    '      }\n'+
    '      if(msg.equals("sensorReadFrontR")){\n'+
    '        ReadValues();\n'+
    '        client.println(sensorValues[1]);   \n'+
    '      }\n'+
    '      if(msg.equals("sensorReadBackL")){\n'+
    '        ReadValues();\n'+
    '        client.println(sensorValues[2]);   \n'+
    '      }\n'+
    '      if(msg.equals("sensorReadBackR")){\n'+
    '        ReadValues();\n'+
    '        client.println(sensorValues[3]);   \n'+
    '      }\n'+
    '}\n';

    var servoFunc='void JointServoMsg(String msg,WiFiClient client){\n'+
    '    String messageint="";\n'+
    '    bool digit=false;\n'+
    '    int positionJoint;\n'+
    '    int periodJoint;\n'+
    '    if(!msg.indexOf("EXTRAJOINTSTATIC")){\n'+
    '       for (char single : msg){\n'+
    '          if(isDigit(single)){\n'+
    '            digit=true;\n'+
    '            messageint.concat(single);\n'+
    '          }\n'+
    '        }\n'+
    '        if(digit=true){\n'+
    '          positionJoint= messageint.toInt();  \n'+
    '          client.println("DynamicMotor");\n'+
    '          JointStatic(positionJoint);\n'+
    '          messageint = "";\n'+
    '        }\n'+
    '    }\n'+
    '    if(!msg.indexOf("EXTRAJOINTDYNAMIC")){\n'+
    '       for (char single : msg){\n'+
    '          if(isDigit(single)){\n'+
    '            digit=true;\n'+
    '            messageint.concat(single);\n'+
    '          }\n'+
    '        }\n'+
    '        if(digit=true){\n'+
    '          periodJoint= messageint.toInt();\n'+
    '          timetransition=millis();  \n'+
    '          client.println("DynamicMotor");\n'+
    '          JointDynamic(periodJoint);\n'+
    '          messageint = "";\n'+
    '        }\n'+
    '    }\n'+
    '}\n';

    var findWordFunc='String stringFindWord(String msg){\n'+
    '  String messageintSpeed="";\n'+
    '  String messageintID="";\n'+
    '  int tabs{0};\n'+
    '  for (char index: msg){\n'+
    '    if(isSpace(index)){\n'+
    '      tabs++;\n'+
    '    }\n'+
    '    switch (tabs){\n'+
    '      case 1:\n'+
    '        messageintSpeed.concat(index);\n'+
    '        break;\n'+
    '      case 2:\n'+
    '        messageintID.concat(index);\n'+
    '        break;\n'+
    '      default:\n'+
    '        break;    \n'+
    '    }\n'+
    '  }\n'+
    '  Serial.println(speeds);\n'+
    '  speeds= messageintSpeed.toInt();\n'+
    '  return messageintID;\n'+
    '}\n';

    Blockly.Java.addDeclaration("custom",declCode);
    Blockly.Java.addInclude('custom',includeCode);
    Blockly.Java.addSetup('custom',setupCode,false);
    Blockly.Java.addFunction('robotMovement',robotMvtFunc);
    Blockly.Java.addFunction('readCustomVariablesMotors',motorsFunc);
    Blockly.Java.addFunction('readCustomVariablesSensors',sensorsFunc);
    Blockly.Java.addFunction('JointServoMsg',servoFunc);
    Blockly.Java.addFunction('stringFindWord',findWordFunc);

    var code = 'WiFiClient client = wifiServer.available();\n'+
'if(client){\n'+
      ' while (client.connected()) {\n'+
        '   String messages="";\n'+
        '   while (client.available()>0) {\n'+
          '     char c = client.read();\n'+
          '     messages.concat(c);\n'+
          '     recieve = true;\n'+
        '   }\n'+
        '   if(recieve ==true){\n'+
          '     Serial.println("Message");\n'+
          '     robotMovement(messages,client);\n'+
          '     readCustomVariablesSensors(messages,client);\n'+
          '     messages="";\n'+
          '     recieve=false;\n'+
        '   }\n'+
        ' delay(10);\n'+
      '}\n'+
      'Serial.println("Client Disconnected");\n'+
      'recieve=false;\n'+
      'client.stop();\n'+
      '}\n';
    return code;
  };
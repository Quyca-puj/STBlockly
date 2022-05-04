'use strict';

goog.require('Blockly.Arduino');

Blockly.Arduino['mvt_avanzar'] = function(block) {
    var dropdown_movement = block.getFieldValue('Movement');
    var dropdown_emotion = block.getFieldValue('Emotion');

    var code = 'showEmotion("'+dropdown_emotion+'");\n';
    var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
    code+=aux_code;
    return code;
  };

  Blockly.Arduino['mvt_girar'] = function(block) {
    var dropdown_movement = block.getFieldValue('Movement');
    var dropdown_emotion = block.getFieldValue('Emotion');

    var code = 'showEmotion("'+dropdown_emotion+'");\n';
    var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
    code+=aux_code;
    return code;
  };

  Blockly.Arduino['mvt_avanzar_tiempo'] = function(block) {
    var dropdown_movement = block.getFieldValue('Movement');
    var time = block.getFieldValue('TIME');

    var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
    code+=aux_code;
    return code;
  };

  Blockly.Arduino['mvt_girar_tiempo'] = function(block) {
    var dropdown_movement = block.getFieldValue('Movement');
    var time = block.getFieldValue('TIME');

    var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
    code+=aux_code;
    return code;
  };

  Blockly.Arduino['mvt_stop'] = function(block) {
    var code='robotMovement("stop", client);\n';
    return code;
  };

  Blockly.Arduino['hablar'] = function(block) {
    var value_tosay = Blockly.Arduino.valueToCode(block, 'ToSay', Blockly.Arduino.ORDER_ATOMIC);
    var code = 'textToSpeech('+value_tosay+');\n';
    return code;
  };


  Blockly.Arduino['setupsmarttown'] = function(block) {
    var text_wifiname = block.getFieldValue('wifiName');
    var text_pass = block.getFieldValue('pass');
    let conf = block.getFieldValue('CONF_TYPE');

    let setupCode = '//'+conf+' config\n';

    switch (conf){
      case 'Quyca':
        setupCode += 
          '   Serial.begin(115200);\n'+
          '   delay(1000);\n'+
          '   WifiConnection();\n'+
          '   setupMotor();\n'+
          '   setupSensors();\n'+
          '   setupFaces();\n'+
          '   JointSetup();\n';
        break;
      case 'Smarttown':
        setupCode += 
          '   Serial.begin(115200);\n'+
          '   delay(1000);\n'+
          '   WifiConnection();\n'+
          '   setupMotor();\n'+
          '   setupSensors();\n'+
          '   setupFaces();\n'+
          '   JointSetup();\n';
        break;
      
    }

    var includeCode='#include "nodeWifi.h"\n'+
    '#include "motorMovementController.h"\n'+
    '#include "FacesLed.h"\n'+
    '#include "JointExtra.h"\n';

    var declCode='#define ssid "'+text_wifiname+'"\n'+
    '#define password "'+text_pass+'"';

    Blockly.Arduino.addDeclaration("custom",declCode);
    Blockly.Arduino.addInclude('custom',includeCode);
    Blockly.Arduino.addSetup('custom',setupCode,false);

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



  Blockly.Arduino['new_smarttown_command'] = function(block) {
    var text_name = block.getFieldValue('NAME');
    var statements_name = Blockly.Arduino.statementToCode(block, 'COMMANDS');
    Blockly.Arduino.addSTCommand(text_name,statements_name);
    return '';
  };
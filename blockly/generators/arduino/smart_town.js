'use strict';

goog.require('Blockly.Arduino');

Blockly.Arduino['mvt_avanzar'] = function(block) {
    let code='robotForward();\n';
    return code;
  };

  Blockly.Arduino['mvt_girar'] = function(block) {
    let dropdown_movement = block.getFieldValue('Movement');
    let code='robotTurn('+dropdown_movement+');\n';
    // code+=aux_code;
    return code;
  };

  Blockly.Arduino['mvt_avanzar_tiempo'] = function(block) {
    let dropdown_movement = block.getFieldValue('Movement');
    let time = block.getFieldValue('TIME');

    let code = "timer = "+time+";\n";
    let aux_code='robotTimedMove('+dropdown_movement+');\n';
    code+=aux_code;
    return code;
  };

  Blockly.Arduino['mvt_girar_tiempo'] = function(block) {
    let dropdown_movement = block.getFieldValue('Movement');
    let time = block.getFieldValue('TIME');

    let code = 'timer = "+time+";\n';
    let aux_code='robotTimedTurn('+dropdown_movement+');\n';
    code+=aux_code;
    return code;
  };

  Blockly.Arduino['mvt_stop'] = function(block) {
    let code='robotStopMovement();\n';
    return code;
  };

  Blockly.Arduino['hablar'] = function(block) {
    let value_tosay = Blockly.Arduino.valueToCode(block, 'ToSay', Blockly.Arduino.ORDER_ATOMIC);
    let code = 'textToSpeech('+value_tosay+');\n';
    return code;
  };


  Blockly.Arduino['setupsmarttown'] = function(block) {
    let text_wifiname = block.getFieldValue('wifiName');
    let text_pass = block.getFieldValue('pass');
    let serial = block.getFieldValue('serialNumber');
    let conf = block.getFieldValue('CONF_TYPE');
    let commands = Blockly.Arduino.statementToCode(block, 'COMMANDS');
    let STcommands = [];

    let STDef = 'void Robot::processCommands(String command) {\n';
    for (let name in Blockly.Arduino.STFunctions_) {
      STcommands.push('  if(!command.indexOf("'+name+'")){\n'+Blockly.Arduino.STFunctions_[name]+'   } \n');
    }

    if(STcommands.length){
      STDef+=STcommands.join(' else')
      STDef+=' else {\n     robotBasicCommands(command);\n   }\n';
    }else{
      STDef+='  robotBasicCommands(command);\n';
    }
    STDef+='}\n';

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

    let includeCode='#include "Robot.h"\n';
    let robotDef = 'Robot robot;\n'
    Blockly.Arduino.addFunction("processCommands",STDef);

    Blockly.Arduino.addInclude('custom',includeCode);
    Blockly.Arduino.setRobotDef(robotDef);
    Blockly.Arduino.addVariable('rec_flag','bool rec_flag = false;',true);


   let  setupRobotCode = 'robot.setupRobot('+serial+',"'+text_wifiname+'","'+text_pass+'");';
    Blockly.Arduino.addSetup("robotSetup",setupRobotCode,true);
    let code = 'WiFiClient client = wifiServer.available();\n'+
  'String messages = "";\n'+
  'if(client) {\n'+
      ' while (client.connected()) {\n'+
        '   while (client.available() > 0) {\n'+
          '     char c = client.read();\n'+
          '     messages.concat(c);\n'+
          '     rec_flag = true;\n'+
        '   }\n'+
        '   if(rec_flag == true){\n'+
          '     Serial.println("Message");\n'+
          '     robot.processMsg(messages, client);\n'+
          '     messages = "";\n'+
          '     rec_flag = false;\n'+
        '   }\n'+
        ' delay(10);\n'+
      '}\n'+
      'Serial.println("Client Disconnected");\n'+
      'rec_flag = false;\n'+
      'client.stop();\n'+
      '}\n';
    return code;
  };



  Blockly.Arduino['new_smarttown_command'] = function(block) {
    let text_name = block.getFieldValue('NAME');
    let statements_name = Blockly.Arduino.statementToCode(block, 'COMMANDS');


    Blockly.Arduino.addSTCommand(text_name,statements_name);
    return '';
  };
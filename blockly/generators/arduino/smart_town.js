'use strict';

goog.require('Blockly.Arduino');

Blockly.Arduino['mvt_avanzar'] = function(block) {
    let code='nextStep = robotForward();\n';
    return code;
  };

  Blockly.Arduino['mvt_girar'] = function(block) {
    let dropdown_movement = block.getFieldValue('Movement');
    let code='nextStep = robotTurn('+dropdown_movement+');\n';
    // code+=aux_code;
    return code;
  };

  Blockly.Arduino['mvt_avanzar_tiempo'] = function(block) {
    let dropdown_movement = block.getFieldValue('Movement');
    let time = block.getFieldValue('TIME');

    let code = "timer = "+time+";\n";
    let aux_code='nextStep = robotTimedMove('+dropdown_movement+');\n';
    code+=aux_code;
    return code;
  };

  Blockly.Arduino['mvt_girar_tiempo'] = function(block) {
    let dropdown_movement = block.getFieldValue('Movement');
    let time = block.getFieldValue('TIME');

    let code = 'timer = '+time+';\n';
    let aux_code='nextStep = robotTimedTurn('+dropdown_movement+');\n';
    code+=aux_code;
    return code;
  };

  Blockly.Arduino['mvt_stop'] = function(block) {
    let code='nextStep = robotStopMovement();\n';
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
    let alias = block.getFieldValue('alias');
    let conf = block.getFieldValue('CONF_TYPE');
    let commands = Blockly.Arduino.statementToCode(block, 'COMMANDS');
    let STcommands = [];
    let STFunctionsDict = {};
    let STchecks = [];
    let STDef = 'bool Robot::processCommands(String command, bool checkStatus) {\n bool toRet = false;\n';
    STDef+=' STprint("command");\n'+
    ' STprint(command);\n'+
    ' STprint("Status");\n'+
    ' STprint(checkStatus);\n'+
    ' STprint("inAction");\n'+
    ' STprint(inAction);\n'+
    ' STprint("isTimedAction");\n'+
    ' STprint(isTimedAction);\n'+
    ' STprint("forwardActive");\n'+
    ' STprint(forwardActive);\n'+
    ' STprint("rightActive");\n'+
    ' STprint(rightActive);\n'+
    ' STprint("leftActive");\n'+
    ' STprint(leftActive);\n'+
    ' STprint("reverseActive");\n'+
    ' STprint(reverseActive);\n'+
    ' STprint("motorInactive");\n'+
    ' STprint(motorInactive);\n'+
    ' STprint("macroRunning");\n'+
    ' STprint(macroRunning);\n'+  
    ' STprint("macroInExec");\n'+
    ' STprint(macroInExec);\n'+  
    ' STprint("macroStep");\n'+
    ' STprint(macroStep);\n';

    STDef+='  if (!checkStatus || (checkStatus && inAction)) {\n'+
      '    if (checkStatus) {\n'+
        '      STprint("Checking Status");\n'+
      '    } else {\n'+
        '      STprint("Starting Command");\n'+
      '    }\n';
    for (let name in Blockly.Arduino.STFunctions_) {
      STchecks.push('command.equals("'+name+'")');
      STcommands.push('  if(command.equals("'+name+'")|| macroInExec.equals("'+name+'")){\n      toRet= '+name+'();\n    }');
      let functionDecl='bool Robot::'+name+'(){\n'+Blockly.Arduino.STFunctions_[name]+'} \n';
      STFunctionsDict[name]=functionDecl;
    }

    if(STcommands.length){
      let auxDef= ['  if (('+STchecks.join(' || ')+') && !macroRunning) {\n    macroRunning=true; \n     if(!checkStatus){\n      macroInExec=command;\n        }\n      }\n'];
      auxDef.push(' if(macroRunning){\n    '+STcommands.join('\n else')+'\n  } else {\n  toRet = robotBasicCommands(command, checkStatus);\n  }\n');
      STDef+=auxDef.join("");
    }else{
      STDef+='     toRet = robotBasicCommands(command, checkStatus);\n';
    }

    STDef+='   }\n inAction =  reverseActive || forwardActive ||  rightActive ||  leftActive || macroRunning;\n';
    STDef+='   return toRet;\n }\n';

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
    let robotDef = 'Robot robot;\nWiFiClient client;\n'
    Blockly.Arduino.addFunction("processCommands",STDef);

    for (let name in STFunctionsDict) {

      Blockly.Arduino.addFunction(name,STFunctionsDict[name]);
    }

    Blockly.Arduino.addInclude('custom',includeCode);
    Blockly.Arduino.setRobotDef(robotDef);
    Blockly.Arduino.addVariable('rec_flag','bool rec_flag = false;',true);


   let  setupRobotCode = 'robot.setupRobot('+serial+',"'+alias+'","'+text_wifiname+'","'+text_pass+'");';
    Blockly.Arduino.addSetup("robotSetup",setupRobotCode,true);
    let code = 'String messages = "";\n'+
  'if(client) {\n'+
      ' if (client.connected()) {\n'+
        '   while (client.available() > 0) {\n'+
          '     char c = client.read();\n'+
          '     messages.concat(c);\n'+
          '     rec_flag = true;\n'+
        '   }\n'+
        '   if (!messages.indexOf(robot.alias) || (robot.inAction && messages.equals(""))) {\n'+
          '     robot.processMsg(messages, !rec_flag, client);\n'+
          '     messages = "";\n'+
          '     rec_flag = false;\n'+
        '   }\n'+
      '}\n'+
      '} else {\n'+
      'client = wifiServer.available();\n'+
      '}\n';
    return code;
  };



  Blockly.Arduino['new_smarttown_command'] = function(block) {
    let text_name = block.getFieldValue('NAME');
    let code ="";
    let blockList = Blockly.Arduino.statementToList(block, 'COMMANDS');

    if(blockList.length>0){
      code=" bool toRet=false;\n  bool nextStep=false;\n switch(macroStep){\n";
      for(let i in blockList){
        code+= "  case "+i+":\n"+blockList[i]+" break;\n"
      }
      code+=" default:\n  macroRunning=false;\n  macroStep=0;\n  toRet = true;\n break; \n}\n";
      code+=" if(nextStep){macroStep++;}\n return toRet;\n"
    }

    Blockly.Arduino.addSTCommand(text_name,code);
    return '';
  };
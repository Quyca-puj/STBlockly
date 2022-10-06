'use strict';

goog.require('Blockly.Arduino');

Blockly.Arduino[Blockly.SmartTown.BLOCK_ST_AVANZAR] = function (block) {
  let code = 'robotForward();\n';

  if (block.getRootBlock() && block.getRootBlock().type && (block.getRootBlock().type === 'setupsmarttown' || block.getRootBlock().type === 'procedures_defreturn')) {
    code = 'nextStep = ' + code;
  } else {
    code = 'robot.' + code;
  }
  return code;
};

Blockly.Arduino[Blockly.SmartTown.BLOCK_ST_GIRAR] = function (block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let code = 'robotTurn(' + dropdown_movement + ');\n';
  if (block.getRootBlock() && block.getRootBlock().type && (block.getRootBlock().type === 'setupsmarttown' || block.getRootBlock().type === 'procedures_defreturn')) {
    code = 'nextStep = ' + code;
  } else {
    code = 'robot.' + code;
  }
  return code;
};

Blockly.Arduino[Blockly.SmartTown.BLOCK_ST_AVANZAR_T] = function (block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let time = block.getFieldValue('TIME');

  let code = "mvtTimer = " + time + ";\n";
  let aux_code = 'robotTimedMove(' + dropdown_movement + ');\n';
  if (block.getRootBlock() && block.getRootBlock().type && (block.getRootBlock().type === 'setupsmarttown' || block.getRootBlock().type === 'procedures_defreturn')) {
    aux_code = 'nextStep = ' + aux_code;
  } else {
    aux_code = 'robot.' + aux_code;
  }
  code += aux_code;
  return code;
};

Blockly.Arduino[Blockly.SmartTown.BLOCK_ST_GIRAR_T] = function (block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let time = block.getFieldValue('TIME');

  let code = 'mvtTimer = ' + time + ';\n';
  let aux_code = 'robotTimedTurn(' + dropdown_movement + ');\n';
  if (block.getRootBlock() && block.getRootBlock().type && (block.getRootBlock().type === 'setupsmarttown' || block.getRootBlock().type === 'procedures_defreturn')) {
    aux_code = 'nextStep = ' + aux_code;
  } else {
    aux_code = 'robot.' + aux_code;
  }
  code += aux_code;
  return code;
};

Blockly.Arduino[Blockly.SmartTown.BLOCK_ST_STOP] = function (block) {
  let code = 'robotStopMovement();\n';
  if (block.getRootBlock() && block.getRootBlock().type && (block.getRootBlock().type === 'setupsmarttown' || block.getRootBlock().type === 'procedures_defreturn')) {
    code = 'nextStep = ' + code;
  }
  return code;
};

Blockly.Arduino[Blockly.SmartTown.BLOCK_ST_SETUP] = function (block) {
  let text_wifiname = block.getFieldValue('wifiName');
  let text_pass = block.getFieldValue('pass');
  let serial = block.getFieldValue('serialNumber');
  let alias = block.getFieldValue('alias');
  let conf = block.getFieldValue('CONF_TYPE');
  let commands = Blockly.Arduino.statementToCode(block, 'COMMANDS');
  let STcommands = [];
  let STFunctionsDict = {};
  let STchecks = [];
  let STfeas = [];
  let isCustAction = "bool Robot::isCustomAction(String command)\n{\n  return ";
  let isFeasAction = "bool Robot::isFeasibleCustom(Task *msg)\n{\n  bool toRet = false;\n";
  let checkCustomCommands = "void Robot::checkCustomCommands(String msg, bool checkStatus, WiFiClient client)\n{\n";


  for (let name in Blockly.Arduino.STFunctions_) {
    let code = Blockly.Arduino.STFunctions_[name].code;
    let restrictions = Blockly.Arduino.STFunctions_[name].restrictions;
    STfeas.push('  if(strcmp(msg->command, "' + name + '") == 0){\n   toRet =' + restrictions + "\n }");
    STchecks.push('command.equals("' + name + '")');
    STcommands.push('  if(msg.equals("' + name + '")|| runningCustoms.searchAck("' + name + '") != -1){\n     ' + name + '(client);\n    }');
    let functionDecl = 'void Robot::' + name + '(WiFiClient client){\n' + code + '} \n';
    STFunctionsDict[name] = functionDecl;
  }
  if (STchecks.length > 0) {
    isCustAction += STchecks.join(' || ');
  } else {
    isCustAction += "return false"
  }
  isCustAction += ";\n}"

  if (STfeas.length > 0) {
    isFeasAction += STfeas.join('\n else ');
  }
  isFeasAction += "  \nreturn toRet;\n}"

  if (STcommands.length > 0) {
    checkCustomCommands += STcommands.join("\n");
  }
  checkCustomCommands += "\n  return;\n }\n";

  Blockly.Arduino.addFunction("isCustomAction", isCustAction);
  Blockly.Arduino.addFunction("isFeasibleCustom", isFeasAction);
  Blockly.Arduino.addFunction("checkCustomCommands", checkCustomCommands);

  let setupCode = '//' + conf + ' config\n';

  switch (conf) {
    case 'Quyca':
      setupCode +=
        '   Serial.begin(115200);\n' +
        '   delay(1000);\n' +
        '   WifiConnection();\n' +
        '   setupMotor();\n' +
        '   setupSensors();\n' +
        '   setupFaces();\n' +
        '   JointSetup();\n';
      break;
    case 'Smarttown':
      setupCode +=
        '   Serial.begin(115200);\n' +
        '   delay(1000);\n' +
        '   WifiConnection();\n' +
        '   setupMotor();\n' +
        '   setupSensors();\n' +
        '   setupFaces();\n' +
        '   JointSetup();\n';
      break;

  }

  let includeCode = '#include "Robot.h"\n';
  let robotDef = 'Robot robot;\nbool rec_flag = false;\n'

  for (let name in STFunctionsDict) {

    Blockly.Arduino.addFunction(name, STFunctionsDict[name]);
  }

  Blockly.Arduino.addInclude('custom', includeCode);
  Blockly.Arduino.setRobotDef(robotDef);

  let setupRobotCode = 'robot.setupRobot(' + serial + ',"' + alias + '","' + text_wifiname + '","' + text_pass + '");';
  Blockly.Arduino.addSetup("robotSetup", setupRobotCode, true);
  let code = ' WiFiClient client = wifiServer.available();\n String messages = "";\n' +
    ' if(client) {\n' +
    '  while (client.connected()) {\n' +
    '   while (client.available() > 0) {\n' +
    '     char c = client.read();\n' +
    '     messages.concat(c);\n' +
    '     rec_flag = true;\n' +
    '   }\n' +
    '   if (!messages.indexOf(robot.alias) || (messages.equals("") && robot.isInAction())) {\n' +
    '     robot.processMsg(messages, !rec_flag, client);\n' +
    '     messages = "";\n' +
    '     rec_flag = false;\n' +
    '   }\n' +
    '  }\n' +
    '  Serial.println("Client Disconnected");\n' +
    '  client.stop();\n' +
    '} else if (robot.isInAction()){\n' +
    '   robot.processMsg(messages, true, client);\n' +
    '}\n';
  return code;
};



Blockly.Arduino[Blockly.SmartTown.BLOCK_ST_COMMAND] = function (block) {
  let text_name = block.getFieldValue('NAME');
  let command = {};
  let code = "";
  let varsDict = {};
  let condDict = {};
  let stepCounter = text_name + "Step";
  let cleanupVars = [" default:\n  " + stepCounter + "=0;\n  toRet = true;\n"];
  let restrictions = [];
  let conditions = [];
  let blockList = Blockly.Arduino.statementToList(block, 'COMMANDS');
  let childBlocks = block.getDescendants();
  for (let i in childBlocks) {
    
    if (childBlocks[i].hasConditions) {
      varsDict[childBlocks[i].type] = Blockly.Arduino.getConditions(childBlocks[i].type);
      condDict[childBlocks[i].type] = Blockly.Arduino.getConditionsST(childBlocks[i].type);
    }
  }
  for (let name in varsDict) {
    restrictions.push(...varsDict[name]);
    conditions.push(...condDict[name]);
  }
  if (blockList.length > 0) {
    code = " bool toRet=false;\n  bool nextStep=false;\n switch(" + stepCounter + "){\n";
    for (let i in blockList) {
      code += "  case " + i + ":\n" + blockList[i] + " break;\n"
    }
    cleanupVars.push(" break; \n}");
    code += cleanupVars.join("\n");
    code += " if(nextStep){" + stepCounter + '++;}\n if(toRet){answerCommand(&runningCustoms, "'+text_name+'", client);};\n'
  }

  command.code = code;
  restrictions= [... new Set(restrictions)];
  conditions= [... new Set(conditions)];
  if(restrictions.length==0){
    restrictions.push("true");
  }
  command.restrictions = restrictions.join(" && ") +";";
  Blockly.Arduino.addSTCommand(text_name, command,conditions);
  return '';
};

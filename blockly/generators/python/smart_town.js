'use strict';

goog.require('Blockly.Java');

Blockly.Java['mvt_avanzar_middle'] = function(block) {
  let dropdown_emotion = block.getFieldValue('Emotion');

  let code='sendMessage("'+dropdown_emotion+'");\n';
  return code;
};

Blockly.Java['mvt_girar_middle'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let dropdown_emotion = block.getFieldValue('Emotion');

  let code='sendMessage("'+dropdown_movement+'");\n';
  return code;
};

Blockly.Java['mvt_avanzar_tiempo_middle'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let time = block.getFieldValue('TIME');
  let speed = block.getFieldValue('SPEED');

  let code='sendMessage("'+dropdown_movement+'");\n';
  return code;
};

Blockly.Java['mvt_girar_tiempo_middle'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let time = block.getFieldValue('TIME');
  let speed = block.getFieldValue('SPEED');

  let code='sendMessage("'+dropdown_movement+'");\n';
  return code;
};

Blockly.Java['mvt_stop'] = function(block) {
  let code='sendMessage("stop");\n';
  return code;
};

Blockly.Java['hablar'] = function(block) {
  let value_tosay = Blockly.Java.valueToCode(block, 'ToSay', Blockly.Java.ORDER_ATOMIC);
  let code = 'sendMessage('+value_tosay+');\n';
  return code;
};


 Blockly.Java['st_command_call'] = function(block) {
  let funcName = Blockly.Java.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  let code = 'sendCommand("' + funcName + '");\n';
  return code;
};


Blockly.Java['setupsmarttown_middle'] = function(block) {
  let commands = Blockly.Arduino.statementToCode(block, 'COMMANDS');

  return '';
};


Blockly.Java['new_smarttown_action_list'] = function(block) {
  let text_name = block.getFieldValue('NAME');
  let statements_name = Blockly.Arduino.statementToCode(block, 'COMMANDS');
  return '';
};
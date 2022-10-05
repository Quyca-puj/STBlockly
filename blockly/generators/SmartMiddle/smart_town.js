'use strict';

goog.require('Blockly.SmartMiddle');

Blockly.SmartMiddle['mvt_avanzar_middle'] = function(block) {
  let dropdown_emotion = block.getFieldValue('Emotion');

  let code='{"action": "forward","emotion":"'+dropdown_emotion+'"}\n';
  return code;
};

Blockly.SmartMiddle['mvt_girar_middle'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let dropdown_emotion = block.getFieldValue('Emotion');

  let code='{"action": "'+dropdown_movement+'","emotion":"'+dropdown_emotion+'"}\n';
  return code;
};

Blockly.SmartMiddle['mvt_avanzar_tiempo_middle'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let time = block.getFieldValue('TIME');
  let speed = block.getFieldValue('SPEED');

  let code='{"action": "'+dropdown_movement+'","time":'+time+',"speed":'+speed+'}\n';
  return code;
};

Blockly.SmartMiddle['mvt_girar_tiempo_middle'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let time = block.getFieldValue('TIME');
  let speed = block.getFieldValue('SPEED');

  let code='{"action": "'+dropdown_movement+'","time":'+time+',"speed":'+speed+'}\n';
  return code;
};

Blockly.SmartMiddle['mvt_stop_mvt_middle'] = function(block) {
  let code='{"action": "stop_mvt"}\n';
  return code;
};

Blockly.SmartMiddle['mvt_stop_all_middle'] = function(block) {
  let code='{"action": "stop_all"}\n';
  return code;
};

Blockly.SmartMiddle['change_emo_middle'] = function(block) {
  let dropdown_emotion = block.getFieldValue('Emotion');
  let code='{"action": "emotions","emotion":"'+dropdown_emotion+'"}\n';
  return code;
};

 Blockly.SmartMiddle['st_command_call'] = function(block) {
  let funcName = Blockly.SmartMiddle.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  let speed = block.getFieldValue('SPEED');
  let code='{"action": "'+funcName+'", "speed":'+speed+'}\n';
  return code;
};


Blockly.SmartMiddle['setupsmarttown_middle'] = function(block) {
  let commands = Blockly.SmartMiddle.statementToCode(block, 'COMMANDS');

  return '';
};


Blockly.SmartMiddle['new_smarttown_action_list'] = function(block) {
  let text_name = block.getFieldValue('NAME');
  let statements_name = Blockly.SmartMiddle.statementToCode(block, 'COMMANDS');
  return '';
};
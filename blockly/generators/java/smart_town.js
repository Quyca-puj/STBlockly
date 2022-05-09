'use strict';

goog.require('Blockly.Java');

Blockly.Java['mvt_avanzar_media'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let dropdown_emotion = block.getFieldValue('Emotion');

  let code='sendMessage("'+dropdown_movement+'");\n';
  return code;
};

Blockly.Java['mvt_girar_media'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let dropdown_emotion = block.getFieldValue('Emotion');

  let code='sendMessage("'+dropdown_movement+'");\n';
  return code;
};

Blockly.Java['mvt_avanzar_tiempo_media'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let time = block.getFieldValue('TIME');

  let code='sendMessage("'+dropdown_movement+'");\n';
  return code;
};

Blockly.Java['mvt_girar_tiempo_media'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let time = block.getFieldValue('TIME');

  let code='sendMessage("'+dropdown_movement+'");\n';
  return code;
};

Blockly.Java['mvt_stop_media'] = function(block) {
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

Blockly.Java['mvt_stop'] = function(block) {
  let code = 'sendCommand("stop");\n';
  return code;
};


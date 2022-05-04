'use strict';

goog.require('Blockly.Python');

Blockly.Python['mvt_avanzar'] = function(block) {
  var dropdown_movement = block.getFieldValue('Movement');
  var dropdown_emotion = block.getFieldValue('Emotion');

  var code = 'showEmotion("'+dropdown_emotion+'");\n';
  var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
  code+=aux_code;
  return code;
};

Blockly.Python['mvt_girar'] = function(block) {
  var dropdown_movement = block.getFieldValue('Movement');
  var dropdown_emotion = block.getFieldValue('Emotion');

  var code = 'showEmotion("'+dropdown_emotion+'");\n';
  var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
  code+=aux_code;
  return code;
};

Blockly.Python['mvt_avanzar_tiempo'] = function(block) {
  var dropdown_movement = block.getFieldValue('Movement');
  var time = block.getFieldValue('TIME');

  var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
  code+=aux_code;
  return code;
};

Blockly.Python['mvt_girar_tiempo'] = function(block) {
  var dropdown_movement = block.getFieldValue('Movement');
  var time = block.getFieldValue('TIME');

  var aux_code='robotMovement("'+dropdown_movement+'", client);\n';
  code+=aux_code;
  return code;
};

Blockly.Python['mvt_stop'] = function(block) {
  var code='robotMovement("stop", client);\n';
  return code;
};

Blockly.Python['hablar'] = function(block) {
  var value_tosay = Blockly.Python.valueToCode(block, 'ToSay', Blockly.Python.ORDER_ATOMIC);
  var code = 'textToSpeech('+value_tosay+');\n';
  return code;
};

 Blockly.Python['st_command_call'] = function(block) {
  var funcName = Blockly.Java.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);

  var code = 'sendCommand("' + funcName + '");\n';
  return code;
};

  Blockly.Python['setupsmarttown'] = function(block) {
    var text_wifiname = block.getFieldValue('wifiName');
    var text_pass = block.getFieldValue('pass');


    var code = 'print("'+text_wifiname+'"+"'+text_pass+'")\n';
    return code;
  };
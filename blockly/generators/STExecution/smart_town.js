'use strict';

goog.require('Blockly.STExecution');

Blockly.STExecution['mvt_avanzar_exec'] = function(block) {
  let dropdown_emotion = block.getFieldValue('Emotion');
  let paramStr = Blockly.STExecution.setEmotionalParams(dropdown_emotion);
  let code={action:"forward", emotion:dropdown_emotion, params:paramStr};
  return code;
};

Blockly.STExecution['mvt_girar_exec'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let dropdown_emotion = block.getFieldValue('Emotion');
  let paramStr = Blockly.STExecution.setEmotionalParams(dropdown_emotion);
  let code={action:dropdown_movement, emotion:dropdown_emotion, params:paramStr};
  return code;
};

Blockly.STExecution['mvt_avanzar_tiempo_exec'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let time = block.getFieldValue('TIME');
  let speed = block.getFieldValue('SPEED');
  let code={action:dropdown_movement, params:speed + " "+time  };
  return code;
};

Blockly.STExecution['mvt_girar_tiempo_exec'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let time = block.getFieldValue('TIME');
  let speed = block.getFieldValue('SPEED');
  let code={action:dropdown_movement, params:speed + " "+time  };
  return code;
};

Blockly.STExecution['mvt_stop_exec'] = function(block) {
  let dropdown_emotion = block.getFieldValue('Emotion');
  let code={action:'stop', emotion:dropdown_emotion};
  return code;
};

Blockly.STExecution['change_emotion_exec'] = function(block) {
  let dropdown_emotion = block.getFieldValue('Emotion');
  let code={emotion:dropdown_emotion};
  return code;
};

 Blockly.STExecution['st_command_call'] = function(block) {
  let funcName = Blockly.STExecution.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  let code={action:funcName};
  return code;
};

Blockly.STExecution['st_actionList_call'] = function(block) {
  let funcName = Blockly.STExecution.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  let code={list:funcName};
  return code;
};


Blockly.STExecution['setupsmarttown_exec'] = function(block) {
  let alias = block.getFieldValue('ALIAS');
  let ip = block.getFieldValue('ip');
  //bloque de configuracion
  let blockList = Blockly.STExecution.statementToList(block, 'COMMANDS', alias);
  Blockly.STExecution.addCommandToDict(alias,{ip:ip,list:blockList});
  return '';
};
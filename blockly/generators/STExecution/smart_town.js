'use strict';

goog.require('Blockly.STExecution');

Blockly.STExecution['mvt_avanzar_exec'] = function(block) {
  let dropdown_emotion = block.getFieldValue('Emotion');
  let code={action:"forward", emotion:dropdown_emotion};
  let paramStr = Blockly.STExecution.setEmotionalParams(SmartTownUtils.ACTION_PARAMS[code.action], dropdown_emotion);
  code.params=paramStr
  console.log(code);
  return code;
};

Blockly.STExecution['mvt_girar_exec'] = function(block) {
  let dropdown_movement = block.getFieldValue('Movement');
  let dropdown_emotion = block.getFieldValue('Emotion');
  let code={action:dropdown_movement, emotion:dropdown_emotion}
  let paramStr = Blockly.STExecution.setEmotionalParams(SmartTownUtils.ACTION_PARAMS[code.action], dropdown_emotion);
  code.params=paramStr;
  console.log(code);
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
  let emo_conf = Blockly.STExecution.statementToCode(block, 'EMOCONFIG');
  let act_conf = Blockly.STExecution.statementToCode(block, 'ACTCONFIG');
  let blockList = Blockly.STExecution.statementToList(block, 'COMMANDS', alias);
  Blockly.STExecution.addCommandToDict(alias,{ip:ip,list:blockList});
  return '';
};

Blockly.STExecution['config_emotions'] = function(block) {
  let MF = block.getFieldValue('MF');
  let F = block.getFieldValue('F');
  let S = block.getFieldValue('S');
  let T = block.getFieldValue('T');  
  let MT = block.getFieldValue('MT');
  let E = block.getFieldValue('E');
  let FU = block.getFieldValue('FU');
  let SO = block.getFieldValue('SO');
  let code={very_happy:MF, happy:F,neutral:S, sad:T,very_sad:MT,sick:E,angry:FU,surprised:SO};
  Blockly.STExecution.setEmoConfig(code);
  return null;
};

Blockly.STExecution['config_actions'] = function(block) {
  let speed_min = block.getFieldValue('SPEED_MIN');
  let speed_max = block.getFieldValue('SPEED_MAX');
  let code={speed:{MIN:speed_min, MAX:speed_max}};
  Blockly.STExecution.setActConfig(code);
  return null;
};
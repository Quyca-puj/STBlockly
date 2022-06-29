/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for variables blocks.
 */
'use strict';

goog.provide('Blockly.Arduino.variables');

goog.require('Blockly.Arduino');


/**
 * Code generator for variable (X) getter.
 * Arduino code: loop { X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['variables_get'] = function(block) {
  var code = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
      if(block.getSurroundParent() && (block.getSurroundParent().type !== 'new_smarttown_command' ||block.getSurroundParent().type !== 'setupsmarttown' ||block.getSurroundParent().type !== 'procedures_defreturn') ){
        if(block.getRootBlock() && (block.getRootBlock().type !== 'new_smarttown_command' && block.getRootBlock().type !== 'setupsmarttown' && block.getRootBlock().type !== 'procedures_defreturn'))
        code = "robot."+code;
      }
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Code generator for variable (X) setter (Y).
 * Arduino code: type X;
 *               loop { X = Y; }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino['variables_set'] = function(block) {
  var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Arduino.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

  let code = varName + ' = ' + argument0 + ';\n';
  if(block.getSurroundParent() && (block.getSurroundParent().type !== 'new_smarttown_command' ||block.getSurroundParent().type !== 'setupsmarttown' ||block.getSurroundParent().type !== 'procedures_defreturn') ){
    if(block.getRootBlock() && (block.getRootBlock().type !== 'new_smarttown_command' && block.getRootBlock().type !== 'setupsmarttown' && block.getRootBlock().type !== 'procedures_defreturn'))
    code = "robot."+code;
  }

  if(block.getSurroundParent() && block.getSurroundParent().type && block.getSurroundParent().type === 'new_smarttown_command'){
    code += 'nextStep = true;\n';
  }
  return code
};

/**
 * Code generator for variable (X) casting (Y).
 * Arduino code: loop { (Y)X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['variables_set_type'] = function(block) {
  var argument0 = Blockly.Arduino.valueToCode(block, 'VARIABLE_SETTYPE_INPUT',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var varType = Blockly.Arduino.getArduinoType_(
      Blockly.Types[block.getFieldValue('VARIABLE_SETTYPE_TYPE')]);
  var code = '(' + varType + ')(' + argument0 + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

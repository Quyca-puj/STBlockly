/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating STExecution code for variables blocks.
 */
'use strict';

goog.provide('Blockly.STExecution.variables');

goog.require('Blockly.STExecution');


/**
 * Code generator for variable (X) getter.
 * STExecution code: loop { X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.STExecution['variables_get'] = function(block) {
  var code = Blockly.STExecution.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.STExecution.ORDER_ATOMIC];
};

/**
 * Code generator for variable (X) setter (Y).
 * STExecution code: type X;
 *               loop { X = Y; }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.STExecution['variables_set'] = function(block) {
  var argument0 = Blockly.STExecution.valueToCode(block, 'VALUE',
      Blockly.STExecution.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.STExecution.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};

/**
 * Code generator for variable (X) casting (Y).
 * STExecution code: loop { (Y)X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.STExecution['variables_set_type'] = function(block) {
  var argument0 = Blockly.STExecution.valueToCode(block, 'VARIABLE_SETTYPE_INPUT',
      Blockly.STExecution.ORDER_ASSIGNMENT) || '0';
  var varType = Blockly.STExecution.getSTExecutionType_(
      Blockly.Types[block.getFieldValue('VARIABLE_SETTYPE_TYPE')]);
  var code = '(' + varType + ')(' + argument0 + ')';
  return [code, Blockly.STExecution.ORDER_ATOMIC];
};

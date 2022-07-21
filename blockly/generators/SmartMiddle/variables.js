/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating SmartMiddle code for variables blocks.
 */
'use strict';

goog.provide('Blockly.SmartMiddle.variables');

goog.require('Blockly.SmartMiddle');


/**
 * Code generator for variable (X) getter.
 * SmartMiddle code: loop { X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.SmartMiddle['variables_get'] = function(block) {
  var code = Blockly.SmartMiddle.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.SmartMiddle.ORDER_ATOMIC];
};

/**
 * Code generator for variable (X) setter (Y).
 * SmartMiddle code: type X;
 *               loop { X = Y; }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.SmartMiddle['variables_set'] = function(block) {
  var argument0 = Blockly.SmartMiddle.valueToCode(block, 'VALUE',
      Blockly.SmartMiddle.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.SmartMiddle.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};

/**
 * Code generator for variable (X) casting (Y).
 * SmartMiddle code: loop { (Y)X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.SmartMiddle['variables_set_type'] = function(block) {
  var argument0 = Blockly.SmartMiddle.valueToCode(block, 'VARIABLE_SETTYPE_INPUT',
      Blockly.SmartMiddle.ORDER_ASSIGNMENT) || '0';
  var varType = Blockly.SmartMiddle.getSmartMiddleType_(
      Blockly.Types[block.getFieldValue('VARIABLE_SETTYPE_TYPE')]);
  var code = '(' + varType + ')(' + argument0 + ')';
  return [code, Blockly.SmartMiddle.ORDER_ATOMIC];
};

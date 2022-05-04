/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Java code for variables blocks.
 */
'use strict';

goog.provide('Blockly.Java.variables');

goog.require('Blockly.Java');


/**
 * Code generator for variable (X) getter.
 * Java code: loop { X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Java['variables_get'] = function(block) {
  var code = Blockly.Java.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Java.ORDER_ATOMIC];
};

/**
 * Code generator for variable (X) setter (Y).
 * Java code: type X;
 *               loop { X = Y; }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Java['variables_set'] = function(block) {
  var argument0 = Blockly.Java.valueToCode(block, 'VALUE',
      Blockly.Java.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Java.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};

/**
 * Code generator for variable (X) casting (Y).
 * Java code: loop { (Y)X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Java['variables_set_type'] = function(block) {
  var argument0 = Blockly.Java.valueToCode(block, 'VARIABLE_SETTYPE_INPUT',
      Blockly.Java.ORDER_ASSIGNMENT) || '0';
  var varType = Blockly.Java.getJavaType_(
      Blockly.Types[block.getFieldValue('VARIABLE_SETTYPE_TYPE')]);
  var code = '(' + varType + ')(' + argument0 + ')';
  return [code, Blockly.Java.ORDER_ATOMIC];
};

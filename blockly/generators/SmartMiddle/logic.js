/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating SmartMiddle code for the logic blocks.
 */
'use strict';

goog.provide('Blockly.SmartMiddle.logic');

goog.require('Blockly.SmartMiddle');


/**
 * Code generator to create if/if else/else statement.
 * SmartMiddle code: loop { if (X)/else if ()/else { X } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.SmartMiddle['controls_if'] = function(block) {
  var n = 0;
  var argument = Blockly.SmartMiddle.valueToCode(block, 'IF' + n,
      Blockly.SmartMiddle.ORDER_NONE) || 'false';
  var branch = Blockly.SmartMiddle.statementToCode(block, 'DO' + n);
  var code = 'if (' + argument + ') {\n' + branch + '}';
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.SmartMiddle.valueToCode(block, 'IF' + n,
        Blockly.SmartMiddle.ORDER_NONE) || 'false';
    branch = Blockly.SmartMiddle.statementToCode(block, 'DO' + n);
    code += ' else if (' + argument + ') {\n' + branch + '}';
  }
  if (block.elseCount_) {
    branch = Blockly.SmartMiddle.statementToCode(block, 'ELSE');
    code += ' else {\n' + branch + '}';
  }
  return code + '\n';
};

/**
 * Code generator for the comparison operator block.
 * SmartMiddle code: loop { X operator Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.SmartMiddle['logic_compare'] = function(block) {
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.SmartMiddle.ORDER_EQUALITY : Blockly.SmartMiddle.ORDER_RELATIONAL;
  var argument0 = Blockly.SmartMiddle.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.SmartMiddle.valueToCode(block, 'B', order) || '0';
  var code;
  if (typeof argument0 === 'string'){
    operator='.equals('
    code = argument0 + operator + argument1 + ')';
  }else{
    code = argument0 + ' ' + operator + ' ' + argument1;
  }
  
  return [code, order];
};

/**
 * Code generator for the logic operator block.
 * SmartMiddle code: loop { X operator Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.SmartMiddle['logic_operation'] = function(block) {
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.SmartMiddle.ORDER_LOGICAL_AND :
      Blockly.SmartMiddle.ORDER_LOGICAL_OR;
  var argument0 = Blockly.SmartMiddle.valueToCode(block, 'A', order) || 'false';
  var argument1 = Blockly.SmartMiddle.valueToCode(block, 'B', order) || 'false';
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

/**
 * Code generator for the logic negate operator.
 * SmartMiddle code: loop { !X }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.SmartMiddle['logic_negate'] = function(block) {
  var order = Blockly.SmartMiddle.ORDER_UNARY_PREFIX;
  var argument0 = Blockly.SmartMiddle.valueToCode(block, 'BOOL', order) || 'false';
  var code = '!' + argument0;
  return [code, order];
};

/**
 * Code generator for the boolean values true and false.
 * SmartMiddle code: loop { true/false }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.SmartMiddle['logic_boolean'] = function(block) {
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.SmartMiddle.ORDER_ATOMIC];
};

/**
 * Code generator for the null value.
 * SmartMiddle code: loop { X ? Y : Z }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.SmartMiddle['logic_null'] = function(block) {
  var code = 'null';
  return [code, Blockly.SmartMiddle.ORDER_ATOMIC];
};

/**
 * Code generator for the ternary operator.
 * SmartMiddle code: loop { NULL }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 *
 * TODO: Check types of THEN and ELSE blocks and add warning to this block if
 *       they are different from each other.
 */
Blockly.SmartMiddle['logic_ternary'] = function(block) {
  var valueIf = Blockly.SmartMiddle.valueToCode(block, 'IF',
      Blockly.SmartMiddle.ORDER_TERNARY) || 'false';
  var valueThen = Blockly.SmartMiddle.valueToCode(block, 'THEN',
      Blockly.SmartMiddle.ORDER_TERNARY) || 'null';
  var valueElse = Blockly.SmartMiddle.valueToCode(block, 'ELSE',
      Blockly.SmartMiddle.ORDER_TERNARY) || 'null';
  var code = valueIf + ' ? ' + valueThen + ' : ' + valueElse;
  return [code, Blockly.SmartMiddle.ORDER_TERNARY];
};

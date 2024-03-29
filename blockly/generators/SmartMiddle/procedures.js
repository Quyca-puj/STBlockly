/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating SmartMiddle code for procedure (function) blocks.
 *
 * TODO: For now all variables will stay at "int". Once type is implemented
 *       it needs to be captured on the functions with return.
 */
'use strict';

goog.provide('Blockly.SmartMiddle.procedures');

goog.require('Blockly.SmartMiddle');


/**
 * Code generator to create a function with a return value (X).
 * SmartMiddle code: void functionname { return X }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {null} There is no code added to loop.
 */
Blockly.SmartMiddle['procedures_defreturn'] = function(block) {
  var funcName = Blockly.SmartMiddle.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.SmartMiddle.statementToCode(block, 'STACK');
  if (Blockly.SmartMiddle.STATEMENT_PREFIX) {
    branch = Blockly.SmartMiddle.prefixLines(
        Blockly.SmartMiddle.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.SmartMiddle.INDENT) + branch;
  }
  if (Blockly.SmartMiddle.INFINITE_LOOP_TRAP) {
    branch = Blockly.SmartMiddle.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var returnValue = Blockly.SmartMiddle.valueToCode(block, 'RETURN',
      Blockly.SmartMiddle.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }

  // Get arguments with type
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] =
        Blockly.SmartMiddle.getSmartMiddleType_(block.arguments_[x][1]) +
        ' ' +
        Blockly.SmartMiddle.variableDB_.getName(block.arguments_[x][0],
            Blockly.Variables.NAME_TYPE);
  }

  // Get return type
  var returnType = Blockly.Types.NULL;
  if (block.getReturnType) {
    returnType = block.getReturnType();
  }
  returnType = Blockly.SmartMiddle.getSmartMiddleType_(returnType);

  // Construct code
  var code = 'public '+returnType + ' ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}';
  code = Blockly.SmartMiddle.scrub_(block, code);
  Blockly.SmartMiddle.userFunctions_[funcName] = code;
  return null;
};

/**
 * Code generator to create a function without a return value.
 * It uses the same code as with return value, as it will maintain the void
 * type.
 * SmartMiddle code: void functionname { }
 */
Blockly.SmartMiddle['procedures_defnoreturn'] =
    Blockly.SmartMiddle['procedures_defreturn'];

/**
 * Code generator to create a function call with a return value.
 * SmartMiddle code: loop { functionname() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.SmartMiddle['procedures_callreturn'] = function(block) {
  var funcName = Blockly.SmartMiddle.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.SmartMiddle.valueToCode(block, 'ARG' + x,
        Blockly.SmartMiddle.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.SmartMiddle.ORDER_UNARY_POSTFIX];
};

/**
 * Code generator to create a function call without a return value.
 * SmartMiddle code: loop { functionname() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.SmartMiddle['procedures_callnoreturn'] = function(block) {
  var funcName = Blockly.SmartMiddle.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.SmartMiddle.valueToCode(block, 'ARG' + x,
        Blockly.SmartMiddle.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

/**
 * Code generator to create a conditional (X) return value (Y) for a function.
 * SmartMiddle code: if (X) { return Y; }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.SmartMiddle['procedures_ifreturn'] = function(block) {
  var condition = Blockly.SmartMiddle.valueToCode(block, 'CONDITION',
      Blockly.SmartMiddle.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (block.hasReturnValue_) {
    var value = Blockly.SmartMiddle.valueToCode(block, 'VALUE',
        Blockly.SmartMiddle.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};

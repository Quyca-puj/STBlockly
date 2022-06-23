/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating STExecution code for procedure (function) blocks.
 *
 * TODO: For now all variables will stay at "int". Once type is implemented
 *       it needs to be captured on the functions with return.
 */
'use strict';

goog.provide('Blockly.STExecution.procedures');

goog.require('Blockly.STExecution');


/**
 * Code generator to create a function with a return value (X).
 * STExecution code: void functionname { return X }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {null} There is no code added to loop.
 */
Blockly.STExecution['procedures_defreturn'] = function(block) {
  var funcName = Blockly.STExecution.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.STExecution.statementToCode(block, 'STACK');
  if (Blockly.STExecution.STATEMENT_PREFIX) {
    branch = Blockly.STExecution.prefixLines(
        Blockly.STExecution.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.STExecution.INDENT) + branch;
  }
  if (Blockly.STExecution.INFINITE_LOOP_TRAP) {
    branch = Blockly.STExecution.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var returnValue = Blockly.STExecution.valueToCode(block, 'RETURN',
      Blockly.STExecution.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }

  // Get arguments with type
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] =
        Blockly.STExecution.getSTExecutionType_(block.arguments_[x][1]) +
        ' ' +
        Blockly.STExecution.variableDB_.getName(block.arguments_[x][0],
            Blockly.Variables.NAME_TYPE);
  }

  // Get return type
  var returnType = Blockly.Types.NULL;
  if (block.getReturnType) {
    returnType = block.getReturnType();
  }
  returnType = Blockly.STExecution.getSTExecutionType_(returnType);

  // Construct code
  var code = 'public '+returnType + ' ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}';
  code = Blockly.STExecution.scrub_(block, code);
  Blockly.STExecution.userFunctions_[funcName] = code;
  return null;
};

/**
 * Code generator to create a function without a return value.
 * It uses the same code as with return value, as it will maintain the void
 * type.
 * STExecution code: void functionname { }
 */
Blockly.STExecution['procedures_defnoreturn'] =
    Blockly.STExecution['procedures_defreturn'];

/**
 * Code generator to create a function call with a return value.
 * STExecution code: loop { functionname() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.STExecution['procedures_callreturn'] = function(block) {
  var funcName = Blockly.STExecution.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.STExecution.valueToCode(block, 'ARG' + x,
        Blockly.STExecution.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.STExecution.ORDER_UNARY_POSTFIX];
};

/**
 * Code generator to create a function call without a return value.
 * STExecution code: loop { functionname() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.STExecution['procedures_callnoreturn'] = function(block) {
  var funcName = Blockly.STExecution.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.STExecution.valueToCode(block, 'ARG' + x,
        Blockly.STExecution.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

/**
 * Code generator to create a conditional (X) return value (Y) for a function.
 * STExecution code: if (X) { return Y; }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.STExecution['procedures_ifreturn'] = function(block) {
  var condition = Blockly.STExecution.valueToCode(block, 'CONDITION',
      Blockly.STExecution.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (block.hasReturnValue_) {
    var value = Blockly.STExecution.valueToCode(block, 'VALUE',
        Blockly.STExecution.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};

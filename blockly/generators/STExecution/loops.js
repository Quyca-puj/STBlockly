/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating STExecution code for the loop blocks.
 *
 * TODO: 'For each' block needs to have lists implemented.
 */
'use strict';

goog.provide('Blockly.STExecution.loops');

goog.require('Blockly.STExecution');


/**
 * Generator for the repeat block (number in a drop down) using a For loop
 * statement.
 * STExecution code: loop { for (int count = 0; count < X; count++) { Y } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.STExecution['controls_repeat'] = function(block) {
  var repeats = Number(block.getFieldValue('TIMES'));
  var branch = Blockly.STExecution.statementToCode(block, 'DO');
  branch = Blockly.STExecution.addLoopTrap(branch, block.id);
  var loopVar = Blockly.STExecution.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  let commandList = "";
      for (let index = 0; index < repeats; index++) {
        commandList+= branch;
      }

  return commandList;
};

/**
 * Generator for the repeat block (using external number block) using a
 * For loop statement.
 * STExecution code: loop { for (int count = 0; count < X; count++) { Y } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.STExecution['controls_repeat_ext'] = function(block) {
  var repeats = Blockly.STExecution.valueToCode(block, 'TIMES',
      Blockly.STExecution.ORDER_ADDITIVE) || '0';
  var list = Blockly.STExecution.statementToList(block, 'DO',"");
  let commandList = [];
      for (let index = 0; index < repeats; index++) {
        commandList.push(...list);
      }
      console.log(commandList);
  return {array:commandList};
};

/**
 * Generator for the For loop statements.
 * STExecution code: loop { for (i = X; i <= Y; i+=Z) { } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.STExecution['controls_for'] = function(block) {
  var variable0 = Blockly.STExecution.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.STExecution.valueToCode(block, 'FROM',
      Blockly.STExecution.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.STExecution.valueToCode(block, 'TO',
      Blockly.STExecution.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.STExecution.valueToCode(block, 'BY',
      Blockly.STExecution.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.STExecution.statementToCode(block, 'DO');
  branch = Blockly.STExecution.addLoopTrap(branch, block.id);
  var code;
  if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
      Blockly.isNumber(increment)) {
    // All arguments are simple numbers.
    var up = parseFloat(argument0) <= parseFloat(argument1);
    code = 'for (' + variable0 + ' = ' + argument0 + '; ' +
        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
        variable0;
    var step = Math.abs(parseFloat(increment));
    if (step == 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += ') {\n' + branch + '}\n';
  } else {
    code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var startVar = argument0;
    if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
      var startVar = Blockly.STExecution.variableDB_.getDistinctName(
          variable0 + '_start', Blockly.Variables.NAME_TYPE);
      code += 'int ' + startVar + ' = ' + argument0 + ';\n';
    }
    var endVar = argument1;
    if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
      var endVar = Blockly.STExecution.variableDB_.getDistinctName(
          variable0 + '_end', Blockly.Variables.NAME_TYPE);
      code += 'int ' + endVar + ' = ' + argument1 + ';\n';
    }
    // Determine loop direction at start, in case one of the bounds
    // changes during loop execution.
    var incVar = Blockly.STExecution.variableDB_.getDistinctName(
        variable0 + '_inc', Blockly.Variables.NAME_TYPE);
    code += 'int ' + incVar + ' = ';
    if (Blockly.isNumber(increment)) {
      code += Math.abs(increment) + ';\n';
    } else {
      code += 'abs(' + increment + ');\n';
    }
    code += 'if (' + startVar + ' > ' + endVar + ') {\n';
    code += Blockly.STExecution.INDENT + incVar + ' = -' + incVar + ';\n';
    code += '}\n';
    code += 'for (' + variable0 + ' = ' + startVar + ';\n' +
        '     ' + incVar + ' >= 0 ? ' +
        variable0 + ' <= ' + endVar + ' : ' +
        variable0 + ' >= ' + endVar + ';\n' +
        '     ' + variable0 + ' += ' + incVar + ') {\n' +
        branch + '}\n';
  }
  return code;
};

/**
 * A "for each" block.
 * TODO: Removed for now from toolbox as lists are not yet implemented.
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.STExecution['controls_forEach'] = Blockly.STExecution.noGeneratorCodeLine;

/**
 * Generator for the loop flow control statements.
 * STExecution code: loop { break;/continue; }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.STExecution['controls_flow_statements'] = function(block) {
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw 'Unknown flow statement.';
};

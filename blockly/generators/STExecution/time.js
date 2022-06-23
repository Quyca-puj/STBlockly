/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview STExecution code generator for the Time blocks.
 *     STExecution built-in function docs: http://STExecution.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.STExecution.time');

goog.require('Blockly.STExecution');


/**
 * Code generator for the delay STExecution block.
 * STExecution code: loop { delay(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.STExecution['time_delay'] = function(block) {
  var delayTime = Blockly.STExecution.valueToCode(
      block, 'DELAY_TIME_MILI', Blockly.STExecution.ORDER_ATOMIC) || '0';
  var code = 'delay(' + delayTime + ');\n';
  return code;
};

/**
 * Code generator for the delayMicroseconds block.
 * STExecution code: loop { delayMicroseconds(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.STExecution['time_delaymicros'] = function(block) {
  var delayTimeMs = Blockly.STExecution.valueToCode(
      block, 'DELAY_TIME_MICRO', Blockly.STExecution.ORDER_ATOMIC) || '0';
  var code = 'delayMicroseconds(' + delayTimeMs + ');\n';
  return code;
};

/**
 * Code generator for the elapsed time in milliseconds block.
 * STExecution code: loop { millis() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
 Blockly.STExecution['time_millis'] = function(block) {
  var code = 'millis()';
  return [code, Blockly.STExecution.ORDER_ATOMIC];
};

/**
 * Code generator for the elapsed time in microseconds block.
 * STExecution code: loop { micros() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
 Blockly.STExecution['time_micros'] = function(block) {
  var code = 'micros()';
  return [code, Blockly.STExecution.ORDER_ATOMIC];
};

/**
 * Code generator for the wait forever (end of program) block
 * STExecution code: loop { while(true); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.STExecution['infinite_loop'] = function(block) {
  return 'while(true);\n';
};

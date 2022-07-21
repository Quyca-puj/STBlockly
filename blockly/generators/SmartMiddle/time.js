/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview SmartMiddle code generator for the Time blocks.
 *     SmartMiddle built-in function docs: http://SmartMiddle.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.SmartMiddle.time');

goog.require('Blockly.SmartMiddle');


/**
 * Code generator for the delay SmartMiddle block.
 * SmartMiddle code: loop { delay(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.SmartMiddle['time_delay'] = function(block) {
  var delayTime = Blockly.SmartMiddle.valueToCode(
      block, 'DELAY_TIME_MILI', Blockly.SmartMiddle.ORDER_ATOMIC) || '0';
  var code = 'delay(' + delayTime + ');\n';
  return code;
};

/**
 * Code generator for the delayMicroseconds block.
 * SmartMiddle code: loop { delayMicroseconds(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.SmartMiddle['time_delaymicros'] = function(block) {
  var delayTimeMs = Blockly.SmartMiddle.valueToCode(
      block, 'DELAY_TIME_MICRO', Blockly.SmartMiddle.ORDER_ATOMIC) || '0';
  var code = 'delayMicroseconds(' + delayTimeMs + ');\n';
  return code;
};

/**
 * Code generator for the elapsed time in milliseconds block.
 * SmartMiddle code: loop { millis() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
 Blockly.SmartMiddle['time_millis'] = function(block) {
  var code = 'millis()';
  return [code, Blockly.SmartMiddle.ORDER_ATOMIC];
};

/**
 * Code generator for the elapsed time in microseconds block.
 * SmartMiddle code: loop { micros() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
 Blockly.SmartMiddle['time_micros'] = function(block) {
  var code = 'micros()';
  return [code, Blockly.SmartMiddle.ORDER_ATOMIC];
};

/**
 * Code generator for the wait forever (end of program) block
 * SmartMiddle code: loop { while(true); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.SmartMiddle['infinite_loop'] = function(block) {
  return 'while(true);\n';
};

/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Java code generator for the Time blocks.
 *     Java built-in function docs: http://Java.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Java.time');

goog.require('Blockly.Java');


/**
 * Code generator for the delay Java block.
 * Java code: loop { delay(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.Java['time_delay'] = function(block) {
  var delayTime = Blockly.Java.valueToCode(
      block, 'DELAY_TIME_MILI', Blockly.Java.ORDER_ATOMIC) || '0';
  var code = 'delay(' + delayTime + ');\n';
  return code;
};

/**
 * Code generator for the delayMicroseconds block.
 * Java code: loop { delayMicroseconds(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.Java['time_delaymicros'] = function(block) {
  var delayTimeMs = Blockly.Java.valueToCode(
      block, 'DELAY_TIME_MICRO', Blockly.Java.ORDER_ATOMIC) || '0';
  var code = 'delayMicroseconds(' + delayTimeMs + ');\n';
  return code;
};

/**
 * Code generator for the elapsed time in milliseconds block.
 * Java code: loop { millis() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
 Blockly.Java['time_millis'] = function(block) {
  var code = 'millis()';
  return [code, Blockly.Java.ORDER_ATOMIC];
};

/**
 * Code generator for the elapsed time in microseconds block.
 * Java code: loop { micros() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
 Blockly.Java['time_micros'] = function(block) {
  var code = 'micros()';
  return [code, Blockly.Java.ORDER_ATOMIC];
};

/**
 * Code generator for the wait forever (end of program) block
 * Java code: loop { while(true); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.Java['infinite_loop'] = function(block) {
  return 'while(true);\n';
};

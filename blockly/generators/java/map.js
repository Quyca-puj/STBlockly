/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the Java map functionality.
 *     Java built-in function docs: http://Java.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Java.map');

goog.require('Blockly.Java');


/**
 * Code generator for the map block.
 * Java code: loop { map(x, 0, 1024, 0, y) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Java['base_map'] = function(block) {
  var valueNum = Blockly.Java.valueToCode(
      block, 'NUM', Blockly.Java.ORDER_NONE) || '0';
  var valueDmax = Blockly.Java.valueToCode(
      block, 'DMAX', Blockly.Java.ORDER_ATOMIC) || '0';

  var code = 'map(' + valueNum + ', 0, 1024, 0, ' + valueDmax + ')';
  return [code, Blockly.Java.ORDER_NONE];
};

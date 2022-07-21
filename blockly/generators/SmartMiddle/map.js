/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the SmartMiddle map functionality.
 *     SmartMiddle built-in function docs: http://SmartMiddle.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.SmartMiddle.map');

goog.require('Blockly.SmartMiddle');


/**
 * Code generator for the map block.
 * SmartMiddle code: loop { map(x, 0, 1024, 0, y) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.SmartMiddle['base_map'] = function(block) {
  var valueNum = Blockly.SmartMiddle.valueToCode(
      block, 'NUM', Blockly.SmartMiddle.ORDER_NONE) || '0';
  var valueDmax = Blockly.SmartMiddle.valueToCode(
      block, 'DMAX', Blockly.SmartMiddle.ORDER_ATOMIC) || '0';

  var code = 'map(' + valueNum + ', 0, 1024, 0, ' + valueDmax + ')';
  return [code, Blockly.SmartMiddle.ORDER_NONE];
};

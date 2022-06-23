/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the STExecution map functionality.
 *     STExecution built-in function docs: http://STExecution.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.STExecution.map');

goog.require('Blockly.STExecution');


/**
 * Code generator for the map block.
 * STExecution code: loop { map(x, 0, 1024, 0, y) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.STExecution['base_map'] = function(block) {
  var valueNum = Blockly.STExecution.valueToCode(
      block, 'NUM', Blockly.STExecution.ORDER_NONE) || '0';
  var valueDmax = Blockly.STExecution.valueToCode(
      block, 'DMAX', Blockly.STExecution.ORDER_ATOMIC) || '0';

  var code = 'map(' + valueNum + ', 0, 1024, 0, ' + valueDmax + ')';
  return [code, Blockly.STExecution.ORDER_NONE];
};

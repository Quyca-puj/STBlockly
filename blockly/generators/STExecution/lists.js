/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating STExecution code for list blocks.
 *
 * TODO: A lot of this can be converted to arrays code by creating functions to
 *       replicate this kind of behavior.
 */
'use strict';

goog.provide('Blockly.STExecution.lists');

goog.require('Blockly.STExecution');


Blockly.STExecution['lists_create_empty'] = Blockly.STExecution.noGeneratorCodeInline;

Blockly.STExecution['lists_create_with'] = Blockly.STExecution.noGeneratorCodeInline;

Blockly.STExecution['lists_repeat'] = Blockly.STExecution.noGeneratorCodeInline;

Blockly.STExecution['lists_length'] = Blockly.STExecution.noGeneratorCodeInline;

Blockly.STExecution['lists_isEmpty'] = Blockly.STExecution.noGeneratorCodeInline;

Blockly.STExecution['lists_indexOf'] = Blockly.STExecution.noGeneratorCodeInline;

Blockly.STExecution['lists_getIndex'] = Blockly.STExecution.noGeneratorCodeInline;

Blockly.STExecution['lists_setIndex'] = Blockly.STExecution.noGeneratorCodeLine;

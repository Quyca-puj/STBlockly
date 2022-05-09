/**
 * @license
 * Visual Blocks Editor
 *
 * License Pending @todo
 */

/**
 * @fileoverview Utility functions for handling STCommands.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.STCommands');

goog.require('Blockly.Field');
goog.require('Blockly.Names');
goog.require('Blockly.Workspace');


/**
 * Category to separate STCommand names from variables and generated functions.
 */
Blockly.STCommands.NAME_TYPE = 'STCOMMANDS';

/**
 * Find all user-created STCommand definitions in a workspace.
 * @param {!Blockly.Workspace} root Root workspace.
 * @return {!Array.<!Array.<!Array>>} Pair of arrays, the
 *     first contains STCommands without return variables, the second with.
 *     Each STCommand is defined by a three-element list of name, parameter
 *     list, and return value boolean.
 */
Blockly.STCommands.allSTCommands = function(root) {
  var blocks = root.getAllBlocks();
  let STCommandsNoReturn = [];
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].getCommandDef) {
      var tuple = blocks[i].getCommandDef();
      if (tuple) {
          STCommandsNoReturn.push(tuple);
      }
    }
  }
  STCommandsNoReturn.sort(Blockly.STCommands.procTupleComparator_);
  return [STCommandsNoReturn];
};

/**
 * Comparison function for case-insensitive sorting of the first element of
 * a tuple.
 * @param {!Array} ta First tuple.
 * @param {!Array} tb Second tuple.
 * @return {number} -1, 0, or 1 to signify greater than, equality, or less than.
 * @private
 */
Blockly.STCommands.procTupleComparator_ = function(ta, tb) {
  return ta[0].toLowerCase().localeCompare(tb[0].toLowerCase());
};

/**
 * Ensure two identically-named STCommands don't exist.
 * @param {string} name Proposed STCommand name.
 * @param {!Blockly.Block} block Block to disambiguate.
 * @return {string} Non-colliding name.
 */
Blockly.STCommands.findLegalName = function(name, block) {
  if (block.isInFlyout) {
    // Flyouts can have multiple STCommands called 'do something'.
    return name;
  }
  while (!Blockly.STCommands.isLegalName(name, block.workspace, block)) {
    // Collision with another STCommand.
    var r = name.match(/^(.*?)(\d+)$/);
    if (!r) {
      name += '2';
    } else {
      name = r[1] + (parseInt(r[2], 10) + 1);
    }
  }
  return name;
};

/**
 * Does this STCommand have a legal name?  Illegal names include names of
 * STCommands already defined.
 * @param {string} name The questionable name.
 * @param {!Blockly.Workspace} workspace The workspace to scan for collisions.
 * @param {Blockly.Block=} opt_exclude Optional block to exclude from
 *     comparisons (one doesn't want to collide with oneself).
 * @return {boolean} True if the name is legal.
 */
Blockly.STCommands.isLegalName = function(name, workspace, opt_exclude) {
  var blocks = workspace.getAllBlocks();
  // Iterate through every block and check the name.
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i] == opt_exclude) {
      continue;
    }
    if (blocks[i].getCommandDef) {
      var procName = blocks[i].getCommandDef();
      if (Blockly.Names.equals(procName[0], name)) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Rename a STCommand.  Called by the editable field.
 * @param {string} text The proposed new name.
 * @return {string} The accepted name.
 * @this {!Blockly.Field}
 */
Blockly.STCommands.rename = function(text) {
  // Strip leading and trailing whitespace.  Beyond this, all names are legal.
  text = text.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');

  // Ensure two identically-named STCommands don't exist.
  text = Blockly.STCommands.findLegalName(text, this.sourceBlock_);
  // Rename any callers.
  var blocks = this.sourceBlock_.workspace.getAllBlocks();
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].renameCommand) {
      blocks[i].renameCommand(this.text_, text);
    }
  }
  return text;
};

/**
 * Construct the blocks required by the flyout for the STCommand category.
 * @param {!Blockly.Workspace} workspace The workspace contianing STCommands.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blockly.STCommands.flyoutCategory = function(workspace) {
  var xmlList = [];

  if (xmlList.length) {
    // Add slightly larger gap between system blocks and user calls.
    xmlList[xmlList.length - 1].setAttribute('gap', 24);
  }

  function populateSTCommands(STCommandList) {
    if(STCommandList && STCommandList.length){
      for (var i = 0; i < STCommandList.length; i++) {

        var name = STCommandList[i].name;
        var block = goog.dom.createDom('block');
        block.setAttribute('type', 'st_command_call');
        block.setAttribute('gap', 16);
        var mutation = goog.dom.createDom('mutation');
        mutation.setAttribute('name', name);
        block.appendChild(mutation);
        // for (var t = 0; t < args.length; t++) {
        //   var arg = goog.dom.createDom('arg');
        //   arg.setAttribute('name', args[t]);
        //   mutation.appendChild(arg);
        // }
        xmlList.push(block);
  
      }
    }
  }
  populateSTCommands(Ardublockly.commandList);
  return xmlList;
};

/**
 * Find all the callers of a named STCommand.
 * @param {string} name Name of STCommand.
 * @param {!Blockly.Workspace} workspace The workspace to find callers in.
 * @return {!Array.<!Blockly.Block>} Array of caller blocks.
 */
Blockly.STCommands.getCallers = function(name, workspace) {
  var callers = [];
  var blocks = workspace.getAllBlocks();
  // Iterate through every block and check the name.
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].getCommandCall) {
      var procName = blocks[i].getCommandCall();
      // STCommand name may be null if the block is only half-built.
      if (procName && Blockly.Names.equals(procName, name)) {
        callers.push(blocks[i]);
      }
    }
  }
  return callers;
};

/**
 * When a STCommand definition is disposed of, find and dispose of all its
 *     callers.
 * @param {string} name Name of deleted STCommand definition.
 * @param {!Blockly.Workspace} workspace The workspace to delete callers from.
 */
Blockly.STCommands.disposeCallers = function(name, workspace) {
  var callers = Blockly.STCommands.getCallers(name, workspace);
  for (var i = 0; i < callers.length; i++) {
    callers[i].dispose(true, false);
  }
};

/**
 * When a STCommand definition changes its parameters, find and edit all its
 * callers.
 * @param {!Blockly.Block} defBlock STCommand definition block.
 */
Blockly.STCommands.mutateCallers = function(defBlock) {
  var oldRecordUndo = Blockly.Events.recordUndo;
  var name = defBlock.getCommandDef()[0];
  var xmlElement = defBlock.mutationToDom(true);
  var callers = Blockly.STCommands.getCallers(name, defBlock.workspace);
  for (var i = 0, caller; caller = callers[i]; i++) {
    var oldMutationDom = caller.mutationToDom();
    var oldMutation = oldMutationDom && Blockly.Xml.domToText(oldMutationDom);
    caller.domToMutation(xmlElement);
    var newMutationDom = caller.mutationToDom();
    var newMutation = newMutationDom && Blockly.Xml.domToText(newMutationDom);
    if (oldMutation != newMutation) {
      // Fire a mutation on every caller block.  But don't record this as an
      // undo action since it is deterministically tied to the STCommand's
      // definition mutation.
      Blockly.Events.recordUndo = false;
      Blockly.Events.fire(new Blockly.Events.Change(
          caller, 'mutation', null, oldMutation, newMutation));
      Blockly.Events.recordUndo = oldRecordUndo;
    }
  }
};

/**
 * Find the definition block for the named STCommand.
 * @param {string} name Name of STCommand.
 * @param {!Blockly.Workspace} workspace The workspace to search.
 * @return {Blockly.Block} The STCommand definition block, or null not found.
 */
Blockly.STCommands.getDefinition = function(name, workspace) {
  var blocks = workspace.getAllBlocks();
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].getCommandDef) {
      var tuple = blocks[i].getCommandDef();
      if (tuple && Blockly.Names.equals(tuple[0], name)) {
        return blocks[i];
      }
    }
  }
  return null;
};

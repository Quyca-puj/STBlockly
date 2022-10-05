/**
 * @license 
 */

/**
 * @fileoverview Helper functions for generating STExecution language.
 */
'use strict';

goog.provide('Blockly.STExecution');

goog.require('Blockly.Generator');
goog.require('Blockly.StaticTyping');


/**
 * STExecution code generator.
 * @type {!Blockly.Generator}
 */
Blockly.STExecution = new Blockly.Generator('STExecution');
Blockly.STExecution.StaticTyping = new Blockly.StaticTyping();

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.STExecution.addReservedWords(
  'Blockly');

/** Order of operation ENUMs. */
Blockly.STExecution.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.STExecution.ORDER_ACCESS = 1;  // expr++ expr-- () [] .
Blockly.STExecution.ORDER_UNARY_POSTFIX = 2;  // expr++ expr-- () [] .
Blockly.STExecution.ORDER_UNARY_PREFIX = 3;   // -expr !expr ~expr ++expr --expr
Blockly.STExecution.ORDER_CREATION = 4; // new , (cast)
Blockly.STExecution.ORDER_MULTIPLICATIVE = 5; // * / % ~/
Blockly.STExecution.ORDER_ADDITIVE = 6;       // + -
Blockly.STExecution.ORDER_SHIFT = 7;          // << >>
Blockly.STExecution.ORDER_RELATIONAL = 8;     // >= > <= <
Blockly.STExecution.ORDER_EQUALITY = 9;       // == != === !==
Blockly.STExecution.ORDER_BITWISE_AND = 10;    // &
Blockly.STExecution.ORDER_BITWISE_XOR = 11;    // ^
Blockly.STExecution.ORDER_BITWISE_OR = 12;    // |
Blockly.STExecution.ORDER_LOGICAL_AND = 13;   // &&
Blockly.STExecution.ORDER_LOGICAL_OR = 14;    // ||
Blockly.STExecution.ORDER_TERNARY = 15;   // expr ? expr : expr
Blockly.STExecution.ORDER_ASSIGNMENT = 16;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.STExecution.ORDER_LAMBDA = 17;    // ->
Blockly.STExecution.ORDER_NONE = 99;          // (...)

/**
 * STExecution generator short name for
 * Blockly.Generator.prototype.FUNCTION_NAME_PLACEHOLDER_
 * @type {!string}
 */
Blockly.STExecution.DEF_FUNC_NAME = Blockly.STExecution.FUNCTION_NAME_PLACEHOLDER_;

/**
 * Initialises the database of global definitions, the setup function, function
 * names, and variable names.
 * @param {Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.STExecution.init = function (workspace) {
  // Create a dictionary of definitions to be printed at the top of the sketch
  Blockly.STExecution.includes_ = Object.create(null);
  // Create a dictionary of global definitions to be printed after variables
  Blockly.STExecution.definitions_ = Object.create(null);
  // Create a dictionary of variables
  Blockly.STExecution.variables_ = Object.create(null);
  // Create a dictionary of functions from the code generator
  Blockly.STExecution.codeFunctions_ = Object.create(null);
  // Create a dictionary of functions created by the user
  Blockly.STExecution.userFunctions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions)
  Blockly.STExecution.functionNames_ = Object.create(null);
  // Create a dictionary of setups to be printed in the setup() function
  Blockly.STExecution.setups_ = Object.create(null);
  // Create a dictionary of setups to be printed in the setup() function
  Blockly.STExecution.commandDict = Object.create(null);
  // Create a dictionary of pins to check if their use conflicts
  if (!Blockly.STExecution.variableDB_) {
    Blockly.STExecution.variableDB_ =
      new Blockly.Names(Blockly.STExecution.RESERVED_WORDS_);
  } else {
    Blockly.STExecution.variableDB_.reset();
  }
  Blockly.STExecution.actDict = Object.create(null);
  Blockly.STExecution.emoDict = Object.create(null);

  // Iterate through to capture all blocks types and set the function arguments
  var varsWithTypes = Blockly.STExecution.StaticTyping.collectVarsWithTypes(workspace);
  Blockly.STExecution.StaticTyping.setProcedureArgs(workspace, varsWithTypes);

  // Set variable declarations with their STExecution type in the defines dictionary
  for (var varName in varsWithTypes) {
    Blockly.STExecution.addVariable(varName,
      Blockly.STExecution.getSTExecutionType_(varsWithTypes[varName]) + ' ' +
      Blockly.STExecution.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE) + ';');
  }
};

/**
 * Prepare all generated code to be placed in the sketch specific locations.
 * @param {string} code Generated main program (loop function) code.
 * @return {string} Completed sketch code.
 */
Blockly.STExecution.finish = function (code) {
  // Convert the includes, definitions, and functions dictionaries into lists
  var includes = [], definitions = [], variables = [], functions = [];
  for (var name in Blockly.STExecution.includes_) {
    includes.push(Blockly.STExecution.includes_[name]);
  }
  if (includes.length) {
    includes.push('\n');
  }
  for (var name in Blockly.STExecution.variables_) {
    variables.push(Blockly.STExecution.variables_[name]);
  }
  if (variables.length) {
    variables.push('\n');
  }
  for (var name in Blockly.STExecution.definitions_) {
    definitions.push(Blockly.STExecution.definitions_[name]);
  }
  if (definitions.length) {
    definitions.push('\n');
  }
  for (var name in Blockly.STExecution.codeFunctions_) {
    functions.push(Blockly.STExecution.codeFunctions_[name]);
  }
  for (var name in Blockly.STExecution.userFunctions_) {
    functions.push(Blockly.STExecution.userFunctions_[name]);
  }
  if (functions.length) {
    functions.push('\n');
  }

  // userSetupCode added at the end of the setup function without leading spaces
  // var setups = [''], userSetupCode= '';
  // if (Blockly.STExecution.setups_['userSetupCode'] !== undefined) {
  //   userSetupCode = '\n' + Blockly.STExecution.setups_['userSetupCode'];
  //   delete Blockly.STExecution.setups_['userSetupCode'];
  // }
  // for (var name in Blockly.STExecution.setups_) {
  //   setups.push(Blockly.STExecution.setups_[name]);
  // }
  // if (userSetupCode) {
  //   setups.push(userSetupCode);
  // }

  // Clean up temporary data
  delete Blockly.STExecution.includes_;
  delete Blockly.STExecution.definitions_;
  delete Blockly.STExecution.codeFunctions_;
  delete Blockly.STExecution.userFunctions_;
  delete Blockly.STExecution.functionNames_;
  delete Blockly.STExecution.setups_;
  Blockly.STExecution.variableDB_.reset();

  var header = includes.join('\n');
  var allDefs = variables.join('\n') +
    definitions.join('\n');
  var loop = code.replace(/\n/g, '\n  ');
  return header + allDefs + loop + functions.join('\n\n');
};

/**
 * Adds a string of "include" code to be added to the sketch.
 * Once a include is added it will not get overwritten with new code.
 * @param {!string} includeTag Identifier for this include code.
 * @param {!string} code Code to be included at the very top of the sketch.
 */
Blockly.STExecution.addInclude = function (includeTag, code) {
  if (Blockly.STExecution.includes_[includeTag] === undefined) {
    Blockly.STExecution.includes_[includeTag] = code;
  }
};

/**
 * Adds a string of code to be declared globally to the sketch.
 * Once it is added it will not get overwritten with new code.
 * @param {!string} declarationTag Identifier for this declaration code.
 * @param {!string} code Code to be added below the includes.
 */
Blockly.STExecution.addDeclaration = function (declarationTag, code) {
  if (Blockly.STExecution.definitions_[declarationTag] === undefined) {
    Blockly.STExecution.definitions_[declarationTag] = code;
  }
};

/**
 * Adds a string of code to declare a variable globally to the sketch.
 * Only if overwrite option is set to true it will overwrite whatever
 * value the identifier held before.
 * @param {!string} varName The name of the variable to declare.
 * @param {!string} code Code to be added for the declaration.
 * @param {boolean=} overwrite Flag to ignore previously set value.
 * @return {!boolean} Indicates if the declaration overwrote a previous one.
 */
Blockly.STExecution.addVariable = function (varName, code, overwrite) {
  var overwritten = false;
  if (overwrite || (Blockly.STExecution.variables_[varName] === undefined)) {
    Blockly.STExecution.variables_[varName] = code;
    overwritten = true;
  }
  return overwritten;
};

/**
 * Adds a string of code as a function. It takes an identifier (meant to be the
 * function name) to only keep a single copy even if multiple blocks might
 * request this function to be created.
 * A function (and its code) will only be added on first request.
 * @param {!string} preferedName Identifier for the function.
 * @param {!string} code Code to be included in the setup() function.
 * @return {!string} A unique function name based on input name.
 */
Blockly.STExecution.addFunction = function (preferedName, code) {
  if (Blockly.STExecution.codeFunctions_[preferedName] === undefined) {
    var uniqueName = Blockly.STExecution.variableDB_.getDistinctName(
      preferedName, Blockly.Generator.NAME_TYPE);
    Blockly.STExecution.codeFunctions_[preferedName] =
      code.replace(Blockly.STExecution.DEF_FUNC_NAME, uniqueName);
    Blockly.STExecution.functionNames_[preferedName] = uniqueName;
  }
  return Blockly.STExecution.functionNames_[preferedName];
};


/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything. A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.STExecution.scrubNakedValue = function (line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped STExecution string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} STExecution string.
 * @private
 */
Blockly.STExecution.quote_ = function (string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\\n')
    .replace(/\$/g, '\\$')
    .replace(/'/g, '\\\'');
  return '\"' + string + '\"';
};

/**
 * Common tasks for generating STExecution from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The STExecution code created for this block.
 * @return {string} STExecution code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.STExecution.scrub_ = function (block, code) {
  if (code === null) { return ''; } // Block has handled code generation itself

  var commentCode = '';
  // Only collect comments for blocks that aren't inline
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments
    // Don't collect comments for nested statements
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Generates STExecution Types from a Blockly Type.
 * @param {!Blockly.Type} typeBlockly The Blockly type to be converted.
 * @return {string} STExecution type for the respective Blockly input type, in a
 *     string format.
 * @private
 */
Blockly.STExecution.getSTExecutionType_ = function (typeBlockly) {
  let typeid = typeBlockly.typeId ? typeBlockly.typeId : typeBlockly;

  switch (typeid) {
    case Blockly.Types.SHORT_NUMBER.typeId:
      return 'char';
    case Blockly.Types.NUMBER.typeId:
      return 'int';
    case Blockly.Types.LARGE_NUMBER.typeId:
      return 'long';
    case Blockly.Types.DECIMAL.typeId:
      return 'float';
    case Blockly.Types.TEXT.typeId:
      return 'String';
    case Blockly.Types.CHARACTER.typeId:
      return 'char';
    case Blockly.Types.BOOLEAN.typeId:
      return 'boolean';
    case Blockly.Types.NULL.typeId:
      return 'void';
    case Blockly.Types.UNDEF.typeId:
      return 'undefined';
    case Blockly.Types.CHILD_BLOCK_MISSING.typeId:
      // If no block connected default to int, change for easier debugging
      //return 'ChildBlockMissing';
      return 'int';
    default:
      return 'Invalid Blockly Type';
  }
};

/** Used for not-yet-implemented block code generators */
Blockly.STExecution.noGeneratorCodeInline = function () {
  return ['', Blockly.STExecution.ORDER_ATOMIC];
};

/** Used for not-yet-implemented block code generators */
Blockly.STExecution.noGeneratorCodeLine = function () { return ''; };

Blockly.STExecution.LoopToList = function (block, name) {
  var targetBlock = block.getInputTargetBlock(name);
  var code = this.LoopToList(targetBlock);
  return code;
};

Blockly.STExecution.statementToList = function (block, name, alias) {
  var targetBlock = block.getInputTargetBlock(name);
  var code = this.blockToList(targetBlock, alias);
  return code;
};

Blockly.STExecution.LoopToList = function (block) {
  let auxBlock = block;
  let blockList = [];
  while (auxBlock !== null) {
    if (!block.disabled) {
      let action = this.blockToOutput(auxBlock);
      blockList.push(action);
    }
    auxBlock = auxBlock.getNextBlock();
  }
  return blockList;
};

Blockly.STExecution.blockToList = function (block, alias) {
  let auxBlock = block;
  let blockList = [];
  while (auxBlock !== null) {
    if (!block.disabled) {
      let action = this.blockToOutput(auxBlock, alias);
      blockList.push(action);
    }
    auxBlock = auxBlock.getNextBlock();
  }
  return blockList;
};
Blockly.STExecution.blockToSTActions = function (command, alias, id) {
  let retAction = {};
  let stmt = command;
  let msg = [];
  let emoMsg = [];
  retAction.id = id;
  console.log("processing");
  console.log(command);
  if (stmt.action) {
    retAction.type = SmartTownUtils.BASE_COMMAND;
    msg.push(alias);
    msg.push(stmt.action);

    if (stmt.emotion) {
      emoMsg.push(alias);
      emoMsg.push("emotions");
      emoMsg.push(stmt.emotion);
      retAction.emotion = emoMsg.join(" ");
      retAction.type = SmartTownUtils.EMOTION_COMMAND;
      stmt.params = Blockly.STExecution.setEmotionalParams(SmartTownUtils.ACTION_PARAMS[stmt.action], stmt.emotion);
    }
    
    if (stmt.params) {
      msg.push(stmt.params);
    }
    retAction.command = msg.join(" ");

  } else {
    if (stmt.emotion) {
      emoMsg.push(alias);
      emoMsg.push("emotions");
      emoMsg.push(stmt.emotion);
      retAction.emotion = emoMsg.join(" ");
      retAction.type = SmartTownUtils.JUST_EMOTION_COMMAND;
    }
  }

  if (stmt.list) {
    retAction.type = SmartTownUtils.ACTIONLIST_COMMAND;
    let commands = SmartTown.getActionsFromList(stmt.list);
    commands = commands.actions;
    let commandList = [];
    for (let i in commands) {
      commandList.push(this.blockToSTActions(commands[i], alias, id));
    }
    retAction.actions = commandList;
  }

  if (stmt.array) {
    retAction.type = SmartTownUtils.ACTIONLIST_COMMAND;
    let commands = stmt.array;
    let commandList = [];
    for (let i in commands) {
      commandList.push(this.blockToSTActions(commands[i], alias, id));
    }
    retAction.actions = commandList;
  }
  console.log(retAction);

  return retAction;
};

Blockly.STExecution.blockToOutput = function (block, alias) {
  if (!block) {
    return '';
  }
  if (block.disabled) {
    // Skip past this block if it is disabled.
    return this.blockToText(block.getNextBlock());
  }

  var func = this[block.type];
  goog.asserts.assertFunction(func,
    'Language "%s" does not know how to generate code for block type "%s".',
    this.name_, block.type);
  // First argument to func.call is the value of 'this' in the generator.
  // Prior to 24 September 2013 'this' was the only way to access the block.
  // The current prefered method of accessing the block is through the second
  // argument to func.call, which becomes the first parameter to the generator.
  let code = func.call(block, block);
  if (goog.isObject(code) || goog.isArray(code)) {
    let retAction;
    if(alias){
        retAction = this.blockToSTActions(code, alias, block.id);
    }else{
      retAction = code;
    }

    return retAction;
  } else if (goog.isString(code)) {
    if (this.STATEMENT_PREFIX) {
      code = this.STATEMENT_PREFIX.replace(/%1/g, '\'' + block.id + '\'') +
        code;
    }
    return code;
  } else if (code === null) {
    // Block has handled code generation itself.
    return '';
  } else {
    goog.asserts.fail('Invalid code generated: %s', code);
  }
};

//esta cambia los params necesarios.
Blockly.STExecution.setEmotionalParams = function (actions, emotion) {
  let retStr = [];
  console.log()
  let intensity = Blockly.STExecution.getEmoConfig(emotion);
  for (let i in actions) {
    let act = Blockly.STExecution.getActConfig(actions[i]);
    let min = parseFloat(act.MIN);
    let max = parseFloat(act.MAX);
    let aux = ((intensity + 1) / 2);
    let mid = max - min;
    retStr.push((aux * mid) + min);
  }
  return retStr.join(" ");
};


Blockly.STExecution.setActConfig = function (dict) {
  Blockly.STExecution.actDict = dict;
};

Blockly.STExecution.setEmoConfig = function (dict) {
  Blockly.STExecution.emoDict = dict;

};
Blockly.STExecution.getActConfig = function (action) {
  return Blockly.STExecution.actDict[action];
};

Blockly.STExecution.getEmoConfig = function (emotion) {
  return parseFloat(Blockly.STExecution.emoDict[emotion]);
};

Blockly.STExecution.getCommandDict = function () {
  let key = Object.keys(Blockly.STExecution.commandDict)[0];
  return Blockly.STExecution.commandDict[key];
};


Blockly.STExecution.addCommandToDict = function (alias, commandList) {
  Blockly.STExecution.commandDict[alias] = commandList;
};
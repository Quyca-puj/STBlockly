/**
 * @license 
 */

/**
 * @fileoverview Helper functions for generating SmartMiddle language.
 */
'use strict';

goog.provide('Blockly.SmartMiddle');

goog.require('Blockly.Generator');
goog.require('Blockly.StaticTyping');


/**
 * SmartMiddle code generator.
 * @type {!Blockly.Generator}
 */
Blockly.SmartMiddle = new Blockly.Generator('SmartMiddle');
Blockly.SmartMiddle.StaticTyping = new Blockly.StaticTyping();

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.SmartMiddle.addReservedWords(
    'Blockly');

/** Order of operation ENUMs. */
Blockly.SmartMiddle.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.SmartMiddle.ORDER_ACCESS = 1;  // expr++ expr-- () [] .
Blockly.SmartMiddle.ORDER_UNARY_POSTFIX = 2;  // expr++ expr-- () [] .
Blockly.SmartMiddle.ORDER_UNARY_PREFIX = 3;   // -expr !expr ~expr ++expr --expr
Blockly.SmartMiddle.ORDER_CREATION = 4; // new , (cast)
Blockly.SmartMiddle.ORDER_MULTIPLICATIVE = 5; // * / % ~/
Blockly.SmartMiddle.ORDER_ADDITIVE = 6;       // + -
Blockly.SmartMiddle.ORDER_SHIFT = 7;          // << >>
Blockly.SmartMiddle.ORDER_RELATIONAL = 8;     // >= > <= <
Blockly.SmartMiddle.ORDER_EQUALITY = 9;       // == != === !==
Blockly.SmartMiddle.ORDER_BITWISE_AND = 10;    // &
Blockly.SmartMiddle.ORDER_BITWISE_XOR = 11;    // ^
Blockly.SmartMiddle.ORDER_BITWISE_OR = 12;    // |
Blockly.SmartMiddle.ORDER_LOGICAL_AND = 13;   // &&
Blockly.SmartMiddle.ORDER_LOGICAL_OR = 14;    // ||
Blockly.SmartMiddle.ORDER_TERNARY = 15;   // expr ? expr : expr
Blockly.SmartMiddle.ORDER_ASSIGNMENT = 16;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.SmartMiddle.ORDER_LAMBDA = 17;    // ->
Blockly.SmartMiddle.ORDER_NONE = 99;          // (...)

/**
 * SmartMiddle generator short name for
 * Blockly.Generator.prototype.FUNCTION_NAME_PLACEHOLDER_
 * @type {!string}
 */
Blockly.SmartMiddle.DEF_FUNC_NAME = Blockly.SmartMiddle.FUNCTION_NAME_PLACEHOLDER_;

/**
 * Initialises the database of global definitions, the setup function, function
 * names, and variable names.
 * @param {Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.SmartMiddle.init = function(workspace) {
  // Create a dictionary of definitions to be printed at the top of the sketch
  Blockly.SmartMiddle.includes_ = Object.create(null);
  // Create a dictionary of global definitions to be printed after variables
  Blockly.SmartMiddle.definitions_ = Object.create(null);
  // Create a dictionary of variables
  Blockly.SmartMiddle.variables_ = Object.create(null);
  // Create a dictionary of functions from the code generator
  Blockly.SmartMiddle.codeFunctions_ = Object.create(null);
  // Create a dictionary of functions created by the user
  Blockly.SmartMiddle.userFunctions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions)
  Blockly.SmartMiddle.functionNames_ = Object.create(null);
  // Create a dictionary of setups to be printed in the setup() function
  Blockly.SmartMiddle.setups_ = Object.create(null);
  // Create a dictionary of pins to check if their use conflicts

  if (!Blockly.SmartMiddle.variableDB_) {
    Blockly.SmartMiddle.variableDB_ =
        new Blockly.Names(Blockly.SmartMiddle.RESERVED_WORDS_);
  } else {
    Blockly.SmartMiddle.variableDB_.reset();
  }

  // Iterate through to capture all blocks types and set the function arguments
  var varsWithTypes = Blockly.SmartMiddle.StaticTyping.collectVarsWithTypes(workspace);
  Blockly.SmartMiddle.StaticTyping.setProcedureArgs(workspace, varsWithTypes);

  // Set variable declarations with their SmartMiddle type in the defines dictionary
  for (var varName in varsWithTypes) {
    Blockly.SmartMiddle.addVariable(varName,
        Blockly.SmartMiddle.getSmartMiddleType_(varsWithTypes[varName]) +' ' +
        Blockly.SmartMiddle.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE) + ';');
  }
};

/**
 * Prepare all generated code to be placed in the sketch specific locations.
 * @param {string} code Generated main program (loop function) code.
 * @return {string} Completed sketch code.
 */
Blockly.SmartMiddle.finish = function(code) {
  // Convert the includes, definitions, and functions dictionaries into lists
  var includes = [], definitions = [], variables = [], functions = [];
  for (var name in Blockly.SmartMiddle.includes_) {
    includes.push(Blockly.SmartMiddle.includes_[name]);
  }
  if (includes.length) {
    includes.push('\n');
  }
  for (var name in Blockly.SmartMiddle.variables_) {
    variables.push(Blockly.SmartMiddle.variables_[name]);
  }
  if (variables.length) {
    variables.push('\n');
  }
  for (var name in Blockly.SmartMiddle.definitions_) {
    definitions.push(Blockly.SmartMiddle.definitions_[name]);
  }
  if (definitions.length) {
    definitions.push('\n');
  }
  for (var name in Blockly.SmartMiddle.codeFunctions_) {
    functions.push(Blockly.SmartMiddle.codeFunctions_[name]);
  }
  for (var name in Blockly.SmartMiddle.userFunctions_) {
    functions.push(Blockly.SmartMiddle.userFunctions_[name]);
  }
  if (functions.length) {
    functions.push('\n');
  }

  // userSetupCode added at the end of the setup function without leading spaces
  // var setups = [''], userSetupCode= '';
  // if (Blockly.SmartMiddle.setups_['userSetupCode'] !== undefined) {
  //   userSetupCode = '\n' + Blockly.SmartMiddle.setups_['userSetupCode'];
  //   delete Blockly.SmartMiddle.setups_['userSetupCode'];
  // }
  // for (var name in Blockly.SmartMiddle.setups_) {
  //   setups.push(Blockly.SmartMiddle.setups_[name]);
  // }
  // if (userSetupCode) {
  //   setups.push(userSetupCode);
  // }

  // Clean up temporary data
  delete Blockly.SmartMiddle.includes_;
  delete Blockly.SmartMiddle.definitions_;
  delete Blockly.SmartMiddle.codeFunctions_;
  delete Blockly.SmartMiddle.userFunctions_;
  delete Blockly.SmartMiddle.functionNames_;
  delete Blockly.SmartMiddle.setups_;
  Blockly.SmartMiddle.variableDB_.reset();

  var header = includes.join('\n');
  var allDefs =  variables.join('\n') +
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
Blockly.SmartMiddle.addInclude = function(includeTag, code) {
  if (Blockly.SmartMiddle.includes_[includeTag] === undefined) {
    Blockly.SmartMiddle.includes_[includeTag] = code;
  }
};

/**
 * Adds a string of code to be declared globally to the sketch.
 * Once it is added it will not get overwritten with new code.
 * @param {!string} declarationTag Identifier for this declaration code.
 * @param {!string} code Code to be added below the includes.
 */
Blockly.SmartMiddle.addDeclaration = function(declarationTag, code) {
  if (Blockly.SmartMiddle.definitions_[declarationTag] === undefined) {
    Blockly.SmartMiddle.definitions_[declarationTag] = code;
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
Blockly.SmartMiddle.addVariable = function(varName, code, overwrite) {
  var overwritten = false;
  if (overwrite || (Blockly.SmartMiddle.variables_[varName] === undefined)) {
    Blockly.SmartMiddle.variables_[varName] = code;
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
Blockly.SmartMiddle.addFunction = function(preferedName, code) {
  if (Blockly.SmartMiddle.codeFunctions_[preferedName] === undefined) {
    var uniqueName = Blockly.SmartMiddle.variableDB_.getDistinctName(
        preferedName, Blockly.Generator.NAME_TYPE);
    Blockly.SmartMiddle.codeFunctions_[preferedName] =
        code.replace(Blockly.SmartMiddle.DEF_FUNC_NAME, uniqueName);
    Blockly.SmartMiddle.functionNames_[preferedName] = uniqueName;
  }
  return Blockly.SmartMiddle.functionNames_[preferedName];
};


/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything. A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.SmartMiddle.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped SmartMiddle string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} SmartMiddle string.
 * @private
 */
Blockly.SmartMiddle.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\$/g, '\\$')
                 .replace(/'/g, '\\\'');
  return '\"' + string + '\"';
};

/**
 * Common tasks for generating SmartMiddle from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The SmartMiddle code created for this block.
 * @return {string} SmartMiddle code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.SmartMiddle.scrub_ = function(block, code) {
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
 * Generates SmartMiddle Types from a Blockly Type.
 * @param {!Blockly.Type} typeBlockly The Blockly type to be converted.
 * @return {string} SmartMiddle type for the respective Blockly input type, in a
 *     string format.
 * @private
 */
Blockly.SmartMiddle.getSmartMiddleType_ = function(typeBlockly) {
  let typeid = typeBlockly.typeId ? typeBlockly.typeId:typeBlockly;

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
Blockly.SmartMiddle.noGeneratorCodeInline = function() {
  return ['', Blockly.SmartMiddle.ORDER_ATOMIC];
};

/** Used for not-yet-implemented block code generators */
Blockly.SmartMiddle.noGeneratorCodeLine = function() { return ''; };

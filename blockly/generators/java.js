/**
 * @license 
 */

/**
 * @fileoverview Helper functions for generating Java language.
 */
'use strict';

goog.provide('Blockly.Java');

goog.require('Blockly.Generator');
goog.require('Blockly.StaticTyping');


/**
 * Java code generator.
 * @type {!Blockly.Generator}
 */
Blockly.Java = new Blockly.Generator('Java');
Blockly.Java.StaticTyping = new Blockly.StaticTyping();

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Java.addReservedWords(
    'Blockly,' +  // In case JS is evaled in the current window.
    'abstract,continue,for,new,switch,assert,default,goto,package,synchronized,boolean,do,if,private,'+
    'this,break,double,implements,protected,throw,byte,else,import,public,throws,case,enum,instanceof,'+
    'return,transient,catch,extends,int,short,try,char,final,interface,static,void,class,finally,long,'+
    'strictfp,volatile,const,float,native,super,while,const,goto,true,false,null,_');

/** Order of operation ENUMs. */
Blockly.Java.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.Java.ORDER_ACCESS = 1;  // expr++ expr-- () [] .
Blockly.Java.ORDER_UNARY_POSTFIX = 2;  // expr++ expr-- () [] .
Blockly.Java.ORDER_UNARY_PREFIX = 3;   // -expr !expr ~expr ++expr --expr
Blockly.Java.ORDER_CREATION = 4; // new , (cast)
Blockly.Java.ORDER_MULTIPLICATIVE = 5; // * / % ~/
Blockly.Java.ORDER_ADDITIVE = 6;       // + -
Blockly.Java.ORDER_SHIFT = 7;          // << >>
Blockly.Java.ORDER_RELATIONAL = 8;     // >= > <= <
Blockly.Java.ORDER_EQUALITY = 9;       // == != === !==
Blockly.Java.ORDER_BITWISE_AND = 10;    // &
Blockly.Java.ORDER_BITWISE_XOR = 11;    // ^
Blockly.Java.ORDER_BITWISE_OR = 12;    // |
Blockly.Java.ORDER_LOGICAL_AND = 13;   // &&
Blockly.Java.ORDER_LOGICAL_OR = 14;    // ||
Blockly.Java.ORDER_TERNARY = 15;   // expr ? expr : expr
Blockly.Java.ORDER_ASSIGNMENT = 16;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Java.ORDER_LAMBDA = 17;    // ->
Blockly.Java.ORDER_NONE = 99;          // (...)

/**
 * Java generator short name for
 * Blockly.Generator.prototype.FUNCTION_NAME_PLACEHOLDER_
 * @type {!string}
 */
Blockly.Java.DEF_FUNC_NAME = Blockly.Java.FUNCTION_NAME_PLACEHOLDER_;

/**
 * Initialises the database of global definitions, the setup function, function
 * names, and variable names.
 * @param {Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Java.init = function(workspace) {
  // Create a dictionary of definitions to be printed at the top of the sketch
  Blockly.Java.includes_ = Object.create(null);
  // Create a dictionary of global definitions to be printed after variables
  Blockly.Java.definitions_ = Object.create(null);
  // Create a dictionary of variables
  Blockly.Java.variables_ = Object.create(null);
  // Create a dictionary of functions from the code generator
  Blockly.Java.codeFunctions_ = Object.create(null);
  // Create a dictionary of functions created by the user
  Blockly.Java.userFunctions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions)
  Blockly.Java.functionNames_ = Object.create(null);
  // Create a dictionary of setups to be printed in the setup() function
  Blockly.Java.setups_ = Object.create(null);
  // Create a dictionary of pins to check if their use conflicts

  if (!Blockly.Java.variableDB_) {
    Blockly.Java.variableDB_ =
        new Blockly.Names(Blockly.Java.RESERVED_WORDS_);
  } else {
    Blockly.Java.variableDB_.reset();
  }

  // Iterate through to capture all blocks types and set the function arguments
  var varsWithTypes = Blockly.Java.StaticTyping.collectVarsWithTypes(workspace);
  Blockly.Java.StaticTyping.setProcedureArgs(workspace, varsWithTypes);

  // Set variable declarations with their Java type in the defines dictionary
  for (var varName in varsWithTypes) {
    Blockly.Java.addVariable(varName,
        Blockly.Java.getJavaType_(varsWithTypes[varName]) +' ' +
        Blockly.Java.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE) + ';');
  }
};

/**
 * Prepare all generated code to be placed in the sketch specific locations.
 * @param {string} code Generated main program (loop function) code.
 * @return {string} Completed sketch code.
 */
Blockly.Java.finish = function(code) {
  // Convert the includes, definitions, and functions dictionaries into lists
  var includes = [], definitions = [], variables = [], functions = [];
  for (var name in Blockly.Java.includes_) {
    includes.push(Blockly.Java.includes_[name]);
  }
  if (includes.length) {
    includes.push('\n');
  }
  for (var name in Blockly.Java.variables_) {
    variables.push(Blockly.Java.variables_[name]);
  }
  if (variables.length) {
    variables.push('\n');
  }
  for (var name in Blockly.Java.definitions_) {
    definitions.push(Blockly.Java.definitions_[name]);
  }
  if (definitions.length) {
    definitions.push('\n');
  }
  for (var name in Blockly.Java.codeFunctions_) {
    functions.push(Blockly.Java.codeFunctions_[name]);
  }
  for (var name in Blockly.Java.userFunctions_) {
    functions.push(Blockly.Java.userFunctions_[name]);
  }
  if (functions.length) {
    functions.push('\n');
  }

  // userSetupCode added at the end of the setup function without leading spaces
  // var setups = [''], userSetupCode= '';
  // if (Blockly.Java.setups_['userSetupCode'] !== undefined) {
  //   userSetupCode = '\n' + Blockly.Java.setups_['userSetupCode'];
  //   delete Blockly.Java.setups_['userSetupCode'];
  // }
  // for (var name in Blockly.Java.setups_) {
  //   setups.push(Blockly.Java.setups_[name]);
  // }
  // if (userSetupCode) {
  //   setups.push(userSetupCode);
  // }

  // Clean up temporary data
  delete Blockly.Java.includes_;
  delete Blockly.Java.definitions_;
  delete Blockly.Java.codeFunctions_;
  delete Blockly.Java.userFunctions_;
  delete Blockly.Java.functionNames_;
  delete Blockly.Java.setups_;
  Blockly.Java.variableDB_.reset();

  var header = includes.join('\n') + '\n\npublic class MacroManager implements Runnable {\n';
  var allDefs =  variables.join('\n') +
      definitions.join('\n');
  var loop = ' @Override\n public void run() {\n  ' + code.replace(/\n/g, '\n  ') + '\n } \n';
  return header + allDefs + loop + functions.join('\n\n') +  '\n}';
};

/**
 * Adds a string of "include" code to be added to the sketch.
 * Once a include is added it will not get overwritten with new code.
 * @param {!string} includeTag Identifier for this include code.
 * @param {!string} code Code to be included at the very top of the sketch.
 */
Blockly.Java.addInclude = function(includeTag, code) {
  if (Blockly.Java.includes_[includeTag] === undefined) {
    Blockly.Java.includes_[includeTag] = code;
  }
};

/**
 * Adds a string of code to be declared globally to the sketch.
 * Once it is added it will not get overwritten with new code.
 * @param {!string} declarationTag Identifier for this declaration code.
 * @param {!string} code Code to be added below the includes.
 */
Blockly.Java.addDeclaration = function(declarationTag, code) {
  if (Blockly.Java.definitions_[declarationTag] === undefined) {
    Blockly.Java.definitions_[declarationTag] = code;
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
Blockly.Java.addVariable = function(varName, code, overwrite) {
  var overwritten = false;
  if (overwrite || (Blockly.Java.variables_[varName] === undefined)) {
    Blockly.Java.variables_[varName] = code;
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
Blockly.Java.addFunction = function(preferedName, code) {
  if (Blockly.Java.codeFunctions_[preferedName] === undefined) {
    var uniqueName = Blockly.Java.variableDB_.getDistinctName(
        preferedName, Blockly.Generator.NAME_TYPE);
    Blockly.Java.codeFunctions_[preferedName] =
        code.replace(Blockly.Java.DEF_FUNC_NAME, uniqueName);
    Blockly.Java.functionNames_[preferedName] = uniqueName;
  }
  return Blockly.Java.functionNames_[preferedName];
};


/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything. A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Java.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Java string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Java string.
 * @private
 */
Blockly.Java.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\$/g, '\\$')
                 .replace(/'/g, '\\\'');
  return '\"' + string + '\"';
};

/**
 * Common tasks for generating Java from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Java code created for this block.
 * @return {string} Java code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.Java.scrub_ = function(block, code) {
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
 * Generates Java Types from a Blockly Type.
 * @param {!Blockly.Type} typeBlockly The Blockly type to be converted.
 * @return {string} Java type for the respective Blockly input type, in a
 *     string format.
 * @private
 */
Blockly.Java.getJavaType_ = function(typeBlockly) {
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
Blockly.Java.noGeneratorCodeInline = function() {
  return ['', Blockly.Java.ORDER_ATOMIC];
};

/** Used for not-yet-implemented block code generators */
Blockly.Java.noGeneratorCodeLine = function() { return ''; };

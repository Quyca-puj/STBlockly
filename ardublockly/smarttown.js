/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
'use strict';

/** Create a namespace for the application. */
var SmartTown = SmartTown || {};
 /** Sets the middle level generator */
SmartTown.setMiddleGenerator = function (generator) {
  Blockly.SmartTown.middleGenerator = generator;
};
 /** Generates robot arduino sketch from the workspace*/
SmartTown.getSTRobotSketch = function () {
  return SmartTown.generateRobotSketch(Ardublockly.workspace).join("\n");
};
 /**
  *  Gets a dictionary with the active characters from the high level graph play.
  *  @returns {Object} active character dictionary.
 */
SmartTown.getActiveCharacters = () => {
  let activeCharDir = {};

  const chars = SmartTown.graph.mapNodes((node) => {
    return SmartTown.graph.getNodeAttribute(node,"charac")["charac_alias"];
  });

  let charSet = new Set([...chars]);

  charSet.forEach(char =>{
    activeCharDir[char]  = SmartTown.characters[char];
  })

  
  return activeCharDir;
};


SmartTown.hasSetupBlock = (workspace) =>{
  let blocks = workspace.getAllBlocks();
  let hasSetup =false;
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].type === "setupsmarttown") {
        hasSetup = true;
    }
  }
  return hasSetup;
}
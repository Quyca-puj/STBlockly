/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
'use strict';

/** Create a namespace for the application. */
var SmartTown = SmartTown || {};

SmartTown.generateRobotSketch = function (root) {
  return Blockly.SmartTown.generateCommandRobotSketch(root);
};


SmartTown.setCommandList = function (list) {
  SmartTown.CommandList = list;
};

SmartTown.setALList = function (list) {
  SmartTown.ALList = list;
  SmartTown.convertToSendable(list);
};

SmartTown.convertToSendable = function (alList) {
  SmartTown.ALDict = {};
  for (let i in alList) {
    let al = [];
    let actionsAr = alList[i].actions;
    for (let j in actionsAr) {
      let act = actionsAr[j];
      let action = { action: act.action };
      if (act.time !== null && act.speed !== null) {
        action.params = act.speed + " " + act.time;
      }
      if (act.emotion !== null) {
        action.emotion = act.emotion;
      }
      al.push(action);
    }
    SmartTown.ALDict[alList[i].name] = al;
  }
};

SmartTown.getActionsFromList = function (alName) {
  return SmartTown.ALDict[alName];
};
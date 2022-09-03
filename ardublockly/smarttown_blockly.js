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


/** Opens the modal that displays the "not connected to server" message. */
SmartTown.openCharacModal = function () {
  $('#new_charac_dialog').openModal({
    dismissible: true,
    opacity: .5,
    in_duration: 200,
    out_duration: 250
  });
};

SmartTown.modalCharacOnSubmit = () => { 
  const form = document.getElementById('new_char_form');
  let charac_name = form.elements["charac_name" ];
  let charac_alias = form.elements["charac_alias"];
  let charac_ip = form.elements["charac_ip"];
  let charac_color = form.elements["charac_color"];
  let charac = {"charac_name":charac_name.value,"charac_alias":charac_alias.value,"charac_ip":charac_ip.value,"charac_color":charac_color.value};
  let valid = SmartTown.addCharacter(charac);
  console.log(valid);
  if(!valid){
    Ardublockly.materialAlert(Ardublockly.getLocalStr('characErrorTitle'), Ardublockly.getLocalStr('characErrorBody'), false);
  }else{
    var $newOpt = $("<option>").attr("value",charac.charac_alias).text(charac.charac_name)
    $("#charac").append($newOpt);
    $("#charac").trigger('contentChanged');
  }

}
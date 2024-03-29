/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
'use strict';

/** Create a namespace for the application. */
var SmartTown = SmartTown || {};
/**
 * Emotion List
 */
SmartTown.emotions = {};
/**
 * Command List
 */
SmartTown.CommandList = [];
/**
 * Emotion dict
 */
SmartTown.emotionsUtil = [];

/**
 * Emotional configuration.
 */
SmartTown.emoConf = {};

/**
 * Generates a robot command sketch
 *  @param {Ardublockly.workspace} root workspace
 */
SmartTown.generateRobotSketch = function (root) {
  return Blockly.SmartTown.generateCommandRobotSketch(root);
};

/**
 * Sets the command list
 *  @param {Array} list 
 */
SmartTown.setCommandList = function (list) {
  SmartTown.CommandList = list;
};

/**
 * Sets the Action List's list
 *  @param {Array} list 
 */
SmartTown.setALList = function (list) {
  SmartTown.ALList = list;
  SmartTown.convertToSendable(list);
};


/**
 * Sets the Emotion list
 *  @param {Array} list 
 */
SmartTown.setEmotions = function (list) {
  SmartTown.emotions = list;
  SmartTown.emotions.forEach(emo => {
    SmartTown.emotionsUtil.push([emo.translatedName, emo.name]);
  });
};

/**
 * Sets the Emotional config
 *  @param {Array} list 
 */
SmartTown.setEmotionConf = function (list) {
  let emoAux = list["config"];
  emoAux.forEach(emo => {
    SmartTown.emoConf[emo["emotion"]["name"]] = emo;
  });
};

/**
 * Calculates the speed for a given emotion.
 *  @param {String} emotion 
 * @return speed.
 */
SmartTown.getSpeedFromEmotion = (emotion) => {
  let intensity = SmartTown.emoConf[emotion]["intensity"];
  let min = parseFloat(10);
  let max = parseFloat(100);
  let aux = ((intensity + 1) / 2);
  let mid = max - min;
  return (aux * mid) + min;
}

/**
 * Converts the action list into an object to be sent.
 *  @param {Array} alList 
 */
SmartTown.convertToSendable = function (alList) {
  SmartTown.ALDict = {};
  for (let i in alList) {
    let al = [];
    let actionsAr = alList[i].actions;
    for (let j in actionsAr) {
      let act = actionsAr[j];
      let action = { action: act.action };
      if (act.speed !== null && act.speed > 0) {
        action.params = "" + act.speed;
      }
      if (act.time !== null) {
        if (action.params) {
          action.params += " ";
        } else {
          action.params = "";
        }
        action.params += act.time;
      }
      if (act.emotion !== null) {
        action.emotion = act.emotion;
      }
      if (act.shouldAnswer !== null) {
        action.shouldAnswer = act.shouldAnswer;
      }
      if (act.emotionOriented !== null) {
        action.emotionOriented = act.emotionOriented;
      }

      if(action.emotionOriented){
        let speed = SmartTown.getSpeedFromEmotion(action.emotion);
        let emoAct = {action:"emotions", emotion:action.emotion, shouldAnswer:false, emotionOriented:false};
        let speedAct = {action:action.action, params:speed, shouldAnswer:true, emotionOriented:false};
        al.push(emoAct);
        al.push(speedAct);
      
      }else{
        al.push(action);

      }
    }
    SmartTown.ALDict[alList[i].name] = { name: alList[i].name, translatedName: alList[i].name, actions: al, conditions: alList[i].conditions };
  }
};

/**
 * Gets the actions form a gicen action list
 *  @param {String} alName 
 */
SmartTown.getActionsFromList = function (alName) {
  return SmartTown.ALDict[alName];
};


/** Opens the modal that displays the character dialog message. */
SmartTown.openCharacModal = function () {
  $('#new_charac_dialog').openModal({
    dismissible: false,
    opacity: .5,
    in_duration: 200,
    out_duration: 250
  });
};

/** Interprets and creates the character form the character form */
SmartTown.modalCharacOnSubmit = () => {
  const form = document.getElementById('new_char_form');
  let charac_name = form.elements["charac_name"];
  let charac_alias = form.elements["charac_alias"];
  let charac_ip = form.elements["charac_ip"];
  let charac_color = form.elements["charac_color"];
  let charac = { "charac_name": charac_name.value, "charac_alias": charac_alias.value, "charac_ip": charac_ip.value, "charac_color": charac_color.value };
  let valid = SmartTown.addCharacter(charac);
  if (!valid) {
    Ardublockly.materialAlert(Ardublockly.getLocalStr('characErrorTitle'), Ardublockly.getLocalStr('characErrorBody'), false);
  } else {
    var $newOpt = $("<option>").attr("value", charac.charac_alias).text(charac.charac_name)
    $("#charac").append($newOpt);
    $("#charac").trigger('contentChanged');
  }

}
/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Ajax calls to the Ardublockly Server python program.
 */
'use strict';

/** Create a name space for the application. */
var STServer = {};

/**
 * Reads JSON data from the server and forwards formatted JavaScript object.
 * @param {!string} url Location for the JSON data.
 */
STServer.getJson = function(url) {
  return STServer.sendRequest(url, 'GET', 'application/json', null);
};


/**
 * Sends JSON data to the STServer.
 * @param {!string} url Requestor URL.
 * @param {!string} json JSON string.
 */
 STServer.postJson = function(url, json ) {
  return STServer.sendRequest(url, 'POST', 'application/json', json);
};

/**
 * Sends a request to the Ardublockly Server that returns a JSON response.
 * @param {!string} url Requestor URL.
 * @param {!string} method HTTP method.
 * @param {!string} contentType HTTP content type.
 * @param {string} jsonObjSend JavaScript object to be parsed into JSON to send.
 */
STServer.sendRequest = function(
    url, method, contentType, jsonObjSend) {

      return new Promise(function (resolve, reject){
        var request = STServer.createRequest();

        // The data received is JSON, so it needs to be converted into the right
        // format to be displayed in the page.
        var onReady = function() {
          if (request.readyState == 4) {
            if (request.status == 200) {
              var jsonObjReceived = null;
              try {
                resolve(request.response);
                jsonObjReceived = JSON.parse(request.responseText);
              } catch(e) {
                console.error('Incorrectly formatted JSON data from ' + url);
                throw e;
              }
            } else {
              reject(request.status)
            }
          }
        };
      
        try {
          request.open(method, url, true);
          request.setRequestHeader('Content-type', contentType);
          request.onreadystatechange = onReady;
          request.send(JSON.stringify(jsonObjSend));
        } catch (e) {
          throw e;
        }
      });
 
};

/** @return {XMLHttpRequest} An XML HTTP Request multi-browser compatible. */
STServer.createRequest = function() {
  var request = null;
  try {
    // Firefox, Chrome, IE7+, Opera, Safari
    request = new XMLHttpRequest();
  }
  catch (e) {
    // IE6 and earlier
    try {
      request = new ActiveXObject('Msxml2.XMLHTTP');
    }
    catch (e) {
      try {
        request = new ActiveXObject('Microsoft.XMLHTTP');
      }
      catch (e) {
        throw 'Your browser does not support AJAX. You will not be able to' +
              'use all of Ardublockly features.';
        request = null;
      }
    }
  }
  return request;
};
/**
 * Requests the custom commands available in the ST Backend
 * @return {!string} JSON list with the given commands
 */
 STServer.requestCommands = async function() {
  return await STServer.getJson('http://127.0.0.1:8080/command/custom');
};

/**
 * Requests the Action Lists available in the ST Backend
 * @return {!string} JSON list with the given action lists
 */
STServer.requestActionLists = async function() {
  return await STServer.getJson('http://127.0.0.1:8080/actionList/all');
};

/**
 * Requests all the commands available in the ST Backend
 * @return {!string} JSON list with the given commands
 */
STServer.requestActions = async function() {
  return await STServer.getJson('http://127.0.0.1:8080/command/all');
};
/**
 * Requests the emotions available in the ST Backend
 * @return {!string} JSON list with the given emotions
 */
STServer.requestEmotions = async function() {
  return await STServer.getJson('http://127.0.0.1:8080/emotions/all');
};
/**
 * Requests the emotional config available in the ST Backend
 * @return {!string} JSON list with the given emotional config
 */
STServer.requestEmotionConf = async function() {
  return await STServer.getJson('http://127.0.0.1:8080/emotions/emoConfig/default');
};

/**
 * Sends the commands created in the low level to the ST Backend
 * @param {!Ardublockly.workspace} workspace Ardublockly workspace
 */
STServer.sendCommands = function(workspace) {
  let STCommandList = Blockly.SmartTown.allSTCommands(workspace)[0];
  for (let i = 0; i < STCommandList.length; i++) {
    let comName = STCommandList[i][0];
    let jsonObj = {id:-1, name:comName, conditions:Blockly.Arduino.STFunctionConditions_[comName]};
    STServer.sendCommand(jsonObj);
  }

};
/**
 * Sends a command created in the low level to the ST Backend
 */
STServer.sendCommand = function(json) {
  STServer.postJson('http://127.0.0.1:8080/command/new', json);
};

/**
 * Sends a new action list created in the middle level to the ST Backend
 * @return {!function} JSON list with the new command
 */
STServer.sendActionList = async function(json) {
  return await STServer.postJson('http://127.0.0.1:8080/actionList/new', json);
};

/**
 * Sends a new action list created in the middle level to the ST Backend. It handles error and success.
 * @param {!Ardublockly.workspace} workspace Ardublockly workspace
 * @param {!function} successHandler Success Handler
 * @param {!function} errorHandler Error Handler
 */
 STServer.sendActionLists = function(workspace, successHandler, errorHandler) {
  let STActionLists = Blockly.SmartTown.allSTAL(workspace);
  for (let i = 0; i < STActionLists.length; i++) {
    STServer.sendActionList(STActionLists[i]).then(function handle(response){
      successHandler(STActionLists[i].name);
    }).catch(function error(response){
      errorHandler(STActionLists[i].name);
    });
  }
};

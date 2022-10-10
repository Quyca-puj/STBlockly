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
 * @param {!function} jsonDataCb Callback with JSON object or null for error.
 */
STServer.getJson = function(url) {
  return STServer.sendRequest(url, 'GET', 'application/json', null);
};


/**
 * Sends JSON data to the STServer.
 * @param {!string} url Requestor URL.
 * @param {!string} json JSON string.
 * @param {!function} callback Request callback function.
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
 * @param {!function} cb Request callback function, takes a single input for a
 *     parsed JSON object.
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
 * Gets the current IDE setting from the Ardublockly Server settings. The new
 * settings menu for the IDE options is then processed into an HTML element
 * and sent to the callback function as an argument.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
 STServer.requestCommands = async function() {
  return await STServer.getJson('http://127.0.0.1:8080/command/custom');
};


STServer.requestActionLists = async function() {
  return await STServer.getJson('http://127.0.0.1:8080/actionList/all');
};


STServer.requestActionLists = async function() {
  return await STServer.getJson('http://127.0.0.1:8080/actionList/all');
};

STServer.requestActions = async function() {
  return await STServer.getJson('http://127.0.0.1:8080/command/all');
};

STServer.requestEmotions = async function() {
  return await STServer.getJson('http://127.0.0.1:8080/emotions/all');
};

STServer.requestEmotionConf = async function() {
  return await STServer.getJson('http://127.0.0.1:8080/emotions/emoConfig/default');
};


STServer.sendCommands = function(workspace) {
  let STCommandList = Blockly.SmartTown.allSTCommands(workspace)[0];
  for (let i = 0; i < STCommandList.length; i++) {
    let comName = STCommandList[i][0];
    let jsonObj = {id:-1, name:comName, conditions:Blockly.Arduino.STFunctionConditions_[comName]};
    STServer.sendCommand(jsonObj);
  }

};

STServer.sendCommand = function(json) {
  STServer.postJson('http://127.0.0.1:8080/command/new', json);
};


STServer.sendActionList = async function(json) {
  return await STServer.postJson('http://127.0.0.1:8080/actionList/new', json);
};


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

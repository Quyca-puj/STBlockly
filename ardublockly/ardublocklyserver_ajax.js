/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Ajax calls to the Ardublockly Server python program.
 */
'use strict';

/** Create a name space for the application. */
var ArdublocklyServer = {};
ArdublocklyServer.NO_RESPONSE_ACK = -1;
ArdublocklyServer.pause = false;

ArdublocklyServer.setPause = function(value){
  ArdublocklyServer.pause = value;
}
/**
 * Reads JSON data from the server and forwards formatted JavaScript object.
 * @param {!string} url Location for the JSON data.
 * @param {!function} jsonDataCb Callback with JSON object or null for error.
 */
ArdublocklyServer.getJson = function(url, callback) {
  ArdublocklyServer.sendRequest(url, 'GET', 'application/json', null, callback);
};

/**
 * Sends JSON data to the ArduBlocklyServer.
 * @param {!string} url Requestor URL.
 * @param {!string} json JSON string.
 * @param {!function} callback Request callback function.
 */
ArdublocklyServer.putJson = function(url, json, callback) {
  ArdublocklyServer.sendRequest(url, 'PUT', 'application/json', json, callback);
};

/**
 * Sends JSON data to the ArduBlocklyServer.
 * @param {!string} url Requestor URL.
 * @param {!string} json JSON string.
 * @param {!function} callback Request callback function.
 */
 ArdublocklyServer.postJson = async function(url, json) {
  return await ArdublocklyServer.sendRequestCustom(url, 'POST', 'application/json', json);
};


/**
 * Sends a request to the Ardubloockly Server that returns a JSON response.
 * @param {!string} url Requestor URL.
 * @param {!string} method HTTP method.
 * @param {!string} contentType HTTP content type.
 * @param {string} jsonObjSend JavaScript object to be parsed into JSON to send.
 * @param {!function} cb Request callback function, takes a single input for a
 *     parsed JSON object.
 */
ArdublocklyServer.sendRequest = async function(
    url, method, contentType, jsonObjSend, cb) {
  var request = ArdublocklyServer.createRequest();

  // The data received is JSON, so it needs to be converted into the right
  // format to be displayed in the page.
  var onReady = function() {
    if (request.readyState == 4) {
      if (request.status == 200) {
        var jsonObjReceived = null;
        try {
          jsonObjReceived = JSON.parse(request.responseText);
        } catch(e) {
          console.error('Incorrectly formatted JSON data from ' + url);
          throw e;
        }
        cb(jsonObjReceived);
      } else {
        // return a null element which will be dealt with in the front end
        cb(null);
      }
    }
  };

  try {
    request.open(method, url, true);
    request.setRequestHeader('Content-type', contentType);
    request.onreadystatechange = onReady;
    request.send(JSON.stringify(jsonObjSend));
  } catch (e) {
    // Nullify callback to indicate error
    cb(null);
    throw e;
  }
};


ArdublocklyServer.sendRequestCustom = async function(
  url, method, contentType, jsonObjSend) {
    return new Promise(function (resolve, reject){
      var request = ArdublocklyServer.createRequest();

      // The data received is JSON, so it needs to be converted into the right
      // format to be displayed in the page.
      var onReady = function() {
        if (request.readyState == 4) {
          if (request.status == 200) {
            try {
              resolve(request.response);
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
ArdublocklyServer.createRequest = function() {
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
 * Creates an HTML element based on the JSON data received from the server.
 * @param {!string} json_data A string containing the JSON data to be parsed.
 * @return {!element} An HTML element, which type depends on the JSON 'element'
 *                    key (currently only text input or drop down).
 */
ArdublocklyServer.jsonToIdeModal = function(jsonObj) {
  if (!jsonObj) return null;

  var elTitle = document.createElement('h4');
  elTitle.className = (jsonObj && jsonObj.success) ? 'arduino_dialog_success' :
                                                     'arduino_dialog_failure';
  var elStdOp = document.createElement('span');
  elStdOp.className = 'arduino_dialog_out';
  var elErrOp = document.createElement('span');
  elErrOp.className = 'arduino_dialog_out_error';

  // Add the Standard and Error outputs
  var ideData = jsonObj.ide_data;
  if (ideData && (ideData.std_output !== undefined) && 
      (ideData.err_output !== undefined)) {
    elStdOp.innerHTML = ideData.std_output.split('\n').join('<br />');
    elErrOp.innerHTML = ideData.err_output.split('\n').join('<br />');
  } else {
    console.error(jsonObj);
    console.error('The IDE out JSON response does not have valid "ide_data".');
  }

  if (jsonObj.errors) {
    // Prepare error message
    elTitle.innerHTML = Ardublockly.getLocalStr('arduinoOpErrorTitle');
    var errStr = [];
    for (var i = 0; i < jsonObj.errors.length; i++) {
      var errorContext = 'Unrecognised error.';
      try {
        errorContext = Ardublockly.getLocalStr(
            'arduinoOpErrorIdContext_' + jsonObj.errors[i].id);
      } catch (e) {
        // Swallow the exception, could be expanded to try to figure out issue
      }
      errStr.push('\nError id ' + jsonObj.errors[i].id + ': ' + errorContext);
    }
    elErrOp.innerHTML += '<br />' + errStr.join('<br />');
  } else if (jsonObj.success && jsonObj.ide_mode) {
    // Format a successful response
    if (jsonObj.ide_mode == 'upload') {
      elTitle.innerHTML = Ardublockly.getLocalStr('arduinoOpUploadedTitle');
    } else if (jsonObj.ide_mode == 'verify') {
      elTitle.innerHTML = Ardublockly.getLocalStr('arduinoOpVerifiedTitle');
    } else if (jsonObj.ide_mode == 'open') {
      elTitle.innerHTML = Ardublockly.getLocalStr('arduinoOpOpenedTitle');
      // This is a corner case where we also add to the stand out
      elStdOp.innerHTML += Ardublockly.getLocalStr('arduinoOpOpenedBody');
    } else {
      elTitle.innerHTML = Ardublockly.getLocalStr('arduinoOpErrorTitle');
    }
  } else {
    console.error(jsonObj);
    console.error('Unexpected response format, printed above.');
  }

  var element = document.createElement('div');
  element.appendChild(elTitle);
  element.appendChild(elStdOp);
  element.appendChild(elErrOp);
  return element;
};

ArdublocklyServer.jsonToHtmlTextInput = function(jsonObj) {
  var element = null;
  if (jsonObj) {
    // Simple text input
    element = document.createElement('input');
    element.setAttribute('type', 'text');
    element.style.cssText = '';
    if (jsonObj.errors) {
      element.setAttribute('value', '');
      element.style.cssText = 'border-bottom: 1px solid #f75c51;' +
                              'box-shadow: 0 1px 0 0 #d73c30;';
    } else {
      element.setAttribute('value', jsonObj.selected || '');
    }
  }
  return element;
};

ArdublocklyServer.jsonToHtmlDropdown = function(jsonObj) {
  var element = null;
  if (!jsonObj) {
    console.error('Invalid JSON received from server.');
  } else if(jsonObj.errors) {
    console.error('There are errors in the JSON response from server.');
    console.error(jsonObj);
  } else {
    // Drop down list of unknown length with a selected item
    element = document.createElement('select');
    element.name = jsonObj.settings_type;
    for (var i = 0; i < jsonObj.options.length; i++) {
      if (jsonObj.options[i].value && jsonObj.options[i].display_text) {
        var option = document.createElement('option');
        option.value = jsonObj.options[i].value;
        option.text = jsonObj.options[i].display_text;
        // Check selected option and mark it
        if (jsonObj.selected) {
          option.selected = jsonObj.options[i].value == jsonObj.selected;
        }
        element.appendChild(option);
      } else {
        console.error('Missing required JSON keys for Drop Down conversion.');
      }
    }
  }
  return element;
};

/**
 * Gets the current Compiler location from the ArdublocklyServer settings.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
ArdublocklyServer.requestCompilerLocation = function(callback) {
  ArdublocklyServer.getJson('/settings/compiler', callback);
};

/**
 * Sends a string to the Ardublockly Server for a the Arduino IDE executable
 * path.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
ArdublocklyServer.setCompilerLocation = function(new_path, callback) {
    ArdublocklyServer.putJson(
      '/settings/compiler', {"new_value": new_path}, callback);
};

/**
 * Gets the current Sketch location from the Ardublockly Server settings.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
ArdublocklyServer.requestSketchLocation = function(callback) {
   ArdublocklyServer.getJson('/settings/sketch', callback);
};

/**
 * Sends a string to the Ardublockly Server for a the Arduino sketch folder.
 * @param {!string} new_path New Sketch location path..
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
ArdublocklyServer.setSketchLocation = function(new_path, callback) {
  ArdublocklyServer.putJson(
      '/settings/sketch', {"new_value": new_path}, callback);
};

/**
 * Request to the Ardublockly Server to return JSON data containing all
 * available target Arduino Boards, and the selected one in the settings.
 * The data is then processed into an HTML element and sent to the callback
 * function as an argument.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
ArdublocklyServer.requestArduinoBoards = function(callback) {
  ArdublocklyServer.getJson('/settings/board', callback);
};

/**
 * Sends the inputted Arduino Board type to the Ardublockly Server Settings.
 * The new settings menu for the Board type is then processed into an HTML
 * element and sent to the callback function as an argument.
 * @param {!string} new_board Indicates which board has been selected.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
ArdublocklyServer.setArduinoBoard = function(new_board, callback) {
  ArdublocklyServer.putJson(
      '/settings/board', {"new_value": new_board}, callback);
};

/**
 * Request to the Ardublockly Server to return JSON data containing all
 * available serial ports in the computer, and the selected one in the
 * settings. The data is then processed into an HTML element and sent to the
 * callback function as an argument.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
ArdublocklyServer.requestSerialPorts = function(callback) {
  ArdublocklyServer.getJson('/settings/serial', callback);
};

/**
 * Sends the inputted Serial Port to the Ardublockly Server Settings. The new
 * settings menu for the Serial Port is then processed into an HTML element
 * and sent to the callback function as an argument.
 * @param {!string} new_port Indicates which port has been selected.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
ArdublocklyServer.setSerialPort = function(new_port, callback) {
  ArdublocklyServer.putJson(
      '/settings/serial', {"new_value": new_port}, callback);
};

/**
 * Gets the current IDE setting from the Ardublockly Server settings. The new
 * settings menu for the IDE options is then processed into an HTML element
 * and sent to the callback function as an argument.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
ArdublocklyServer.requestIdeOptions = function(callback) {
  ArdublocklyServer.getJson('/settings/ide', callback);
};

/**
 * Sends the inputted IDE option to the Ardublockly Server Settings. The new
 * settings menu for the IDE options is then processed into an HTML element
 * and sent to the callback function as an argument.
 * @param {!string} ide_option Indicates which option has been selected.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
ArdublocklyServer.setIdeOptions = function(ide_option, callback) {
  ArdublocklyServer.putJson(
      '/settings/ide', {"new_value": ide_option}, callback);
};


/**
 * Sends the Arduino code to the ArdublocklyServer to be processed as defined
 * by the settings.
 * @param {!string} code Arduino code in a single string format.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
ArdublocklyServer.sendSketchToServer = function(code, callback) {
  ArdublocklyServer.sendRequest(
      '/code', 'POST', 'application/json', {"sketch_code": code}, callback);
};


/**
 * Sends the Arduino code to the ArdublocklyServer to be processed as defined
 * by the settings.
 * @param {!string} code Arduino code in a single string format.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
 ArdublocklyServer.sendSTSketchToServer = function(code, robotSpec,callback) {
  ArdublocklyServer.sendRequest(
      '/code', 'POST', 'application/json', {"sketch_code": code,"robot_spec":robotSpec}, callback);
};

ArdublocklyServer.calibrate = function(ip, alias ,successHandler, errorHandler, workspace){
  ArdublocklyServer.ack =0 ;
  let json = {ip:ip,msg:alias+" calibration "+ ArdublocklyServer.ack, ack:ArdublocklyServer.ack};
  ArdublocklyServer.sendToRobot(json,null, workspace).then(function handle(response) {  
    let jsonObj = JSON.parse(response);
    if(jsonObj.success){
      successHandler();
    }else{
      let dataBack = ArdublocklyServer.jsonToIdeModal(jsonObj);
      errorHandler(dataBack);
    }
  });
}

//TODOL ENdpoint
ArdublocklyServer.calibrateMultiple = function(characObj ,successHandler, errorHandler, workspace){
  ArdublocklyServer.ack =0 ;
  ArdublocklyServer.calibrateRobots(characObj, workspace).then(function handle(response) {  
    let jsonObj = JSON.parse(response);
    if(jsonObj.success){
      successHandler();
    }else{
      let dataBack = ArdublocklyServer.jsonToIdeModal(jsonObj);
      errorHandler(dataBack);
    }
  });
}


ArdublocklyServer.startExecution = function (commandObj, workspace ,errorHandler){
  ArdublocklyServer.ack =0 ;
  ArdublocklyServer.actionPos =0 ;
  ArdublocklyServer.alPos =0 ;
  ArdublocklyServer.pause = false;
  ArdublocklyServer.commandList = commandObj.list;
  let ip = commandObj.ip;
  ArdublocklyUtils.traceOn(true,workspace);
  ArdublocklyServer.sendCommand(workspace, ip, errorHandler);
}

ArdublocklyServer.sendCommand = function(workspace, ip, errorHandler){
  if(!ArdublocklyServer.pause){
    if(ArdublocklyServer.commandList.length>ArdublocklyServer.actionPos){
      let ret = ArdublocklyServer.sendCommandToRobot(ip, false);
      ArdublocklyServer.sendToRobot(ret.json,ret.id, workspace).then(function handle(response) {  
        let jsonObj = JSON.parse(response);
        if(jsonObj.success){
          ArdublocklyServer.sendCommand(workspace, ip, errorHandler);
        }else{
          let dataBack = ArdublocklyServer.jsonToIdeModal(jsonObj);
          errorHandler(dataBack);
        }
      });
    }else{
      Ardublockly.largeIdeButtonSpinner(false);
    }
  } 

}
ArdublocklyServer.getCommand = function(isList){
  let command;
  if(isList){
      command=ArdublocklyServer.commandList[ArdublocklyServer.actionPos].actions[ArdublocklyServer.alPos];
      ArdublocklyServer.alPos++;
      if(ArdublocklyServer.alPos>=ArdublocklyServer.commandList[ArdublocklyServer.actionPos].actions.length){
        ArdublocklyServer.actionPos++;
        ArdublocklyServer.alPos=0;
      }
    }else{
      command = ArdublocklyServer.commandList[ArdublocklyServer.actionPos];
    }

  return command;
};

ArdublocklyServer.sendCommandToRobot= function (ip, isList){
  let json;
  let command= ArdublocklyServer.getCommand(isList);

  switch(command.type){
    case SmartTownUtils.BASE_COMMAND:
        json = {ip:ip,msg:command.command +" "+ ArdublocklyServer.ack, ack:ArdublocklyServer.ack};
        json={json:json, id: command.id};
        ArdublocklyServer.ack++ ;
      break;
    case SmartTownUtils.EMOTION_COMMAND:
      json = {ip:ip,msg:command.command +" "+ ArdublocklyServer.ack,emomsg:command.emotion+" "+ ArdublocklyServer.NO_RESPONSE_ACK, ack:ArdublocklyServer.ack};
      json={json:json, id: command.id};
      ArdublocklyServer.ack++ ;
      break;
      case SmartTownUtils.JUST_EMOTION_COMMAND:
        json = {ip:ip,emomsg:command.emotion+" "+ ArdublocklyServer.NO_RESPONSE_ACK};
        json={json:json, id: command.id};
        break;
    case SmartTownUtils.ACTIONLIST_COMMAND:
      isList=true;
      json = ArdublocklyServer.sendCommandToRobot(ip, true);
      break;
  }
  if(!isList){
    ArdublocklyServer.actionPos++;
  }

  return json;
}

ArdublocklyServer.sendToRobot = async function(json, id, workspace) {
  ArdublocklyUtils.highlightBlock(id, workspace);
  return await ArdublocklyServer.postJson('/robot/send', {action:json});
};

ArdublocklyServer.calibrateRobots = async function(json, id, workspace) {
  return await ArdublocklyServer.postJson('/robot/calibrateAll', {actions:json});
};


ArdublocklyServer.sendPetriNet = async function(characInfo,net) {
  return await ArdublocklyServer.postJson('/play/executeNet', {characters:characInfo,net:net});
};

ArdublocklyServer.pausePetriNet = async function() {
  return await ArdublocklyServer.postJson('/play/pauseNet', null);
};

ArdublocklyServer.stopPetriNet = async function() {
  return await ArdublocklyServer.postJson('/play/stopNet', null);
};


ArdublocklyServer.resumePetriNet = async function() {
  return await ArdublocklyServer.postJson('/play/resumeNet', null);
};



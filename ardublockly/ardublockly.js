/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
'use strict';

/** Create a namespace for the application. */
var Ardublockly = Ardublockly || {};
Ardublockly.calibrated = false;
Ardublockly.inExec = false;
/** Initialize function for Ardublockly, to be called on page load. */
Ardublockly.init = function () {
  // Lang init must run first for the rest of the page to pick the right msgs
  Ardublockly.initLanguage();
  STServer.requestEmotions().then(function handle(list) {
    SmartTown.setEmotions(JSON.parse(list));
  });

  STServer.requestEmotionConf().then(function handle(list) {
    SmartTown.setEmotionConf(JSON.parse(list));
  });
  // Inject Blockly into content_blocks and fetch additional blocks
  Ardublockly.injectBlockly(document.getElementById('content_blocks'), Ardublockly.TOOLBOX_ARDUINO_XML, '../blockly/');
  Ardublockly.importExtraBlocks();

  Ardublockly.designJsInit();
  Ardublockly.initialiseIdeButtons();

  Ardublockly.bindDesignEventListeners();
  Ardublockly.bindActionFunctions();
  Ardublockly.bindBlocklyEventListeners();

  // Hackish way to check if not running locally
  if (document.location.hostname != 'localhost') {
    Ardublockly.openNotConnectedModal();
    console.log('Offline app modal opened as non localhost host name found: ' +
      document.location.hostname)
  }
  $("#lang").trigger("change");

};

/** Binds functions to each of the buttons, nav links, and related. */
Ardublockly.bindActionFunctions = function () {
  // Navigation buttons
  Ardublockly.bindClick_('button_load', Ardublockly.loadUserXmlFile);
  Ardublockly.bindClick_('button_save', Ardublockly.saveXmlFile);

  // Side menu buttons, they also close the side menu
  Ardublockly.bindClick_('menu_load', function () {
    Ardublockly.loadUserXmlFile();
    $('.button-collapse').sideNav('hide');
  });
  Ardublockly.bindClick_('menu_save', function () {
    Ardublockly.saveXmlFile();
    $('.button-collapse').sideNav('hide');
  });
  Ardublockly.bindClick_('menu_delete', function () {
    Ardublockly.discardAllBlocks(false);
    $('.button-collapse').sideNav('hide');
  });
  Ardublockly.bindClick_('menu_settings', function () {
    Ardublockly.openSettings();
    $('.button-collapse').sideNav('hide');
  });
  Ardublockly.bindClick_('menu_example_1', function () {
    Ardublockly.loadServerXmlFile('../examples/blink.xml');
    $('.button-collapse').sideNav('hide');
  });
  Ardublockly.bindClick_('menu_example_2', function () {
    Ardublockly.loadServerXmlFile('../examples/serial_print_ascii.xml');
    $('.button-collapse').sideNav('hide');
  });
  Ardublockly.bindClick_('menu_example_3', function () {
    Ardublockly.loadServerXmlFile('../examples/serial_repeat_game.xml');
    $('.button-collapse').sideNav('hide');
  });
  Ardublockly.bindClick_('menu_example_4', function () {
    Ardublockly.loadServerXmlFile('../examples/servo_knob.xml');
    $('.button-collapse').sideNav('hide');
  });
  Ardublockly.bindClick_('menu_example_5', function () {
    Ardublockly.loadServerXmlFile('../examples/stepper_knob.xml');
    $('.button-collapse').sideNav('hide');
  });

  // Floating buttons
  Ardublockly.bindClick_('button_ide_large', function () {
    Ardublockly.ideButtonLargeAction();
  });
  Ardublockly.bindClick_('button_ide_middle', function () {
    Ardublockly.ideButtonMiddleAction();
  });
  Ardublockly.bindClick_('button_ide_left', function () {
    Ardublockly.ideButtonLeftAction();
  });

  //Node modals
  //Opens the new character modal
  Ardublockly.bindClick_('button_ide_char', function () {
    SmartTown.openCharacModal();
  });

  //Adds a new node to the workspace.

  Ardublockly.bindClick_('button_ide_node', function () {
    SmartTown.addNewNode();
  });
  //Deletes the selected node from the workspace.
  Ardublockly.bindClick_('button_ide_del_node', function () {
    SmartTown.deleteSelectedNode();
  });


  Ardublockly.bindClick_('button_load_xml', Ardublockly.XmlTextareaToBlocks);
  Ardublockly.bindClick_('button_toggle_toolbox', Ardublockly.toogleToolbox);

  // Settings modal input field listeners only if they can be edited
  var settingsPathInputListeners = function (elId, setValFunc, setHtmlCallback) {
    var el = document.getElementById(elId);
    if (el.readOnly === false) {
      // Event listener that send the data when the user presses 'Enter'
      el.onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
          setValFunc(el.value, function (jsonObj) {
            setHtmlCallback(ArdublocklyServer.jsonToHtmlTextInput(jsonObj));
          });
          return false;
        }
      };
      // Event listener that send the data when moving out of the input field
      el.onblur = function () {
        setValFunc(el.value, function (jsonObj) {
          setHtmlCallback(ArdublocklyServer.jsonToHtmlTextInput(jsonObj));
        });
      };
    }
  };
  settingsPathInputListeners('settings_compiler_location',
    ArdublocklyServer.setCompilerLocation,
    Ardublockly.setCompilerLocationHtml);
  settingsPathInputListeners('settings_sketch_location',
    ArdublocklyServer.setSketchLocationHtml,
    Ardublockly.setSketchLocationHtml);
};

/** Sets the Ardublockly server IDE setting to upload and sends the code. */
Ardublockly.ideSendUpload = function () {
  // Check if this is the currently selected option before edit sever setting
  if (Ardublockly.ideButtonLargeAction !== Ardublockly.ideSendUpload) {
    Ardublockly.showExtraIdeButtons(false);
    Ardublockly.setIdeSettings(null, 'upload');
  }
  switch (Ardublockly.selected_language) {
    case "arduino":
      Ardublockly.shortMessage(Ardublockly.getLocalStr('uploadingSketch'));
      Ardublockly.resetIdeOutputContent();
      Ardublockly.sendCode();
      STServer.sendCommands(Ardublockly.workspace);
      break;
    case "exec":
      Ardublockly.shortMessage(Ardublockly.getLocalStr('executeCommands'));
      Ardublockly.resetIdeOutputContent();
      break;

    case "exec_net":
      Ardublockly.shortMessage(Ardublockly.getLocalStr('executeCommands'));
      Ardublockly.resetIdeOutputContent();
      Ardublockly.startNetExecution();
      break;
    case "middle":
      Ardublockly.shortMessage(Ardublockly.getLocalStr('uploadingCommands'));
      Ardublockly.resetIdeOutputContent();
      STServer.sendActionLists(Ardublockly.workspace, Ardublockly.successALHandler, Ardublockly.errorAlHandler);
      break;
  }

};

/** Success Handler for the creation of an action list*/
Ardublockly.successALHandler = function (name) {
  Ardublockly.MaterialToast(name + Ardublockly.getLocalStr('sucALToast'));
}
/** Error Handler for the creation of an action list*/
Ardublockly.errorAlHandler = function (name) {
  Ardublockly.MaterialToast(Ardublockly.getLocalStr('errALToast') + name);
}

/** Error Handler for arduino related actions*/
Ardublockly.errorHandler = function (response) {
  Ardublockly.calibrated = false;
  Ardublockly.largeIdeButtonSpinner(false);
  Ardublockly.MaterialToast(Ardublockly.getLocalStr('checkErrorMsg'));
  if (response === null) return Ardublockly.openNotConnectedModal();
  Ardublockly.arduinoIdeOutput(response);
};

/** It sends a calibration request to a single character*/
Ardublockly.calibrate = function () {
  Ardublockly.generateExec(Ardublockly.workspace);
  let commandObj = Ardublockly.execCommandsToList();
  ArdublocklyServer.calibrate(commandObj.ip, commandObj.alias, Ardublockly.successCalibration, Ardublockly.errorHandler, Ardublockly.workspace);
}

/** It sends a calibration request to multiple character*/
Ardublockly.calibrateMultiple = function () {
  let characObj = SmartTown.getActiveCharacters();
  ArdublocklyServer.calibrateMultiple(characObj, Ardublockly.successCalibration, Ardublockly.errorHandler);
}

/** It starts the command execution for a single character*/
Ardublockly.startExecution = function () {

  ArdublocklyServer.setPause(false);
  Ardublockly.generateExec(Ardublockly.workspace);
  if (!Ardublockly.calibrated) {
    Ardublockly.materialAlert(Ardublockly.getLocalStr('noCalibrationTitle'), Ardublockly.getLocalStr('noCalibrationBody'), false);
  } else {
    let commandObj = Ardublockly.execCommandsToList();
    if (commandObj) {
      Ardublockly.inExec = true;
      Ardublockly.largeIdeButtonSpinner(true, Ardublockly.inExec);
      ArdublocklyServer.startExecution(commandObj, Ardublockly.workspace, Ardublockly.errorHandler);
    } else {
      Ardublockly.materialAlert(Ardublockly.getLocalStr('notSetExecAlertTitle'), Ardublockly.getLocalStr('notSetExecAlertBody'), false);
    }
  }

};

/** It starts the command execution for multiple characters*/
Ardublockly.startNetExecution = function () {
  //if not in execution start execution, else pause execution.
  if (!Ardublockly.inExec) {
    ArdublocklyServer.setPause(false);
    //If net is not active, start execution. Else resume net.
    if (!Ardublockly.activeNet) {
      //check for robot calibration.
      if (!Ardublockly.calibrated) {
        Ardublockly.materialAlert(Ardublockly.getLocalStr('noNetCalibrationTitle'), Ardublockly.getLocalStr('noNetCalibrationBody'), false);
      } else {

        // If there are nodes created, send the graph and the active characters to the backend.
        //else show alert.
        if(SmartTown.graph.order>0){
          let commandObj = SmartTown.exportGraph();
          let characObj = SmartTown.getActiveCharacters();
          if (commandObj) {
            Ardublockly.inExec = true;
            Ardublockly.activeNet = true;
            Ardublockly.largeIdeButtonSpinner(true, Ardublockly.inExec);
            ArdublocklyServer.sendPetriNet(characObj, commandObj);
          } else {
            Ardublockly.materialAlert(Ardublockly.getLocalStr('notSetExecAlertTitle'), Ardublockly.getLocalStr('notSetExecAlertBody'), false);
          }
        }else{
          Ardublockly.materialAlert(Ardublockly.getLocalStr('noNetNodesTitle'), Ardublockly.getLocalStr('noNetNodesBody'), false);
        }
      }
    } else {
      Ardublockly.resumeNetExecution();
    }
  } else {
    Ardublockly.pauseNetExecution();
  }
};

/**
 * It resumes the net execution.
 */
Ardublockly.resumeNetExecution = function () {
  ArdublocklyServer.resumePetriNet().then(function handle(response) {
    Ardublockly.inExec = true;
    Ardublockly.largeIdeButtonSpinner(true, Ardublockly.inExec);
    let jsonObj = JSON.parse(response);
    if (jsonObj) {
      Ardublockly.MaterialToast("Volviendo a ejecutar el guion");
    }
  });
}


/**
 * It pauses the net execution.
 */
Ardublockly.pauseNetExecution = function () {
  ArdublocklyServer.pausePetriNet().then(function handle(response) {
    Ardublockly.largeIdeButtonSpinner(false, Ardublockly.inExec);
    Ardublockly.inExec = false;
    let jsonObj = JSON.parse(response);
    if (jsonObj) {
      Ardublockly.MaterialToast("Se pausó el guion exitósamente");
    }
  });
}


/**
 * It stops the net execution.
 */
Ardublockly.stopNetExecution = function () {
  ArdublocklyServer.stopPetriNet().then(function handle(response) {
    Ardublockly.inExec = false;
    Ardublockly.activeNet = false;
    let jsonObj = JSON.parse(response);
    if (jsonObj) {
      Ardublockly.MaterialToast("Se detuvo el guion exitósamente");
    }
  });
}


/** Sets the Ardublockly server IDE setting to verify and sends the code. */
Ardublockly.ideSendVerify = function () {
  // Check if this is the currently selected option before edit sever setting
  if (Ardublockly.ideButtonLargeAction !== Ardublockly.ideSendVerify) {
    Ardublockly.showExtraIdeButtons(false);
    Ardublockly.setIdeSettings(null, 'verify');
  }
  switch (Ardublockly.selected_language) {
    case "arduino":
      Ardublockly.shortMessage(Ardublockly.getLocalStr('verifyingSketch'));
      Ardublockly.resetIdeOutputContent();
      Ardublockly.sendCode();
      break;
    case "exec":
      Ardublockly.shortMessage(Ardublockly.getLocalStr('pauseCommands'));
      Ardublockly.resetIdeOutputContent();
      Ardublockly.largeIdeButtonSpinner(false)
      ArdublocklyServer.setPause(true); //TODOL pasar a pasue net
      break;
    case "exec_net":
      Ardublockly.shortMessage(Ardublockly.getLocalStr('pauseCommands'));
      Ardublockly.resetIdeOutputContent();
      Ardublockly.largeIdeButtonSpinner(false);
      Ardublockly.stopNetExecution();
      break;
  }
};

/** Sets the Ardublockly server IDE setting to open and sends the code. */
Ardublockly.ideSendOpen = function () {
  // Check if this is the currently selected option before edit sever setting
  if (Ardublockly.ideButtonLargeAction !== Ardublockly.ideSendOpen) {
    Ardublockly.showExtraIdeButtons(false);
    Ardublockly.setIdeSettings(null, 'open');
  }

  switch (Ardublockly.selected_language) {
    case "arduino":
      Ardublockly.shortMessage(Ardublockly.getLocalStr('openingSketch'));
      Ardublockly.resetIdeOutputContent();
      Ardublockly.sendCode();
      break;
    case "exec":
      Ardublockly.shortMessage(Ardublockly.getLocalStr('calibrateToast'));
      Ardublockly.resetIdeOutputContent();
      Ardublockly.largeIdeButtonSpinner(false)
      Ardublockly.calibrate();
      break;
    case "exec_net":
      Ardublockly.shortMessage(Ardublockly.getLocalStr('calibrateToast'));
      Ardublockly.resetIdeOutputContent();
      Ardublockly.largeIdeButtonSpinner(false)
      Ardublockly.calibrateMultiple();
      break;
  }

};
/**
 * Calibration success callback.
 */
Ardublockly.successCalibration = function () {
  Ardublockly.calibrated = true;
  Ardublockly.MaterialToast(Ardublockly.getLocalStr('sucCalibrateToast'));
}

/** Function bound to the left IDE button, to be changed based on settings. */
Ardublockly.ideButtonLargeAction = Ardublockly.ideSendUpload;

/** Function bound to the middle IDE button, to be changed based on settings. */
Ardublockly.ideButtonMiddleAction = Ardublockly.ideSendVerify;

/** Function bound to the large IDE button, to be changed based on settings. */
Ardublockly.ideButtonLeftAction = Ardublockly.ideSendOpen;

/** Initialises the IDE buttons with the default option from the server. */
Ardublockly.initialiseIdeButtons = function () {
  document.getElementById('button_ide_left').title =
    Ardublockly.getLocalStr('openSketch');
  document.getElementById('button_ide_middle').title =
    Ardublockly.getLocalStr('verify');
  document.getElementById('button_ide_large').title =
    Ardublockly.getLocalStr('upload');
  // ArdublocklyServer.requestIdeOptions(function (jsonObj) {
  //   if (jsonObj != null) {
  //     Ardublockly.changeIdeButtons(jsonObj.selected);
  //   } // else Null: Ardublockly server is not running, do nothing
  // });
};

/**
 * Changes the IDE launch buttons based on the option indicated in the argument.
 * @param {!string} value One of the 3 possible values from the drop down select
 *     in the settings modal: 'upload', 'verify', or 'open'.
 */
Ardublockly.changeIdeButtons = function (value) {
  var largeButton = document.getElementById('button_ide_large');
  var middleButton = document.getElementById('button_ide_middle');
  var leftButton = document.getElementById('button_ide_left');
  var openTitle = Ardublockly.getLocalStr('openSketch');
  var verifyTitle = Ardublockly.getLocalStr('verify');
  var uploadTitle = Ardublockly.getLocalStr('upload');
  switch (Ardublockly.selected_language) {
    case "arduino":
      if (value === 'upload') {
        Ardublockly.changeIdeButtonsDesign('upload');
        Ardublockly.ideButtonLeftAction = Ardublockly.ideSendOpen;
        Ardublockly.ideButtonMiddleAction = Ardublockly.ideSendVerify;
        Ardublockly.ideButtonLargeAction = Ardublockly.ideSendUpload;
        leftButton.title = openTitle;
        middleButton.title = verifyTitle;
        largeButton.title = uploadTitle;
      } else if (value === 'verify') {
        Ardublockly.changeIdeButtonsDesign('upload');
        Ardublockly.ideButtonLeftAction = Ardublockly.ideSendOpen;
        Ardublockly.ideButtonMiddleAction = Ardublockly.ideSendVerify;
        Ardublockly.ideButtonLargeAction = Ardublockly.ideSendUpload;
        leftButton.title = openTitle;
        middleButton.title = verifyTitle;
        largeButton.title = uploadTitle;
      } else if (value === 'open') {
        Ardublockly.changeIdeButtonsDesign('upload');
        Ardublockly.ideButtonLeftAction = Ardublockly.ideSendOpen;
        Ardublockly.ideButtonMiddleAction = Ardublockly.ideSendVerify;
        Ardublockly.ideButtonLargeAction = Ardublockly.ideSendUpload;
        leftButton.title = openTitle;
        middleButton.title = verifyTitle;
        largeButton.title = uploadTitle;
      }
      break;
    case "exec":
      if (value === 'upload') {
        Ardublockly.changeIdeButtonsDesign('upload');
        Ardublockly.ideButtonLeftAction = Ardublockly.ideSendOpen;
        Ardublockly.ideButtonMiddleAction = Ardublockly.ideSendVerify;
        Ardublockly.ideButtonLargeAction = Ardublockly.ideSendUpload;
        leftButton.title = Ardublockly.getLocalStr('calibrateMsg');
        middleButton.title = Ardublockly.getLocalStr('pauseCommands');
        largeButton.title = Ardublockly.getLocalStr('executeCommands');
      } else if (value === 'verify') {
        Ardublockly.changeIdeButtonsDesign('upload');
        Ardublockly.ideButtonLeftAction = Ardublockly.ideSendOpen;
        Ardublockly.ideButtonMiddleAction = Ardublockly.ideSendVerify;
        Ardublockly.ideButtonLargeAction = Ardublockly.ideSendUpload;
        leftButton.title = Ardublockly.getLocalStr('calibrateMsg');
        middleButton.title = Ardublockly.getLocalStr('pauseCommands');
        largeButton.title = Ardublockly.getLocalStr('executeCommands');
      } else if (value === 'open') {
        Ardublockly.changeIdeButtonsDesign('upload');
        Ardublockly.ideButtonLeftAction = Ardublockly.ideSendOpen;
        Ardublockly.ideButtonMiddleAction = Ardublockly.ideSendVerify;
        Ardublockly.ideButtonLargeAction = Ardublockly.ideSendUpload;
        leftButton.title = Ardublockly.getLocalStr('calibrateMsg');
        middleButton.title = Ardublockly.getLocalStr('pauseCommands');
        largeButton.title = Ardublockly.getLocalStr('executeCommands');
      }
      break;
  }
};

/**
 * Loads an XML file from the server and replaces the current blocks into the
 * Blockly workspace.
 * @param {!string} xmlFile Server location of the XML file to load.
 */
Ardublockly.loadServerXmlFile = function (xmlFile) {
  var loadXmlfileAccepted = function () {
    // loadXmlBlockFile loads the file asynchronously and needs a callback
    var loadXmlCb = function (sucess) {
      if (sucess) {
        Ardublockly.renderContent();
      } else {
        Ardublockly.alertMessage(
          Ardublockly.getLocalStr('invalidXmlTitle'),
          Ardublockly.getLocalStr('invalidXmlBody'),
          false);
      }
    };
    var connectionErrorCb = function () {
      Ardublockly.openNotConnectedModal();
    };
    Ardublockly.loadXmlBlockFile(xmlFile, loadXmlCb, connectionErrorCb);
  };

  if (Ardublockly.isWorkspaceEmpty()) {
    loadXmlfileAccepted();
  } else {
    Ardublockly.alertMessage(
      Ardublockly.getLocalStr('loadNewBlocksTitle'),
      Ardublockly.getLocalStr('loadNewBlocksBody'),
      true, loadXmlfileAccepted);
  }
};

/**
 * Loads an XML file from the users file system and adds the blocks into the
 * Blockly workspace.
 */
Ardublockly.loadUserXmlFile = function () {
  // Create File Reader event listener function
  switch (Ardublockly.selected_language) {
    case "arduino":
    case "middle":
    case "exec":
      var parseInputXMLfile = function (e) {
        var xmlFile = e.target.files[0];
        var filename = xmlFile.name;
        var extensionPosition = filename.lastIndexOf('.');
        if (extensionPosition !== -1) {
          filename = filename.substr(0, extensionPosition);
        }

        var reader = new FileReader();
        reader.onload = function () {
          var success = Ardublockly.replaceBlocksfromXml(reader.result);
          if (success) {
            Ardublockly.renderContent();
            Ardublockly.sketchNameSet(filename);
          } else {
            Ardublockly.alertMessage(
              Ardublockly.getLocalStr('invalidXmlTitle'),
              Ardublockly.getLocalStr('invalidXmlBody'),
              false);
          }
        };
        reader.readAsText(xmlFile);
      };

      // Create once invisible browse button with event listener, and click it
      var selectFile = document.getElementById('select_file');
      if (selectFile === null) {
        var selectFileDom = document.createElement('INPUT');
        selectFileDom.type = 'file';
        selectFileDom.id = 'select_file';

        var selectFileWrapperDom = document.createElement('DIV');
        selectFileWrapperDom.id = 'select_file_wrapper';
        selectFileWrapperDom.style.display = 'none';
        selectFileWrapperDom.appendChild(selectFileDom);

        document.body.appendChild(selectFileWrapperDom);
        selectFile = document.getElementById('select_file');
        selectFile.addEventListener('change', parseInputXMLfile, false);
      }
      selectFile.click();
      break;

    case "exec_net":
      var parseInputGraphFileJSON = function (e) {
        var graphFile = e.target.files[0];
        var filename = graphFile.name;
        var extensionPosition = filename.lastIndexOf('.');
        if (extensionPosition !== -1) {
          filename = filename.substr(0, extensionPosition);
        }

        var reader = new FileReader();
        reader.onload = function () {
          SmartTown.graph.clear();
          let save = JSON.parse(reader.result);
          const graph = SmartTown.graph.import(save['graph']);
          SmartTown.characters = save['characters']
          SmartTown.startSigma(graph);
        };
        reader.readAsText(graphFile);
        e.target.value = '';
      };

      // Create once invisible browse button with event listener, and click it
      var selectFile = document.getElementById('select_file_json');
      if (selectFile === null) {
        var selectFileDom = document.createElement('INPUT');
        selectFileDom.type = 'file';
        selectFileDom.id = 'select_file_json';

        var selectFileWrapperDom = document.createElement('DIV');
        selectFileWrapperDom.id = 'select_file_wrapper_json';
        selectFileWrapperDom.style.display = 'none';
        selectFileWrapperDom.appendChild(selectFileDom);

        document.body.appendChild(selectFileWrapperDom);
        selectFile = document.getElementById('select_file_json');
        selectFile.addEventListener('change', parseInputGraphFileJSON, false);

      }

      selectFile.click();

      break;
  }

};

/**
 * Creates an XML file containing the blocks from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
Ardublockly.saveXmlFile = function () {
  switch (Ardublockly.selected_language) {
    case "arduino":
    case "middle":
    case "exec":
      Ardublockly.saveTextFileAs(
        document.getElementById('sketch_name').value + '.xml',
        Ardublockly.generateXml());
      break;
    case "exec_net":
      let save = { "graph": SmartTown.exportGraph(), "characters": SmartTown.characters };
      Ardublockly.saveTextFileAs(
        document.getElementById('sketch_name').value + '.json',
        JSON.stringify(save)
      );
      break;
  }
};

/**
 * Creates an Arduino Sketch file containing the Arduino code generated from
 * the Blockly workspace and prompts the users to save it into their local file
 * system.
 */
Ardublockly.saveSketchFile = function () {
  Ardublockly.saveTextFileAs(
    document.getElementById('sketch_name').value + '.ino',
    Ardublockly.generateArduino());
};

/**
 * Creates an text file with the input content and files name, and prompts the
 * users to save it into their local file system.
 * @param {!string} fileName Name for the file to be saved.
 * @param {!string} content Text datd to be saved in to the file.
 */
Ardublockly.saveTextFileAs = function (fileName, content) {
  var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, fileName);
};



/**
 * Retrieves the Settings from ArdublocklyServer to populates the form data
 * and opens the Settings modal dialog.
 */
Ardublockly.openSettings = function () {
  ArdublocklyServer.requestCompilerLocation(function (jsonObj) {
    Ardublockly.setCompilerLocationHtml(
      ArdublocklyServer.jsonToHtmlTextInput(jsonObj));
  });
  ArdublocklyServer.requestSketchLocation(function (jsonObj) {
    Ardublockly.setSketchLocationHtml(
      ArdublocklyServer.jsonToHtmlTextInput(jsonObj));
  });
  ArdublocklyServer.requestArduinoBoards(function (jsonObj) {
    Ardublockly.setArduinoBoardsHtml(
      ArdublocklyServer.jsonToHtmlDropdown(jsonObj));
  });
  ArdublocklyServer.requestSerialPorts(function (jsonObj) {
    Ardublockly.setSerialPortsHtml(
      ArdublocklyServer.jsonToHtmlDropdown(jsonObj));
  });
  ArdublocklyServer.requestIdeOptions(function (jsonObj) {
    Ardublockly.setIdeHtml(ArdublocklyServer.jsonToHtmlDropdown(jsonObj));
  });
  // Language menu only set on page load within Ardublockly.initLanguage()
  Ardublockly.openSettingsModal();
};

/**
 * Sets the compiler location form data retrieve from an updated element.
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
Ardublockly.setCompilerLocationHtml = function (newEl) {
  if (newEl === null) return Ardublockly.openNotConnectedModal();

  var compLocIp = document.getElementById('settings_compiler_location');
  if (compLocIp != null) {
    compLocIp.value = newEl.value || compLocIp.value ||
      'Please enter the location of the Arduino IDE executable';
    compLocIp.style.cssText = newEl.style.cssText;
  }
};

/**
 * Sets the sketch location form data retrieve from an updated element.
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
Ardublockly.setSketchLocationHtml = function (newEl) {
  if (newEl === null) return Ardublockly.openNotConnectedModal();

  var sketchLocIp = document.getElementById('settings_sketch_location');
  if (sketchLocIp != null) {
    sketchLocIp.value = newEl.value || sketchLocIp.value ||
      'Please enter a folder to store the Arduino Sketch';
    sketchLocIp.style.cssText = newEl.style.cssText;
  }
};

/**
 * Replaces the Arduino Boards form data with a new HTMl element.
 * Ensures there is a change listener to call 'setSerialPort' function
 * @param {element} jsonObj JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
Ardublockly.setArduinoBoardsHtml = function (newEl) {
  if (newEl === null) return Ardublockly.openNotConnectedModal();

  var boardDropdown = document.getElementById('board');
  if (boardDropdown !== null) {
    // Restarting the select elements built by materialize
    $('select').material_select('destroy');
    newEl.name = 'settings_board';
    newEl.id = 'board';
    newEl.onchange = Ardublockly.setBoard;
    boardDropdown.parentNode.replaceChild(newEl, boardDropdown);
    // Refresh the materialize select menus
    $('select').material_select();
  }
};

/**
 * Sets the Arduino Board type with the selected user input from the drop down.
 */
Ardublockly.setBoard = function () {
  var el = document.getElementById('board');
  var boardValue = el.options[el.selectedIndex].value;
  ArdublocklyServer.setArduinoBoard(boardValue, function (jsonObj) {
    var newEl = ArdublocklyServer.jsonToHtmlDropdown(jsonObj);
    Ardublockly.setArduinoBoardsHtml(newEl);
  });
  Ardublockly.changeBlocklyArduinoBoard(
    boardValue.toLowerCase().replace(/ /g, '_'));
};

/**
 * Replaces the Serial Port form data with a new HTMl element.
 * Ensures there is a change listener to call 'setSerialPort' function
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
Ardublockly.setSerialPortsHtml = function (newEl) {
  if (newEl === null) return Ardublockly.openNotConnectedModal();

  var serialDropdown = document.getElementById('serial_port');
  if (serialDropdown !== null) {
    // Restarting the select elements built by materialize
    $('select').material_select('destroy');
    newEl.name = 'settings_serial';
    newEl.id = 'serial_port';
    newEl.onchange = Ardublockly.setSerial;
    serialDropdown.parentNode.replaceChild(newEl, serialDropdown);
    // Refresh the materialize select menus
    $('select').material_select();
  }
};

/** Sets the Serial Port with the selected user input from the drop down. */
Ardublockly.setSerial = function () {
  var el = document.getElementById('serial_port');
  var serialValue = el.options[el.selectedIndex].value;
  ArdublocklyServer.setSerialPort(serialValue, function (jsonObj) {
    var newEl = ArdublocklyServer.jsonToHtmlDropdown(jsonObj);
    Ardublockly.setSerialPortsHtml(newEl);
  });
};

/**
 * Replaces IDE options form data with a new HTMl element.
 * Ensures there is a change listener to call 'setIdeSettings' function
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
Ardublockly.setIdeHtml = function (newEl) {
  if (newEl === null) return Ardublockly.openNotConnectedModal();

  var ideDropdown = document.getElementById('ide_settings');
  if (ideDropdown !== null) {
    // Restarting the select elements built by materialize
    $('select').material_select('destroy');
    newEl.name = 'settings_ide';
    newEl.id = 'ide_settings';
    newEl.onchange = Ardublockly.setIdeSettings;
    ideDropdown.parentNode.replaceChild(newEl, ideDropdown);
    // Refresh the materialize select menus
    $('select').material_select();
  }
};

/**
 * Sets the IDE settings data with the selected user input from the drop down.
 * @param {Event} e Event that triggered this function call. Required for link
 *     it to the listeners, but not used.
 * @param {string} preset A value to set the IDE settings bypassing the drop
 *     down selected value. Valid data: 'upload', 'verify', or 'open'.
 */
Ardublockly.setIdeSettings = function (e, preset) {
  if (preset !== undefined) {
    var ideValue = preset;
  } else {
    var el = document.getElementById('ide_settings');
    var ideValue = el.options[el.selectedIndex].value;
  }
  Ardublockly.changeIdeButtons('upload');
  ArdublocklyServer.setIdeOptions(ideValue, function (jsonObj) {
    Ardublockly.setIdeHtml(ArdublocklyServer.jsonToHtmlDropdown(jsonObj));
  });
};

/**
 * Send the Arduino Code to the ArdublocklyServer to process.
 * Shows a loader around the button, blocking it (unblocked upon received
 * message from server).
 */
Ardublockly.sendCode = function () {
  Ardublockly.largeIdeButtonSpinner(true);

  /**
   * Receives the IDE data back to be displayed and stops spinner.
   * @param {element} jsonResponse JSON data coming back from the server.
   * @return {undefined} Might exit early if response is null.
   */
  var sendCodeReturn = function (jsonObj) {
    Ardublockly.largeIdeButtonSpinner(false);
    if (jsonObj === null) return Ardublockly.openNotConnectedModal();
    var dataBack = ArdublocklyServer.jsonToIdeModal(jsonObj);
    Ardublockly.arduinoIdeOutput(dataBack);
  };

  ArdublocklyServer.sendSTSketchToServer(Ardublockly.generateArduino(), SmartTown.getSTRobotSketch(), sendCodeReturn);

};

/** Populate the workspace blocks with the XML written in the XML text area. */
Ardublockly.XmlTextareaToBlocks = function () {
  var success = Ardublockly.replaceBlocksfromXml(
    document.getElementById('content_xml').value);
  if (success) {
    Ardublockly.renderContent();
  } else {
    Ardublockly.alertMessage(
      Ardublockly.getLocalStr('invalidXmlTitle'),
      Ardublockly.getLocalStr('invalidXmlBody'),
      false);
  }
};

/**
 * Private variable to save the previous version of the Arduino Code.
 * @type {!String}
 * @private
 */
Ardublockly.PREV_ARDUINO_CODE_ = 'void setup() {\n\n}\n\n\nvoid loop() {\n\n}';
Ardublockly.PREV_MIDDLE_CODE_ = '';

/**
 * Populate the Arduino Code and Blocks XML panels with content generated from
 * the blocks.
 */
Ardublockly.renderContent = function () {
  // Render Arduino Code with latest change highlight and syntax highlighting
  let language = Ardublockly.selected_language;

  switch (language) {
    case "arduino":
      var arduinoCode = Ardublockly.generateArduino();
      if (arduinoCode !== Ardublockly.PREV_ARDUINO_CODE_) {
        var diff = JsDiff.diffWords(Ardublockly.PREV_ARDUINO_CODE_, arduinoCode);
        var resultStringArray = [];
        for (var i = 0; i < diff.length; i++) {
          if (!diff[i].removed) {
            var escapedCode = diff[i].value.replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
            if (diff[i].added) {
              resultStringArray.push(
                '<span class="code_highlight_new">' + escapedCode + '</span>');
            } else {
              resultStringArray.push(escapedCode);
            }
          }
        }

        document.getElementById('content_arduino').innerHTML =
          prettyPrintOne(resultStringArray.join(''), 'cpp', false);
        Ardublockly.PREV_ARDUINO_CODE_ = arduinoCode;
      }
      break;
    case "java":
      SmartTown.setMiddleGenerator(Blockly.Java);
      var javaCode = Ardublockly.generateJava();
      if (javaCode !== Ardublockly.PREV_JAVA_CODE_) {
        var diff = JsDiff.diffWords(Ardublockly.PREV_JAVA_CODE_, javaCode);
        var resultStringArray = [];
        for (var i = 0; i < diff.length; i++) {
          if (!diff[i].removed) {
            var escapedCode = diff[i].value.replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
            if (diff[i].added) {
              resultStringArray.push(
                '<span class="code_highlight_new">' + escapedCode + '</span>');
            } else {
              resultStringArray.push(escapedCode);
            }
          }
        }

        document.getElementById('content_java').innerHTML =
          prettyPrintOne(resultStringArray.join(''), 'cpp', false);
        Ardublockly.PREV_JAVA_CODE_ = javaCode;
      }
      break;
    case "python":
      SmartTown.setMiddleGenerator(Blockly.Python);
      var pyCode = Ardublockly.generatePython();
      if (pyCode !== Ardublockly.PREV_PY_CODE_) {
        var diff = JsDiff.diffWords(Ardublockly.PREV_PY_CODE_, pyCode);
        var resultStringArray = [];
        for (var i = 0; i < diff.length; i++) {
          if (!diff[i].removed) {
            var escapedCode = diff[i].value.replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
            if (diff[i].added) {
              resultStringArray.push(
                '<span class="code_highlight_new">' + escapedCode + '</span>');
            } else {
              resultStringArray.push(escapedCode);
            }
          }
        }

        document.getElementById('content_py').innerHTML =
          prettyPrintOne(resultStringArray.join(''), 'cpp', false);
        Ardublockly.PREV_PY_CODE_ = pyCode;
      }
      break;
    case "middle":
      var pyCode = Ardublockly.generateMiddle();
      if (pyCode !== Ardublockly.PREV_MIDDLE_CODE_) {
        var diff = JsDiff.diffWords(Ardublockly.PREV_MIDDLE_CODE_, pyCode);
        var resultStringArray = [];
        for (var i = 0; i < diff.length; i++) {
          if (!diff[i].removed) {
            var escapedCode = diff[i].value.replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
            if (diff[i].added) {
              resultStringArray.push(
                '<span class="code_highlight_new">' + escapedCode + '</span>');
            } else {
              resultStringArray.push(escapedCode);
            }
          }
        }

        document.getElementById('content_mid').innerHTML =
          prettyPrintOne(resultStringArray.join(''), 'cpp', false);
        Ardublockly.PREV_MIDDLE_CODE_ = pyCode;
      }
      break;
  }





  // Generate plain XML into element
  if (language !== "exec") {
    document.getElementById('content_xml').value = Ardublockly.generateXml();
  }
};

/**
 * Private variable to indicate if the toolbox is meant to be shown.
 * @type {!boolean}
 * @private
 */
Ardublockly.TOOLBAR_SHOWING_ = true;

/**
 * Toggles the blockly toolbox and the Ardublockly toolbox button On and Off.
 * Uses namespace member variable TOOLBAR_SHOWING_ to toggle state.
 */
Ardublockly.toogleToolbox = function () {
  if (Ardublockly.TOOLBAR_SHOWING_) {
    Ardublockly.blocklyCloseToolbox();
    Ardublockly.displayToolbox(false);
  } else {
    Ardublockly.displayToolbox(true);
  }
  Ardublockly.TOOLBAR_SHOWING_ = !Ardublockly.TOOLBAR_SHOWING_;
};

/** @return {boolean} Indicates if the toolbox is currently visible. */
Ardublockly.isToolboxVisible = function () {
  return Ardublockly.TOOLBAR_SHOWING_;
};

/**
 * Lazy loads the additional block JS files from the ./block directory.
 * Initialises any additional Ardublockly extensions.
 * TODO: Loads the examples into the examples modal
 */
Ardublockly.importExtraBlocks = function () {
  /**
   * Parses the JSON data to find the block and languages js files.
   * @param {jsonDataObj} jsonDataObj JSON in JavaScript object format, null
   *     indicates an error occurred.
   * @return {undefined} Might exit early if response is null.
   */
  var jsonDataCb = function (jsonDataObj) {
    if (jsonDataObj === null) return Ardublockly.openNotConnectedModal();
    if (jsonDataObj.categories !== undefined) {
      var head = document.getElementsByTagName('head')[0];
      for (var catDir in jsonDataObj.categories) {
        var blocksJsLoad = document.createElement('script');
        blocksJsLoad.src = '../blocks/' + catDir + '/blocks.js';
        head.appendChild(blocksJsLoad);

        var blocksLangJsLoad = document.createElement('script');
        blocksLangJsLoad.src = '../blocks/' + catDir + '/msg/' + 'messages.js';
        //'lang/' + Ardublockly.LANG + '.js';
        head.appendChild(blocksLangJsLoad);

        var blocksGeneratorJsLoad = document.createElement('script');
        blocksGeneratorJsLoad.src = '../blocks/' + catDir +
          '/generator_arduino.js';
        head.appendChild(blocksGeneratorJsLoad);

        // Check if the blocks add additional Ardublockly functionality
        var extensions = jsonDataObj.categories[catDir].extensions;
        if (extensions) {
          for (var i = 0; i < extensions.length; i++) {
            var blockExtensionJsLoad = document.createElement('script');
            blockExtensionJsLoad.src = '../blocks/' + catDir + '/extensions.js';
            head.appendChild(blockExtensionJsLoad);
            // Add function to scheduler as lazy loading has to complete first
            setTimeout(function (category, extension) {
              var extensionNamespaces = extension.split('.');
              var extensionCall = window;
              var invalidFunc = false;
              for (var j = 0; j < extensionNamespaces.length; j++) {
                extensionCall = extensionCall[extensionNamespaces[j]];
                if (extensionCall === undefined) {
                  invalidFunc = true;
                  break;
                }
              }
              if (typeof extensionCall != 'function') {
                invalidFunc = true;
              }
              if (invalidFunc) {
                throw 'Blocks ' + category.categoryName + ' extension "' +
                extension + '" is not a valid function.';
              } else {
                extensionCall();
              }
            }, 800, jsonDataObj.categories[catDir], extensions[i]);
          }
        }
      }
    }
  };
  // Reads the JSON data containing all block categories from ./blocks directory
  // TODO: Now reading a local file, to be replaced by server generated JSON
  ArdublocklyServer.getJson('../blocks/blocks_data.json', jsonDataCb);
};

/** Opens a modal with a list of categories to add or remove to the toolbox */
Ardublockly.openExtraCategoriesSelect = function () {
  /**
   * Parses the JSON data from the server into a list of additional categories.
   * @param {jsonDataObj} jsonDataObj JSON in JavaScript object format, null
   *     indicates an error occurred.
   * @return {undefined} Might exit early if response is null.
   */
  var jsonDataCb = function (jsonDataObj) {
    if (jsonDataObj === null) return Ardublockly.openNotConnectedModal();
    var htmlContent = document.createElement('div');
    if (jsonDataObj.categories !== undefined) {
      for (var catDir in jsonDataObj.categories) {
        // Function required to maintain each loop variable scope separated
        (function (cat) {
          var clickBind = function (tickValue) {
            if (tickValue) {
              var catDom = (new DOMParser()).parseFromString(
                cat.toolbox.join(''), 'text/xml').firstChild;
              Ardublockly.addToolboxCategory(cat.toolboxName, catDom);
            } else {
              Ardublockly.removeToolboxCategory(cat.toolboxName);
            }
          };
          htmlContent.appendChild(Ardublockly.createExtraBlocksCatHtml(
            cat.categoryName, cat.description, clickBind));
        })(jsonDataObj.categories[catDir]);
      }
    }
    Ardublockly.openAdditionalBlocksModal(htmlContent);
  };
  // Reads the JSON data containing all block categories from ./blocks directory
  // TODO: Now reading a local file, to be replaced by server generated JSON
  ArdublocklyServer.getJson('../blocks/blocks_data.json', jsonDataCb);
};

/** Informs the user that the selected function is not yet implemented. */
Ardublockly.functionNotImplemented = function () {
  Ardublockly.shortMessage('Function not yet implemented');
};

/**
 * Interface to display messages with a possible action.
 * @param {!string} title HTML to include in title.
 * @param {!element} body HTML to include in body.
 * @param {boolean=} confirm Indicates if the user is shown a single option (ok)
 *     or an option to cancel, with an action applied to the "ok".
 * @param {string=|function=} callback If confirm option is selected this would
 *     be the function called when clicked 'OK'.
 */
Ardublockly.alertMessage = function (title, body, confirm, callback) {
  Ardublockly.materialAlert(title, body, confirm, callback);
};

/**
 * Interface to displays a short message, which disappears after a time out.
 * @param {!string} message Text to be temporarily displayed.
 */
Ardublockly.shortMessage = function (message) {
  Ardublockly.MaterialToast(message);
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!function} func Event handler to bind.
 * @private
 */
Ardublockly.bindClick_ = function (el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  // Need to ensure both, touch and click, events don't fire for the same thing
  var propagateOnce = function (e) {
    e.stopPropagation();
    e.preventDefault();
    func();
  };
  el.addEventListener('ontouchend', propagateOnce);
  el.addEventListener('click', propagateOnce);
};

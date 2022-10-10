/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
`use strict`;

var SmartTown = SmartTown || {};
SmartTown.GUIsocket = new WebSocket("ws://127.0.0.1:7002");

SmartTown.GUIsocket.onmessage = function (event) {
    let guiEvent = JSON.parse(event.data);
    if(guiEvent.event){
        SmartTown.resetNodeStatus();
        Ardublockly.largeIdeButtonSpinner(false,Ardublockly.inExec);
        Ardublockly.MaterialToast("Se acabó el guion.");
        Ardublockly.inExec = false;
        Ardublockly.activeNet = false;
    }else{
        SmartTown.updateNodeStatus(guiEvent);
    }
};

SmartTown.GUIsocket.onclose = function (event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        console.log(`[close] Connection died`);
    }
};


SmartTown.GUIsocket.onerror = function(error) {
    console.log(`[error] ${error.message}`);
};
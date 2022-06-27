/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
 'use strict';

 /** Create a namespace for the application. */
 var ArdublocklyUtils = ArdublocklyUtils || {};


 ArdublocklyUtils.traceOn= function(value, root){
    root.traceOn(value)
   }
  
   ArdublocklyUtils.highlightBlock =function (id, root) {
    root.highlightBlock(id);
  };
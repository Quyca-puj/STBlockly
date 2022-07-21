/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
 'use strict';

 /** Create a namespace for the application. */
 var ArdublocklyUtils = ArdublocklyUtils || {};

 ArdublocklyUtils.DEFAULT_WORKSPACE = {
 arduino:'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setupsmarttown" id="BG73`6b@~shNXtygu?!C" deletable="false" x="42" y="92"><field name="serialNumber"></field><field name="wifiName"></field><field name="alias"></field><field name="pass"></field><field name="CONF_TYPE">Quyca</field></block></xml>',
 middle:'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setupsmarttown_middle" id="e0Vs@X?;=^2D]FrVPX4i" deletable="false"  x="73" y="46"></block></xml>', 
 exec:'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setupsmarttown_exec" id=".fe5t+EaCWuO~.b[53)7" deletable="false" x="42" y="92"><field name="ALIAS"></field><field name="ip"></field><statement name="EMOCONFIG"><shadow type="config_emotions" id=".I_TvE{H{)VYZPBcKPyK">  <field name="MF">1</field>  <field name="F">0.5</field>  <field name="S">1</field>  <field name="T">-0.5</field>  <field name="MT">-1</field>  <field name="E">-0.2</field>  <field name="FU">0.4</field>  <field name="SO">0.7</field></shadow></statement><statement name="ACTCONFIG"><shadow type="config_actions" id="S~-`N,!EQ)n)fKwY|s7c">  <field name="SPEED_MIN">10</field>  <field name="SPEED_MAX">90</field></shadow></statement></block></xml>'
};
ArdublocklyUtils.EMPTY_WORKSPACE = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'
 ArdublocklyUtils.traceOn= function(value, root){
    root.traceOn(value)
   }
  
   ArdublocklyUtils.highlightBlock =function (id, root) {
    root.highlightBlock(id);
  };
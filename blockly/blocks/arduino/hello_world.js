'use strict';

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

Blockly.Blocks['hello_world'] = {
  init: function() {
    this.appendValueInput("Arg 1")
        .setCheck("Array")
        .appendField("Corregir Velocidad")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "NAME");
    this.appendStatementInput("Arg 2")
        .setCheck("String")
        .appendField("Aceleracion")
        .appendField(new Blockly.FieldDropdown([["1","Opcion 1"], ["2","Opcion 2"], ["3","Opcion 3"]]), "Opciones")
        .appendField(new Blockly.FieldVariable("Velocidad"), "1");
    this.appendDummyInput()
        .appendField("Aceleracion")
        .appendField(new Blockly.FieldNumber(100), "Aceleracion");
    this.setOutput(true, ["Boolean", "Object"]);
    this.setColour(330);
 this.setTooltip("Esta es una prueba");
 this.setHelpUrl("www.google.com");
  }
};
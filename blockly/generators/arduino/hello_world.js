'use strict';

goog.require('Blockly.Arduino');


Blockly.Arduino['hello_world'] = function(block) {
    var checkbox_name = block.getFieldValue('NAME') === 'TRUE';
    var value_arg_1 = Blockly.Arduino.valueToCode(block, 'Arg 1', Blockly.Arduino.ORDER_ATOMIC);
    var dropdown_opciones = block.getFieldValue('Opciones');
    var variable_1 = Blockly.Arduino.variableDB_.getName(block.getFieldValue('1'), Blockly.Variables.NAME_TYPE);
    var statements_arg_2 = Blockly.Arduino.statementToCode(block, 'Arg 2');
    var number_aceleracion = block.getFieldValue('Aceleracion');
    // TODO: Assemble JavaScript into code variable.
    var code = 'Serial.println("Hello World"); \n'
    + 'Serial.println('+ dropdown_opciones +', '+number_aceleracion+')'
    ;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  };
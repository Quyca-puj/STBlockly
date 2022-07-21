'use strict';

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

Blockly.Blocks['mvt_avanzar_exec'] = {
  init: function () {
    this.jsonInit(
      {
        "message0": "Avanzar Emocion %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "field_dropdown",
            "name": "Emotion",
            "options":  SmartTownUtils.EMOTION_OPTIONS
          }
        ],
        "inputsInline": true,
        "previousStatement": "COMMAND",
        "nextStatement": null,
        "colour": 230,
        "tooltip": "El robot Avanza",
        "helpUrl": ""
      }
    );
  }
};


Blockly.Blocks['mvt_girar_exec'] = {
  init: function () {
    this.jsonInit(
      {
        "message0": "Girar Direccíon %1 %2  Emocion %3",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "Movement",
            "options": [
              [
                "Izquierda",
                "left"
              ],
              [
                "Derecha",
                "right"
              ]
            ]
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_dropdown",
            "name": "Emotion",
            "options":  SmartTownUtils.EMOTION_OPTIONS
          }
        ],
        "inputsInline": true,
        "previousStatement": "COMMAND",
        "nextStatement": null,
        "colour": 230,
        "tooltip": "El robot gira",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Blocks['mvt_avanzar_tiempo_exec'] = {
  init: function () {
    this.jsonInit(
      {
        "message0": "Avanzar Direccíon %1 %2 TIempo %3 Velocidad %4 %5",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "Movement",
            "options": [
              [
                "Adelante",
                "t_forward"
              ],
              [
                "Atrás",
                "t_reverse"
              ]
            ]
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_number",
            "name": "TIME",
            "value": 0,
            "min": 0
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_number",
            "name": "SPEED",
            "value": 0,
            "min": 0
          }
        ],
        "inputsInline": true,
        "previousStatement": "COMMAND",
        "nextStatement": null,
        "colour": 210,
        "tooltip": "El robot avanza dado un tiempo especifico",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Blocks['mvt_girar_tiempo_exec'] = {
  init: function () {
    this.jsonInit(
      {
        "message0": "Girar Direccíon %1 %2 Tiempo %3 Velocidad %4 %5",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "Movement",
            "options": [
              [
                "Izquierda",
                "t_left"
              ],
              [
                "Derecha",
                "t_right"
              ]
            ]
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_number",
            "name": "TIME",
            "value": 0,
            "min": 0
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_number",
            "name": "SPEED",
            "value": 0,
            "min": 0
          }
        ],
        "inputsInline": true,
        "previousStatement": "COMMAND",
        "nextStatement": null,
        "colour": 210,
        "tooltip": "El robot gira dado un tiempo especifico",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Blocks['setupsmarttown_exec'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Setup Robot");
    this.appendDummyInput()
      .appendField("Alias")
      .appendField(new Blockly.FieldTextInput(""), "ALIAS");
    this.appendDummyInput()
      .appendField("IP")
      .appendField(new Blockly.FieldTextInput(""), "ip");
    this.appendStatementInput("EMOCONFIG")
      .setCheck(["EMOCONF"])
      .appendField("Conf. Emociones");
    this.appendStatementInput("ACTCONFIG")
      .setCheck(["ACTCONF"])
      .appendField("Conf. Acciones");
    this.appendStatementInput("COMMANDS")
      .setCheck(["COMMAND","ALCOMMAND"])
      .appendField("Comandos");
    this.setInputsInline(true);
    this.setColour(59);
    this.setTooltip("Ejecuta algo con el robot");
    this.setHelpUrl("");
    this.setDeletable(false);
  }
};

Blockly.Blocks['mvt_stop_exec'] = {
  init: function () {
    this.jsonInit(
      {
        "message0": " Parar Robot Emocion %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "field_dropdown",
            "name": "Emotion",
            "options":  SmartTownUtils.EMOTION_OPTIONS
          }
        ],
        "inputsInline": true,
        "previousStatement": "COMMAND",
        "nextStatement": null,
        "colour": 0,
        "tooltip": "El robot gira dado un tiempo especifico",
        "helpUrl": ""
      }

    );
  }
};


Blockly.Blocks['change_emotion_exec'] = {
  init: function () {
    this.jsonInit(
      {
        "message0": " Cambiar Emocion Emocion %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "field_dropdown",
            "name": "Emotion",
            "options":  SmartTownUtils.EMOTION_OPTIONS
          }
        ],
        "inputsInline": true,
        "previousStatement": "COMMAND",
        "nextStatement": null,
        "colour": 0,
        "tooltip": "El robot gira dado un tiempo especifico",
        "helpUrl": ""
      }

    );
  }
};


Blockly.Blocks['config_emotions'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "config_emotions",
        "message0": "Muy Feliz Intensidad %1 %2 Feliz Intensidad %3 %4 Serio Intensidad %5 %6 Triste Intensidad %7 %8 Muy Triste Intensidad %9 %10 Enfermo Intensidad %11 %12 Furioso Intensidad %13 %14 Sorprendido Intensidad %15",
        "args0": [
          {
            "type": "field_number",
            "name": "MF",
            "value": 1,

          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_number",
            "name": "F",
            "value": 0.5,

          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_number",
            "name": "S",
            "value": 0,

          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_number",
            "name": "T",
            "value": -0.5,

          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_number",
            "name": "MT",
            "value": -1,

          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_number",
            "name": "E",
            "value": -0.2,

          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_number",
            "name": "FU",
            "value": 0.4,

          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_number",
            "name": "SO",
            "value": 0.7,

          }
        ],
        "previousStatement": "EMOCONF",
        "colour": 12,
        "tooltip": "Bloque para la configuración de las emociones",
        "helpUrl": "",
      }
    );
  }
};


Blockly.Blocks['config_actions'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "config_actions",
        "message0": "Velocidad Min %1 Max %2",
        "args0": [
          {
            "type": "field_number",
            "name": "SPEED_MIN",
            "value": 10,
            "min": 10,
            "max": 100
          },
          {
            "type": "field_number",
            "name": "SPEED_MAX",
            "value": 100,
            "min": 10,
            "max": 100
          }
        ],
        "previousStatement": "ACTCONF",
        "colour": 15,
        "tooltip": "Bloque para la configuración de los parametros que afectan las acciones",
        "helpUrl": "",
      }
    );
  }
};
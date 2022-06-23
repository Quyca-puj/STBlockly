'use strict';

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

Blockly.Blocks['mvt_avanzar_exec'] = {
    init: function() {
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
                    "options": [
                      [
                        "Muy Feliz",
                        "MUY_FELIZ"
                      ],
                      [
                        "Feliz",
                        "FELIZ"
                      ],
                      [
                        "Serio",
                        "SERIO"
                      ],
                      [
                        "Triste",
                        "TRISTE"
                      ],
                      [
                        "Muy Triste",
                        "MUY_TRISTE"
                      ],
                      [
                        "Enfermo",
                        "ENFERMO"
                      ],
                      [
                        "Furioso",
                        "FURIOSO"
                      ],
                      [
                        "Sorprendido",
                        "SORPRENDIDO"
                      ]
                    ]
                  }
                ],
                "inputsInline": true,
                "previousStatement": null,
                "nextStatement": null,
                "colour": 230,
                "tooltip": "El robot Avanza",
                "helpUrl": ""
              }
        );
    }
  };


  Blockly.Blocks['mvt_girar_exec'] = {
    init: function() {
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
                    "options": [
                      [
                        "Muy Feliz",
                        "MUY_FELIZ"
                      ],
                      [
                        "Feliz",
                        "FELIZ"
                      ],
                      [
                        "Serio",
                        "SERIO"
                      ],
                      [
                        "Triste",
                        "TRISTE"
                      ],
                      [
                        "Muy Triste",
                        "MUY_TRISTE"
                      ],
                      [
                        "Enfermo",
                        "ENFERMO"
                      ],
                      [
                        "Furioso",
                        "FURIOSO"
                      ],
                      [
                        "Sorprendido",
                        "SORPRENDIDO"
                      ]
                    ]
                  }
                ],
                "inputsInline": true,
                "previousStatement": null,
                "nextStatement": null,
                "colour": 230,
                "tooltip": "El robot gira",
                "helpUrl": ""
              }
        );
    }
  };

  Blockly.Blocks['mvt_avanzar_tiempo_exec'] = {
    init: function() {
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
                "previousStatement": null,
                "nextStatement": null,
                "colour": 210,
                "tooltip": "El robot avanza dado un tiempo especifico",
                "helpUrl": ""
              }
        );
    }
  };

  Blockly.Blocks['mvt_girar_tiempo_exec'] = {
    init: function() {
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
                "previousStatement": null,
                "nextStatement": null,
                "colour": 210,
                "tooltip": "El robot gira dado un tiempo especifico",
                "helpUrl": ""
              }
        );
    }
  };

  Blockly.Blocks['setupsmarttown_exec'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Setup Robot");
          this.appendDummyInput()
          .appendField("Alias")
          .appendField(new Blockly.FieldTextInput(""), "ALIAS");
          this.appendDummyInput()
          .appendField("IP")
          .appendField(new Blockly.FieldTextInput(""), "ip");
      this.appendStatementInput("COMMANDS")
      .setCheck("Command")
      .appendField("Comandos");
      this.setInputsInline(true);
      this.setNextStatement(true, null);
      this.setColour(59);
   this.setTooltip("Ejecuta algo con el robot");
   this.setHelpUrl("");
    }
  };

  Blockly.Blocks['mvt_stop_exec'] = {
    init: function() {
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
                  "options": [
                    [
                      "Muy Feliz",
                      "MUY_FELIZ"
                    ],
                    [
                      "Feliz",
                      "FELIZ"
                    ],
                    [
                      "Serio",
                      "SERIO"
                    ],
                    [
                      "Triste",
                      "TRISTE"
                    ],
                    [
                      "Muy Triste",
                      "MUY_TRISTE"
                    ],
                    [
                      "Enfermo",
                      "ENFERMO"
                    ],
                    [
                      "Furioso",
                      "FURIOSO"
                    ],
                    [
                      "Sorprendido",
                      "SORPRENDIDO"
                    ]
                  ]
                }
              ],
              "inputsInline": true,
                "previousStatement": null,
                "nextStatement": null,
                "colour": 0,
                "tooltip": "El robot gira dado un tiempo especifico",
                "helpUrl": ""
            }
            
        );
    }
  };

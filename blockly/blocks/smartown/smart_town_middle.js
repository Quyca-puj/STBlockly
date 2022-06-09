'use strict';

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

Blockly.Blocks['mvt_avanzar_middle'] = {
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


  Blockly.Blocks['mvt_girar_middle'] = {
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

  Blockly.Blocks['mvt_avanzar_tiempo_middle'] = {
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
                        "forward"
                      ],
                      [
                        "Atrás",
                        "backward"
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

  Blockly.Blocks['mvt_girar_tiempo_middle'] = {
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

  Blockly.Blocks['setupsmarttown_middle'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Setup SmartTown");
      this.appendStatementInput("COMMANDS")
      .setCheck("Command")
      .appendField("Comandos");
      this.setInputsInline(true);
      this.setNextStatement(true, null);
      this.setColour(59);
   this.setTooltip("Setup SmartTown functions");
   this.setHelpUrl("");
    }
  };

  
  Blockly.Blocks['new_smarttown_action_list'] = {
    init: function() {
        this.jsonInit(
            {
              "message0": "Nombre %1 %2 Instrucciones %3",
              "args0": [
                {
                  "type": "field_input",
                  "name": "NAME",
                  "text": "nuevo"
                },
                {
                  "type": "input_dummy"
                },
                {
                  "type": "input_statement",
                  "name": "COMMANDS"
                }
              ],
              "previousStatement": null,
              "nextStatement": null,
              "colour": 140,
              "tooltip": "",
              "helpUrl": ""
              }
        );
    },

    getSTALDef: function(){
      return this.getFieldValue('NAME');
    },
  /**
   * Add custom menu options to this block's context menu.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
   customContextMenu: function(options) {
    // Add option to create caller.
    var option = {enabled: true};
    var name = this.getFieldValue('NAME');
    option.text = Blockly.Msg.PROCEDURES_CREATE_DO.replace('%1', name);
    var xmlMutation = goog.dom.createDom('mutation');
    xmlMutation.setAttribute('name', name);
    for (var i = 0; i < this.arguments_.length; i++) {
      var xmlArg = goog.dom.createDom('arg');
      xmlArg.setAttribute('name', this.arguments_[i][0]);
      xmlArg.setAttribute('type', this.arguments_[i][1]);
      xmlMutation.appendChild(xmlArg);
    }
    var xmlBlock = goog.dom.createDom('block', null, xmlMutation);
    xmlBlock.setAttribute('type', this.callType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);

    // Add options to create getters for each parameter.
    if (!this.isCollapsed()) {
      for (var i = 0; i < this.arguments_.length; i++) {
        var option = {enabled: true};
        var name = this.arguments_[i][0];
        option.text = Blockly.Msg.VARIABLES_SET_CREATE_GET.replace('%1', name);
        var xmlField = goog.dom.createDom('field', null, name);
        xmlField.setAttribute('name', 'VAR');
        var xmlBlock = goog.dom.createDom('block', null, xmlField);
        xmlBlock.setAttribute('type', 'variables_get');
        option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
        options.push(option);
      }
    }
  }
  };


  Blockly.Blocks['mvt_stop_middle'] = {
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

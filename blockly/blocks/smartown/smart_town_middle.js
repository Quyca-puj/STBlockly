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
                    "options":  SmartTown.emotionsUtil
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
                    "options":  SmartTown.emotionsUtil
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

  Blockly.Blocks['setupsmarttown_middle'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Setup SmartTown");
      this.appendStatementInput("COMMANDS")
      .setCheck("Command")
      .appendField("Comandos");
      this.setInputsInline(true);
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
  },callType_: 'st_actionList_call',
  FUNCTION_TYPES: ['st_actionList_call']
  };

  Blockly.Blocks['st_actionList_call'] = {
    /**
     * Block for calling a procedure with no return value.
     * @this Blockly.Block
     */
    init: function() {
      this.appendDummyInput('TOPROW')
          .appendField(this.id, 'NAME');
      this.setPreviousStatement(true,"ALCOMMAND");
      this.setNextStatement(true);
      this.setColour(140);
      // Tooltip is set in renameCommand.
      this.setHelpUrl(Blockly.Msg.PROCEDURES_CALLNORETURN_HELPURL);
      this.arguments_ = [];
      this.quarkConnections_ = {};
      this.quarkIds_ = null;
    },
    /**
     * Returns the name of the procedure this block calls.
     * @return {string} Procedure name.
     * @this Blockly.Block
     */
    getALCall: function() {
      // The NAME field is guaranteed to exist, null will never be returned.
      return /** @type {string} */ (this.getFieldValue('NAME'));
    },
    /**
     * Notification that a procedure is renaming.
     * If the name matches this block's procedure, rename it.
     * @param {string} oldName Previous name of procedure.
     * @param {string} newName Renamed procedure.
     * @this Blockly.Block
     */
    renameCommand: function(oldName, newName) {
      if (Blockly.Names.equals(oldName, this.getALCall())) {
        this.setFieldValue(newName, 'NAME');
        this.setTooltip(
            (this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP :
             Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP)
            .replace('%1', newName));
      }
    },
    /**
     * Modify this block to have the correct number of arguments.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function() {
      for (var i = 0; i < this.arguments_.length; i++) {
        var field = this.getField('ARGNAME' + i);
        if (field) {
          // Ensure argument name is up to date.
          // The argument name field is deterministic based on the mutation,
          // no need to fire a change event.
          Blockly.Events.disable();
          field.setValue(this.arguments_[i][0]);
          Blockly.Events.enable();
        } else {
          // Add new input.
          field = new Blockly.FieldLabel(this.arguments_[i][0]);
          var input = this.appendValueInput('ARG' + i)
              .setAlign(Blockly.ALIGN_RIGHT)
              .appendField(field, 'ARGNAME' + i);
          input.init();
        }
      }
      // Remove deleted inputs.
      while (this.getInput('ARG' + i)) {
        this.removeInput('ARG' + i);
        i++;
      }
      // Add 'with:' if there are parameters, remove otherwise.
      var topRow = this.getInput('TOPROW');
      if (topRow) {
        if (this.arguments_.length) {
          if (!this.getField('WITH')) {
            topRow.appendField(Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS, 'WITH');
            topRow.init();
          }
        } else {
          if (this.getField('WITH')) {
            topRow.removeField('WITH');
          }
        }
      }
    },
    /**
     * Create XML to represent the (non-editable) name and arguments.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
      var container = document.createElement('mutation');
      container.setAttribute('name', this.getALCall());
      for (var i = 0; i < this.arguments_.length; i++) {
        var parameter = document.createElement('arg');
        parameter.setAttribute('name', this.arguments_[i][0]);
        parameter.setAttribute('type', this.arguments_[i][1]);
        container.appendChild(parameter);
      }
      return container;
    },
    /**
     * Parse XML to restore the (non-editable) name and parameters.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
      var name = xmlElement.getAttribute('name');
      this.renameCommand(this.getALCall(), name);
      var args = [];
      var types = [];
      var paramIds = [];
      for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
        if (childNode.nodeName.toLowerCase() == 'arg') {
          args.push(childNode.getAttribute('name'));
          types.push(childNode.getAttribute('type'));
          paramIds.push(childNode.getAttribute('paramId'));
        }
      }
      //this.setProcedureParameters_(args, types, paramIds);
    },
    /**
     * Notification that a variable is renaming.
     * If the name matches one of this block's variables, rename it.
     * @param {string} oldName Previous name of variable.
     * @param {string} newName Renamed variable.
     * @this Blockly.Block
     */
    renameVar: function(oldName, newName) {
      for (var i = 0; i < this.arguments_.length; i++) {
        if (Blockly.Names.equals(oldName, this.arguments_[i][0])) {
          this.arguments_[i][0] = newName;
          this.getField('ARGNAME' + i).setValue(newName);
        }
      }
    },
    /**x
     * Add menu option to find the definition block for this call.
     * @param {!Array} options List of menu options to add to.
     * @this Blockly.Block
     */
    customContextMenu: function(options) {
      var option = {enabled: true};
      option.text = Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF;
      var name = this.getALCall();
      var workspace = this.workspace;
      option.callback = function() {
        var def = Blockly.SmartTown.getDefinition(name, workspace);
        def && def.select();
      };
      options.push(option);
    }
  }

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
                  "options":  SmartTown.emotionsUtil
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

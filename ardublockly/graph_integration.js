/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 * { "morado": { charac_name: "Mirabel", charac_alias: "morado", charac_ip: "192.168.73.167", charac_color: "#ab00aa" } };
 */
'use strict';

var SmartTown = SmartTown || {};
/** Color mapping to status */
SmartTown.statusColors = { "EXECUTING": "#008000", "DONE": "#000000" };
/** Character map */
SmartTown.characters = {};
/** action map */
SmartTown.actions = {};
SmartTown.selectNodeForEdge = null;
SmartTown.activeActionDropdown = null;
/** Get graph playground */
SmartTown.graphContainer = document.getElementById("content_graph");

/** Reset playground */

SmartTown.reset = () => {
  SmartTown.startSigma(null);
}
/** Start sigma playground */
SmartTown.startSigma = function (graph) {

  var $newOpt = $("<option>").attr("value", "morado").text("Mirabel");
  $("#charac").append($newOpt);
  $("#charac").trigger('contentChanged');

  window.oncontextmenu = () => { return false; };
  //get character form.
  const form = document.getElementById('new_char_form');
  form.addEventListener("submit", function (event) {
    // stop form submission
    event.preventDefault();
    SmartTown.modalCharacOnSubmit();
  });
  //Create a graph
  if (graph) {
    SmartTown.graph = graph;
  } else {
    SmartTown.graph = new graphology.Graph({ allowSelfLoops: false, type: 'directed' });
  }

  //Render sigma graph
  if (SmartTown.sigmaRenderer) {
    SmartTown.sigmaRenderer.graph = SmartTown.graph;
    SmartTown.sigmaRenderer.refresh();
  } else {
    SmartTown.sigmaRenderer = new Sigma(SmartTown.graph, SmartTown.graphContainer,
      {
        minArrowSize: 10,
        allowInvalidContainer: true,
        minCameraRatio: 0.1,
        maxCameraRatio: 10,
      });
  }

  SmartTown.camera = SmartTown.sigmaRenderer.getCamera();

  //Add node selection logic
  SmartTown.sigmaRenderer.on("downNode", (e) => {
    SmartTown.isDragging = true;
    SmartTown.draggedNode = e.node;
    SmartTown.graph.setNodeAttribute(SmartTown.draggedNode, "highlighted", true);
  });

  //Add node double click events logic
  SmartTown.sigmaRenderer.on("doubleClickNode", (e) => {
    SmartTown.resetNodeForm();
    SmartTown.isFormUsed = true;
    let node_dialog = document.getElementById('node_dialog');
    if (SmartTown.doubleClickedNode) {
      SmartTown.graph.setNodeAttribute(SmartTown.doubleClickedNode, "highlighted", false);
    }
    SmartTown.doubleClickedNode = e.node;

    const isNodeInPG =
      SmartTown.doubleClickedNode;
    const select_acttype = document.getElementById('act_type');
    const select_charac = document.getElementById('charac');
    const action_options = document.getElementById('action_options');
    if (isNodeInPG) {
      SmartTown.graph.setNodeAttribute(SmartTown.doubleClickedNode, "highlighted", true);
      node_dialog.style.display = 'block';
      let nodeAtrr = SmartTown.graph.getNodeAttributes(SmartTown.doubleClickedNode);
      select_charac.value = nodeAtrr['charac'] ? nodeAtrr['charac'].charac_alias : "empty";
      $('#charac').material_select();
      if (nodeAtrr['action']) {
        if (nodeAtrr['action'].actions) {
          action_options.value = 'actionlists';
        } else {
          action_options.value = 'actions';
        }
        $('#action_options').trigger('change');
        select_acttype.value = nodeAtrr['action'] ? nodeAtrr['action'].name : "empty";

        const params = nodeAtrr['params'];
        Ardublockly.changeActType(params);
        if (params) {
          for (const [key, value] of Object.entries(params)) {
            const aux_field = document.getElementById(key);
            aux_field.value = value;
          }
        }
      }
    }
    e.preventSigmaDefault();
  });

  //Allow playground movement.
  SmartTown.sigmaRenderer.getMouseCaptor().on("mousemovebody", (e) => {
    if (!SmartTown.isDragging || !SmartTown.draggedNode) return;

    // Get new position of node
    const pos = SmartTown.sigmaRenderer.viewportToGraph(e);

    SmartTown.graph.setNodeAttribute(SmartTown.draggedNode, "x", pos.x);
    SmartTown.graph.setNodeAttribute(SmartTown.draggedNode, "y", pos.y);

    // Prevent sigma to move camera:
    e.preventSigmaDefault();
    e.original.preventDefault();
    e.original.stopPropagation();
  });
  SmartTown.sigmaRenderer.getMouseCaptor().on("mouseup", (e) => {
    const pos = SmartTown.sigmaRenderer.viewportToGraph(e);
    const isNodeInPG =
      SmartTown.draggedNode && SmartTown.graph.getNodeAttribute(SmartTown.draggedNode, "isInPlayground");

    if (SmartTown.draggedNode) {
      SmartTown.graph.removeNodeAttribute(SmartTown.draggedNode, "highlighted");
    }
    SmartTown.sigmaRenderer.on("downNode", (e) => {
      SmartTown.isDragging = true;
      SmartTown.draggedNode = e.node;
      SmartTown.graph.setNodeAttribute(SmartTown.draggedNode, "highlighted", true);
    });
    SmartTown.isDragging = false;
    SmartTown.draggedNode = null;
  });

  //Add rightclick event for edge addition.
  SmartTown.sigmaRenderer.on("rightClickNode", (e) => {
    const act = SmartTown.graph.getNodeAttribute(e.node, "action");
    if (act) {
      if (SmartTown.selectNodeForEdge && SmartTown.selectNodeForEdge !== e.node) {
        SmartTown.graph.setNodeAttribute(e.node, "highlighted", true);
        SmartTown.addEdge(SmartTown.selectNodeForEdge, e.node);
        SmartTown.graph.setNodeAttribute(SmartTown.selectNodeForEdge, "highlighted", false);
        SmartTown.graph.setNodeAttribute(e.node, "highlighted", false);
        SmartTown.selectNodeForEdge = null;
      } else {
        SmartTown.selectNodeForEdge = e.node;
        SmartTown.graph.setNodeAttribute(SmartTown.selectNodeForEdge, "highlighted", true);
      }
    } else {
      Ardublockly.materialAlert(Ardublockly.getLocalStr('invalidConnectionActionTitle'), Ardublockly.getLocalStr('invalidConnectionActionBody'), false);
    }
  });

  SmartTown.sigmaRenderer.getMouseCaptor().on("mousedown", () => {
    if (!SmartTown.sigmaRenderer.getCustomBBox()) SmartTown.sigmaRenderer.setCustomBBox(SmartTown.sigmaRenderer.getBBox());
  });

  //Add reset behavior for click stage.
  SmartTown.sigmaRenderer.on('clickStage', () => {
    let node_dialog = document.getElementById('node_dialog');
    node_dialog.style.display = "none";
    SmartTown.doubleClickedNode = null;
    SmartTown.selectNodeForEdge = null;
    SmartTown.ClickedNode = null;
    SmartTown.graph.updateEachNodeAttributes((node, attr) => {
      return {
        ...attr,
        highlighted: false
      };
    }, { attributes: ['highlighted'] });

    SmartTown.sigmaRenderer.refresh();
  });

  //Add clickNode behavior
  SmartTown.sigmaRenderer.on('clickNode', (e) => {
    if (SmartTown.ClickedNode) {
      SmartTown.graph.setNodeAttribute(SmartTown.ClickedNode, "highlighted", false);
    }

    SmartTown.ClickedNode = e.node;
    SmartTown.graph.setNodeAttribute(e.node, "highlighted", true);

  });


}

/** It resets the form node */
SmartTown.resetNodeForm = () => {
  SmartTown.isFormUsed = false;
  $('#action_options').val("empty");
  Ardublockly.clearActType();
}

/** Adds a new node to the playground */
SmartTown.addNewNode = () => {
  const node = {
    size: 20,
    color: "#2cdb98",
    x: 0,
    y: 0,
    isInPlayground: false
  };

  const id = uuidv4();
  SmartTown.graph.addNode(id, node);
};


/** Deletes a selected node */
SmartTown.deleteSelectedNode = () => {
  if (SmartTown.ClickedNode) {
    SmartTown.deleteAllOutEdges(SmartTown.ClickedNode);
    SmartTown.deleteAllInEdges(SmartTown.ClickedNode);
    SmartTown.graph.dropNode(SmartTown.ClickedNode);
    SmartTown.ClickedNode = null;
  }
};

/** Exports graph to a json object*/
SmartTown.exportGraph = () => {
  return SmartTown.graph.export();
}

/** Adds an edge between two nodes taking into account resource conflict.*/
SmartTown.addEdge = (origin, destination) => {

  let key = origin > destination ? origin + "" + destination : destination + "" + origin;
  if (SmartTown.graph.hasEdge(key)) {
    const destIn = SmartTown.graph.getNodeAttribute(destination, 'inArcs');
    const orIn = SmartTown.graph.getNodeAttribute(origin, 'inArcs');
    const destOut = SmartTown.graph.getNodeAttribute(destination, 'outArcs');
    const orOut = SmartTown.graph.getNodeAttribute(origin, 'outArcs');
    let index = -1;
    if (destIn) {
      index = destIn.indexOf(key);
    }
    if (index > -1)
      destIn.splice(index, 1);

    index = -1;
    if (orIn) {
      index = orIn.indexOf(key);
    }
    if (index > -1)
      orIn.splice(index, 1);
    index = -1;
    if (destOut) {
      index = destOut.indexOf(key);
    }
    if (index > -1)
      destOut.splice(index, 1);
    index = -1;

    if (orOut) {
      index = orOut.indexOf(key);
    }
    if (index > -1)
      orOut.splice(index, 1);

    SmartTown.graph.updateNodeAttribute(destination, 'inArcs', old => old = destIn);
    SmartTown.graph.updateNodeAttribute(destination, 'outArcs', old => old = destOut);
    SmartTown.graph.updateNodeAttribute(origin, 'inArcs', old => old = orIn);
    SmartTown.graph.updateNodeAttribute(origin, 'outArcs', old => old = orOut);

    SmartTown.graph.dropEdge(key);
  } else {
    let isValid = true;
    let orAction = SmartTown.graph.getNodeAttribute(origin, 'action');
    let orCharac = SmartTown.graph.getNodeAttribute(origin, 'charac');
    let destIn = SmartTown.graph.getNodeAttribute(destination, 'inArcs');
    let destCharac = SmartTown.graph.getNodeAttribute(destination, 'charac');
    if (destCharac && orCharac) {
      if (!destIn) destIn = [];
      let orOut = SmartTown.graph.getNodeAttribute(origin, 'outArcs');
      if (!orOut) orOut = [];

      /*
        edge guarda origen y destino. Se puede tomar origen de las edges y buscar attr en el grafo. De ahi tomar action y sacarlo.
      */
      destIn.forEach(element => {
        let orEdgeNode = SmartTown.graph.getEdgeAttribute(element, 'origin');
        let orEdgeAction = SmartTown.graph.getNodeAttribute(orEdgeNode, 'action');
        let orEdgeCharac = SmartTown.graph.getNodeAttribute(orEdgeNode, 'charac');
        isValid = isValid && SmartTown.compareActionResources(orAction, orCharac, orEdgeAction, orEdgeCharac);
      });

      if (isValid) {
        destIn.push(key);
        orOut.push(key);
        SmartTown.graph.updateNodeAttribute(destination, 'inArcs', old => old = destIn);
        SmartTown.graph.updateNodeAttribute(origin, 'outArcs', old => old = orOut);
        SmartTown.graph.addEdgeWithKey(key, origin, destination, {
          weight: 1,
          type: "arrow",
          size: 5,
          color: "#000000",
          origin: origin,
          destination: destination
        });
      } else {
        Ardublockly.materialAlert(Ardublockly.getLocalStr('invalidConnectionTitle'), Ardublockly.getLocalStr('invalidConnectionBody'), false);
      }
    } else {
      if (!destCharac) {
        Ardublockly.materialAlert(Ardublockly.getLocalStr('noCharacDestinationTitle'), Ardublockly.getLocalStr('noCharacBody'), false);
      } else {
        Ardublockly.materialAlert(Ardublockly.getLocalStr('noCharacOriginTitle'), Ardublockly.getLocalStr('noCharacBody'), false);
      }
    }
  }

}

/** It compares resources set checking if there's an intersection
 * @returns {!Boolean} shouldAdd: checks if the edge should be added or not.
 */
SmartTown.compareActionResources = (origin, orCharac, otherOrigin, orEdgeCharac) => {
  let shouldAdd = false;
  if (orCharac !== undefined && orEdgeCharac !== undefined) {
    shouldAdd = (orCharac.charac_alias !== orEdgeCharac.charac_alias);
    if (!shouldAdd) {
      let conditionSet = origin.conditions;
      let originConditionSet = new Set([...otherOrigin.conditions]);
      let intersection = new Set(
        [...conditionSet].filter(x => originConditionSet.has(x)));
      shouldAdd = intersection.size == 0;
    }
  }

  return shouldAdd;

}

/** Adds a new character to the play.
 * @returns {!Boolean} true, if characters is added, false if not.
 */
SmartTown.addCharacter = (charac) => {

  if (!SmartTown.characters[charac.charac_alias]) {
    SmartTown.characters[charac.charac_alias] = charac;
    return true;
  }
  return false;
}

/** sets available actions.
 * @param {!Boolean} list, action list.
 */
SmartTown.setActions = (list) => {
  list.forEach(action => {
    SmartTown.actions[action['name']] = action;
  });
}


/** 
 * Deletes all edges that have the node as an origin.
 * @param {!Boolean} node specified node.
 */
SmartTown.deleteAllOutEdges = (node) => {
  const orOut = SmartTown.graph.getNodeAttribute(node, 'outArcs');
  if (orOut) {
    orOut.forEach(edge => {
      let orEdgeNode = SmartTown.graph.getEdgeAttribute(edge, 'destination');
      let destIn = SmartTown.graph.getNodeAttribute(orEdgeNode, 'inArcs');
      let index = -1;
      if (destIn) {
        index = destIn.indexOf(edge);
      }
      if (index > -1)
        destIn.splice(index, 1);

      SmartTown.graph.updateNodeAttribute(orEdgeNode, 'inArcs', old => old = destIn);
      SmartTown.graph.dropEdge(edge);
    });
    SmartTown.graph.updateNodeAttribute(node, 'outArcs', old => old = []);
  }
}

/** 
 * Deletes all edges that have the node as an destination.
 * @param {!Boolean} node specified node.
 */
SmartTown.deleteAllInEdges = (node) => {
  const orIn = SmartTown.graph.getNodeAttribute(node, 'inArcs');
  if (orIn) {
    orIn.forEach(edge => {
      let orEdgeNode = SmartTown.graph.getEdgeAttribute(edge, 'origin');
      let destIn = SmartTown.graph.getNodeAttribute(orEdgeNode, 'outArcs');
      let index = -1;
      if (destIn) {
        index = destIn.indexOf(edge);
      }
      if (index > -1)
        destIn.splice(index, 1);

      SmartTown.graph.updateNodeAttribute(orEdgeNode, 'outArcs', old => old = destIn);
      SmartTown.graph.dropEdge(edge);
    });
    SmartTown.graph.updateNodeAttribute(node, 'inArcs', old => old = []);
  }
}

/** 
 * Resets and fills action dropdown.
 * @param {!Boolean} actionsToShow actionlist.
 */
SmartTown.resetAndFillActionDropDown = (actionsToShow) => {
  SmartTown.activeActionDropdown = actionsToShow;
  const actSelect = document.getElementById("act_type");
  while (actSelect.firstChild) {
    actSelect.removeChild(actSelect.lastChild);
  }
  let $emptyOpt = $("<option>").attr("value", "").text("");
  $("#act_type").append($emptyOpt);
  for (const [key, value] of Object.entries(actionsToShow)) {
    var $newOpt = $("<option>").attr("value", key).text(value.translatedName);
    $("#act_type").append($newOpt);
  }
};
/** 
 * Updates node graphic status.
 * @param {!Boolean} node node to update.
 */
SmartTown.updateNodeStatus = (node) => {
  let status = node.status;
  SmartTown.graph.updateNodeAttribute(node.id, 'color', newColor => newColor = SmartTown.statusColors[status]);
};

/** 
 * Updates all nodes graphic status.
 */
SmartTown.resetNodeStatus = () => {
  SmartTown.graph.updateEachNodeAttributes((node, attr) => {
    return {
      ...attr,
      color: attr.defaultColor
    };
  }, { attributes: ['color'] });
};

SmartTown.startSigma(null);

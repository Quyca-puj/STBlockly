/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
'use strict';

var SmartTown = SmartTown || {};

SmartTown.characters = {};
SmartTown.actions = {};
SmartTown.selectNodeForEdge = null;
/** Create a namespace for the application. */
SmartTown.graphContainer = document.getElementById("content_graph");

SmartTown.reset = () => {
  SmartTown.startSigma(null);
}

SmartTown.startSigma = function (graph) {

  window.oncontextmenu = () => { return false; };
  const form = document.getElementById('new_char_form');
  form.addEventListener("submit", function (event) {
    // stop form submission
    event.preventDefault();
    SmartTown.modalCharacOnSubmit();
  });
  if (graph) {
    SmartTown.graph = graph;
  } else {
    SmartTown.graph = new graphology.Graph({ allowSelfLoops: false, type: 'directed' });

  }
  SmartTown.sigmaRenderer = new Sigma(SmartTown.graph, SmartTown.graphContainer,
    {
      minArrowSize: 10,
      allowInvalidContainer: true,
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
    });
  SmartTown.camera = SmartTown.sigmaRenderer.getCamera();

  SmartTown.sigmaRenderer.on("downNode", (e) => {
    SmartTown.isDragging = true;
    SmartTown.draggedNode = e.node;
    SmartTown.graph.setNodeAttribute(SmartTown.draggedNode, "highlighted", true);
  });


  SmartTown.sigmaRenderer.on("doubleClickNode", (e) => {
    let node_dialog = document.getElementById('node_dialog');
    if (SmartTown.doubleClickedNode) {
      SmartTown.graph.setNodeAttribute(SmartTown.doubleClickedNode, "highlighted", false);
    }
    SmartTown.doubleClickedNode = e.node;

    const isNodeInPG =
      SmartTown.doubleClickedNode;
    const select_acttype = document.getElementById('act_type');
    const select_charac = document.getElementById('charac');
    if (isNodeInPG) {
      SmartTown.graph.setNodeAttribute(SmartTown.doubleClickedNode, "highlighted", true);
      node_dialog.style.display = 'block';
      let nodeAtrr = SmartTown.graph.getNodeAttributes(SmartTown.doubleClickedNode);
      console.log(nodeAtrr);
      select_charac.value = nodeAtrr['charac'] ? nodeAtrr['charac'].charac_alias : "empty";
      select_acttype.value = nodeAtrr['act_type'] ? nodeAtrr['act_type'].name : "empty";;
      const params = nodeAtrr['params'];
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          const aux_field = document.getElementById(key);
          aux_field.value = value;
        }
      }

    }
    e.preventSigmaDefault();
  });

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
    }
  });

  SmartTown.sigmaRenderer.getMouseCaptor().on("mousedown", () => {
    if (!SmartTown.sigmaRenderer.getCustomBBox()) SmartTown.sigmaRenderer.setCustomBBox(SmartTown.sigmaRenderer.getBBox());
  });

  SmartTown.sigmaRenderer.on('clickStage', () => {
    let node_dialog = document.getElementById('node_dialog');
    node_dialog.style.display = "none";
    SmartTown.doubleClickedNode = null;
    SmartTown.selectNodeForEdge = null;
    SmartTown.ClickedNode  = null;
    SmartTown.graph.updateEachNodeAttributes((node, attr) => {
      return {
        ...attr,
        highlighted: false
      };
    }, { attributes: ['highlighted'] });
    SmartTown.sigmaRenderer.refresh();
  });
  

  SmartTown.sigmaRenderer.on('clickNode', (e) => {
    let node_dialog = document.getElementById('node_dialog');
    if(SmartTown.ClickedNode ){
      SmartTown.graph.setNodeAttribute(SmartTown.ClickedNode , "highlighted", false);
    }

    SmartTown.ClickedNode = e.node;
    SmartTown.graph.setNodeAttribute(e.node, "highlighted", true);

  });


  
  SmartTown.sigmaRenderer.on("wheelNode", (e) => {
    SmartTown.graph.dropNode(e.node);
  });

}

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

SmartTown.deleteSelectedNode = () =>{
  if(SmartTown.ClickedNode){
    SmartTown.graph.dropNode(SmartTown.ClickedNode);
    SmartTown.ClickedNode = null;
  }
};


SmartTown.exportGraph = () => {
  return SmartTown.graph.export();
}

SmartTown.addEdge = (origin, destination) => {

  let key = origin > destination ? origin + "" + destination : destination + "" + origin;
  if (SmartTown.graph.hasEdge(key)) {
    const destIn = SmartTown.graph.getNodeAttribute(destination, 'inArcs');
    const orIn = SmartTown.graph.getNodeAttribute(origin, 'inArcs');
    const destOut = SmartTown.graph.getNodeAttribute(destination, 'outArcs');
    const orOut = SmartTown.graph.getNodeAttribute(origin, 'outArcs');
    let index = destIn.indexOf(key);
    if (index > -1)
      destIn.splice(index, 1);

    index = orIn.indexOf(key);
    if (index > -1)
      orIn.splice(index, 1);

    index = destOut.indexOf(key);
    if (index > -1)
      destOut.splice(index, 1);

    index = orOut.indexOf(key);
    if (index > -1)
      orOut.splice(index, 1);

    SmartTown.graph.updateNodeAttribute(destination, 'inArcs', destIn);
    SmartTown.graph.updateNodeAttribute(destination, 'outArcs', destOut);
    SmartTown.graph.updateNodeAttribute(origin, 'inArcs', orIn);
    SmartTown.graph.updateNodeAttribute(origin, 'outArcs', orOut);

    SmartTown.graph.dropEdge(key);
  } else {
    let isValid = true;
    const orAction = SmartTown.graph.getNodeAttribute(origin, 'action');
    const destIn = SmartTown.graph.getNodeAttribute(destination, 'inArcs');
    if (!destIn) destIn = {};
    const orOut = SmartTown.graph.getNodeAttribute(origin, 'outArcs');
    if (!orOut) orOut = {};

    /*
    edge guarda origen y destino. Se puede tomar origen de las edges y buscar attr en el grafo. De ahi tomar action y sacarlo.
    */

    destIn.forEach(element => {
      let orEdgeNode = SmartTown.graph.getEdgeAttribute(element, 'origin');
      let orEdgeAction = SmartTown.graph.getEdgeAttribute(orEdgeNode, 'action');
      let isValid = isValid && !SmartTown.compareActionResources(orAction, orEdgeAction);
    }
    );

    if (isValid) {
      destIn.push(key);
      orOut.push(key);
      SmartTown.graph.updateNodeAttribute(destination, 'inArcs', destIn);
      SmartTown.graph.updateNodeAttribute(origin, 'outArcs', orOut);
      SmartTown.graph.addEdgeWithKey(key, origin, destination, {
        weight: 1,
        type: "arrow",
        size: 5,
        color: "#000000",
        origin: origin,
        destination: destination
      });
    }
  }

}

SmartTown.compareActionResources = (origin, otherOrigin) => {
  let conditionSet = origin.conditions;
  let intersection = new Set(
    [...conditionSet].filter(x => otherOrigin.conditions.has(x)));
  return intersection.size == 0;
}

SmartTown.addCharacter = (charac) => {

  if (!SmartTown.characters[charac.charac_alias]) {
    SmartTown.characters[charac.charac_alias] = charac;
    return true;
  }
  return false;
}

SmartTown.setActions = (list) => {
  list.forEach(action => {
    SmartTown.actions[action['name']] = action;
  });
}

SmartTown.startSigma(null);

/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
'use strict';

var SmartTown = SmartTown || {};

SmartTown.characters = {};
SmartTown.selectNodeForEdge = null;
/** Create a namespace for the application. */
SmartTown.graphContainer = document.getElementById("content_graph");

SmartTown.reset = () => {
  SmartTown.startSigma();
}

SmartTown.startSigma = function () {

  window.oncontextmenu = () => { return false; };
  const form = document.getElementById('new_char_form');
  form.addEventListener("submit", function (event) {
    // stop form submission
    event.preventDefault();
    SmartTown.modalCharacOnSubmit();
  });

  SmartTown.graph = new graphology.Graph({ allowSelfLoops: false, type: 'directed' });
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
      select_acttype.value = nodeAtrr['act_type'];
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

  });

  SmartTown.sigmaRenderer.getMouseCaptor().on("mousedown", () => {
    if (!SmartTown.sigmaRenderer.getCustomBBox()) SmartTown.sigmaRenderer.setCustomBBox(SmartTown.sigmaRenderer.getBBox());
  });

  SmartTown.sigmaRenderer.on('clickStage', () => {
    let node_dialog = document.getElementById('node_dialog');
    node_dialog.style.display="none";
    SmartTown.doubleClickedNode = null;
    SmartTown.selectNodeForEdge = null;

    SmartTown.graph.updateEachNodeAttributes((node, attr) => {
      return {
        ...attr,
        highlighted: false
      };
    }, { attributes: ['highlighted'] });
    SmartTown.sigmaRenderer.refresh();
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


SmartTown.exportGraph = () => {
  return SmartTown.graph.export();
}

SmartTown.addEdge = (origin, destination) => {

  /*
  Tomar nodo destino
  Tomar edges hacia nodo destino.
  Tomar origen de cada edge y ver set de condiciones.
  Combinar set de condiciones y ver si es valido.

  Si es valido:
    creamos arco y agregamos key a cada atributo de cada place.
  si no:
    retornamos.
  */
  let key = origin > destination ? origin + "" + destination : destination + "" + origin;
  if (SmartTown.graph.hasEdge(key)) {
    SmartTown.graph.dropEdge(key);
  } else {
    SmartTown.graph.addEdgeWithKey(key, origin, destination, {
      weight: 1,
      type: "arrow",
      size: 5,
      color: "#000000"
    });
  }





  // let isValid = true;
  // const destIn = SmartTown.graph.getNodeAttribute(destination, 'inArcs');
  // destIn.forEach(element => {
  //   let edge = SmartTown.graph.getEdgeAttribute(element, 'conditions');
  //   const attributes = graph.getEdgeAttributes(edge);
  //   let isValid = isValid && !element.getOrigin().hasConditions(origin);
  // });
  // if (isValid) {
  //   const arc = new Arc(origin, destination);
  //   origin.addArc(arc, true);
  //   destination.addArc(arc, false);
  //   this.arcs.push(arc);
  // }

  // return isValid;

}

SmartTown.addNode = (name, attributes) => {
  graph.addNode(name, attributes);
}

SmartTown.removeNode = (node) => {
  SmartTown.graph.dropNode(node);
}

SmartTown.removeEdge = (edge) => {
  SmartTown.graph.dropEdge(edge);
}


SmartTown.addCharacter = (charac) => {

  if (!SmartTown.characters[charac.charac_alias]) {
    SmartTown.characters[charac.charac_alias] = charac;
    return true;
  }
  return false;
}

SmartTown.startSigma();

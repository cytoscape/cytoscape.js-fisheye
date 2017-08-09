const defaultOpts = {
  animate: false,
  distortionFactor: 1
};
 

const distort = (val, distortionFactor) => {
  return ( ( distortionFactor + 1) * val ) / ( ( distortionFactor * val) + 1 );
};

// The position of a node for a fisheye view is a function of the node's position
// as well as the focus node's position
// node - specific node to calculate the fisheye position
// focusNode - the node that is the focus of the fisheye view
// globalBB - the bounding box for the fisheye view 
const fePosition = (focusPos, node, globalBB, opts) => {
  const nodeRPos = node.position();

  let dNormX = Math.abs((nodeRPos.x - focusPos.x));
  let dNormY = Math.abs((nodeRPos.y - focusPos.y));

  let dMaxX;
  if (nodeRPos.x <= focusPos.x) {
    dMaxX = focusPos.x - globalBB.x1;
  } else {
    dMaxX = globalBB.x2 - focusPos.x;
  }

  let dMaxY;
  if (nodeRPos.y <= focusPos.y) {
    dMaxY = focusPos.y - globalBB.y1;
  } else {
    dMaxY = globalBB.y2 - focusPos.y;
  }

  const distortedFactorX = distort(dNormX / dMaxX, opts.distortion);
  const distortedFactorY = distort(dNormY / dMaxY, opts.distortion);

  let x = focusPos.x > nodeRPos.x ? focusPos.x - ( distortedFactorX * dMaxX ) : focusPos.x + ( distortedFactorX * dMaxX );
  let y = focusPos.y > nodeRPos.y ? focusPos.y - ( distortedFactorY * dMaxY ) : focusPos.y + ( distortedFactorY * dMaxY );

  return {
    x: x,
    y: y
  };
};

const feSize = (node, focusNode, opts) => {
  const nodeSize = node.layoutDimenions({
    nodeDimensionsIncludeLabels: false
  });
  const nodePos = node.position();

  const focusPos = focusNode.position();
};

const maxDetail = (node, focusNode, opts) => {
  const nodeFisheyeSize = feSize(node, focusNode, opts);
  const maxDetail = opts.maxNodeDetail;

};

const visualWorth = (node, focusNode, opts) => {
  const nodePos = node.position();
  const focusPos = focusNode.position();

};

const fisheyePosition = (focusPos, node, radius, distortion) => {
  const nodePos = node.position();
  node.data('fisheye.pos-before', nodePos);

  const e = Math.exp(distortion);
  let k0 = e / (e - 1) * radius;
  let k1 = distortion / radius;

  const dx = nodePos.x - focusPos.x;
  const dy = nodePos.y - focusPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // too far away ? don't apply anything
  if (!distance || distance >= radius) {
    return node.data('fisheye.pos-before');
  }

  const k = k0 * (1 - Math.exp(-distance * k1)) / distance * .75 + .25;
  return {
    x: focusPos.x + dx * k,
    y: focusPos.y + dy * k
  };
};


module.exports = function (focusPos, opts) {
  let cy = this;

  cy.nodes().forEach(node => {
    const fePos = fePosition(focusPos, node, cy.nodes().boundingBox(), opts);
    // node.position(fePos);
    node.animate({
      position: fePos,
      // queue: true,
      duration: 100
    });

    // node.position(fisheyePosition(focusPos, node, opts.radius, opts.distortion));
  });
  return this; // chainability
};
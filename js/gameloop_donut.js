import { game_engine_instance } from "./core/game_engine_instance.js";

const shapes = game_engine_instance.shapes;

// Initialize an array to track the state of each key
const keysState = {};

// Update key states on keydown and keyup
document.addEventListener("keydown", (event) => {
  keysState[event.key] = true; // Store key state as true
});

document.addEventListener("keyup", (event) => {
  keysState[event.key] = false; // Store key state as false
});

// Example: Move a smaller block with arrow keys
let posX = 300;
let posY = 200;

const PI = 3.141592;
const TAU = PI * 2;
const RADIAN = PI / 180.0;
const HALF_PI = PI / 2;
const PI1_4 = PI / 4;

let currentAngle = 0;

let VELOCITY_PX = RADIAN * 25;

export const getCirclePoint = (angle, offsetX, offsetY, factor) => [
  Math.cos(angle) * factor + offsetX,
  Math.sin(angle) * factor + offsetY,
];

export const rotateVertexAxisX = (vertex, angle) => {
  let vertexOut = [0, 0, 0];
  vertexOut[0] = vertex[0];
  vertexOut[2] = vertex[2] * Math.cos(angle) - vertex[1] * Math.sin(angle);
  vertexOut[1] = vertex[1] * Math.cos(angle) + vertex[2] * Math.sin(angle);
  return vertexOut;
};
export const rotateVertexAxisY = (vertex, angle) => {
  let vertexOut = [0, 0, 0];
  vertexOut[0] = vertex[0] * Math.cos(angle) - vertex[2] * Math.sin(angle);
  vertexOut[1] = vertex[1];
  vertexOut[2] = vertex[2] * Math.cos(angle) + vertex[0] * Math.sin(angle);
  return vertexOut;
};
export const rotateVertexAxisZ = (vertex, angle) => {
  let vertexOut = [0, 0, 0];
  vertexOut[2] = vertex[2];
  vertexOut[0] = vertex[0] * Math.cos(angle) - vertex[1] * Math.sin(angle);
  vertexOut[1] = vertex[1] * Math.cos(angle) + vertex[0] * Math.sin(angle);
  return vertexOut;
};

export const rotateVertexAxisXYZ = (vertex, angleX, angleY, angleZ) => {
  let cosX = Math.cos(angleX);
  let cosY = Math.cos(angleY);
  let cosZ = Math.cos(angleZ);
  let sinX = Math.sin(angleX);
  let sinY = Math.sin(angleY);
  let sinZ = Math.sin(angleZ);

  let final_x =
    (vertex[0] * cosY + (vertex[2] * cosX + vertex[1] * -sinX) * -sinY) * cosZ +
    (vertex[1] * cosX + vertex[2] * sinX) * -sinZ;

  let final_y =
    (vertex[1] * cosX + vertex[2] * sinX) * cosZ +
    (vertex[0] * cosY + (vertex[2] * cosX + vertex[1] * -sinX) * -sinY) * sinZ;

  let final_z =
    (vertex[2] * cosX + vertex[1] * -sinX) * cosY + vertex[0] * sinY;

  return [final_x, final_y, final_z];
};

export const addVertexToVertex = (vertex, addition) => [
  vertex[0] + addition[0],
  vertex[1] + addition[1],
  vertex[2] + addition[2],
];

export const generateSolidDonut = (
  numTransversalCircles = 8,
  circlesResolution = 16,
  donutRadius,
  circlesRadius
) => {
  const solidData = {
    numVertices: 0,
    numEdges: 0,
    vertices: [],
    edges: [],
  };
  let circleAngleOffset = 0;

  for (
    let circlesIterator = 0;
    circlesIterator < numTransversalCircles;
    ++circlesIterator
  ) {
    const offsetCircle = [
      Math.cos(circleAngleOffset) * donutRadius,
      0,
      Math.sin(circleAngleOffset) * donutRadius,
    ];

    const currentCircleVerticesStartIndex = solidData.numVertices; // Store the starting index of the current circle

    for (
      let anglePointCircle = 0;
      anglePointCircle < TAU;
      anglePointCircle += TAU / circlesResolution
    ) {
      const circleVertex = [
        Math.cos(anglePointCircle) * circlesRadius,
        Math.sin(anglePointCircle) * circlesRadius,
        0,
      ];
      let vertex = rotateVertexAxisY(circleVertex, circleAngleOffset);
      vertex = addVertexToVertex(vertex, offsetCircle);

      solidData.vertices.push(vertex);
      const currentVertexIndex = solidData.numVertices;
      solidData.numVertices += 1;

      // Create edges with the current vertex and the previous vertex in the same circle
      if (circlesIterator > 0) {
        const previousCircleVertexIndex =
          currentVertexIndex - circlesResolution;
        solidData.edges.push([previousCircleVertexIndex, currentVertexIndex]);
        solidData.numEdges += 1;
      }

      // Create edges with the current vertex and the next vertex in the same circle
      const nextVertexIndex =
        ((currentVertexIndex + 1) % circlesResolution) +
        circlesIterator * circlesResolution;
      if (anglePointCircle + TAU / circlesResolution < TAU) {
        solidData.edges.push([currentVertexIndex, nextVertexIndex]);
        solidData.numEdges += 1;
      }
    }

    // Connect the last vertex of the current circle to the first vertex of the same circle
    const lastVertexIndex =
      currentCircleVerticesStartIndex + circlesResolution - 1;
    solidData.edges.push([lastVertexIndex, currentCircleVerticesStartIndex]);
    solidData.numEdges += 1;

    circleAngleOffset += TAU / numTransversalCircles;
  }

  // Connect the last circle to the first circle
  for (let i = 0; i < circlesResolution; i++) {
    const firstCircleVertexIndex = i; // Vertex index of the first circle
    const lastCircleVertexIndex =
      (numTransversalCircles - 1) * circlesResolution + i; // Vertex index of the last circle
    solidData.edges.push([lastCircleVertexIndex, firstCircleVertexIndex]);
    solidData.numEdges += 1;
  }

  return solidData;
};

const solidData = generateSolidDonut(64, 64, 0, 1);

let tempVertices = new Array(solidData.numVertices);

// Main game loop function
export const gameLoop = ({ graphics }, deltaTime) => {
  const viewportWidthHalf = graphics.viewportWidth >> 1;
  const viewportHeightHalf = graphics.viewportHeight >> 1;
  const aspectRatio = graphics.viewportHeight / graphics.viewportWidth;

  for (
    let vertexIterator = 0;
    vertexIterator < solidData.numVertices;
    ++vertexIterator
  ) {
    const vertexData = solidData.vertices[vertexIterator];

    let vertex = rotateVertexAxisXYZ(
      vertexData,
      currentAngle,
      currentAngle * 0.5,
      0
    );

    vertex = addVertexToVertex(vertex, [0, 0, 2]);

    tempVertices[vertexIterator] = [
      (vertex[0] / vertex[2]) * viewportWidthHalf * 0.5 * aspectRatio +
        viewportWidthHalf,
      (vertex[1] / vertex[2]) * viewportHeightHalf * 0.5 + viewportHeightHalf,
    ];
  }

  for (
    let edgeIterator = 0;
    edgeIterator < solidData.numEdges;
    ++edgeIterator
  ) {
    const edge = solidData.edges[edgeIterator];

    const vertexA = tempVertices[edge[0]];
    const vertexB = tempVertices[edge[1]];

    if (vertexB === undefined) continue;

    shapes.drawNormalizedLine(
      vertexA[0],
      vertexA[1],
      vertexB[0],
      vertexB[1],
      0x000000
    );

    // shapes.drawCircleFill(vertexA[0], vertexA[1], 2, 0xff0000);
    // shapes.drawCircleFill(vertexB[0], vertexB[1], 2, 0xff0000);
  }
  // for (
  //   let vertexIterator = 0;
  //   vertexIterator < solidData.numVertices;
  //   ++vertexIterator
  // ) {
  //   const vertex = tempVertices[vertexIterator];

  //   shapes.drawCircleFill(vertex[0], vertex[1], 2, 0xff0000);
  // }

  currentAngle += RADIAN * 100 * deltaTime;
};

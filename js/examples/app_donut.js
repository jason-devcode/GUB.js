import { GameEngine } from "../gubjs/src/core/game_engine.js";
import { GraphicEngine } from "../gubjs/src/core/graphic_engine.js";
import { Shapes } from "../gubjs/src/utils/Shapes.js";

const PI = 3.141592;
const TAU = PI*2.0;

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

/**
 * Initializes the game application context, setting up the main game loop.
 *
 * @param {Object} params - Configuration object for the game context.
 * @param {GraphicEngine} params.graphics - Instance of the graphic engine to manage rendering.
 * @param {Shapes} params.shapes - Instance of the Shapes class for drawing shapes.
 * @returns {function(number): void} Game loop function that takes `deltaTime` to update the game.
 */
export const gameAppContext = ({ graphics, shapes }) => {
  graphics.setClearFramebufferColor(0xFFFFFFFF);

  const RADIAN = 0.01745329251;

  let currentAngle = 0.0;

  const solidData = generateSolidDonut(32, 32, 2, 1);

  let tempVertices = new Array(solidData.numVertices);
  const viewportWidthHalf = graphics.viewportWidth >> 1;
  const viewportHeightHalf = graphics.viewportHeight >> 1;
  const aspectRatio = graphics.viewportHeight / graphics.viewportWidth;

  /**
   * Main game loop that updates object positions based on elapsed time.
   *
   * @param {number} deltaTime - Time in seconds since the last frame.
   */
  const gameLoop = (deltaTime) => {
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

      vertex = addVertexToVertex(vertex, [0, 0, 4]);

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

  return gameLoop;
};

/**
 * Main function that initializes and runs the game.
 */
export const main = () => {
  const game = new GameEngine();
  game.setGameAppContext(gameAppContext);
  game.startGameLoop();
};

main();

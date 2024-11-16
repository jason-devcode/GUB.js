import { GameEngine } from "./core/game_engine.js";
import { GraphicEngine } from "./core/graphic_engine.js";
import { Shapes } from "./utils/Shapes.js";

import { SLATE_950 } from "./utils/colors.js";

export const getCirclePoint = (angle, offsetX, offsetY, factor) => [
  Math.cos(angle) * factor + offsetX,
  Math.sin(angle) * factor + offsetY,
];

export const cubeData = {
  numVertices: 8,
  vertices: [
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],

    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
  ],
  edges: [
    // front face
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    // back face
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    // corners
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ],
};

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

/**
 * Initializes the game application context, setting up the main game loop.
 *
 * @param {Object} params - Configuration object for the game context.
 * @param {GraphicEngine} params.graphics - Instance of the graphic engine to manage rendering.
 * @param {Shapes} params.shapes - Instance of the Shapes class for drawing shapes.
 * @returns {function(number): void} Game loop function that takes `deltaTime` to update the game.
 */
export const gameAppContext = ({ graphics, shapes }) => {
  graphics.setClearFramebufferColor(SLATE_950);

  const RADIAN = 0.01745329251;
  const PI = 3.141592;

  let currentAngle = 0.0;
  const viewportWidthHalf = graphics.viewportWidth >> 1;
  const viewportHeightHalf = graphics.viewportHeight >> 1;
  const aspectRatio = graphics.viewportHeight / graphics.viewportWidth;

  let tempVertices = new Array(cubeData.numVertices);

  /**
   * Main game loop that updates object positions based on elapsed time.
   *
   * @param {number} deltaTime - Time in seconds since the last frame.
   */
  const gameLoop = (deltaTime) => {
    for (
      let vertexIterator = 0;
      vertexIterator < cubeData.numVertices;
      ++vertexIterator
    ) {
      const vertexData = cubeData.vertices[vertexIterator];

      let vertex = rotateVertexAxisXYZ(
        vertexData,
        currentAngle,
        currentAngle * 0.5,
        currentAngle * 0.5
      );

      vertex = addVertexToVertex(vertex, [0, 0, 2.5]);

      tempVertices[vertexIterator] = [
        (vertex[0] / vertex[2]) * viewportWidthHalf * 0.5 * aspectRatio +
          viewportWidthHalf,
        (vertex[1] / vertex[2]) * viewportHeightHalf * 0.5 + viewportHeightHalf,
      ];
    }

    for (
      let edgeIterator = 0;
      edgeIterator < cubeData.edges.length;
      ++edgeIterator
    ) {
      const edge = cubeData.edges[edgeIterator];

      const vertexA = tempVertices[edge[0]];
      const vertexB = tempVertices[edge[1]];

      shapes.drawNormalizedLine(
        vertexA[0],
        vertexA[1],
        vertexB[0],
        vertexB[1],
        0xffffff
      );

      shapes.drawCircleFill(vertexA[0], vertexA[1], 5, 0xff0000);
      shapes.drawCircleFill(vertexB[0], vertexB[1], 5, 0xff0000);
    }

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

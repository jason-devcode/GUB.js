import { GameEngine } from "./core/game_engine.js";
import { GraphicEngine } from "./core/graphic_engine.js";

import { PPMImage } from "./utils/PPMImage.js";
import { Shapes } from "./utils/Shapes.js";

import {
  GRAY_500,
  GREEN_500,
  ORANGE_500,
  RED_500,
  SLATE_950,
  WHITE,
  YELLOW_500,
} from "./utils/colors.js";

/**
 *
 * @param {Array<number>} vertex
 * @param {number} angle
 */
export const vertexRotateX = (vertex, angle) => {
  const vertexOutput = [];
  vertexOutput[0] = vertex[0];
  vertexOutput[1] = vertex[1] * Math.cos(angle) - vertex[2] * Math.sin(angle);
  vertexOutput[2] = vertex[2] * Math.cos(angle) + vertex[1] * Math.sin(angle);
  return vertexOutput;
};

/**
 *
 * @param {Array<number>} vertex
 * @param {number} angle
 */
export const vertexRotateY = (vertex, angle) => {
  const vertexOutput = [];
  vertexOutput[0] = vertex[0] * Math.cos(angle) - vertex[2] * Math.sin(angle);
  vertexOutput[1] = vertex[1];
  vertexOutput[2] = vertex[2] * Math.cos(angle) + vertex[0] * Math.sin(angle);
  return vertexOutput;
};

/**
 * Initializes the game application context, setting up the main game loop.
 *
 * @param {Object} params - Configuration object for the game context.
 * @param {GraphicEngine} params.graphics - Instance of the graphic engine to manage rendering.
 * @param {Shapes} params.shapes - Instance of the Shapes class for drawing shapes.
 * @returns {function(number): void} Game loop function that takes `deltaTime` to update the game.
 */
export const gameAppContext = async ({ graphics, shapes }) => {
  graphics.setClearFramebufferColor(SLATE_950);
  graphics.enableDepthBufferRendering();

  const RADIAN = 0.01745329251;
  const aspectRatio = graphics.viewportHeight / graphics.viewportWidth;

  let currentAngle = 0.0;

  const cubeData = {
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
    triangles: [
      // front face
      [0, 1, 2, RED_500],
      [0, 2, 3, RED_500],

      // back face
      [4, 5, 6, YELLOW_500],
      [4, 6, 7, YELLOW_500],

      // top face
      [4, 5, 1, WHITE],
      [4, 1, 0, WHITE],

      // bottom face
      [7, 6, 2, GREEN_500],
      [7, 2, 3, GREEN_500],

      // left face
      [4, 0, 3, GRAY_500],
      [4, 3, 7, GRAY_500],

      // right face
      [1, 5, 6, ORANGE_500],
      [1, 6, 2, ORANGE_500],
    ],
    numTriangles: 12,
    numVertices: 8,
  };

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
      let vertex = vertexRotateY(
        cubeData.vertices[vertexIterator],
        currentAngle
      );

      vertex = vertexRotateX(vertex, currentAngle * 0.5);

      vertex[2] += 2.5;
      // vertex[0] += 2;
      vertex[0] /= vertex[2] || 1;
      vertex[1] /= vertex[2] || 1;

      let px =
        (vertex[0] * graphics.viewportWidth * aspectRatio) / 4 +
        graphics.viewportWidth / 2;
      let py =
        (vertex[1] * graphics.viewportHeight) / 4 + graphics.viewportHeight / 2;

      tempVertices[vertexIterator] = [px, py, vertex[2]];
    }

    // triangle drawing
    for (let triangle of cubeData.triangles) {
      const vertexA = tempVertices[triangle[0]];
      const vertexB = tempVertices[triangle[1]];
      const vertexC = tempVertices[triangle[2]];
      const color = triangle[3];

      shapes.drawScanLineDepthTriangle(
        vertexA[0],
        vertexA[1],
        vertexA[2],
        vertexB[0],
        vertexB[1],
        vertexB[2],
        vertexC[0],
        vertexC[1],
        vertexC[2],
        color
      );

      // shapes.drawLine(vertexA[0], vertexA[1], vertexB[0], vertexB[1], 0xeeff00);
      // shapes.drawLine(vertexB[0], vertexB[1], vertexC[0], vertexC[1], 0xeeff00);
      // shapes.drawLine(vertexC[0], vertexC[1], vertexA[0], vertexA[1], 0xeeff00);

      // shapes.drawCircleFill(vertexA[0], vertexA[1], 5, 0xffff00);
      // shapes.drawCircleFill(vertexB[0], vertexB[1], 5, 0xffff00);
      // shapes.drawCircleFill(vertexC[0], vertexC[1], 5, 0xffff00);
    }

    // vertex drawing
    // for (
    //   let vertexIterator = 0;
    //   vertexIterator < cubeData.numVertices;
    //   ++vertexIterator
    // ) {
    //   let vertex = tempVertices[vertexIterator];

    //   shapes.drawCircleFill(vertex[0], vertex[1], 10, 0xff0000);
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

  // Call setGameAppContext, handling the promise if the context is async
  game
    .setGameAppContext(gameAppContext)
    .then(() => {
      // Once the game loop context is set, start the game loop
      game.startGameLoop();
    })
    .catch((error) => {
      // Handle any errors that occur while setting the game loop context
      console.error("Error setting game loop context:", error);
    });
};

main();
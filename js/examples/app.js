import { GameEngine } from "../gubjs/src/core/game_engine.js";
import { GraphicEngine } from "../gubjs/src/core/graphic_engine.js";

import { PPMImage } from "../gubjs/src/utils/PPMImage.js";
import { Shapes } from "../gubjs/src/utils/Shapes.js";

import {
  GRAY_500,
  GREEN_500,
  ORANGE_500,
  RED_500,
  SLATE_950,
  WHITE,
  YELLOW_500,
} from "../gubjs/src/utils/colors.js";
import { CKeyEventManager } from "../gubjs/src/core/event_managers/CKeyEventManager.js";

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
 *
 * @param {Array<number>} vertex
 * @param {number} angle
 */
export const vertexRotateZ = (vertex, angle) => {
  const vertexOutput = [];
  vertexOutput[0] = vertex[0] * Math.cos(angle) - vertex[1] * Math.sin(angle);
  vertexOutput[1] = vertex[1] * Math.cos(angle) + vertex[0] * Math.sin(angle);
  vertexOutput[2] = vertex[2];
  return vertexOutput;
};

/**
 * Initializes the game application context, setting up the main game loop.
 *
 * @param {Object} params - Configuration object for the game context.
 * @param {GraphicEngine} params.graphics - Instance of the graphic engine to manage rendering.
 * @param {Shapes} params.shapes - Instance of the Shapes class for drawing shapes.
 * @param {CKeyEventManager} params.key_press_event_manager - Instance of key event manager for key press event management.
 * @returns {function(number): void} Game loop function that takes `deltaTime` to update the game.
 */
export const gameAppContext = async ({
  graphics,
  shapes,
  key_press_event_manager,
}) => {
  graphics.setClearFramebufferColor(SLATE_950);
  graphics.enableDepthBufferRendering();

  const RADIAN = 0.01745329251;
  const aspectRatio = graphics.viewportHeight / graphics.viewportWidth;

  let currentAngle = 0.0;
  let image = await PPMImage.loadImage("wood_box.ppm");
  console.log(image);
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
    texels: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    triangles: [
      // front face
      [0, 1, 2, 0, 1, 3, RED_500],
      [0, 2, 3, 0, 3, 2, RED_500],

      // back face
      [4, 6, 5, 0, 1, 3, YELLOW_500],
      [4, 7, 6, 0, 3, 2, YELLOW_500],

      // top face
      [4, 5, 1, 0, 1, 3, WHITE],
      [4, 1, 0, 0, 3, 2, WHITE],

      // bottom face
      [3, 2, 6, 0, 1, 3, GREEN_500],
      [3, 6, 7, 0, 3, 2, GREEN_500],

      // left face
      [4, 0, 3, 0, 1, 3, GRAY_500],
      [4, 3, 7, 0, 3, 2, GRAY_500],

      // right face
      [1, 5, 6, 0, 1, 3, ORANGE_500],
      [1, 6, 2, 0, 3, 2, ORANGE_500],
    ],
    numTriangles: 12,
    numVertices: 8,
  };

  let tempVertices = new Array(cubeData.numVertices);

  const drawCube = (position, rotation) => {
    for (
      let vertexIterator = 0;
      vertexIterator < cubeData.numVertices;
      ++vertexIterator
    ) {
      let vertex = vertexRotateY(
        cubeData.vertices[vertexIterator],
        rotation[0]
      );

      vertex = vertexRotateX(vertex, rotation[1]);
      vertex[0] += position[0];
      vertex[1] += position[1];
      vertex[2] += position[2];

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

      const area =
        (vertexB[0] - vertexA[0]) * (vertexC[1] - vertexA[1]) -
        (vertexC[0] - vertexA[0]) * (vertexB[1] - vertexA[1]);

      if (area > 0) continue;

      const texelA = cubeData.texels[triangle[3]];
      const texelB = cubeData.texels[triangle[4]];
      const texelC = cubeData.texels[triangle[5]];

      const color = triangle[6];

      // shapes.drawScanLineDepthTriangle(
      //   vertexA[0],
      //   vertexA[1],
      //   vertexA[2],
      //   vertexB[0],
      //   vertexB[1],
      //   vertexB[2],
      //   vertexC[0],
      //   vertexC[1],
      //   vertexC[2],
      //   color,
      // );

      shapes.drawScanLineDepthTextureTriangle(
        vertexA[0],
        vertexA[1],
        vertexA[2],
        texelA[0],
        texelA[1],
        vertexB[0],
        vertexB[1],
        vertexB[2],
        texelB[0],
        texelB[1],
        vertexC[0],
        vertexC[1],
        vertexC[2],
        texelC[0],
        texelC[1],
        image
      );

      // shapes.drawDepthLine(
      //   vertexA[0],
      //   vertexA[1],
      //   vertexA[2],
      //   vertexB[0],
      //   vertexB[1],
      //   vertexB[2],
      //   0x00ffff
      // );
      // shapes.drawDepthLine(
      //   vertexB[0],
      //   vertexB[1],
      //   vertexB[2],
      //   vertexC[0],
      //   vertexC[1],
      //   vertexC[2],
      //   0x00ffff
      // );
      // shapes.drawDepthLine(
      //   vertexC[0],
      //   vertexC[1],
      //   vertexC[2],
      //   vertexA[0],
      //   vertexA[1],
      //   vertexA[2],
      //   0x00ffff
      // );

      // shapes.drawCircleFill(vertexA[0], vertexA[1], 5, 0xffff00);
      // shapes.drawCircleFill(vertexB[0], vertexB[1], 5, 0xffff00);
      // shapes.drawCircleFill(vertexC[0], vertexC[1], 5, 0xffff00);
    }
  };

  let posX = 0.0;
  let posY = 0.0;
  let posZ = 2.5;

  key_press_event_manager.addActionListener("ArrowLeft", (deltaTime) => {
    posX -= deltaTime * 10;
  });

  key_press_event_manager.addActionListener("ArrowRight", (deltaTime) => {
    posX += deltaTime * 10;
  });

  key_press_event_manager.addActionListener("ArrowUp", (deltaTime) => {
    posZ += deltaTime * 2;
  });

  key_press_event_manager.addActionListener("ArrowDown", (deltaTime) => {
    posZ -= deltaTime * 2;
  });
  
  

  /**
   * Main game loop that updates object positions based on elapsed time.
   *
   * @param {number} deltaTime - Time in seconds since the last frame.
   */
  const gameLoop = (deltaTime) => {
    drawCube([posX, 0, posZ], [currentAngle * 0.2, currentAngle * 0.8]);
    currentAngle += RADIAN * 100 * deltaTime;
  };

  return gameLoop;
};

/**
 * Main function that initializes and runs the game.
 */
export const main = () => {
  const game = new GameEngine(512,256);
  // const game = new GameEngine();

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

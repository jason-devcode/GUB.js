import { GameEngine } from "./core/game_engine.js";
import { GraphicEngine } from "./core/graphic_engine.js";
import { Shapes } from "./utils/Shapes.js";

/**
 * Initializes the game application context, setting up the main game loop.
 *
 * @param {Object} params - Configuration object for the game context.
 * @param {GraphicEngine} params.graphics - Instance of the graphic engine to manage rendering.
 * @param {Shapes} params.shapes - Instance of the Shapes class for drawing shapes.
 * @returns {function(number): void} Game loop function that takes `deltaTime` to update the game.
 */
export const gameAppContext = ({ graphics, shapes }) => {
  const RADIAN = 0.01745329251;

  let currentAngle = 0.0;

  /**
   * Main game loop that updates object positions based on elapsed time.
   *
   * @param {number} deltaTime - Time in seconds since the last frame.
   */
  const gameLoop = (deltaTime) => {
    let x = Math.cos(currentAngle) * 30;
    let y = Math.sin(currentAngle) * 30;

    shapes.drawCircleFill(200 + x, 200 + y, 5, 0x00ffff);

    currentAngle += RADIAN * 500 * deltaTime;
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

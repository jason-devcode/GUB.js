import { GraphicEngine } from "./graphic_engine.js";

/**
 * GameEngine class that serves as the foundation for game development, providing
 * essential utilities and components such as the graphics engine, game loop,
 * and shared game context. The GameEngine class abstracts common functionalities
 * required for building games, simplifying the creation and management of game
 * logic, rendering, and context management.
 */
export class GameEngine {
  /**
   * Initializes the GameEngine with a specified viewport ID for rendering.
   * @param {string} [viewportDivId="game-viewport"] - The ID of the HTML element to be used as the viewport for rendering.
   */
  constructor(viewportDivId = "game-viewport") {
    this.initializeGraphicEngine(viewportDivId);
    this.initializeGameEngineContext();
  }

  /**
   * Initializes the GraphicEngine instance for handling rendering tasks.
   * @param {string} viewportDivId - The ID of the HTML element used as the viewport for rendering.
   */
  initializeGraphicEngine(viewportDivId) {
    this.graphic_engine = new GraphicEngine(viewportDivId);
  }

  /**
   * Sets up the main game context, which maintains references to core subsystems.
   */
  initializeGameEngineContext() {
    this.instance_context = { graphics: this.graphic_engine };
  }

  /**
   * Sets the callback function for the game loop, defining the primary game
   * update and render cycle. This function is called on each frame to update
   * and render the game state.
   * @param {function} gameLoopCallback - The callback function for the game loop, which receives the game engine context.
   */
  setGameLoop(gameLoopCallback) {
    this.gameLoopCallback = () => {
      // Clear the framebuffer with a black color (0x00000000).
      this.graphic_engine.clearFramebuffer(0x00000000);
      // Execute the provided callback with the current game engine context.
      gameLoopCallback(this.instance_context);
      // Render the framebuffer contents.
      this.graphic_engine.render();
      // Schedule the next frame in the game loop.
      requestAnimationFrame(this.gameLoopCallback);
    };
  }

  /**
   * Starts the game loop if a callback has been defined, initiating the
   * recurring update-render cycle.
   */
  startGameLoop() {
    if (this.gameLoopCallback) {
      // Begin the recurring game loop.
      requestAnimationFrame(this.gameLoopCallback);
    }
  }
}

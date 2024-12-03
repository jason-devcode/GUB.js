import { Shapes } from "../utils/Shapes.js";
import { GraphicEngine } from "./graphic_engine.js";

/**
 * GameEngine class that serves as the foundation for game development, providing
 * essential utilities and components such as the graphics engine, game loop,
 * and shared game context. The GameEngine class abstracts common functionalities
 * required for building games, simplifying the creation and management of game
 * logic, rendering, and context management.
 */
export class GameEngine {
  static MILLISECONDS = 1000; // Constant representing milliseconds in a second
  static MILLISECONDS_FACTOR = 0.001; // Factor to convert milliseconds to seconds

  /**
   * Creates an instance of GameEngine.
   * @param {number} [customViewportWidth] - Custom width for the viewport in pixels (optional).
   * @param {number} [customViewportHeight] - Custom height for the viewport in pixels (optional).
   * @param {string} [viewportDivId="game-viewport"] - The ID of the HTML element to be used as the viewport for rendering.
   */
  constructor(
    customViewportWidth,
    customViewportHeight,
    viewportDivId = "game-viewport"
  ) {
    this.initializeGraphicEngine(
      viewportDivId,
      customViewportWidth,
      customViewportHeight
    );
    this.initializeFpsCounter(viewportDivId);
    this.initializeGameEngineContext();
  }

  /**
   * Initializes the GraphicEngine for rendering tasks.
   * @param {string} viewportDivId - The ID of the HTML element used as the viewport for rendering.
   * @param {number} [customViewportWidth] - Custom width for the viewport in pixels (optional).
   * @param {number} [customViewportHeight] - Custom height for the viewport in pixels (optional).
   */

  initializeGraphicEngine(
    viewportDivId,
    customViewportWidth,
    customViewportHeight
  ) {
    this.graphic_engine = new GraphicEngine(
      viewportDivId,
      customViewportWidth,
      customViewportHeight
    );
  }

  /**
   * Sets up the main game context, which maintains references to core subsystems.
   * This includes initializing the last frame time.
   */
  initializeGameEngineContext() {
    this.instance_context = {
      graphics: this.graphic_engine,
      shapes: new Shapes(this.graphic_engine),
    };

    // Time of the last frame rendered
    this.lastTime = 0;
  }

  /**
   * Creates an HTML element to display the frames per second (FPS).
   * @returns {HTMLElement} The created span element for displaying FPS.
   */
  createFpsCounterHTMLElement() {
    const fpsCounterElement = document.createElement("span");
    fpsCounterElement.innerText = "FPS: 60"; // Default text
    fpsCounterElement.style.position = "absolute";
    fpsCounterElement.style.right = "0px";
    fpsCounterElement.style.top = "0px";
    fpsCounterElement.style.color = "white";
    fpsCounterElement.style.backgroundColor = "black";
    fpsCounterElement.style.padding = "0.25rem";
    fpsCounterElement.style.fontWeight = "bold";
    fpsCounterElement.style.fontSize = "1.5rem";
    fpsCounterElement.style.fontFamily = "sans-serif";
    return fpsCounterElement;
  }

  /**
   * Inserts the FPS counter HTML element into the specified viewport.
   * @param {HTMLElement} fpsCounterElement - The FPS counter element to be inserted.
   * @param {string} viewportDivId - The ID of the viewport element.
   */
  insertFpsCounterElementToViewport(fpsCounterElement, viewportDivId) {
    this.fpsCounterElement = fpsCounterElement;

    const viewportDiv = document.getElementById(viewportDivId);

    if (!viewportDiv || !fpsCounterElement) return;

    viewportDiv.appendChild(fpsCounterElement);
  }

  /**
   * Initializes the FPS counter, including creating the HTML element and setting
   * up necessary variables for FPS tracking.
   * @param {string} viewportDivId - The ID of the viewport element for rendering.
   */
  initializeFpsCounter(viewportDivId) {
    // Last second to calculate the frames rendered in a second
    this.lastSecond = 0;

    // Frames per second counter
    this.fpsCounter = 0;

    this.insertFpsCounterElementToViewport(
      this.createFpsCounterHTMLElement(),
      viewportDivId
    );
  }

  /**
   * Calculates the time elapsed since the last frame was rendered.
   * @returns {number} The time in decimal seconds since the last frame.
   */
  calculateDeltaTime() {
    const currentTime = performance.now();
    const deltaTime =
      (currentTime - this.lastTime) * GameEngine.MILLISECONDS_FACTOR;
    this.lastTime = currentTime;
    return deltaTime;
  }

  /**
   * Updates the FPS counter element with the current FPS value.
   */
  updateFpsCounterElement() {
    this.fpsCounterElement.innerText = `FPS: ${this.fpsCounter}`;
  }

  /**
   * Updates the frames per second (FPS) counter and logs the FPS to the console
   * once per second.
   */
  updateFPSCounter() {
    const currentTime = performance.now();
    this.fpsCounter += 1;
    if (GameEngine.MILLISECONDS < currentTime - this.lastSecond) {
      this.updateFpsCounterElement();
      this.fpsCounter = 0;
      this.lastSecond = currentTime;
    }
  }

  /**
   * Sets the callback function for the game loop, defining the main game
   * update and render cycle. This callback is invoked on each frame to
   * update and render the current game state.
   *
   * @param {function(Object): function(number): void} gameAppContext - A callback function that initializes
   * and returns the primary game loop. It receives the game engine's context object as a parameter to
   * establish access to core engine properties and should return a game loop function.
   *
   * The returned game loop function will be called on each frame with `deltaTime` (in seconds) as an argument,
   * allowing the game logic to update based on elapsed time.
   *
   * @example
   * const gameAppContext = async (context) => {
   *   // Async initialization logic here
   *   return (deltaTime) => {
   *     // Game update and render logic here, using deltaTime
   *   };
   * };
   * engine.setGameAppContext(gameAppContext);
   * engine.startGameLoop();
   */
  setGameAppContext(gameAppContext) {
    return new Promise((resolve, reject) => {
      if (!gameAppContext) {
        reject(new Error("No gameAppContext provided."));
        return;
      }

      // Check if the provided gameAppContext function is asynchronous
      const isAsync = gameAppContext.constructor.name === "AsyncFunction";

      // If the function is asynchronous, wait for it to resolve
      if (isAsync) {
        Promise.resolve(gameAppContext(this.instance_context))
          .then((gameLoop) => {
            // Once resolved, create the game loop callback
            this.gameLoopCallback = this.createGameLoop(gameLoop);
            resolve(); // Resolve the promise when everything is ready
          })
          .catch((error) => {
            reject(error); // Catch any error that occurs during the async process
          });
      } else {
        // If the function is synchronous, execute it immediately
        const gameLoop = gameAppContext(this.instance_context);
        this.gameLoopCallback = this.createGameLoop(gameLoop);
        resolve(); // Resolve immediately since it's a synchronous operation
      }
    });
  }

  /**
   * Create the game loop callback function.
   * @param {function(number): void} gameLoop - The game loop function to be executed on each frame.
   * @returns {function} A game loop callback function that will be used in the game loop cycle.
   */
  createGameLoop(gameLoop) {
    return () => {
      // Update FPS counter
      this.updateFPSCounter();
      // Calculate deltaTime before all current frame processes
      const deltaTime = this.calculateDeltaTime();
      // Clear the framebuffer with a black color (0x00000000).
      this.graphic_engine.clearFramebuffer(this.graphic_engine.clearColor);
      // Execute the provided game loop function with the current deltaTime
      gameLoop(deltaTime);
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

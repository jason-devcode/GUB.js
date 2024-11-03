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
   * Initializes the GameEngine with a specified viewport ID for rendering.
   * @param {string} [viewportDivId="game-viewport"] - The ID of the HTML element to be used as the viewport for rendering.
   */
  constructor(viewportDivId = "game-viewport") {
    this.initializeGraphicEngine(viewportDivId);
    this.initializeFpsCounter(viewportDivId);
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
   * This includes initializing the last frame time.
   */
  initializeGameEngineContext() {
    this.instance_context = { graphics: this.graphic_engine };

    // shapes
    this.shapes = new Shapes(this.graphic_engine);

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
   * Sets the callback function for the game loop, defining the primary game
   * update and render cycle. This function is called on each frame to update
   * and render the game state.
   * @param {function} gameLoopCallback - The callback function for the game loop,
   *                                      which receives the game engine context and delta time.
   */
  setGameLoop(gameLoopCallback) {
    this.gameLoopCallback = () => {
      // Update FPS counter
      this.updateFPSCounter();
      // Calculate deltaTime before all current frame processes
      const deltaTime = this.calculateDeltaTime();
      // Clear the framebuffer with a black color (0x00000000).
      this.graphic_engine.clearFramebuffer(0x00000000);
      // Execute the provided callback with the current game engine context.
      gameLoopCallback(this.instance_context, deltaTime);
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

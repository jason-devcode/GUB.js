import { useEffect, useRef, useState } from "react";
import { GameEngine } from "../../core/game_engine.js";

/**
 * A custom React hook that initializes and manages a game engine instance.
 * This hook is designed to prevent the re-instantiation of the game engine
 * between React component re-renders, ensuring the game engine instance persists
 * across renders.
 *
 * It initializes the `GameEngine` once and starts the game loop with the provided
 * `gameAppContext`, which contains the game logic and returns the game loop to be executed.
 *
 * @function
 * @param {Object} config - Configuration object for initializing the game engine.
 * @param {number} config.width - The width of the game engine canvas.
 * @param {number} config.height - The height of the game engine canvas.
 * @param {string} config.viewportDivId - The ID of the HTML container where the game engine will render.
 * @param {Function} config.gameAppContext - A callback function that contains all the game logic
 * and returns the game loop to be executed by the engine.
 * @returns {void}
 */
export const useGameEngine = ({
  width,
  height,
  viewportDivId,
  gameAppContext,
}) => {
  /**
   * A mutable reference to the game engine instance, ensuring that the same instance
   * persists between re-renders of the component.
   *
   * @type {React.MutableRefObject<GameEngine|null>}
   */
  const gameRef = useRef(null);

  /**
   * A stateful value holding the current game engine instance.
   * This allows for reactive updates if the game engine instance changes.
   *
   * @type {[GameEngine|undefined, Function]}
   */
  const [game, setGame] = useState(undefined);

  /**
   * Effect to initialize the game engine on the first render.
   * This effect runs only once after the first render to prevent re-instantiating
   * the game engine on every re-render.
   * 
   * - It creates a new instance of `GameEngine` and assigns it to `gameRef`.
   * - The instance is then stored in the `game` state using `setGame`.
   */
  useEffect(() => {
    // Avoid re-initializing the game engine if it's already set.
    if (gameRef.current) return;

    try {
      // Initialize the game engine instance.
      gameRef.current = new GameEngine(width, height, viewportDivId);
      setGame(gameRef.current);  // Store the game engine instance in state.
    } catch (e) {
      console.error("Error initializing game engine:", e.message);
    }
  }, [width, height, viewportDivId]);

  /**
   * Effect to start the game loop once the game engine is initialized.
   * This effect depends on the `game` instance, and runs when the game engine is ready.
   *
   * - It sets the game application context via `game.setGameAppContext`.
   * - Starts the game loop using `game.startGameLoop`.
   */
  useEffect(() => {
    if (!game) return;

    // Set the game logic (app context) and start the game loop.
    game.setGameAppContext(gameAppContext);
    game.startGameLoop();
  }, [game, gameAppContext]);
};

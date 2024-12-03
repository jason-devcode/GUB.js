import { useEffect, useRef, useState } from "react";
import { GameEngine } from "../../core/game_engine.js";

/**
 * A custom React hook for initializing and managing a persistent game engine instance.
 *
 * This hook ensures the `GameEngine` is instantiated only once and remains consistent 
 * across React component re-renders. It integrates seamlessly with React's lifecycle, 
 * preventing unnecessary re-instantiations that could disrupt game functionality.
 *
 * The `useGameEngine` hook sets up the game engine and starts the game loop defined 
 * in the `gameAppContext` callback, allowing developers to focus on implementing game logic.
 *
 * @function
 * @param {Object} config - Configuration object for initializing the game engine.
 * @param {number} [config.width] - Optional. The width of the game engine canvas. 
 * If not specified, it defaults to the width of the div assigned as the viewport.
 * @param {number} [config.height] - Optional. The height of the game engine canvas. 
 * If not specified, it defaults to the height of the div assigned as the viewport.
 * @param {string} [config.viewportDivId="game-viewport"] - Optional. The ID of the HTML container 
 * where the game engine will render. Defaults to a div with the ID `game-viewport` if not specified.
 * @param {Function} config.gameAppContext - Required. A callback function containing all the game logic.
 * This function is responsible for returning the game loop, which the engine executes 
 * continuously to update the game state and render graphics.
 * 
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

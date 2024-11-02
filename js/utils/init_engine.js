import { gameLoop } from "../gameloop.js";
import { GameEngine } from "../core/game_engine.js";

const main = () => {
  const game_engine_instance = new GameEngine();
  game_engine_instance.setGameLoop(gameLoop);
  game_engine_instance.startGameLoop();
};

main();

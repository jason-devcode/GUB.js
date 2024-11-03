import { gameLoop } from "../gameloop.js";
import { game_engine_instance } from "../core/game_engine_instance.js";

const main = () => {
  game_engine_instance.setGameLoop(gameLoop);
  game_engine_instance.startGameLoop();
};

main();

# GUB.js

<!-- ![engine_demo](resources/gifs/ezgif-4-f92c6eb948.gif) -->
<img src="resources/gifs/ezgif-4-f92c6eb948.gif" alt="engine demo" width="50%">

GUB.js is a lightweight JavaScript game engine designed to simplify the development of browser-based games by providing essential features like a game loop, graphics engine, and utilities for managing game context and rendering.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Core Modules](#core-modules)
- [License](#license)

## Overview

GUB.js serves as the foundation for game development by providing utilities and components such as:

- A graphics engine for rendering graphics.
- A game loop for continuous game updates.
- Context management for handling game state.

## Project Structure

```
.
├── index.html
├── js
│   ├── app.js
│   ├── core
│   │   ├── event_manager.js
│   │   ├── game_engine.js
│   │   └── graphic_engine.js
│   ├── sample_app.js
│   └── utils
│       └── Shapes.js
├── LICENSE
├── README.md
└── run.sh
```

## Installation

To use GUB.js, you need to run it on a local server to avoid CORS restrictions. You can easily set up a simple HTTP server with Python:

```bash
python3 -m http.server 8000
```

Alternatively, you can use the provided `run.sh` script to start the server.

## Usage

To create a simple game using GUB.js, follow the example below. This example includes an HTML file that sets up the viewport for rendering and initializes the game engine.

### Example HTML Structure

Create an `index.html` file with the following content:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Game Engine</title>
    <style>
      body {
        display: flex;
        width: 100vw;
        height: 100vh;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        background-color: black;
      }

      .viewport-container {
        display: flex;
        width: 75%;
        height: 75%;
        position: relative; /* this should be relative to place internal elements correctly  */
        border: 4px solid black;
      }
    </style>
  </head>
  <body>
    <div id="game-viewport" class="viewport-container" >
    </div>
    <script type="module" src="./js/app.js"></script>
    </script>
  </body>
</html>
```

### Game Loop Implementation

In the `app.js` file, the `gameAppContext` function serves as the main entry point for your game's logic, and it returns the `gameLoop` function. This returned function is called on each frame by the game engine to update and render the game state.

#### Updated Documentation for the `gameLoop`:

```javascript
import { GameEngine } from "./core/game_engine.js";
import { GraphicEngine } from "./core/graphic_engine.js";
import { Shapes } from "./utils/Shapes.js";

/**
 * Initializes the game application context, setting up the main game loop.
 *
 * @param {Object} params - Configuration object for the game context.
 * @param {GraphicEngine} params.graphics - Instance of the graphic engine to manage rendering.
 * @param {Shapes} params.shapes - Instance of the Shapes class for drawing shapes.
 * @returns {function(number): void} A game loop function that is called on each frame with the `deltaTime`
 * (time in seconds since the last frame) to update game state and render the game.
 */
export const gameAppContext = ({ graphics, shapes }) => {
  const RADIAN = 0.01745329251;

  let currentAngle = 0.0;

  /**
   * Main game loop function that is called continuously by the game engine.
   * It updates object positions and renders the game state based on `deltaTime`.
   *
   * @param {number} deltaTime - Time elapsed in seconds since the last frame.
   * This is used to ensure smooth and consistent updates across varying frame rates.
   */
  const gameLoop = (deltaTime) => {
    let x = Math.cos(currentAngle) * 30;
    let y = Math.sin(currentAngle) * 30;

    // Draw a rotating circle at (200 + x, 200 + y) with radius 5 and color 0x00FFFF.
    shapes.drawCircleFill(200 + x, 200 + y, 5, 0x00ffff);

    // Update the current angle for the next frame.
    currentAngle += RADIAN * 500 * deltaTime;

    // Additional game logic (e.g., collision checks, input handling, etc.) can be added here.
  };

  return gameLoop;
};

/**
 * Main function that initializes and starts the game loop.
 */
export const main = () => {
  const game = new GameEngine();
  game.setGameAppContext(gameAppContext); // Pass the gameAppContext to the engine.
  game.startGameLoop(); // Start the game loop execution.
};

main();
```

This structured approach allows you to build a responsive and interactive game environment efficiently.

## Core Modules

### GameEngine Class

The `GameEngine` class serves as the foundation for game development, providing essential utilities and components such as the graphics engine, game loop, and shared game context.

### GraphicEngine Class

The `GraphicEngine` class handles rendering tasks and manages the canvas element where graphics are drawn.

## Running the Game

1. Start the local server using Python or the `run.sh` script.
2. Open your web browser and navigate to `http://localhost:8000`.
3. You should see the game viewport rendered with a red grid.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

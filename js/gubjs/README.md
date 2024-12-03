# GUB.js

**GUB.js** is a lightweight JavaScript game engine available as an npm package. It simplifies the development of browser-based games by offering essential features such as a graphics engine, a game loop, and utilities for game context and rendering management.

## Installation

Install the package using npm:

```bash
npm install gubjs-v1b
```

## React Integration

The React integration for **GUB.js** is achieved using the `useGameEngine` hook, designed to seamlessly manage the game engine lifecycle within React components. This hook ensures that the `GameEngine` instance is not re-instantiated between re-renders, preventing potential issues with game execution.

### Requirements

1. **Viewport Element**: The game engine requires an HTML container (e.g., a `<div>`) with a valid `id`.
   - The `id` must be provided in the `viewportDivId` property when calling `useGameEngine`, by default the engine looks
     for a div with the id `game-viewport` if you do not specify it in the call to useGameEngine.
   - The viewport's size (width and height) must be greater than `0x0` for proper rendering.
2. **Game Logic**: The `gameAppContext` function contains the game logic and should return the game loop.

---

## Usage Examples

### Example 1: Basic Game Loop

```javascript
import { useGameEngine } from "gubjs-v1b/react";

const App = () => {
  const gameAppContext = ({ graphics, shapes }) => {
    // here we define things like configurations and resource loading
    const gameLoop = (deltaTime) => {
        // game logic
    };
    return gameLoop;
  };

  useGameEngine({ gameAppContext: gameAppContext });

  return <div id="game-viewport" style={{ width: "100%", height: "100%" }} />;
};

export default App;
```

---

### Example 2: Drawing some graphics and setting useGameEngine parameters

```javascript
import { useGameEngine } from "gubjs-v1b/react";
import { SLATE_950 } from "gubjs-v1b/utils";

const App = () => {
  const gameAppContext = ({ graphics, shapes }) => {
    graphics.setClearFramebufferColor(SLATE_950);

    let currentAngle = 0.0;
    const RADIAN = 0.01745329251;
    
    // draws rotating circle in coords x: 200 y: 200
    const gameLoop = (deltaTime) => {
      let x = Math.cos(currentAngle) * 30;
      let y = Math.sin(currentAngle) * 30;

      shapes.drawCircleFill(200 + x, 200 + y, 5, 0x00ffff);
      currentAngle += RADIAN * 500 * deltaTime;
    };

    return gameLoop;
  };

  useGameEngine({
    width: 800,
    height: 600,
    viewportDivId: "my-game",
    gameAppContext,
  });

  return <div id="my-game" style={{ width: "100%", height: "100%" }} />;
};

export default App;
```

### Hook: `useGameEngine`

The `useGameEngine` hook initializes and manages a persistent game engine instance, ensuring smooth integration with React's lifecycle. It prevents unnecessary re-instantiations and handles the game loop logic.

#### Usage

```javascript
useGameEngine({
  width: 800, // Optional: Width of the game canvas
  height: 600, // Optional: Height of the game canvas
  viewportDivId: "game-viewport", // Optional: ID of the container div
  gameAppContext: () => { /* Game logic */ }, // Required: Game logic callback
});
```

#### Parameters
- **`width`** (number, optional): Width of the game canvas. Defaults to the container's width if not specified.
- **`height`** (number, optional): Height of the game canvas. Defaults to the container's height if not specified.
- **`viewportDivId`** (string, optional): ID of the HTML container where the engine renders. Defaults to `"game-viewport"`.
- **`gameAppContext`** (function, required): Callback for the game logic. It returns the game loop to update the state and render.

#### Example

```javascript
useGameEngine({
  width: 1024,
  height: 768,
  viewportDivId: "my-game-container",
  gameAppContext: () => {
    const gameLoop = () => {
      // Game update and render logic
    };
    return gameLoop;
  },
});
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

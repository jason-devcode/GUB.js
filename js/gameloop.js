// Initialize an array to track the state of each key
const keysState = {};

// Update key states on keydown and keyup
document.addEventListener("keydown", (event) => {
  keysState[event.key] = true; // Store key state as true
});

document.addEventListener("keyup", (event) => {
  keysState[event.key] = false; // Store key state as false
});

// Set a default color, e.g., red
let color = 0xff0000;

// Example: Move a smaller block with arrow keys
let posX = 100;
let posY = 100;

const VELOCITY_PX = 80;

// Main game loop function
export const gameLoop = ({ graphics }, deltaTime) => {
  // Check specific keys to change the color
  if (keysState[" "]) {
    // Spacebar
    color = 0x00ff00; // Change color to green when space is pressed
  }
  if (keysState["r"]) {
    // 'R' key
    color = 0x0000ff; // Change color to blue when 'R' is pressed
  }

  if (keysState["ArrowLeft"]) posX -= VELOCITY_PX * deltaTime; // Left arrow
  if (keysState["ArrowUp"]) posY -= VELOCITY_PX * deltaTime; // Up arrow
  if (keysState["ArrowRight"]) posX += VELOCITY_PX * deltaTime; // Right arrow
  if (keysState["ArrowDown"]) posY += VELOCITY_PX * deltaTime; // Down arrow

  // Draw a smaller block at posX, posY based on arrow key input
  for (let y = posY; y < posY + 10; ++y) {
    for (let x = posX; x < posX + 10; ++x) {
      graphics.putPixel(x, y, color); // Draw the block with the chosen color
    }
  }
};

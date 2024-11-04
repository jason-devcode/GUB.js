import { game_engine_instance } from "./core/game_engine_instance.js";

const shapes = game_engine_instance.shapes;

// Initialize an array to track the state of each key
const keysState = {};

// Update key states on keydown and keyup
document.addEventListener("keydown", (event) => {
  keysState[event.key] = true; // Store key state as true
});

document.addEventListener("keyup", (event) => {
  keysState[event.key] = false; // Store key state as false
});

// Example: Move a smaller block with arrow keys
let posX = 300;
let posY = 200;


const PI = 3.141592;
const RADIAN = PI / 180.0;
const HALF_PI = PI / 2;
const PI1_4 = PI / 4;

let currentAngle = 0;

let VELOCITY_PX = RADIAN * 25;

export const getCirclePoint = (angle, offsetX, offsetY, factor) => [
  Math.cos(angle) * factor + offsetX,
  Math.sin(angle) * factor + offsetY,
];


// Main game loop function
export const gameLoop = ({ graphics }, deltaTime) => {
  // if (keysState["ArrowLeft"]) posX -= VELOCITY_PX * deltaTime; // Left arrow
  // if (keysState["ArrowUp"]) posY -= VELOCITY_PX * deltaTime; // Up arrow
  // if (keysState["ArrowRight"]) posX += VELOCITY_PX * deltaTime; // Right arrow
  // if (keysState["ArrowDown"]) posY += VELOCITY_PX * deltaTime; // Down arrow


  if (keysState["ArrowUp"]) currentAngle -= VELOCITY_PX * deltaTime; // Up arrow
  if (keysState["ArrowDown"]) currentAngle += VELOCITY_PX * deltaTime; // Down arrow

  const pointA = getCirclePoint(currentAngle + PI1_4, posX, posY, 100);
  const pointB = getCirclePoint(currentAngle - HALF_PI, posX, posY, 100);
  const pointC = getCirclePoint(currentAngle + PI - PI1_4, posX, posY, 100);


  shapes.drawScanLineTriangle(
    pointA[0],
    pointA[1],
    pointB[0],
    pointB[1],
    pointC[0],
    pointC[1],
    0x0000ff,
    graphics
  );
  shapes.drawCircleFill(pointA[0], pointA[1], 10, 0xff0000);
  shapes.drawCircleFill(pointB[0], pointB[1], 10, 0xff0000);
  shapes.drawCircleFill(pointC[0], pointC[1], 10, 0xff0000);

  // currentAngle += RADIAN * deltaTime;
};

/**
 * Class representing a collection of shape drawing methods.
 * This class provides methods for drawing filled circles, triangles, and lines on a given graphics surface.
 */
export class Shapes {
  /**
   * Creates an instance of Shapes.
   * @param {object} graphics - An object that provides the `putPixel(x, y, color)` method for rendering pixels on the screen.
   */
  constructor(graphics) {
    this.graphics = graphics;
  }

  /**
   * Draws a filled circle centered at (cx, cy) with the specified radius and color.
   * Uses symmetry to reduce the number of calculations.
   *
   * @param {number} cx - The x-coordinate of the circle's center.
   * @param {number} cy - The y-coordinate of the circle's center.
   * @param {number} radius - The radius of the circle.
   * @param {number} color - The color of the circle in 32-bit format.
   */
  drawCircleFill(cx, cy, radius, color) {
    for (let y = 0; y <= radius; ++y) {
      for (let x = 0; x <= radius; ++x) {
        if (x * x + y * y < radius * radius) {
          // Draw pixels in all four quadrants to achieve a filled circle
          this.graphics.putPixel(x + cx, y + cy, color);
          this.graphics.putPixel(-x + cx, y + cy, color);
          this.graphics.putPixel(x + cx, -y + cy, color);
          this.graphics.putPixel(-x + cx, -y + cy, color);
        }
      }
    }
  }

  /**
   * Draws a filled triangle using scanline rasterization.
   * Vertices should be given in any order. The method sorts them by y-coordinate internally.
   *
   * @param {number} x1 - The x-coordinate of the first vertex.
   * @param {number} y1 - The y-coordinate of the first vertex.
   * @param {number} x2 - The x-coordinate of the second vertex.
   * @param {number} y2 - The y-coordinate of the second vertex.
   * @param {number} x3 - The x-coordinate of the third vertex.
   * @param {number} y3 - The y-coordinate of the third vertex.
   * @param {number} color_32bpp - The color of the triangle in 32-bit format.
   */
  drawScanLineTriangle(x1, y1, x2, y2, x3, y3, color_32bpp) {
    // Convert vertices to integers to avoid sub-pixel inaccuracies
    x1 = parseInt(x1);
    y1 = parseInt(y1);
    x2 = parseInt(x2);
    y2 = parseInt(y2);
    x3 = parseInt(x3);
    y3 = parseInt(y3);

    // Sort vertices by y-coordinate (ascending)
    if (y1 > y2) [x1, y1, x2, y2] = [x2, y2, x1, y1];
    if (y1 > y3) [x1, y1, x3, y3] = [x3, y3, x1, y1];
    if (y2 > y3) [x2, y2, x3, y3] = [x3, y3, x2, y2];

    const DYAB = y2 - y1;
    const DXAB = x2 - x1;
    const DYAC = y3 - y1;
    const DXAC = x3 - x1;
    const DYBC = y3 - y2;
    const DXBC = x3 - x2;

    let slopeABX = DXAB / (DYAB || 1); // Avoid division by zero
    let slopeACX = DXAC / (DYAC || 1);
    let slopeBCX = DXBC / (DYBC || 1);
    let slopeABCX = slopeACX;

    let xLeft = x1;
    let xRight = x1;

    if (!DYAB) {
      xLeft = x2;
      xRight = x1;
    }

    // Ensure xLeft is the smaller value and xRight is the larger
    if (slopeABX > slopeACX) {
      [slopeABX, slopeACX] = [slopeACX, slopeABX];
      [slopeBCX, slopeABCX] = [slopeABCX, slopeBCX];
      [xLeft, xRight] = [xRight, xLeft];
    }

    // Draw the upper triangle half
    for (let y = y1; y < y2; ++y) {
      for (let x = xLeft; x < xRight; ++x) {
        this.graphics.putPixel(x, y, color_32bpp);
      }
      xLeft += slopeABX;
      xRight += slopeACX;
    }

    // Draw the lower triangle half
    for (let y = y2; y < y3; ++y) {
      for (let x = xLeft; x < xRight; ++x) {
        this.graphics.putPixel(x, y, color_32bpp);
      }
      xLeft += slopeBCX;
      xRight += slopeABCX;
    }
  }

  /**
   * Draws a line from (x1, y1) to (x2, y2) using normalized coordinates.
   * This line drawing algorithm computes the slope and steps along it to avoid jagged edges.
   *
   * @param {number} x1 - The x-coordinate of the start point.
   * @param {number} y1 - The y-coordinate of the start point.
   * @param {number} x2 - The x-coordinate of the end point.
   * @param {number} y2 - The y-coordinate of the end point.
   * @param {number} color_32bpp - The color of the line in 32-bit format.
   */
  drawNormalizedLine(x1, y1, x2, y2, color_32bpp) {
    const DX = x2 - x1;
    const DY = y2 - y1;

    // Calculate the line length and inverse to normalize slope
    const lineLength = Math.sqrt(DX * DX + DY * DY);
    const recLineLength = 1.0 / (lineLength || 1); // Avoid division by zero

    const slopeX = DX * recLineLength;
    const slopeY = DY * recLineLength;

    let pointX = x1;
    let pointY = y1;

    // Step along the line length to draw each pixel
    for (let lineStep = 0; lineStep <= lineLength; ++lineStep) {
      this.graphics.putPixel(pointX, pointY, color_32bpp);
      pointX += slopeX;
      pointY += slopeY;
    }
  }
}

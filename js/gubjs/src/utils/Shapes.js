import { GraphicEngine } from "../core/graphic_engine.js";
import { GUBImage } from "./GUBImage.js";

/**
 * Class representing a collection of shape drawing methods.
 * This class provides methods for drawing filled circles, triangles, and lines on a given graphics surface.
 */
export class Shapes {
  /**
   * Creates an instance of Shapes.
   * @param {GraphicEngine} graphics - An object that provides the `putPixel(x, y, color)` method for rendering pixels on the screen.
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

  /**
   * Draws a line from (x1, y1) to (x2, y2) using a basic line drawing algorithm.
   * This method calculates the steps required to draw the line smoothly and iterates over them.
   *
   * @param {number} x1 - The x-coordinate of the start point.
   * @param {number} y1 - The y-coordinate of the start point.
   * @param {number} x2 - The x-coordinate of the end point.
   * @param {number} y2 - The y-coordinate of the end point.
   * @param {number} color_32bpp - The color of the line in 32-bit format.
   */
  drawLine(x1, y1, x2, y2, color_32bpp) {
    let DX_AB = x2 - x1;
    let DY_AB = y2 - y1;

    let steps =
      Math.abs(Math.abs(DX_AB) > Math.abs(DY_AB) ? DX_AB : DY_AB) || 1;

    let stepX = DX_AB / steps;
    let stepY = DY_AB / steps;

    let X = x1 + 0.5;
    let Y = y1 + 0.5;
    for (let lineIterator = 0; lineIterator < steps; ++lineIterator) {
      this.graphics.putPixel(X, Y, color_32bpp);
      X += stepX;
      Y += stepY;
    }
  }

  /**
   * Draws a line from (x1, y1) to (x2, y2) using a basic line drawing algorithm.
   * This method calculates the steps required to draw the line smoothly and iterates over them.
   *
   * @param {number} x1 - The x-coordinate of the start point.
   * @param {number} y1 - The y-coordinate of the start point.
   * @param {number} x2 - The x-coordinate of the end point.
   * @param {number} y2 - The y-coordinate of the end point.
   * @param {number} color_32bpp - The color of the line in 32-bit format.
   */
  drawDepthLine(x1, y1, z1, x2, y2, z2, color_32bpp) {
    let DX_AB = x2 - x1;
    let DY_AB = y2 - y1;
    let DZ_AB = z2 - z1;

    let steps =
      Math.abs(Math.abs(DX_AB) > Math.abs(DY_AB) ? DX_AB : DY_AB) || 1;

    let stepX = DX_AB / steps;
    let stepY = DY_AB / steps;
    let stepZ = DZ_AB / steps;

    let X = x1 + 0.5;
    let Y = y1 + 0.5;
    let Z = z1;
    for (let lineIterator = 0; lineIterator < steps; ++lineIterator) {
      this.graphics.putDepthPixel(X, Y, Z - 0.1, color_32bpp);
      // this.graphics.putDepthPixel(X + 1, Y, Z - 0.1, 0xff000000);
      // this.graphics.putDepthPixel(X - 1, Y, Z - 0.1, 0xff000000);
      X += stepX;
      Y += stepY;
      Z += stepZ;
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
    // TODO: This is used to avoid swap conditions in triangle loops
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
   * Renders a filled triangle with depth interpolation using scanline rasterization.
   * The triangle is drawn using vertex positions, depth values, and a flat 32-bit color.
   * Depth values are interpolated across the triangle to ensure proper depth testing.
   *
   * @param {number} x1 - X-coordinate of the first vertex.
   * @param {number} y1 - Y-coordinate of the first vertex.
   * @param {number} z1 - Depth value (Z-coordinate) of the first vertex.
   * @param {number} x2 - X-coordinate of the second vertex.
   * @param {number} y2 - Y-coordinate of the second vertex.
   * @param {number} z2 - Depth value (Z-coordinate) of the second vertex.
   * @param {number} x3 - X-coordinate of the third vertex.
   * @param {number} y3 - Y-coordinate of the third vertex.
   * @param {number} z3 - Depth value (Z-coordinate) of the third vertex.
   * @param {number} color_32bpp - Flat color in 32-bit packed format (e.g., 0xAARRGGBB).
   */
  drawScanLineDepthTriangle(x1, y1, z1, x2, y2, z2, x3, y3, z3, color_32bpp) {
    // Convert vertices to integers to avoid sub-pixel inaccuracies
    x1 = parseInt(x1);
    y1 = parseInt(y1);
    x2 = parseInt(x2);
    y2 = parseInt(y2);
    x3 = parseInt(x3);
    y3 = parseInt(y3);

    // Sort vertices by y-coordinate (ascending)
    if (y1 > y2) [x1, y1, z1, x2, y2, z2] = [x2, y2, z2, x1, y1, z1];
    if (y1 > y3) [x1, y1, z1, x3, y3, z3] = [x3, y3, z3, x1, y1, z1];
    if (y2 > y3) [x2, y2, z2, x3, y3, z3] = [x3, y3, z3, x2, y2, z2];

    const DYAB = y2 - y1;
    const DXAB = x2 - x1;
    const DZAB = z2 - z1;

    const DYAC = y3 - y1;
    const DXAC = x3 - x1;
    const DZAC = z3 - z1;

    const DYBC = y3 - y2;
    const DXBC = x3 - x2;
    const DZBC = z3 - z2;

    let slopeABX = DXAB / (DYAB || 1); // Avoid division by zero
    let slopeABZ = DZAB / (DYAB || 1);

    let slopeACX = DXAC / (DYAC || 1);
    let slopeACZ = DZAC / (DYAC || 1);

    let slopeBCX = DXBC / (DYBC || 1);
    let slopeBCZ = DZBC / (DYBC || 1);

    let slopeABCX = slopeACX;
    let slopeABCZ = slopeACZ;

    let xLeft = x1;
    let xRight = x1;
    let zLeft = z1;
    let zRight = z1;

    if (!DYAB) {
      xLeft = x2;
      xRight = x1;
      zLeft = z2;
      zRight = z1;
    }

    // Ensure xLeft is the smaller value and xRight is the larger
    // TODO: This is used to avoid swap conditions in triangle loops
    if (slopeABX > slopeACX) {
      [slopeABX, slopeACX] = [slopeACX, slopeABX];
      [slopeBCX, slopeABCX] = [slopeABCX, slopeBCX];

      [slopeABZ, slopeACZ] = [slopeACZ, slopeABZ];
      [slopeBCZ, slopeABCZ] = [slopeABCZ, slopeBCZ];

      [xLeft, xRight] = [xRight, xLeft];
      [zLeft, zRight] = [zRight, zLeft];
    }

    // Draw the upper triangle half
    for (let y = y1; y < y2; ++y) {
      let lerpZ = (zRight - zLeft) / (xRight - xLeft);
      let pixelDepth = zLeft;
      for (let x = xLeft; x < xRight; ++x) {
        this.graphics.putDepthPixel(x, y, pixelDepth, color_32bpp);
        pixelDepth += lerpZ;
      }
      xLeft += slopeABX;
      xRight += slopeACX;
      zLeft += slopeABZ;
      zRight += slopeACZ;
    }

    // Draw the lower triangle half
    for (let y = y2; y < y3; ++y) {
      let lerpZ = (zRight - zLeft) / (xRight - xLeft);
      let pixelDepth = zLeft;
      for (let x = xLeft; x < xRight; ++x) {
        this.graphics.putDepthPixel(x, y, pixelDepth, color_32bpp);
        pixelDepth += lerpZ;
      }
      xLeft += slopeBCX;
      xRight += slopeABCX;
      zLeft += slopeBCZ;
      zRight += slopeABCZ;
    }
  }

  /**
   * Renders a textured triangle with depth interpolation using scanline rasterization.
   * The function handles depth-correct texture mapping and ensures sub-pixel accuracy 
   * by sorting vertices and computing slopes for interpolation.
   *
   * @param {number} x1 - X-coordinate of the first vertex.
   * @param {number} y1 - Y-coordinate of the first vertex.
   * @param {number} z1 - Depth value (Z-coordinate) of the first vertex.
   * @param {number} u1 - U texture coordinate of the first vertex.
   * @param {number} v1 - V texture coordinate of the first vertex.
   * @param {number} x2 - X-coordinate of the second vertex.
   * @param {number} y2 - Y-coordinate of the second vertex.
   * @param {number} z2 - Depth value (Z-coordinate) of the second vertex.
   * @param {number} u2 - U texture coordinate of the second vertex.
   * @param {number} v2 - V texture coordinate of the second vertex.
   * @param {number} x3 - X-coordinate of the third vertex.
   * @param {number} y3 - Y-coordinate of the third vertex.
   * @param {number} z3 - Depth value (Z-coordinate) of the third vertex.
   * @param {number} u3 - U texture coordinate of the third vertex.
   * @param {number} v3 - V texture coordinate of the third vertex.
   * @param {GUBImage} texture - The texture to be mapped onto the triangle.
   */
  drawScanLineDepthTextureTriangle(
    x1, y1, z1, u1, v1,
    x2, y2, z2, u2, v2,
    x3, y3, z3, u3, v3,
    texture
  ) {
    // Convert vertices to integers to avoid sub-pixel inaccuracies
    x1 = parseInt(x1); y1 = parseInt(y1);
    x2 = parseInt(x2); y2 = parseInt(y2);
    x3 = parseInt(x3); y3 = parseInt(y3);

    // Sort vertices by y-coordinate (ascending)
    if (y1 > y2)
      [x1, y1, z1, u1, v1, x2, y2, z2, u2, v2] = [ x2, y2, z2, u2, v2, x1, y1, z1, u1, v1 ];
    if (y1 > y3)
      [x1, y1, z1, u1, v1, x3, y3, z3, u3, v3] = [ x3, y3, z3, u3, v3, x1, y1, z1, u1, v1 ];
    if (y2 > y3)
      [x2, y2, z2, u2, v2, x3, y3, z3, u3, v3] = [ x3, y3, z3, u3, v3, x2, y2, z2, u2, v2 ];

    // apply perspective to texture coordinates
    u1 /= z1; u2 /= z2; u3 /= z3;
    v1 /= z1; v2 /= z2; v3 /= z3;

    // interpolate inverse of depths, this is used to perform UV correction by each pixel depth
    z1 = 1 / z1; z2 = 1 / z2; z3 = 1 / z3;

    const DUAB = u2 - u1;
    const DVAB = v2 - v1;

    const DUAC = u3 - u1;
    const DVAC = v3 - v1;

    const DUBC = u3 - u2;
    const DVBC = v3 - v2;
    
    const DYAB = y2 - y1;
    const DXAB = x2 - x1;
    const DZAB = z2 - z1;

    const DYAC = y3 - y1;
    const DXAC = x3 - x1;
    const DZAC = z3 - z1;

    const DYBC = y3 - y2;
    const DXBC = x3 - x2;
    const DZBC = z3 - z2;

    let slopeABX = DXAB / (DYAB || 0.0001); // Avoid division by zero
    let slopeABZ = DZAB / (DYAB || 0.0001);

    let slopeACX = DXAC / (DYAC || 0.0001);
    let slopeACZ = DZAC / (DYAC || 0.0001);

    let slopeBCX = DXBC / (DYBC || 0.0001);
    let slopeBCZ = DZBC / (DYBC || 0.0001);

    let slopeABCX = slopeACX;
    let slopeABCZ = slopeACZ;

    let slopeABU = DUAB / (DYAB || 0.0001);
    let slopeABV = DVAB / (DYAB || 0.0001);

    let slopeACU = DUAC / (DYAC || 0.0001);
    let slopeACV = DVAC / (DYAC || 0.0001);


    let slopeBCU = DUBC / (DYBC || 0.0001);
    let slopeABCU = slopeACU;

    let slopeBCV = DVBC / (DYBC || 0.0001);
    let slopeABCV = slopeACV;

    let xLeft = x1;
    let xRight = x1;
    let zLeft = z1;
    let zRight = z1;
    let uLeft = u1;
    let uRight = u1;
    let vLeft = v1;
    let vRight = v1;

    if (!DYAB) {
      xLeft = x2;
      xRight = x1;
      zLeft = z2;
      zRight = z1;
      uLeft = u2;
      uRight = u1;
      vLeft = v2;
      vRight = v1;
    }

    // Ensure xLeft is the smaller value and xRight is the larger
    // TODO: This is used to avoid swap conditions in triangle loops
    if (slopeABX > slopeACX) {
      [slopeABX, slopeACX] = [slopeACX, slopeABX];
      [slopeBCX, slopeABCX] = [slopeABCX, slopeBCX];

      [slopeABZ, slopeACZ] = [slopeACZ, slopeABZ];
      [slopeBCZ, slopeABCZ] = [slopeABCZ, slopeBCZ];

      [slopeABU, slopeACU] = [slopeACU, slopeABU];
      [slopeBCU, slopeABCU] = [slopeABCU, slopeBCU];

      [slopeABV, slopeACV] = [slopeACV, slopeABV];
      [slopeBCV, slopeABCV] = [slopeABCV, slopeBCV];

      [xLeft, xRight] = [xRight, xLeft];
      [zLeft, zRight] = [zRight, zLeft];

      [uLeft, uRight] = [uRight, uLeft];
      [vLeft, vRight] = [vRight, vLeft];
    }

    // Draw the upper triangle half
    for (let y = y1; y < y2; ++y) {
      let invX = 1.0 / (xRight - xLeft);
      let lerpZ = (zRight - zLeft) * invX;
      let pixelDepth = zLeft;

      let lerpU = (uRight - uLeft) * invX;
      let lerpV = (vRight - vLeft) * invX;
      let U = uLeft;
      let V = vLeft;

      for (let x = xLeft; x < xRight; ++x) {
        const correctU = U / pixelDepth;
        const correctV = V / pixelDepth;
        const texelColor = texture.getTexel(correctU, correctV);
        this.graphics.putDepthPixel(x, y, 1/pixelDepth, texelColor);
        pixelDepth += lerpZ;
        U += lerpU;
        V += lerpV;
      }

      xLeft += slopeABX;
      xRight += slopeACX;
      zLeft += slopeABZ;
      zRight += slopeACZ;

      uLeft += slopeABU;
      uRight += slopeACU;
      vLeft += slopeABV;
      vRight += slopeACV;
    }


    // Draw the lower triangle half
    for (let y = y2; y < y3; ++y) {
      let invX = 1.0 / (xRight - xLeft);
      let lerpZ = (zRight - zLeft) * invX;
      let pixelDepth = zLeft;

      let lerpU = (uRight - uLeft) * invX;
      let lerpV = (vRight - vLeft) * invX;
      let U = uLeft;
      let V = vLeft;

      for (let x = xLeft; x < xRight; ++x) {
        const correctU = U / pixelDepth;
        const correctV = V / pixelDepth;
        const texelColor = texture.getTexel(correctU, correctV);
        this.graphics.putDepthPixel(x, y, 1/pixelDepth, texelColor);
        pixelDepth += lerpZ;
        U += lerpU;
        V += lerpV;
      }
      
      xLeft += slopeBCX;
      xRight += slopeABCX;
      zLeft += slopeBCZ;
      zRight += slopeABCZ;

      uLeft += slopeBCU;
      uRight += slopeABCU;
      vLeft += slopeBCV;
      vRight += slopeABCV;
    }
  }
}

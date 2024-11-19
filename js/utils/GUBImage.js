/**
 * Represents an image using 32-bit ARGB pixel data.
 */
export class GUBImage {
  /**
   * Constructs a new GUBImage instance.
   *
   * @param {number} width - The width of the image in pixels.
   * @param {number} height - The height of the image in pixels.
   * @param {Uint32Array} [pixelData] - The pixel data of the image, stored as 32-bit unsigned integers in ARGB format.
   */
  constructor(width, height, pixelData) {
    this.width = width;
    this.height = height;

    // Ensure pixelData is either provided or create a blank one
    this.pixelData = pixelData || new Uint32Array(width * height);
  }

  /**
   * Gets the pixel color at the specified (x, y) coordinate.
   *
   * @param {number} x - The x-coordinate of the pixel.
   * @param {number} y - The y-coordinate of the pixel.
   * @returns {number} The color of the pixel as a 32-bit unsigned integer in ARGB format.
   */
  getPixel(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const index = y * this.width + x;
    return this.pixelData[index];
  }

  /**
   * Sets the pixel color at the specified (x, y) coordinate.
   *
   * @param {number} x - The x-coordinate of the pixel.
   * @param {number} y - The y-coordinate of the pixel.
   * @param {number} color - The color of the pixel as a 32-bit unsigned integer in ARGB format.
   */
  putPixel(x, y, color) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const index = y * this.width + x;
    this.pixelData[index] = color;
  }
}

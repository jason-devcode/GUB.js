export class GraphicEngine {
  /**
   * Create a graphic engine instance.
   * @param {string} viewportId - The ID of the canvas element to use.
   */
  constructor(viewportId) {
    this.initializeEngine(viewportId);
    this.gameLoopCallback = null;
  }

  /**
   * initialize canvas element
   */
  initializeCanvas(viewportId) {
    const viewportDiv = document.getElementById(viewportId);

    const viewportWidth = viewportDiv.clientWidth;
    const viewportHeight = viewportDiv.clientHeight;

    const newCanvasElement = document.createElement("canvas");

    newCanvasElement.width = viewportWidth;
    newCanvasElement.height = viewportHeight;

    viewportDiv.appendChild(newCanvasElement);

    return newCanvasElement;
  }

  /**
   * Initializes the engine by setting up the canvas and framebuffer.
   * @param {string} viewportId - The ID of the canvas element.
   */
  initializeEngine(viewportId) {
    const canvas = this.initializeCanvas(viewportId);

    const viewportWidth = canvas.width;
    const viewportHeight = canvas.height;
    const context = canvas.getContext("2d");

    const contextImageData = context.getImageData(
      0,
      0,
      viewportWidth,
      viewportHeight
    );
    const framebuffer = contextImageData;

    this.canvas = canvas;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.framebuffer = framebuffer;
    this.context = context;
  }

  /**
   * Unpacks a 32-bit color value into individual color channels (A, R, G, B).
   * @param {number} color_32bpp - The 32-bit color value in ARGB format.
   * @returns {number[]} The color channels as an array [R, G, B, A].
   */
  unpackColorChannels(color_32bpp) {
    const channelA = (color_32bpp >> 24) & 0xff;
    const channelR = (color_32bpp >> 16) & 0xff;
    const channelG = (color_32bpp >> 8) & 0xff;
    const channelB = (color_32bpp >> 0) & 0xff;

    return [channelR, channelG, channelB, channelA];
  }

  /**
   * Calculates the index of a pixel in the framebuffer.
   * @param {number} x - The x-coordinate of the pixel.
   * @param {number} y - The y-coordinate of the pixel.
   * @returns {number} The index of the pixel in the framebuffer.
   */
  calculatePixelIndex(x, y) {
    return (y * this.viewportWidth + x) * 4;
  }

  /**
   * Sets the color of a specific pixel in the framebuffer.
   * @param {number} x - The x-coordinate of the pixel.
   * @param {number} y - The y-coordinate of the pixel.
   * @param {number} color_32bpp - The 32-bit color value in ARGB format.
   */
  putPixel(x, y, color_32bpp) {
    // protection if pixel is outside of viewport bounds
    if (x < 0 || y < 0 || x > this.viewportWidth || y > this.viewportHeight)
      return;

    const pixelIndex = this.calculatePixelIndex(parseInt(x), parseInt(y));

    const unpackedColor = this.unpackColorChannels(color_32bpp);

    this.framebuffer.data[pixelIndex + 0] = unpackedColor[0];
    this.framebuffer.data[pixelIndex + 1] = unpackedColor[1];
    this.framebuffer.data[pixelIndex + 2] = unpackedColor[2];
    this.framebuffer.data[pixelIndex + 3] = 0xff; // alpha ever 255
  }

  /**
   * Clears the framebuffer to a specified color.
   * @param {number} color_32bpp - The 32-bit color value in ARGB format.
   */
  clearFramebuffer(color_32bpp = 0x00000000) {
    const unpackedColor = this.unpackColorChannels(color_32bpp);
    const { data } = this.framebuffer;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = unpackedColor[0]; // R
      data[i + 1] = unpackedColor[1]; // G
      data[i + 2] = unpackedColor[2]; // B
      data[i + 3] = unpackedColor[3]; // A
    }
  }

  /**
   * Renders the current framebuffer to the canvas.
   */
  render() {
    this.context.putImageData(this.framebuffer, 0, 0);
  }

  /**
   * Retrieves the HTML canvas element by its ID.
   * @param {string} viewportId - The ID of the canvas element.
   * @returns {HTMLCanvasElement} The canvas element.
   */
  getCanvasElement(viewportId) {
    return document.getElementById(viewportId);
  }
}

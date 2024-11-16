export class GraphicEngine {
  /**
   * Creates an instance of the GraphicEngine.
   * @param {string} viewportId - The ID of the HTML container element where the canvas will be added.
   * @param {number} [customViewportWidth] - Optional custom width for the canvas in pixels.
   * @param {number} [customViewportHeight] - Optional custom height for the canvas in pixels.
   */
  constructor(viewportId, customViewportWidth, customViewportHeight) {
    this.initializeEngine(
      viewportId,
      customViewportWidth,
      customViewportHeight
    );
    this.gameLoopCallback = null;
    this.clearColor = 0xff000000; // clear framebuffer color by default
  }

  /**
   * Initializes a new canvas element inside a specified HTML container.
   * @param {string} viewportId - The ID of the HTML container element.
   * @param {number} [customViewportWidth] - Optional custom width for the canvas in pixels.
   * @param {number} [customViewportHeight] - Optional custom height for the canvas in pixels.
   * @returns {HTMLCanvasElement} The created canvas element.
   */
  initializeCanvas(viewportId, customViewportWidth, customViewportHeight) {
    const viewportDiv = document.getElementById(viewportId);

    const viewportWidth = customViewportWidth || viewportDiv.clientWidth;
    const viewportHeight = customViewportHeight || viewportDiv.clientHeight;

    const newCanvasElement = document.createElement("canvas");

    newCanvasElement.width = viewportWidth;
    newCanvasElement.height = viewportHeight;

    // set dynamic size of canvas related to parent container
    newCanvasElement.style.width = "100%";
    newCanvasElement.style.height = "100%";

    viewportDiv.appendChild(newCanvasElement);

    return newCanvasElement;
  }

  /**
   * Sets up the canvas, rendering context, and framebuffer for the engine.
   * @param {string} viewportId - The ID of the HTML container element where the canvas will be added.
   * @param {number} [customViewportWidth] - Optional custom width for the canvas in pixels.
   * @param {number} [customViewportHeight] - Optional custom height for the canvas in pixels.
   */
  initializeEngine(viewportId, customViewportWidth, customViewportHeight) {
    const canvas = this.initializeCanvas(
      viewportId,
      customViewportWidth,
      customViewportHeight
    );

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
   * Sets the default color to clear the framebuffer.
   * @param {number} color_32bpp - The 32-bit color value in ARGB format to be used as the clear color.
   */
  setClearFramebufferColor(color_32bpp) {
    this.clearColor = color_32bpp;
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

  /**
   * Sets the background color of the document's body using a 32-bit ARGB color value.
   *
   * @param {number} color_32bpp - The 32-bit color value in the format 0xAARRGGBB.
   */
  setBodyBackgroundColor(color_32bpp) {
    // Extract the components from the 32-bit color
    const alpha = (color_32bpp >>> 24) & 0xff; // Extract AA
    const red = (color_32bpp >>> 16) & 0xff; // Extract RR
    const green = (color_32bpp >>> 8) & 0xff; // Extract GG
    const blue = color_32bpp & 0xff; // Extract BB

    // Convert alpha to a 0-1 range for CSS RGBA
    const alphaDecimal = (alpha / 255).toFixed(2);

    // Set the background color using RGBA format
    document.body.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${alphaDecimal})`;
  }
}

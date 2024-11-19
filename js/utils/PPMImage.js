import { ColorUtils } from "./ColorUtils.js";
import { GUBImage } from "./GUBImage.js";

/**
 * Class responsible for managing PPM image loading and processing.
 */
export class PPMImage {
  /**
   * Loads a PPM image from the given file path.
   *
   * @param {string} imagePath - The path to the image file.
   * @returns {Promise<GUBImage | undefined>} - A promise that resolves to a `GUBImage` object, or `undefined` if loading fails.
   */
  static async loadImage(imagePath) {
    /**
     * Processes the fetch response and returns the image as an ArrayBuffer.
     *
     * @param {Response} response - The response object returned from the fetch request.
     * @returns {Promise<ArrayBuffer>} - The image data as an ArrayBuffer.
     * @throws {Error} - Throws an error if the response is not OK.
     */
    const processResponse = (response) => {
      if (!response.ok) {
        throw new Error(`Could not fetch image from ${imagePath}`);
      }
      return response.arrayBuffer();
    };

    /**
     * Extracts the PPM image header from the byte buffer.
     *
     * @param {Uint8Array} byteBuffer - The buffer containing the image data.
     * @returns {string | undefined} - The PPM header as a string, or undefined if no header found.
     */
    const getPPMHeader = (byteBuffer) => {
      let header = "";
      let currentCharIndex = 0;

      // Iterate through the byte buffer and construct the header.
      while (currentCharIndex < byteBuffer.length) {
        const currentChar = String.fromCharCode(byteBuffer[currentCharIndex]);
        header += currentChar;

        // Stop once the header is complete (3 newlines detected).
        if ((header.match(/\n/g) || []).length >= 3) break;
        currentCharIndex++;
      }

      return header.length > 0 ? header : undefined;
    };

    /**
     * Parses the PPM header to extract image dimensions (width and height).
     *
     * @param {string} ppmHeader - The PPM header string.
     * @returns {{ width: number, height: number } | undefined} - An object containing the width and height of the image, or undefined if parsing fails.
     */
    const parsePPMHeader = (ppmHeader) => {
      if (!ppmHeader) return undefined;

      // Split header into lines and parse dimensions from the second line.
      const headerLines = ppmHeader.split("\n");
      if (headerLines.length < 2) return undefined;

      const [width, height] = headerLines[1].split(" ").map(Number);
      if (isNaN(width) || isNaN(height)) return undefined;

      return { width, height };
    };

    /**
     * Extracts pixel data from the byte buffer based on the PPM header and image dimensions.
     *
     * @param {string} ppmHeader - The PPM header string.
     * @param {{ width: number, height: number }} ppmImageDimensions - The dimensions of the image (width and height).
     * @param {Uint8Array} byteBuffer - The buffer containing the image data.
     * @returns {number[] | undefined} - An array of pixel colors packed as integers, or undefined if extraction fails.
     */
    const getPixelsData = (ppmHeader, ppmImageDimensions, byteBuffer) => {
      const pixelDataOffset = ppmHeader.length;
      const totalPixels = ppmImageDimensions.width * ppmImageDimensions.height;
      const bpp = 3; // bytes per pixel (RGB format)

      const pixelsData = [];

      // Iterate through the byte buffer and extract pixel values (RGB).
      for (let i = pixelDataOffset; i < byteBuffer.length; i += bpp) {
        const red = byteBuffer[i];
        const green = byteBuffer[i + 1];
        const blue = byteBuffer[i + 2];

        // Pack the RGB values into a single integer and push to the pixels data array.
        const pixelColor = ColorUtils.packColor(0xff, red, green, blue);
        pixelsData.push(pixelColor);
      }

      // Ensure the correct number of pixels is extracted.
      return pixelsData.length === totalPixels ? pixelsData : undefined;
    };

    /**
     * Parses the entire byte buffer, extracting the header, dimensions, and pixel data.
     *
     * @param {ArrayBuffer} buffer - The byte buffer containing the full image data.
     * @returns {GUBImage | undefined} - A `GUBImage` object containing the image data, or `undefined` if parsing fails.
     */
    const parseByteBuffer = (buffer) => {
      const byteBuffer = new Uint8Array(buffer);

      // Extract the header from the byte buffer.
      const ppmHeader = getPPMHeader(byteBuffer);
      if (!ppmHeader) return undefined;

      // Parse the dimensions from the header.
      const ppmImageDimensions = parsePPMHeader(ppmHeader);
      if (!ppmImageDimensions) return undefined;

      // Extract pixel data from the byte buffer.
      const pixelsData = getPixelsData(
        ppmHeader,
        ppmImageDimensions,
        byteBuffer
      );
      if (!pixelsData) return undefined;

      // Return a new GUBImage with the extracted data.
      return new GUBImage(
        ppmImageDimensions.width,
        ppmImageDimensions.height,
        pixelsData
      );
    };

    try {
      // Fetch the image from the given path and process the response.
      const response = await fetch(imagePath);
      const buffer = await processResponse(response);

      // Parse the image data from the buffer and return the resulting GUBImage object.
      return parseByteBuffer(buffer);
    } catch (error) {
      // Log any errors that occur during the fetch or image processing.
      console.error(`Error loading image from ${imagePath}:`, error);
      return undefined;
    }
  }
}

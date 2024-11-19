/**
 * Utility class for working with colors in ARGB format.
 */
export class ColorUtils {
  /**
   * Packs ARGB components into a 32-bit unsigned integer.
   *
   * @param {number} a - The alpha component (0-255).
   * @param {number} r - The red component (0-255).
   * @param {number} g - The green component (0-255).
   * @param {number} b - The blue component (0-255).
   * @returns {number} The packed ARGB color as a 32-bit unsigned integer.
   */
  static packColor(a, r, g, b) {
    return (
      (((a & 0xff) << 24) |
        ((r & 0xff) << 16) |
        ((g & 0xff) << 8) |
        (b & 0xff)) >>>
      0
    );
  }

  /**
   * Unpacks a 32-bit unsigned integer into ARGB components.
   *
   * @param {number} color - The packed ARGB color.
   * @returns {{a: number, r: number, g: number, b: number}} An object with `a`, `r`, `g`, and `b` components (0-255).
   */
  static unpackColor(color) {
    return {
      a: (color >>> 24) & 0xff,
      r: (color >>> 16) & 0xff,
      g: (color >>> 8) & 0xff,
      b: color & 0xff,
    };
  }

  /**
   * Converts a 32-bit ARGB color to a hexadecimal string.
   *
   * @param {number} color - The packed ARGB color.
   * @returns {string} The color as a hexadecimal string in the format `#AARRGGBB`.
   */
  static toHex(color) {
    return `#${color.toString(16).padStart(8, "0").toUpperCase()}`;
  }

  /**
   * Parses a hexadecimal color string into a 32-bit ARGB color.
   *
   * @param {string} hex - The hexadecimal color string (e.g., `#AARRGGBB` or `#RRGGBB`).
   * @returns {number} The packed ARGB color.
   * @throws {Error} If the input string is not a valid hex color.
   */
  static fromHex(hex) {
    if (!/^#([0-9A-Fa-f]{8}|[0-9A-Fa-f]{6})$/.test(hex)) {
      throw new Error("Invalid hex color format");
    }
    if (hex.length === 7) {
      // If no alpha is provided, assume full opacity
      hex = `#FF${hex.slice(1)}`;
    }
    return parseInt(hex.slice(1), 16);
  }

  /**
   * Adjusts the brightness of a color by a percentage.
   *
   * @param {number} color - The packed ARGB color.
   * @param {number} percent - The percentage to adjust brightness (-100 to 100).
   * @returns {number} The adjusted color.
   */
  static adjustBrightness(color, percent) {
    const { a, r, g, b } = this.unpackColor(color);
    const adjust = (value) =>
      Math.max(0, Math.min(255, value + (value * percent) / 100));
    return this.packColor(a, adjust(r), adjust(g), adjust(b));
  }

  /**
   * Blends two colors together.
   *
   * @param {number} color1 - The first packed ARGB color.
   * @param {number} color2 - The second packed ARGB color.
   * @param {number} ratio - The blend ratio (0.0 to 1.0). `0.0` returns `color1`, and `1.0` returns `color2`.
   * @returns {number} The blended color.
   */
  static blendColors(color1, color2, ratio) {
    if (ratio < 0 || ratio > 1) {
      throw new Error("Ratio must be between 0 and 1");
    }

    const c1 = this.unpackColor(color1);
    const c2 = this.unpackColor(color2);

    const blend = (v1, v2) => Math.round(v1 * (1 - ratio) + v2 * ratio);

    return this.packColor(
      blend(c1.a, c2.a),
      blend(c1.r, c2.r),
      blend(c1.g, c2.g),
      blend(c1.b, c2.b)
    );
  }

  /**
   * Converts a 32-bit ARGB color to an RGBA CSS string.
   *
   * @param {number} color - The packed ARGB color.
   * @returns {string} The CSS color string in the format `rgba(r, g, b, a)`.
   */
  static toCssRgba(color) {
    const { a, r, g, b } = this.unpackColor(color);
    return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
  }
}

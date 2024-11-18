/**
 * Utility class for custom string manipulation functions not available in the native String class.
 */
export class StringUtils {
  /**
   * Counts the occurrences of a specific character in a given string.
   *
   * @param {string} text The string in which to count occurrences.
   * @param {string} character The character to count in the string.
   * @returns {number} The number of occurrences of the character in the string.
   * @throws {Error} Throws an error if the character is not a single character string.
   *
   * @example
   * const count = StringUtils.countCharOccurrences('hello world', 'o');
   * console.log(count); // 2
   */
  static countCharOccurrences(text, character) {
    let counter = 0;
    if (!text || !character) return counter;

    // Ensure that the character is a single character
    if (character.length !== 1) {
      throw new Error("The character parameter should be a single character.");
    }

    for (let charIndex = 0; charIndex < text.length; ++charIndex) {
      if (text.charAt(charIndex) === character) ++counter;
    }

    return counter;
  }

  /**
   * Converts a string to kebab-case (e.g., 'hello world' -> 'hello-world').
   *
   * @param {string} text The string to convert.
   * @returns {string} The kebab-case version of the string.
   *
   * @example
   * const kebab = StringUtils.toKebabCase('Hello World');
   * console.log(kebab); // "hello-world"
   */
  static toKebabCase(text) {
    return text
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`) // Convert camelCase to kebab-case
      .toLowerCase();
  }

  /**
   * Converts a string to snake_case (e.g., 'hello world' -> 'hello_world').
   *
   * @param {string} text The string to convert.
   * @returns {string} The snake_case version of the string.
   *
   * @example
   * const snake = StringUtils.toSnakeCase('Hello World');
   * console.log(snake); // "hello_world"
   */
  static toSnakeCase(text) {
    return text
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`) // Convert camelCase to snake_case
      .toLowerCase();
  }

  /**
   * Converts a string to PascalCase (e.g., 'hello world' -> 'HelloWorld').
   *
   * @param {string} text The string to convert.
   * @returns {string} The PascalCase version of the string.
   *
   * @example
   * const pascal = StringUtils.toPascalCase('hello world');
   * console.log(pascal); // "HelloWorld"
   */
  static toPascalCase(text) {
    return text
      .replace(
        /\w+/g,
        (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
      )
      .replace(/\s+/g, "");
  }

  /**
   * Capitalizes the first letter of each word in the string.
   *
   * @param {string} text The string to capitalize.
   * @returns {string} The string with the first letter of each word capitalized.
   *
   * @example
   * const capitalized = StringUtils.capitalizeWords('hello world');
   * console.log(capitalized); // "Hello World"
   */
  static capitalizeWords(text) {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  /**
   * Checks if a string is a valid email address.
   *
   * @param {string} email The email string to check.
   * @returns {boolean} True if the string is a valid email address, false otherwise.
   *
   * @example
   * const isValid = StringUtils.isValidEmail('user@example.com');
   * console.log(isValid); // true
   */
  static isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Repeats a string a specified number of times.
   *
   * @param {string} text The string to repeat.
   * @param {number} times The number of times to repeat the string.
   * @returns {string} The repeated string.
   *
   * @example
   * const repeatedText = StringUtils.repeatString('hello', 3);
   * console.log(repeatedText); // "hellohellohello"
   */
  static repeatString(text, times) {
    if (times <= 0) return "";
    return new Array(times + 1).join(text);
  }

  /**
   * Checks if a string starts with a specific prefix.
   *
   * @param {string} text The string to check.
   * @param {string} prefix The prefix to check for.
   * @returns {boolean} True if the string starts with the prefix, false otherwise.
   *
   * @example
   * const startsWithHello = StringUtils.startsWith('hello world', 'hello');
   * console.log(startsWithHello); // true
   */
  static startsWith(text, prefix) {
    return text.indexOf(prefix) === 0;
  }

  /**
   * Checks if a string ends with a specific suffix.
   *
   * @param {string} text The string to check.
   * @param {string} suffix The suffix to check for.
   * @returns {boolean} True if the string ends with the suffix, false otherwise.
   *
   * @example
   * const endsWithWorld = StringUtils.endsWith('hello world', 'world');
   * console.log(endsWithWorld); // true
   */
  static endsWith(text, suffix) {
    return text.lastIndexOf(suffix) === text.length - suffix.length;
  }
}

/**
 * Checks if the provided function is an asynchronous function.
 *
 * This function checks if the given function is an instance of `AsyncFunction`
 * by inspecting its constructor's name.
 *
 * @param {Function} func - The function to check.
 * @returns {boolean} Returns `true` if the function is asynchronous, otherwise `false`.
 */
export const isAsync = (func) => {
  return func && func.constructor.name === "AsyncFunction";
};

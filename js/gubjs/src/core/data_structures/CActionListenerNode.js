/**
 * Represents a node in the action listener linked list.
 * Each node holds a reference to an action listener callback and a link to the next node in the list.
 */
export class CActionListenerNode {
  /**
   * The next node in the linked list.
   * @type {CActionListenerNode | undefined}
   */
  nextNode = undefined;

  /**
   * The callback function associated with this node.
   * @type {Function}
   */
  actionListenerCallback = undefined;

  /**
   * Constructs a new action listener node.
   *
   * @param {Function} actionListenerCallback - The callback function to associate with this node.
   */
  constructor(actionListenerCallback) {
    this.actionListenerCallback = actionListenerCallback;
  }

  /**
   * Gets the callback function associated with this node.
   *
   * @returns {Function} The action listener callback.
   */
  getActionCallback() {
    return this.actionListenerCallback;
  }

  /**
   * Gets the next node in the linked list.
   *
   * @returns {CActionListenerNode | undefined} The next node in the list, or `undefined` if there is none.
   */
  getNextNode() {
    return this.nextNode;
  }

  /**
   * Sets the next node in the linked list.
   *
   * @param {CActionListenerNode | undefined} nextNode - The reference to the next node in the list.
   */
  setNextNode(nextNode) {
    this.nextNode = nextNode;
  }
}

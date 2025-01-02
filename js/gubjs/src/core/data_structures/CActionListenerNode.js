export class CActionListenerNode {
  /** @type {CActionListenerNode | undefined} */
  nextNode = undefined;

  /** @type {Function} */
  actionListenerCallback = undefined;

  /**
   * @param {Function} actionListenerCallback
   */
  constructor(actionListenerCallback) {
    this.actionListenerCallback = actionListenerCallback;
  }

  /**
   * @returns {Function}
   */
  getActionCallback() {
    return this.actionListenerCallback;
  }

  /**
   * returns the next node
   * @returns {CActionListenerNode} The next node in the list
   */
  getNextNode() {
    return this.nextNode;
  }

  /**
   * @param {CActionListenerNode} nextNode The reference to the next node
   */
  setNextNode(nextNode) {
    this.nextNode = nextNode;
  }
}

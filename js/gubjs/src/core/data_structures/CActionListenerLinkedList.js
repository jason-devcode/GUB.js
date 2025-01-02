import { CActionListenerNode } from "./CActionListenerNode.js";

export class CActionListenerLinkedList {
  /** @type {CActionListenerNode | undefined} */
  rootNode = undefined;

  /** @type {CActionListenerNode | undefined} */
  tail = undefined;

  /** @type {number} */
  numNodes = 0;

  constructor() {
    this.numNodes = 0;
  }

  /**
   * Adds a new node to the linked list.
   * @param {function} actionCallback - The callback function to be associated with the new node.
   * @throws {Error} If the node cannot be instantiated.
   */
  addNewNode(actionCallback) {
    /** @type {CActionListenerNode} */
    const newNode = new CActionListenerNode(actionCallback);

    if (!newNode)
      throw new Error("Cannot instantiate CActionListenerNode object");

    const isRootNodeEmpty = !this.rootNode;
    if (isRootNodeEmpty) {
      this.setRootNode(newNode);
    } else {
      this.appendToTail(newNode);
    }
  }

  /**
   * Sets the new node as the root node and the only node in the list.
   * @param {CActionListenerNode} newNode - The node to be set as the root and tail.
   */
  setRootNode(newNode) {
    // Set the new node as both the root and tail node when the list is empty
    this.rootNode = newNode;
    this.tail = newNode;
    ++this.numNodes;
  }

  /**
   * Appends the new node to the end of the list, updating the tail.
   * @param {CActionListenerNode} newNode - The node to be appended to the tail.
   */
  appendToTail(newNode) {
    /** @type {CActionListenerNode | undefined} */
    const prevTail = this.tail;

    const isPrevTailValid = !!prevTail;
    if (!isPrevTailValid) {
      // This block should never be executed, but keep it for safety.
      this.rootNode.setNextNode(newNode);
    } else {
      // Link the previous tail to the new node
      prevTail.setNextNode(newNode);
    }

    // Update the tail to the new node
    this.tail = newNode;
    ++this.numNodes;
  }

  /**
   *
   * @param {CActionListenerNode} previousNode
   */
  removeNextNode(previousNode) {
    if (!previousNode) return;
    const nextNodeOfNextNode = previousNode.getNextNode().getNextNode();
    previousNode.setNextNode(nextNodeOfNextNode);
  }

  /**
   *
   * @param {Function} actionCallback
   */
  removeNodeByActionCallback(actionCallback) {
    if (this.numNodes === 0) return;

    let nodeIterator = this.rootNode;

    do {
      const currentNextNode = nodeIterator.getNextNode();

      if (currentNextNode === undefined) break;

      // check if actionCallback reference are same
      if (actionCallback === currentNextNode.getActionCallback()) {
        this.removeNextNode(nodeIterator);
        this.numNodes -= 1;
        break;
      }

      nodeIterator = currentNextNode;
    } while (nodeIterator !== undefined);
  }
}

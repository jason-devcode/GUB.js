import { CActionListenerNode } from "./CActionListenerNode.js";

/**
 * A linked list to manage action listener nodes.
 * Each node in the list contains a callback function associated with an event.
 */
export class CActionListenerLinkedList {
  /**
   * The root node of the linked list.
   * @type {CActionListenerNode | undefined}
   */
  rootNode = undefined;

  /**
   * The tail node of the linked list.
   * @type {CActionListenerNode | undefined}
   */
  tail = undefined;

  /**
   * The total number of nodes in the linked list.
   * @type {number}
   */
  numNodes = 0;

  /**
   * Constructs a new linked list for managing action listener nodes.
   */
  constructor() {
    this.numNodes = 0;
  }

  /**
   * Adds a new node with the given action callback to the linked list.
   *
   * @param {Function} actionCallback - The callback function to be associated with the new node.
   * @throws {Error} If the node cannot be instantiated.
   */
  addNewNode(actionCallback) {
    /** @type {CActionListenerNode} */
    const newNode = new CActionListenerNode(actionCallback);

    if (!newNode) {
      throw new Error("Cannot instantiate CActionListenerNode object");
    }

    const isRootNodeEmpty = !this.rootNode;
    if (isRootNodeEmpty) {
      this.setRootNode(newNode);
    } else {
      this.appendToTail(newNode);
    }
  }

  /**
   * Sets the new node as the root node and the only node in the list.
   *
   * @param {CActionListenerNode} newNode - The node to be set as the root and tail of the list.
   */
  setRootNode(newNode) {
    this.rootNode = newNode;
    this.tail = newNode;
    this.numNodes++;
  }

  /**
   * Appends the given node to the end of the linked list.
   *
   * @param {CActionListenerNode} newNode - The node to append to the list.
   */
  appendToTail(newNode) {
    /** @type {CActionListenerNode | undefined} */
    const prevTail = this.tail;

    if (prevTail) {
      // Link the previous tail to the new node
      prevTail.setNextNode(newNode);
    } else {
      // Safety check; should not occur if logic is correct
      this.rootNode?.setNextNode(newNode);
    }

    this.tail = newNode;
    this.numNodes++;
  }

  /**
   * Removes the node following the given node.
   *
   * @param {CActionListenerNode} previousNode - The node before the node to be removed.
   */
  removeNextNode(previousNode) {
    if (!previousNode || !previousNode.getNextNode()) return;

    const nodeToRemove = previousNode.getNextNode();
    const nextNode = nodeToRemove.getNextNode();

    previousNode.setNextNode(nextNode);

    // Update tail if the removed node was the tail
    if (this.tail === nodeToRemove) {
      this.tail = previousNode;
    }

    this.numNodes--;
  }

  /**
   * Removes a node from the linked list based on its action callback.
   *
   * @param {Function} actionCallback - The callback function of the node to be removed.
   */
  removeNodeByActionCallback(actionCallback) {
    if (this.numNodes === 0 || !actionCallback) return;

    let nodeIterator = this.rootNode;
    let previousNode = null;

    while (nodeIterator) {
      // Check if the callback matches
      if (actionCallback === nodeIterator.getActionCallback()) {
        // Handle root node removal
        if (nodeIterator === this.rootNode) {
          this.rootNode = nodeIterator.getNextNode();
          if (!this.rootNode) {
            this.tail = undefined; // If the list is now empty
          }
        } else if (previousNode) {
          this.removeNextNode(previousNode);
        }

        this.numNodes--;
        return; // Stop after removing the first matching node
      }

      // Move to the next node
      previousNode = nodeIterator;
      nodeIterator = nodeIterator.getNextNode();
    }
  }
}

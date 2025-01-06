import { CBaseEventManager } from "../declarators/CBaseEventManager.decl.js";
import { CActionListenerLinkedList } from "../CActionListenerLinkedList.js";

/**
 *
 * @param {string} eventName
 * @param {boolean} create
 *
 * @returns {CActionListenerLinkedList}
 */
CBaseEventManager.prototype.getOrCreateActionListenerList = function (
  eventName,
  create = true
) {
  // Retrieve the linked list for the given event name
  const linkedList = this.eventActionsLinkedLists[eventName];

  // If the linked list already exists, return it
  if (linkedList) return linkedList;

  // If create is false so return undefined
  if (!create) return undefined;

  // Create a new linked list if it doesn't exist and store it in the eventActionsLinkedLists
  const newLinkedList = new CActionListenerLinkedList();
  this.eventActionsLinkedLists[eventName] = newLinkedList;

  return newLinkedList;
};

/**
 * Adds an action listener to the event system.
 *
 * @param {string} eventName
 * @param {Function} actionListenerCallback - The callback function to be executed when the associated event is triggered.
 *                                            The callback should follow the signature `(eventData: any) => void`.
 */
CBaseEventManager.prototype.addActionListener = function (
  eventName,
  actionListenerCallback
) {
  if (typeof actionListenerCallback !== "function") return;
  /** @type {CActionListenerLinkedList} */
  const linkedList = this.getOrCreateActionListenerList(eventName);
  linkedList.addNewNode(actionListenerCallback);
};

/**
 * Removes an action listener from the event system.
 *
 * @param {string} eventName
 * @param {Function} actionListenerCallback - The callback function to be removed from the associated event's listeners.
 *                                            The callback should match the reference of an existing listener.
 */
CBaseEventManager.prototype.removeActionListener = function (
  eventName,
  actionListenerCallback
) {
  if (typeof actionListenerCallback !== "function") return;

  /** @type {CActionListenerLinkedList} I */
  const linkedList = this.getOrCreateActionListenerList(eventName, false);
  if (!linkedList) return;
  linkedList.removeNodeByActionCallback(actionListenerCallback);
};

/**
 * Removes an action listener from the event system.
 *
 * @param {string} eventName
 * @param {Object | number | string | undefined} customActionArgs
 * @param {Function} actionListenerCallback - The callback function to be removed from the associated event's listeners.
 *                                            The callback should match the reference of an existing listener.
 */
CBaseEventManager.prototype.triggerEvent = function (eventName, customActionArgs) {
  /** @type {CActionListenerLinkedList} */
  const linkedList = this.getOrCreateActionListenerList(eventName, false);
  if (!linkedList) return;

  // start from root node
  let nodeIterator = linkedList.rootNode;

  while (nodeIterator) {
    const actionCallback = nodeIterator.getActionCallback();
    if (actionCallback) actionCallback(customActionArgs);
    nodeIterator = nodeIterator.getNextNode();
  }
};

export default CBaseEventManager;

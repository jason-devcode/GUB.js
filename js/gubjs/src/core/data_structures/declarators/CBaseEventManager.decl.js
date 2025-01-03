import { CActionListenerLinkedList } from "../CActionListenerLinkedList.js";

/**
 * Base class for event management systems.
 *
 * This class provides a foundation for managing events, allowing the addition and removal of action listeners
 * and the triggering of events. It uses a dictionary to associate event names with linked lists of action listeners.
 */
export class CBaseEventManager {
  constructor() {}

  /**
   *
   * @param {string} eventName
   * @param {boolean} create
   *
   * @returns {CActionListenerLinkedList}
   */
  getOrCreateActionListenerList(eventName, create=true) {
    throw new Error("This method should be implemented!");
  }

  /**
   * Adds an action listener to the event system.
   *
   * @param {string} eventName
   * @param {Function} actionListenerCallback - The callback function to be executed when the associated event is triggered.
   *                                            The callback should follow the signature `(eventData: any) => void`.
   */
  addActionListener(eventName, actionListenerCallback) {
    throw new Error("This method should be implemented!");
  }

  /**
   * Removes an action listener from the event system.
   *
   * @param {string} eventName
   * @param {Function} actionListenerCallback - The callback function to be removed from the associated event's listeners.
   *                                            The callback should match the reference of an existing listener.
   */
  removeActionListener(eventName, actionListenerCallback) {
    throw new Error("This method should be implemented!");
  }

  /**
   * Triggers an event by its name, executing all associated action listeners.
   *
   * @param {string} eventName - The name of the event to be triggered.
   *                             This should correspond to a key in the `linkedListEventActions` dictionary.
   * @throws {Error} If the specified event name does not exist in the dictionary.
   */
  triggerEvent(eventName) {
    throw new Error("This method should be implemented!");
  }

  /**
   * Dictionary that maps event names to their corresponding linked lists of action listeners.
   *
   * Each key is a string representing the event name, and each value is an instance of
   * `CActionListenerLinkedList` that contains the action listeners for that event.
   *
   * @type {Record<string, CActionListenerLinkedList>}
   */
  eventActionsLinkedLists = {};
}

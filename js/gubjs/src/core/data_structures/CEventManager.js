import {CActionListenerLinkedList} from "./CActionListenerLinkedList.js"

/**
 *
 * Analisis para la implementacion de sistema de eventos del motor
 *
 * - Manejador de eventos CEventManager
 * - Manejador de eventos de teclado CKeyEventManager
 * - Manejador de eventos de mouse CMouseEventManager
 * - Manejador de eventos de gamepad CGamepadEventManager
 */

export class CEventManager {
  constructor() {}

  addActionListener(actionListenerCallback) {}
  removeActionListener(actionListenerCallback) {}
  triggerEvent(eventName) {}

  /**
   * Dictionary to store pairs of eventname-action_linked_list
   * @type {Record<string,CActionListenerLinkedList>}
   */
  linkedListEventActions = {};
}

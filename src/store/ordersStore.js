import deepEqual from '../utils/deepEqual';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const ordersStore = {
  orders: [],
  liveOrders: [], // Live orders being tracked (e.g., just placed)
};

export function setOrders(newOrders) {
  if (deepEqual(ordersStore.orders, newOrders)) return;
  ordersStore.orders = newOrders;
  eventBus.emit(EVENT_TYPES.ORDER_UPDATE);
}

export function getOrders() {
  return ordersStore.orders;
}

/**
 * Sets the live orders being tracked (e.g., just placed orders).
 * @param {Array} newLiveOrders
 */
export function setLiveOrders(newLiveOrders) {
  ordersStore.liveOrders = newLiveOrders;
  eventBus.emit(EVENT_TYPES.LIVE_ORDER_UPDATE);
}

/**
 * Gets the current live orders being tracked.
 * @returns {Array}
 */
export function getLiveOrders() {
  return ordersStore.liveOrders;
}

export function clear() {
  ordersStore.orders = [];
  eventBus.emit(EVENT_TYPES.ORDER_UPDATE);
}

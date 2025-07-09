import deepEqual from '../utils/deepEqual';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const editOrderStore = {
  editOrder: null,
};

export function setEditOrder(newEditOrder) {
  if (deepEqual(editOrderStore.editOrder, newEditOrder)) return;
  editOrderStore.editOrder = newEditOrder;
  eventBus.emit(EVENT_TYPES.EDIT_ORDER_UPDATE);
}

export function getEditOrder() {
  return editOrderStore.editOrder;
}

export function clear() {
  editOrderStore.editOrder = null;
  eventBus.emit(EVENT_TYPES.EDIT_ORDER_UPDATE);
} 
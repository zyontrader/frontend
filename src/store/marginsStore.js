import deepEqual from '../utils/deepEqual';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const marginsStore = {
  margins: null,
};

export function setMargins(newMargins) {
  if (deepEqual(marginsStore.margins, newMargins)) return;
  marginsStore.margins = newMargins;
  eventBus.emit(EVENT_TYPES.MARGINS_UPDATE);
}

export function getMargins() {
  return marginsStore.margins;
}

export function clear() {
  marginsStore.margins = null;
  eventBus.emit(EVENT_TYPES.MARGINS_UPDATE);
} 
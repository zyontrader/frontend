import deepEqual from '../utils/deepEqual';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const positionsStore = {
  positions: [],
};

export function setPositions(newPositions) {
  if (deepEqual(positionsStore.positions, newPositions)) return;
  positionsStore.positions = newPositions;
  eventBus.emit(EVENT_TYPES.POSITION_UPDATE);
}

export function getPositions() {
  return positionsStore.positions;
}

export function clear() {
  positionsStore.positions = [];
  eventBus.emit(EVENT_TYPES.POSITION_UPDATE);
}

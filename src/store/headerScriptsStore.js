import deepEqual from '../utils/deepEqual';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const headerScriptsStore = {
  headerScripts: [],
};

export function setHeaderScripts(newHeaderScripts) {
  if (deepEqual(headerScriptsStore.headerScripts, newHeaderScripts)) return;
  headerScriptsStore.headerScripts = newHeaderScripts;
  eventBus.emit(EVENT_TYPES.HEADER_SCRIPTS_UPDATE);
}

export function getHeaderScripts() {
  return headerScriptsStore.headerScripts;
}

export function clear() {
  headerScriptsStore.headerScripts = [];
  eventBus.emit(EVENT_TYPES.HEADER_SCRIPTS_UPDATE);
} 
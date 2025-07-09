import deepEqual from '../utils/deepEqual';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const scriptsStore = {
  scripts: {},
};

export function addScript(script) {
  const prev = scriptsStore.scripts[script.id];
  if (deepEqual(prev, script)) return;
  scriptsStore.scripts[script.id] = script;
  // Emit topic-specific event
  eventBus.emit(EVENT_TYPES.SCRIPT_UPDATE, script.id);
}

export function getScript(id) {
  return scriptsStore.scripts[id];
}

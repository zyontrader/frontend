import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const mobileDataStore = {
  selectedScriptId: null,
  scriptIdIsPosition: false,
  position: null,
};

export function setSelectedScriptId(scriptId) {
  mobileDataStore.selectedScriptId = scriptId;
  eventBus.emit(EVENT_TYPES.MOBILE_DATA_UPDATE, 'selectedScriptId');
}

export function getSelectedScriptId() {
  return mobileDataStore.selectedScriptId;
}

export function setScriptIdIsPosition(isPosition) {
  mobileDataStore.scriptIdIsPosition = isPosition;
  eventBus.emit(EVENT_TYPES.MOBILE_DATA_UPDATE, 'scriptIdIsPosition');
}

export function getScriptIdIsPosition() {
  return mobileDataStore.scriptIdIsPosition;
}

export function setPosition(position) {
  mobileDataStore.position = position;
  eventBus.emit(EVENT_TYPES.MOBILE_DATA_UPDATE, 'position');
}

export function getPosition() {
  return mobileDataStore.position;
}

export function clear() {
  mobileDataStore.selectedScriptId = null;
  mobileDataStore.scriptIdIsPosition = false;
  mobileDataStore.position = null;
  eventBus.emit(EVENT_TYPES.MOBILE_DATA_UPDATE, 'clear');
} 
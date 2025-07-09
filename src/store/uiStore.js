import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const uiStore = {
  isStrategyTabActive: false,
  isFloatingPanelVisible: false,
  isSidebarLeftVisible: true,
  isMobile: false,
};

export function setStrategyTabActive(isActive) {
  uiStore.isStrategyTabActive = isActive;
  setFloatingPanelVisible(isActive);
  setSidebarLeftVisible(!isActive);
  eventBus.emit(EVENT_TYPES.UI_UPDATE, 'isStrategyTabActive');
}

export function getStrategyTabActive() {
  return uiStore.isStrategyTabActive;
}

export function setFloatingPanelVisible(isVisible) {
  uiStore.isFloatingPanelVisible = isVisible;
  eventBus.emit(EVENT_TYPES.UI_UPDATE, 'isFloatingPanelVisible');
}

export function getFloatingPanelVisible() {
  return uiStore.isFloatingPanelVisible;
}

export function setSidebarLeftVisible(isVisible) {
  uiStore.isSidebarLeftVisible = isVisible;
  eventBus.emit(EVENT_TYPES.UI_UPDATE, 'isSidebarLeftVisible');
}

export function getSidebarLeftVisible() {
  return uiStore.isSidebarLeftVisible;
}

export function setIsMobile(isMobile) {
  uiStore.isMobile = isMobile;
  eventBus.emit(EVENT_TYPES.UI_UPDATE, 'isMobile');
}

export function getIsMobile() {
  return uiStore.isMobile;
}

import deepEqual from '../utils/deepEqual';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const optionAnalyticsStore = {
  analytics: null,
};

export function setAnalytics(newAnalytics) {
  if (deepEqual(optionAnalyticsStore.analytics, newAnalytics)) return;
  optionAnalyticsStore.analytics = newAnalytics;
  eventBus.emit(EVENT_TYPES.OPTION_ANALYTICS_UPDATE);
}

export function getAnalytics() {
  return optionAnalyticsStore.analytics;
}

export function clear() {
  optionAnalyticsStore.analytics = null;
  eventBus.emit(EVENT_TYPES.OPTION_ANALYTICS_UPDATE);
}

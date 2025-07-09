class EventBus {
  constructor() {
    this.globalEvents = {}; // { [eventType]: [listener, ...] }
    this.topicEvents = {};  // { [eventType]: { [topicId]: [listener, ...] } }
  }

  // Subscribe to global event
  on(eventType, listenerOrTopicId, maybeListener) {
    if (typeof listenerOrTopicId === 'function' && maybeListener === undefined) {
      // on(eventType, listener)
      if (!this.globalEvents[eventType]) this.globalEvents[eventType] = [];
      this.globalEvents[eventType].push(listenerOrTopicId);
      return () => this.off(eventType, listenerOrTopicId);
    } else if (typeof listenerOrTopicId !== 'function' && typeof maybeListener === 'function') {
      // on(eventType, topicId, listener)
      const topicId = listenerOrTopicId;
      const listener = maybeListener;
      if (!this.topicEvents[eventType]) this.topicEvents[eventType] = {};
      if (!this.topicEvents[eventType][topicId]) this.topicEvents[eventType][topicId] = [];
      this.topicEvents[eventType][topicId].push(listener);
      return () => this.off(eventType, topicId, listener);
    } else {
      throw new Error('Invalid arguments for on()');
    }
  }

  // Unsubscribe
  off(eventType, listenerOrTopicId, maybeListener) {
    if (typeof listenerOrTopicId === 'function' && maybeListener === undefined) {
      // off(eventType, listener)
      if (!this.globalEvents[eventType]) return;
      this.globalEvents[eventType] = this.globalEvents[eventType].filter(l => l !== listenerOrTopicId);
    } else if (typeof listenerOrTopicId !== 'function' && typeof maybeListener === 'function') {
      // off(eventType, topicId, listener)
      const topicId = listenerOrTopicId;
      const listener = maybeListener;
      if (!this.topicEvents[eventType] || !this.topicEvents[eventType][topicId]) return;
      this.topicEvents[eventType][topicId] = this.topicEvents[eventType][topicId].filter(l => l !== listener);
    }
  }

  // Emit event
  emit(eventType, topicId) {
    // If topicId is provided and topic listeners exist, emit to them
    if (
      typeof topicId !== 'undefined' &&
      this.topicEvents[eventType] &&
      this.topicEvents[eventType][topicId]
    ) {
      this.topicEvents[eventType][topicId].forEach(listener => setTimeout(() => listener(), 0));
    }
    // Always emit to global listeners
    if (this.globalEvents[eventType]) {
      this.globalEvents[eventType].forEach(listener => setTimeout(() => listener(), 0));
    }
  }
}

const eventBus = new EventBus();
export default eventBus;

export const EVENT_TYPES = {
  QUOTE_UPDATE: 'QUOTE_UPDATE',
  SCRIPT_UPDATE: 'SCRIPT_UPDATE',
  ORDER_UPDATE: 'ORDER_UPDATE',
  LIVE_ORDER_UPDATE: 'LIVE_ORDER_UPDATE',
  POSITION_UPDATE: 'POSITION_UPDATE',
  WATCHLISTS_UPDATE: 'WATCHLISTS_UPDATE',
  WATCHLIST_SELECTED: 'WATCHLIST_SELECTED',
  OPTION_ANALYTICS_UPDATE: 'OPTION_ANALYTICS_UPDATE',
  MARGINS_UPDATE: 'MARGINS_UPDATE',
  HEADER_SCRIPTS_UPDATE: 'HEADER_SCRIPTS_UPDATE',
  EDIT_ORDER_UPDATE: 'EDIT_ORDER_UPDATE',
  ALLOW_ACCOUNT_LOGOUT_UPDATE: 'ALLOW_ACCOUNT_LOGOUT_UPDATE',
  USER_UPDATE: 'USER_UPDATE',
  USER_ACCOUNT_ID_UPDATE: 'USER_ACCOUNT_ID_UPDATE',
  USER_CREDS_UPDATE: 'USER_CREDS_UPDATE',
  USER_ACCOUNTS_UPDATE: 'USER_ACCOUNTS_UPDATE',
  SHOW_ACCOUNT_LOGIN_UPDATE: 'SHOW_ACCOUNT_LOGIN_UPDATE',
  SHOW_USER_LOGIN_UPDATE: 'SHOW_USER_LOGIN_UPDATE',
  SHOW_USER_ONBOARDING_UPDATE: 'SHOW_USER_ONBOARDING_UPDATE',
  SHOW_USER_CONFIRMATION_UPDATE: 'SHOW_USER_CONFIRMATION_UPDATE',
  SHOW_ACCOUNT_SELECTION_UPDATE: 'SHOW_ACCOUNT_SELECTION_UPDATE',
  SHOW_ACCOUNT_ADDITION_UPDATE: 'SHOW_ACCOUNT_ADDITION_UPDATE',
  SHOW_ADD_ACCOUNT_POPUP_UPDATE: 'SHOW_ADD_ACCOUNT_POPUP_UPDATE',
  SHOW_ACCOUNT_SELECTION_POPUP_UPDATE: 'SHOW_ACCOUNT_SELECTION_POPUP_UPDATE',
  SCRIPT_SEARCH_RESULTS_UPDATE: 'SCRIPT_SEARCH_RESULTS_UPDATE',
  SCRIPT_SEARCH_RESULTS_LOADING_UPDATE: 'SCRIPT_SEARCH_RESULTS_LOADING_UPDATE',
  SCRIPT_SEARCH_CLEAR: 'SCRIPT_SEARCH_CLEAR',
  UI_UPDATE: 'UI_UPDATE',
  MOBILE_DATA_UPDATE: 'MOBILE_DATA_UPDATE',
};

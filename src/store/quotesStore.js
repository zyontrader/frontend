import eventBus, { EVENT_TYPES } from '../utils/eventBus';
import deepEqual from '../utils/deepEqual';

export const quotesStore = {
  quotes: {},
};

export function addQuote(quote) {
  if (deepEqual(quotesStore.quotes[quote.scriptId], quote)) return;
  quotesStore.quotes[quote.scriptId] = quote;
  eventBus.emit(EVENT_TYPES.QUOTE_UPDATE, quote.scriptId);
}

export function getQuote(scriptId) {
  return quotesStore.quotes[scriptId];
}

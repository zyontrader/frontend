import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const optionChainsStore = {
  selectedUnderlying: null,
  selectedExpiry: null,
  underlyings: [],
  expiries: [],
};

export function setSelectedUnderlying(underlying) {
  if (optionChainsStore.selectedUnderlying === underlying) return;
  optionChainsStore.selectedExpiry = null;
  optionChainsStore.selectedUnderlying = underlying;
  eventBus.emit(EVENT_TYPES.OPTION_CHAIN_UPDATE, 'selectedUnderlying');
}

export function setSelectedExpiry(expiry) {
  if (optionChainsStore.selectedExpiry === expiry) return;
  optionChainsStore.selectedExpiry = expiry;
  eventBus.emit(EVENT_TYPES.OPTION_CHAIN_UPDATE, 'selectedExpiry');
}

export function setUnderlyings(underlyings) {
  optionChainsStore.underlyings = underlyings;
}

export function setExpiries(expiries) {
  optionChainsStore.expiries = expiries;
}

export function getSelectedUnderlying() {
  return optionChainsStore.selectedUnderlying;
}

export function getSelectedExpiry() {
  return optionChainsStore.selectedExpiry;
}

export function getUnderlyings() {
  return optionChainsStore.underlyings;
}

export function getExpiries() {
  return optionChainsStore.expiries;
} 
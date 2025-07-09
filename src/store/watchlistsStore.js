import deepEqual from '../utils/deepEqual';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const watchlistsStore = {
  watchlists: [],
  selectedWatchlistId: null,
};

export function setWatchlists(newWatchlists) {
  if (deepEqual(watchlistsStore.watchlists, newWatchlists)) return;
  watchlistsStore.watchlists = newWatchlists;
  eventBus.emit(EVENT_TYPES.WATCHLISTS_UPDATE);

  // Ensure selectedWatchlistId is valid
  const ids = newWatchlists.map(wl => wl.watchlistId);
  if (!ids.includes(watchlistsStore.selectedWatchlistId)) {
    const newId = newWatchlists.length > 0 ? newWatchlists[0].watchlistId : null;
    setSelectedWatchlistId(newId);
  }
}

export function getWatchlists() {
  return watchlistsStore.watchlists;
}

export function setSelectedWatchlistId(id) {
  if (watchlistsStore.selectedWatchlistId === id) return;
  watchlistsStore.selectedWatchlistId = id;
  eventBus.emit(EVENT_TYPES.WATCHLIST_SELECTED);
}

export function getSelectedWatchlistId() {
  return watchlistsStore.selectedWatchlistId;
}

export function clear() {
  watchlistsStore.watchlists = [];
  watchlistsStore.selectedWatchlistId = null;
  eventBus.emit(EVENT_TYPES.WATCHLISTS_UPDATE);
  eventBus.emit(EVENT_TYPES.WATCHLIST_SELECTED);
} 
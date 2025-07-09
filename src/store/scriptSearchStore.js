import deepEqual from '../utils/deepEqual';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

export const scriptSearchStore = {
  searchText: '',
  searchResults: [],
  searchResultsLoading: false,
};

export function setSearchText(newText) {
  if (scriptSearchStore.searchText === newText) return;
  scriptSearchStore.searchText = newText;
}

export function getSearchText() {
  return scriptSearchStore.searchText;
}

export function setSearchResults(newResults) {
  if (deepEqual(scriptSearchStore.searchResults, newResults)) return;
  scriptSearchStore.searchResults = newResults;
  eventBus.emit(EVENT_TYPES.SCRIPT_SEARCH_RESULTS_UPDATE);
}

export function getSearchResults() {
  return scriptSearchStore.searchResults;
}

export function setSearchResultsLoading(isLoading) {
  if (scriptSearchStore.searchResultsLoading === isLoading) return;
  scriptSearchStore.searchResultsLoading = isLoading;
  eventBus.emit(EVENT_TYPES.SCRIPT_SEARCH_RESULTS_LOADING_UPDATE);
}

export function getSearchResultsLoading() {
  return scriptSearchStore.searchResultsLoading;
}

export function clear() {
  scriptSearchStore.searchText = '';
  scriptSearchStore.searchResults = [];
  scriptSearchStore.searchResultsLoading = false;
  eventBus.emit(EVENT_TYPES.SCRIPT_SEARCH_CLEAR);
} 
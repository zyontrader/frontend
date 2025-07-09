import { post } from './base';
import { showOrderStatusToast } from '../utils/utils';
import * as scriptSearchStore from '../store/scriptSearchStore';

// Sync API method
export function sync(creds) {
  return post('/sync', {}, creds);
}

// Login API method
export async function login({ userName, password, googleSignInToken }) {
  const obj = googleSignInToken
    ? { googleSignInToken }
    : { userName, password };
  const res = await post('/users/signin', obj);
  if (res.status && res.creds) {
    let date = new Date(Date.now() + 24 * 60 * 60 * 1000);
    document.cookie = `Auth=${res.creds}; expires=${date.toUTCString()}; path=/`;
  }
  return res;
}

// Add Account API method
export function addAccount(accountName) {
  return post('/accounts/create', { accountName });
}

// Send Confirmation Email API method
export async function sendConfirmationEmail() {
  return post('/user/send-confirmation-email');
}

// Script Search API method
export async function searchScripts(query) {
  if (query && query.length >= 3) {
    scriptSearchStore.setSearchText(query);
    scriptSearchStore.setSearchResultsLoading(true);
    try {
      const data = await post('/scripts', { searchText: query });
      if (scriptSearchStore.getSearchText() === data.searchText) {
        scriptSearchStore.setSearchResults(data.searchScripts || []);
        scriptSearchStore.setSearchResultsLoading(false);
      }
      return data;
    } catch (error) {
      scriptSearchStore.setSearchResults([]);
      scriptSearchStore.setSearchResultsLoading(false);
      return null;
    }
  } else {
    scriptSearchStore.setSearchResults([]);
    scriptSearchStore.setSearchResultsLoading(false);
  }
}

// Add Watchlist API method
export async function addWatchlist(watchlistName) {
  return post('/watchlists/add', { watchlistName });
}

// Add Item to Watchlist API method
export async function addItemToWatchlist(watchlistId, scriptId) {
  return post('/watchlists/items/add', { watchlistId, scriptId });
}

// Delete Watchlist Item API method
export async function deleteWatchlistItem({ watchlistId, scriptId }) {
  return post('/watchlists/items/delete', { watchlistId, scriptId });
}

// Add to Temp Watchlist API method
export async function addToTempWatchlist(scriptId) {
  try {
    await post('/watchlists/temp/add', { scriptId });
  } catch (e) { }
}

// Submit Orders API method
export async function submitOrders(orders, orderStatusHandler = showOrderStatusToast) {
  try {
    const response = await post('/orders/place', { orders });
    if (orderStatusHandler) orderStatusHandler(response);
    setTimeout(() => {
      sync();
    }, 2000);
    return response;
  } catch (error) {
    setTimeout(() => {
      sync();
    }, 2000);
    throw error;
  }
}

// Cancel Orders API method
export async function cancelOrders(orders, orderStatusHandler = showOrderStatusToast) {
  try {
    const response = await post('/orders/cancel', { orders });
    if (orderStatusHandler) orderStatusHandler(response);
    setTimeout(() => {
      sync();
    }, 2000);
    return response;
  } catch (error) {
    setTimeout(() => {
      sync();
    }, 2000);
    throw error;
  }
}

// Options Analysis API method
export async function optionAnalysis(basketId, analysisData) {
  let requestBody = analysisData || {};
  if (basketId) {
    requestBody.basket = { basketId };
  }
  return post('/options/analysis', requestBody);
}

// Market Summary API method
export async function marketSummary(params = {}) {
  return post('/analytics/market-summary', params);
}

// Option Chain Analysis API method
export async function optionChainAnalysis(params = {}) {
  return post('/options/option-chain', params);
}

// Basket APIs
export async function updateBasket(basket) {
  return post('/baskets/update', { basket });
}

export async function getBaskets() {
  return post('/baskets', {});
}

export async function deleteBasket(basketId) {
  return post('/baskets/update', { basket: { basketId }, deleteBasket: true });
}

// Get items for a strategy API method
export async function getItemsForStrategy(strategy, underlying, expiry) {
  return post('/options/strategy-items', { strategy, underlying, expiry });
}

// Logout Account API method
export async function logoutAccount() {
  return post('/accounts/logout', {});
}

// Exit All Orders API method
export async function exitAll() {
  return post('/orders/exit-all', {});
}

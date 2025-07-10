import { isNil } from '../utils/utils';
import * as userStore from '../store/userStore';
import * as scriptsStore from '../store/scriptsStore';
import * as quotesStore from '../store/quotesStore';
import * as positionsStore from '../store/positionsStore';
import * as ordersStore from '../store/ordersStore';
import * as watchlistsStore from '../store/watchlistsStore';
import * as marginsStore from '../store/marginsStore';
import * as headerScriptsStore from '../store/headerScriptsStore';
import * as optionAnalyticsStore from '../store/optionAnalyticsStore';
import * as optionChainsStore from '../store/optionChainsStore';

// Use environment variable for API base URL
const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || '/api';

console.log(BASE_URL)
// Common POST function
export async function post(endpoint, params = {}, creds) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Auth': creds || userStore.userStore.creds,
    'Account': userStore.userStore.accountId,
  };

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
  } catch (e) {
    console.error('Network error:', e);
    throw e;
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error('Invalid JSON:', e);
    throw e;
  }

  if (data.status) {
    handleCommon(data);
  }
  if (!response.ok) {
    throw new Error(data?.errorMessage || 'API Error');
  }
  return data;
}

// Common response handler
function handleCommon(data) {
  if (data.creds) {
    userStore.setCreds(data.creds);
    let date = new Date(Date.now() + 24 * 60 * 60 * 1000);
    document.cookie = `Auth=${data.creds}; expires=${date.toUTCString()}; path=/`;
  }
  if (data.user) userStore.setUser(data.user);
  if (data.accounts) userStore.setAccounts(data.accounts || []);
  if (data.accountId) userStore.setAccountId(data.accountId);
  if (data.scripts) {
    for (let s of data.scripts) {
      scriptsStore.addScript(s);
    }
  }
  if (data.searchScripts) {
    for (let s of data.searchScripts) {
      scriptsStore.addScript(s);
    }
  }
  if (data.quotes) {
    for (let q of data.quotes) {
      quotesStore.addQuote(q);
    }
  }
  if (data.positions) positionsStore.setPositions(data.positions || []);
  if (data.orders) ordersStore.setOrders(data.orders || []);
  if (data.watchlists) watchlistsStore.setWatchlists(data.watchlists || []);
  if (data.selectedWatchlistId) watchlistsStore.setSelectedWatchlistId(data.selectedWatchlistId);
  if (data.margins) marginsStore.setMargins(data.margins);
  if (data.headerScripts) headerScriptsStore.setHeaderScripts(data.headerScripts || []);
  if (data.optionAnalysis) optionAnalyticsStore.setAnalytics(data.optionAnalysis);

  // UI state flags
  if (!isNil(data.requireAccountLogin)) {
    userStore.setShowAccountLogin(data.requireAccountLogin);
  }
  if (!isNil(data.allowAccountLogout)) {
    userStore.setAllowAccountLogout(data.allowAccountLogout);
  }
  if (!isNil(data.accountValidTime)) {
    userStore.setAccountLogoutTime(data.accountValidTime);
  }
  userStore.setShowUserLogin(!!data.requireUserLogin);
  userStore.setShowUserOnboarding(!!data.requireUserOnboarding);
  userStore.setShowUserConfirmation(!!data.requireUserConfirmation);
  userStore.setShowAccountAddition(!!data.requireAccountAddition);
  userStore.setShowAccountSelection(!!data.requireAccountSelection);

  if (data.optionChainAnalysis) {
    optionChainsStore.setSelectedUnderlying(data?.optionChainAnalysis?.underlying);
    optionChainsStore.setSelectedExpiry(data?.optionChainAnalysis?.expiry);
    optionChainsStore.setUnderlyings(data?.optionUnderlyings || []);
    optionChainsStore.setExpiries(data?.optionExpirires || []);
  }
}

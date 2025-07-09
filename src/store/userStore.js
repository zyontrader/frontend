import deepEqual from '../utils/deepEqual';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export const userStore = {
  creds: getCookie('Auth'),
  accountId: null,
  user: null,
  accounts: [],
  allowAccountLogout: false,
  showAccountLogin: false,
  showUserLogin: false,
  showUserOnboarding: false,
  showUserConfirmation: false,
  showAccountSelection: false,
  showAccountAddition: false,
  showAddAccountPopup: false,
  showAccountSelectionPopup: false,
  accountLogoutTime: 0,
};

export function setCreds(newCreds) {
  if (userStore.creds === newCreds) return;
  userStore.creds = newCreds;
}

export function setAccountId(id) {
  if (userStore.accountId === id) return;
  userStore.accountId = id;
  eventBus.emit(EVENT_TYPES.USER_ACCOUNT_ID_UPDATE);
}

export function setUser(newUser) {
  if (deepEqual(userStore.user, newUser)) return;
  userStore.user = newUser;
  eventBus.emit(EVENT_TYPES.USER_UPDATE);
}

export function setAccounts(newAccounts) {
  if (deepEqual(userStore.accounts, newAccounts)) return;
  userStore.accounts = newAccounts;
  eventBus.emit(EVENT_TYPES.USER_ACCOUNTS_UPDATE);
}

export function setShowAccountLogin(value) {
  if (userStore.showAccountLogin === value) return;
  userStore.showAccountLogin = value;
  eventBus.emit(EVENT_TYPES.SHOW_ACCOUNT_LOGIN_UPDATE);
}

export function setAllowAccountLogout(value) {
  if (userStore.allowAccountLogout === value) return;
  userStore.allowAccountLogout = value;
  eventBus.emit(EVENT_TYPES.ALLOW_ACCOUNT_LOGOUT_UPDATE);
}

export function setShowUserLogin(value) {
  if (userStore.showUserLogin === value) return;
  userStore.showUserLogin = value;
  eventBus.emit(EVENT_TYPES.SHOW_USER_LOGIN_UPDATE);
}

export function setShowUserOnboarding(value) {
  if (userStore.showUserOnboarding === value) return;
  userStore.showUserOnboarding = value;
  eventBus.emit(EVENT_TYPES.SHOW_USER_ONBOARDING_UPDATE);
}

export function setShowUserConfirmation(value) {
  if (userStore.showUserConfirmation === value) return;
  userStore.showUserConfirmation = value;
  eventBus.emit(EVENT_TYPES.SHOW_USER_CONFIRMATION_UPDATE);
}

export function setShowAccountSelection(value) {
  if (userStore.showAccountSelection === value) return;
  userStore.showAccountSelection = value;
  eventBus.emit(EVENT_TYPES.SHOW_ACCOUNT_SELECTION_UPDATE);
}

export function setShowAccountAddition(value) {
  if (userStore.showAccountAddition === value) return;
  userStore.showAccountAddition = value;
  eventBus.emit(EVENT_TYPES.SHOW_ACCOUNT_ADDITION_UPDATE);
}

export function setShowAddAccountPopup(value) {
  if (userStore.showAddAccountPopup === value) return;
  userStore.showAddAccountPopup = value;
  eventBus.emit(EVENT_TYPES.SHOW_ADD_ACCOUNT_POPUP_UPDATE);
}

export function setShowAccountSelectionPopup(value) {
  if (userStore.showAccountSelectionPopup === value) return;
  userStore.showAccountSelectionPopup = value;
  eventBus.emit(EVENT_TYPES.SHOW_ACCOUNT_SELECTION_POPUP_UPDATE);
}

export function setAccountLogoutTime(time) {
  if (userStore.accountLogoutTime === time) return;
  userStore.accountLogoutTime = time;
  eventBus.emit(EVENT_TYPES.USER_UPDATE);
}

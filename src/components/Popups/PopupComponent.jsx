import React, { useEffect, useState } from 'react';
import UserLoginPopup from '../Account/UserLoginPopup';
import AddAccountPopup from '../Account/AddAccountPopup';
import AccountSelectionPopup from '../Account/AccountSelectionPopup';
import UserOnboardingPopup from '../Account/UserOnboardingPopup';
import UserConfirmationPopup from '../Account/UserConfirmationPopup';
import OrderPopup from '../Orders/OrderPopup';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';
import * as userStore from '../../store/userStore';
import { getIsMobile } from '../../store/uiStore';

const PopupComponent = ({ loading }) => {
    const [accountId, setAccountId] = useState(userStore.userStore.accountId);
    const [showAccountLogin, setShowAccountLogin] = useState(userStore.userStore.showAccountLogin);
    const [showUserLogin, setShowUserLogin] = useState(userStore.userStore.showUserLogin);
    const [showUserOnboarding, setShowUserOnboarding] = useState(userStore.userStore.showUserOnboarding);
    const [showUserConfirmation, setShowUserConfirmation] = useState(userStore.userStore.showUserConfirmation);
    const [showAccountSelection, setShowAccountSelection] = useState(userStore.userStore.showAccountSelection || userStore.userStore.showAccountSelectionPopup);
    const [showAccountAddition, setShowAccountAddition] = useState(userStore.userStore.showAccountAddition || userStore.userStore.showAddAccountPopup);
    const isMobile = getIsMobile();

    useEffect(() => {
        function handleUserStatusChange() {
            setShowUserLogin(userStore.userStore.showUserLogin);
            setShowUserOnboarding(userStore.userStore.showUserOnboarding);
            setShowUserConfirmation(userStore.userStore.showUserConfirmation);
            setShowAccountSelection(userStore.userStore.showAccountSelection || userStore.userStore.showAccountSelectionPopup);
            setShowAccountAddition(userStore.userStore.showAccountAddition || userStore.userStore.showAddAccountPopup);
            setShowAccountLogin(userStore.userStore.showAccountLogin);
        }
        function handleAccountIdChange() {
            setAccountId(userStore.userStore.accountId);
        }

        const unsubscribeAccountId = eventBus.on(EVENT_TYPES.USER_ACCOUNT_ID_UPDATE, handleAccountIdChange);
        const unsubscribeShowAccountLogin = eventBus.on(EVENT_TYPES.SHOW_ACCOUNT_LOGIN_UPDATE, handleUserStatusChange);
        const unsubscribeShowUserLogin = eventBus.on(EVENT_TYPES.SHOW_USER_LOGIN_UPDATE, handleUserStatusChange);
        const unsubscribeShowUserOnboarding = eventBus.on(EVENT_TYPES.SHOW_USER_ONBOARDING_UPDATE, handleUserStatusChange);
        const unsubscribeShowUserConfirmation = eventBus.on(EVENT_TYPES.SHOW_USER_CONFIRMATION_UPDATE, handleUserStatusChange);
        const unsubscribeShowAccountSelection = eventBus.on(EVENT_TYPES.SHOW_ACCOUNT_SELECTION_UPDATE, handleUserStatusChange);
        const unsubscribeShowAccountSelectionPopup = eventBus.on(EVENT_TYPES.SHOW_ACCOUNT_SELECTION_POPUP_UPDATE, handleUserStatusChange);
        const unsubscribeShowAccountAddition = eventBus.on(EVENT_TYPES.SHOW_ACCOUNT_ADDITION_UPDATE, handleUserStatusChange);
        const unsubscribeShowAddAccountPopup = eventBus.on(EVENT_TYPES.SHOW_ADD_ACCOUNT_POPUP_UPDATE, handleUserStatusChange);

        return () => {
            if (typeof unsubscribeAccountId === 'function') unsubscribeAccountId();
            if (typeof unsubscribeShowAccountLogin === 'function') unsubscribeShowAccountLogin();
            if (typeof unsubscribeShowUserLogin === 'function') unsubscribeShowUserLogin();
            if (typeof unsubscribeShowUserOnboarding === 'function') unsubscribeShowUserOnboarding();
            if (typeof unsubscribeShowUserConfirmation === 'function') unsubscribeShowUserConfirmation();
            if (typeof unsubscribeShowAccountSelection === 'function') unsubscribeShowAccountSelection();
            if (typeof unsubscribeShowAccountAddition === 'function') unsubscribeShowAccountAddition();
            if (typeof unsubscribeShowAccountSelectionPopup === 'function') unsubscribeShowAccountSelectionPopup();
            if (typeof unsubscribeShowAddAccountPopup === 'function') unsubscribeShowAddAccountPopup();
        };
    }, []);

    const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL || '/api';
    const accountLoginUrl = `${apiBaseUrl.replace(/\/$/, '')}/account-login/${accountId || ''}`;

    return <>
        {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-dark-bg/60 z-50">
                <img
                    src={`/logo_icon.svg`}
                    alt="Logo"
                    className="animate-jump h-32 w-32"
                    style={{ filter: 'drop-shadow(0 0 16px #1abe4d)' }}
                />
                <style>{`
          @keyframes jump {
            0%   { transform: translateY(0); }
            20%  { transform: translateY(-30px); }
            40%  { transform: translateY(0); }
            60%  { transform: translateY(-15px); }
            80%  { transform: translateY(0); }
            100% { transform: translateY(0); }
          }
          .animate-jump {
            animation: jump 1.2s infinite cubic-bezier(.28,.84,.42,1);
          }
        `}</style>
            </div>
        )}
        {!loading && !showUserLogin && !showUserOnboarding && !showUserConfirmation && showAccountLogin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-400/20">
                <button
                    className="absolute top-6 font-semibold right-8 z-10 bg-neutral-300 text-neutral-900 rounded-full w-8 h-8 flex items-center justify-center hover:bg-neutral-200 focus:outline-none"
                    onClick={() => userStore.setShowAccountLogin(false)}
                    title="Close"
                >
                    &#10005;
                </button>
                <iframe
                    src={accountLoginUrl}
                    title="Account Login"
                    className="w-[600px] h-[500px] rounded-sm bg-neutral-700 shadow-2xl border border-neutral-700"
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        )}
        <UserLoginPopup isOpen={!loading && showUserLogin} />
        <AccountSelectionPopup isOpen={!loading && !showUserLogin && !showUserConfirmation && !showUserOnboarding && showAccountSelection} />
        <AddAccountPopup
          isOpen={!loading && !showUserLogin && !showUserConfirmation && !showUserOnboarding && showAccountAddition}
          closeable={userStore.userStore.showAddAccountPopup}
        />
        <UserOnboardingPopup isOpen={!loading && !showUserLogin && showUserOnboarding} />
        <UserConfirmationPopup isOpen={!loading && !showUserLogin && showUserConfirmation} />
        {!isMobile && <OrderPopup />}
    </>
};

export default PopupComponent;
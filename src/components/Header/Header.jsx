import React from 'react';
import HeaderScriptComponent from './HeaderScriptComponent';
import { formatPrice } from '../../utils/formatter';
import { Avatar, Dropdown, Button, Menu, Drawer } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, LoginOutlined } from '@ant-design/icons';
import * as userStore from '../../store/userStore';
import * as headerScriptsStore from '../../store/headerScriptsStore';
import * as marginsStore from '../../store/marginsStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';
import { logoutAccount } from '../../api/apis';
import { showErrorToast } from '../../utils/utils';
import { formatDateTimeDDMMYYHHmm } from '../../utils/formatter';

const Header = () => {
  const [user, setUser] = React.useState(() => userStore.userStore.user);
  const [headerScripts, setHeaderScripts] = React.useState(() => headerScriptsStore.getHeaderScripts());
  const [margin, setMargin] = React.useState(() => marginsStore.getMargins());
  const [accountSelected, setAccountSelected] = React.useState(() => userStore.userStore.accounts.find(acc => acc.id === userStore.userStore.accountId)?.name || 'Select Account');
  const [allowAccountLogout, setAllowAccountLogout] = React.useState(() => userStore.userStore.allowAccountLogout);
  const [accountLogoutTime, setAccountLogoutTime] = React.useState(() => userStore.userStore.accountLogoutTime);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    function handleUserChange() { setUser(userStore.userStore.user); }
    function handleHeaderScriptsChange() { setHeaderScripts(headerScriptsStore.getHeaderScripts()); }
    function handleMarginChange() { setMargin(marginsStore.getMargins()); }
    function handleAccountsChange() {
      setAccountSelected(userStore.userStore.accounts.find(acc => acc.id === userStore.userStore.accountId)?.name || 'Select Account');
    }
    function handleAllowAccountLogoutChange() { setAllowAccountLogout(userStore.userStore.allowAccountLogout); }
    function handleAccountLogoutTimeChange() { setAccountLogoutTime(userStore.userStore.accountLogoutTime); }

    const unsubscribeUser = eventBus.on(EVENT_TYPES.USER_UPDATE, handleUserChange);
    const unsubscribeAccounts = eventBus.on(EVENT_TYPES.USER_ACCOUNTS_UPDATE, handleAccountsChange);
    const unsubscribeAccountId = eventBus.on(EVENT_TYPES.USER_ACCOUNT_ID_UPDATE, handleAccountsChange);
    const unsubscribeHeaderScripts = eventBus.on(EVENT_TYPES.HEADER_SCRIPTS_UPDATE, handleHeaderScriptsChange);
    const unsubscribeMargin = eventBus.on(EVENT_TYPES.MARGINS_UPDATE, handleMarginChange);
    const unsubscribeAllowAccountLogout = eventBus.on(EVENT_TYPES.ALLOW_ACCOUNT_LOGOUT_UPDATE, handleAllowAccountLogoutChange);
    const unsubscribeAccountLogoutTime = eventBus.on(EVENT_TYPES.USER_UPDATE, handleAccountLogoutTimeChange);
    setUser(userStore.userStore.user);
    setHeaderScripts(headerScriptsStore.getHeaderScripts());
    setMargin(marginsStore.getMargins());
    handleAccountsChange();
    handleAllowAccountLogoutChange();
    handleAccountLogoutTimeChange();
    return () => {
      if (typeof unsubscribeUser === 'function') unsubscribeUser();
      if (typeof unsubscribeAccounts === 'function') unsubscribeAccounts();
      if (typeof unsubscribeAccountId === 'function') unsubscribeAccountId();
      if (typeof unsubscribeHeaderScripts === 'function') unsubscribeHeaderScripts();
      if (typeof unsubscribeMargin === 'function') unsubscribeMargin();
      if (typeof unsubscribeAllowAccountLogout === 'function') unsubscribeAllowAccountLogout();
      if (typeof unsubscribeAccountLogoutTime === 'function') unsubscribeAccountLogoutTime();
    };
  }, []);
  const isSignedIn = user && user?.userId;

  const handleMenuClick = async ({ key }) => {
    switch (key) {
      case 'logoutAccount':
        try {
          await logoutAccount();
        } catch (error) {
          showErrorToast("Could not logout account");
        }
        break;
      case 'logout':
        // Handle sign out
        console.log('Sign Out clicked');
        break;
      default:
        console.log('Click not handled: ' + key);
    }
  };

  const menu = isSignedIn && (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="welcome" disabled  style={{ cursor: 'default', fontWeight: 'bold', color: '#555', background: '#f6f6f6' }}>
        Hi, {user.name || user.userName || 'User'}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      {allowAccountLogout && (
        <>
          <Menu.Item key="logoutAccount" icon={<LogoutOutlined />} danger>
            Logout Account
          </Menu.Item>
          {accountLogoutTime && (
            <Menu.Item key="logoutAccountTime" disabled style={{ fontSize: 12, color: '#888', background: 'inherit', cursor: 'default' }}>
              Valid till: {formatDateTimeDDMMYYHHmm(accountLogoutTime)}
            </Menu.Item>
          )}
        </>
      )}
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Drawer
        title={null}
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={300}
        closeIcon={false}
        className="md:hidden !bg-neutral-800 p-4 text-neutral-200"
        bodyStyle={{ padding: 0 }}>
        <div>
          <div className='flex items-center justify-start gap-2'>
            <div>
              <Avatar
                size={40}
                className='bg-price-green'
                icon={<UserOutlined />}
                src={user?.avatarBlobId ? `https://zyontrader.com/api/img/${user?.avatarBlobId}` : undefined}
                shape="circle"
              />
            </div>
            <div className='text-lg font-bold'>Hi, {user?.name || user?.userName || 'User'}</div>
          </div>
          <div className="font-semibold text-base mt-6"
            onClick={() => {
              setDrawerOpen(false);
              userStore.setShowAccountSelectionPopup(true);
            }}>
            <span className="flex items-center text-green-500">
              <span>{accountSelected}</span>
              <span><svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="ml-1"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </span>
          </div>
          <div className='flex items-center justify-start gap-2 text-base mt-1'>
            <div className="font-medium text-sm">Margin: </div>
            <div className="font-semibold">{formatPrice(margin?.marginAvailable)}</div>
          </div>
          <div className='border-b border-neutral-400 my-2'></div>
          <div>
            <div
              className="pb-2 font-semibold text-base text-red-500 cursor-pointer"
              onClick={() => {
                console.log('Sign Out clicked');
                setDrawerOpen(false);
              }}>
              Sign Out
            </div>
            {allowAccountLogout && (
              <>
                <div
                  className="pb-2 font-semibold text-base text-price-red cursor-pointer"
                  onClick={async () => {
                    try {
                      await logoutAccount();
                      setDrawerOpen(false);
                    } catch (error) {
                      showErrorToast("Could not logout account");
                    }
                  }}>
                  Logout Account
                </div>
                {accountLogoutTime && (
                  <div className="text-xs text-neutral-400 mb-2 ml-1">
                    Valid till: {formatDateTimeDDMMYYHHmm(accountLogoutTime)}
                  </div>
                )}
              </>
            )}

            <div className="py-2 text-base border-t border-neutral-400 text-neutral-300">
              <UserOutlined /> Profile
            </div>
            <div className="py-2 text-base border-t border-neutral-400 text-neutral-300">
              <SettingOutlined /> Settings
            </div>
          </div>
        </div>
      </Drawer>
      <div className="flex items-center justify-between !bg-black/40 px-2 py-0 pt-2 md:py-2 shadow-md shadow-neutral-800 font-family-roboto">
        {/* Left: Logo and account selector */}
        <div className="flex items-center">
          {/* Menu icon for mobile */}
          {isSignedIn && (
            <button
              className="block md:hidden mr-1 p-1 focus:outline-none !text-white cursor-pointer"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="4" width="24" height="2" rx="1" fill="currentColor" />
                <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
                <rect y="18" width="24" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          )}

          <img src={`/logo_icon.svg`} alt="Logo" className="w-12 h-12 md:h-16 md:w-16" />
          <button
            className="hidden md:block items-center text-logo-green font-bold py-1 rounded focus:outline-none"
            onClick={() => userStore.setShowAccountSelectionPopup(true)} >
            <span className="flex items-center text-green-500">
              <span >{accountSelected}</span>
              <span><svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="ml-1"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </span>
          </button>
        </div>
        {/* Center: Market indices scrollable row */}
        <div
          className="header-scripts-container flex flex-1 gap-5 items-center justify-end md:justify-center">
          {headerScripts && headerScripts.map(scriptId => (
            <HeaderScriptComponent key={scriptId} scriptId={scriptId} />
          ))}
        </div>
        {/* Right: Margin info and user widget */}
        <div className="flex items-center gap-0 md:gap-2 text-right">
          {isSignedIn && (
            <div className='hidden md:block'>
              <div className="text-gray-400 text-xs">Margin</div>
              <div className="text-neutral-400 font-semibold text-md">{formatPrice(margin?.marginAvailable)}</div>
            </div>
          )}
          {/* User sign in widget */}
          {isSignedIn ? (
            <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]} className='!hidden mr-4 md:!block'>
              <Avatar
                style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
                icon={<UserOutlined />}
                src={user.avatarBlobId ? `https://zyontrader.com/api/img/${user.avatarBlobId}` : undefined}
                shape="square"
              />
            </Dropdown>
          ) : (
            <Button type="primary" icon={<LoginOutlined />} onClick={() => userStore.setShowUserLogin(true)}>Sign In</Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
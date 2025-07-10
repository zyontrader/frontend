import React, { useEffect, useState, useRef } from "react";
import { Splitter } from "antd";
// eslint-disable-next-line no-unused-vars
import websocketService from '../../api/websocket';
import "antd/dist/reset.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as userStore from "../../store/userStore";
import MainContent from '../MainContent';
import MobileContent from '../MobileContent';
import Sidebar from '../Sidebar';
import { sync } from '../../api/apis';
import PopupComponent from '../Popups/PopupComponent';
import eventBus, { EVENT_TYPES } from "../../utils/eventBus";
import FloatingBottomLeftPanel from '../Common/FloatingBottomLeftPanel';
import { getSidebarLeftVisible, setIsMobile } from "../../store/uiStore";
import OrderStatusListWidget from '../Orders/OrderStatusListWidget';
import Header from './../Header/Header';


function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobileState] = React.useState(
    () => window.innerWidth < breakpoint
  );
  setIsMobile(window.innerWidth < breakpoint);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < breakpoint;
      setIsMobileState(mobile);
      setIsMobile(mobile);
    };
    window.addEventListener("resize", handleResize);
    // Set initial state
    setIsMobile(window.innerWidth < breakpoint);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

function TraderContent() {
  const [loading, setLoading] = useState(true);
  const [accountId, setAccountId] = useState(userStore.userStore.accountId);
  const selectedAccountIdRef = useRef(accountId);
  const [activeTab, setActiveTab] = useState("Positions");
  const [sidebarVisible, setSidebarVisible] = useState(getSidebarLeftVisible());
  const isMobile = useIsMobile();

  // On mount, check for accountId in URL and set it if present
  useEffect(() => {
    const url = new URL(window.location.href);
    const urlAccountId = url.searchParams.get("accountId");
    if (urlAccountId && urlAccountId !== userStore.userStore.accountId) {
      userStore.setAccountId(urlAccountId);
      setAccountId(urlAccountId);
    }
  }, []);

  // On mount, check for accountId in URL and set it if present
  useEffect(() => {}, [isMobile]);

  useEffect(() => {
    function handleAccountIdChange(newId) {
      setAccountId(userStore.userStore.accountId);
    }

    const unsubscribeUserAccountId = eventBus.on(
      EVENT_TYPES.USER_ACCOUNT_ID_UPDATE,
      handleAccountIdChange
    );
    setAccountId(userStore.userStore.accountId);
    return () => {
      if (typeof unsubscribeUserAccountId === "function")
        unsubscribeUserAccountId();
    };
  }, []);

  // When accountId changes, update the URL
  useEffect(() => {
    if (accountId) {
      const url = new URL(window.location.href);
      url.searchParams.set("accountId", accountId);
      window.history.replaceState({}, "", url);
    }
  }, [accountId]);

  useEffect(() => {
    if (
      accountId !== selectedAccountIdRef.current ||
      selectedAccountIdRef.current == null
    ) {
      selectedAccountIdRef.current = accountId;
      setLoading(true);
      sync()
        .catch((err) => {
          console.error("Failed to sync:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [accountId]);

  // Handle iframe message for login success
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === "login_success") {
        sync().catch((err) => {
          console.error("Failed to sync after login:", err);
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      sync().catch((err) => {
        console.error("Periodic sync failed:", err);
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => setSidebarVisible(getSidebarLeftVisible());
    const unsub = eventBus.on(EVENT_TYPES.UI_UPDATE, handler);
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  useEffect(() => {
    // Reset view on account change
    const unsubAccount = eventBus.on(EVENT_TYPES.USER_ACCOUNT_ID_UPDATE, () => {
      setActiveTab("Positions");
      // Add any other resets here (e.g., close popups, reset local state)
    });
    return () => {
      if (typeof unsubAccount === "function") unsubAccount();
    };
  }, []);

  return (
    <div className="flex flex-col h-dvh bg-[#222] relative">
      <Header />
      <div className="flex flex-1 flex-col overflow-y-auto">
        {isMobile ? (
          <MobileContent activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <>
            <Splitter className="flex flex-1 overflow-y-auto">
              <Splitter.Panel
                min={sidebarVisible ? 400 : 0}
                max={sidebarVisible ? 500 : 0}
                defaultSize={sidebarVisible ? 450 : 0}
                size={sidebarVisible ? undefined : 0}
                collapsible={false}
                resizable={sidebarVisible}
                disabled={!sidebarVisible}
              >
                <Sidebar activeTab={activeTab} />
              </Splitter.Panel>
              <Splitter.Panel className="flex flex-col ">
                <MainContent
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </Splitter.Panel>
            </Splitter>
            <FloatingBottomLeftPanel header="Quick Actions">
              <div>
                <p className="text-neutral-200">
                  This is your expandable panel content!
                </p>
                {/* Add any content here */}
              </div>
            </FloatingBottomLeftPanel>
          </>
        )}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 50,
          minWidth: 320,
          maxWidth: 400,
        }}
      >
        <OrderStatusListWidget />
      </div>
      <PopupComponent loading={loading} />
    </div>
  );
}

function Trader() {
  return (
    <>
      <TraderContent />
      <ToastContainer
        icon
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
    </>
  );
}

export default Trader;

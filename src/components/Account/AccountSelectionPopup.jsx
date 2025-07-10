import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import * as userStore from "../../store/userStore";
import eventBus, { EVENT_TYPES } from "../../utils/eventBus";


const AccountSelectionPopup = ({ isOpen }) => {
  const [accounts, setAccounts] = useState(userStore.userStore.accounts || []);
  const [selectedAccountId, setSelectedAccountId] = useState(
    userStore.userStore.accountId
  );

  useEffect(() => {
    function handleAccountsChange() {
      setAccounts(userStore.userStore.accounts || []);
    }
    const unsubscribeAccounts = eventBus.on(
      EVENT_TYPES.USER_ACCOUNTS_UPDATE,
      handleAccountsChange
    );
    return () => {
      if (typeof unsubscribeAccounts === "function") unsubscribeAccounts();
    };
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    userStore.setShowAccountSelectionPopup(false);
    userStore.setShowAccountSelection(false);
  };

  const handleSelect = (acc) => {
    userStore.setAccountId(acc.id);
    setSelectedAccountId(acc.id);
    handleClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      mask={true}
      closable={false}
      maskClosable={true}
      width={500}
      classNames={{
        body: "p-0 bg-neutral-800 border-neutral-700 border border-solid rounded-md",
      }}
      styles={{ content: { padding: 0 }, mask: { backgroundColor: "#FFF2" } }}
    >
      <div className="p-3  font-family-roboto">
        <div className="flex items-center justify-between mb-2">
          <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-900/50 active:bg-neutral-600 text-green-500 font-bold rounded-md px-5 py-2 cursor-pointer select-none"
            style={{ boxShadow: "none", border: "none" }}
            onClick={() => {
              userStore.setShowAddAccountPopup(true);
              handleClose();
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                userStore.setShowAddAccountPopup(true);
                handleClose();
              }
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Account
          </div>
          <button
            onClick={handleClose}
            className="!text-gray-300 !text-lg font-medium cursor-pointer hover:!text-white"
          >
            <span className="ml-1">&#10005;</span>
          </button>
        </div>
        <hr className="border-neutral-500" />
        <div className="max-h-80 overflow-y-auto">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className={`px-2 py-2 mr-2 text-base cursor-pointer text-zyon-blue border-b border-gray-300 last:border-none ${
                acc.id === selectedAccountId ? "!font-bold !bg-blue-900/40" : ""
              }`}
              onClick={() => handleSelect(acc)}
            >
              <div className="flex items-center gap-2">
                <span className="text-blue-500">{acc.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AccountSelectionPopup;

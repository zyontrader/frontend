import React, { useState } from 'react';
import { addAccount } from '../../api/apis';
import * as userStore from '../../store/userStore';

const AddAccountPopup = ({ isOpen, closeable }) => {
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    userStore.setShowAddAccountPopup(false);
    userStore.setShowAccountAddition(false);
  };

  const handleAdd = async () => {
    setError('');
    if (!accountName.trim()) {
      setError('Please Enter an Account Name');
      return;
    }
    setLoading(true);
    try {
      await addAccount(accountName);
      setLoading(false);
      handleClose();
    } catch (e) {
      setError(e.message || 'Unknown Error! Failed to add account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 font-family-roboto">
      <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-600 relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 rounded-t-xl bg-brighter-green min-w-[500px]">
          <span className="text-base font-bold text-neutral-800">Add a Trading Account</span>
          {closeable && (
            <button onClick={handleClose} className="text-neutral-800 font-bold text-lg font-medium hover:text-white"><span className="ml-1">&#10005;</span></button>
          )}
        </div>
        {/* Content */}
        <div className="flex flex-col items-center py-8 px-6">
          {error && (
            <div className="max-w-[300px] mb-4 text-price-red text-center rounded-sm border border-price-red px-4 py-2 text-base">{error}</div>
          )}
          <div className='flex flex-col items-start'>
            <label className="text-sm font-semibold text-neutral-400 mb-2" htmlFor="accountName">Account Name</label>
            <input
              id="accountName"
              type="text"
              className="w-72 p-1 rounded-md border border-neutral-400 bg-neutral-800 text-base text-neutral-300 focus:outline-none focus:ring-1 focus:ring-price-green mb-6 transition-all"
              value={accountName}
              onChange={e => {
                setAccountName(e.target.value);
                if (error && e.target.value.trim()) setError('');
              }}
              autoFocus
              disabled={loading}
            />
          </div>
          <button
            className="py-1 px-6 rounded-md border border-brighter-green text-brighter-green font-bold text-base bg-price-green/20 hover:bg-price-green/40 active:bg-price-green/70 flex items-center justify-center min-w-[140px]"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? <span className="loader mr-2"></span> : null}
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAccountPopup; 
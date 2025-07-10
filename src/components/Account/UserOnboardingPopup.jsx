import React from 'react';


const UserOnboardingPopup = ({ isOpen }) => {
  if (!isOpen) return null;

  const handleComplete = () => {
    window.open('https://zyontrader.com', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-500/40 font-family-roboto">
      <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-600 relative w-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 rounded-t-xl bg-brighter-green">
          <span className="text-base font-bold text-neutral-800">Complete Account Setup</span>
        </div>
        {/* Content */}
        <div className="flex flex-col items-center py-8 px-6">
          <div className="mb-6 text-neutral-300 text-center text-base">
            Your account is created. You need to enter some additional details to continue.
          </div>
          <button
            className="py-2 px-8 rounded-md border border-brighter-green text-brighter-green font-bold text-base bg-price-green/20 hover:bg-price-green/40 active:bg-price-green/70"
            onClick={handleComplete}
          >
            Complete Onboarding
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserOnboardingPopup; 
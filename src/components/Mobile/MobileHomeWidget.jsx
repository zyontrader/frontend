import React, { useState } from 'react';
import PositionsWidget from '../Positions/PositionsWidget';
import OrdersTabsWidget from '../Orders/OrdersTabsWidget';
import WatchlistsWidget from '../Watchlists/WatchlistsWidget';

const MobileHomeWidget = () => {
  const [activeTab, setActiveTab] = useState('Positions');
  const tabs = ['Watchlists', 'Positions', 'Orders'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Watchlists':
        return <WatchlistsWidget />;
      case 'Positions':
        return <PositionsWidget />;
      case 'Orders':
        return <OrdersTabsWidget />;
      default:
        return <div className="text-gray-400 text-center py-20 text-xl">Content not available</div>;
    }
  };

  return (
    <div className="bg-dark-bg rounded-lg flex flex-col flex-1 overflow-y-auto">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-dark-bg-2 mb-1 pt-1">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`pb-2 px-2 text-base font-medium cursor-pointer ${activeTab === tab ? 'border-b-2 border-blue-500 !text-blue-400' : '!text-gray-400'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto flex flex-col'>
        {renderContent()}
      </div>
    </div>
  );
};

export default MobileHomeWidget; 
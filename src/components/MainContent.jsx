import React, { useRef } from 'react';
import PositionsWidget from './Positions/PositionsWidget';
import OrdersTabsWidget from './Orders/OrdersTabsWidget';
import OptionsWidget from './OptionChain/OptionsWidget';
import MarketAnalyticsWidget from './Analysis/MarketAnalyticsWidget';
import { ReloadOutlined } from '@ant-design/icons';
import BasketsComponent from './Baskets/BasketsComponent';
import { setStrategyTabActive } from '../store/uiStore';
const tabs = ['Positions', 'Orders', 'Markets', 'Basket', 'Options'];

const MainContent = ({ activeTab, setActiveTab }) => {
  const marketRef = useRef();

  const handleRefresh = () => {
    if (activeTab === 'Markets' && marketRef.current) {
      marketRef.current.refresh();
    }
    // Add similar logic for other tabs if needed
  };

  return (
    <div className="bg-dark-bg rounded-lg p-3 mt-3 flex flex-col flex-1 overflow-y-auto">
      {/* Tabs + Refresh */}
      <div className="flex items-center gap-6 border-b border-dark-bg-2 mb-1">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`pb-2 px-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}`}
            onClick={() => {
              setStrategyTabActive(false);
              setActiveTab(tab);
            }}
          >
            {tab}
          </button>
        ))}
        {activeTab === 'Markets' && (
          <button
            onClick={handleRefresh}
            type="primary"
            className="w-8 h-8 flex items-center justify-center rounded bg-button-blue active:bg-blue-300 text-white shadow ml-auto mt-[-15px]">
            <ReloadOutlined style={{ fontSize: 22, fontWeight: 700 }} />
          </button>
        )}
      </div>
      <div className='flex-1 overflow-y-auto flex flex-col'>
        {/* Content */}
        {activeTab === 'Positions' && (
          <PositionsWidget />
        )}
        {activeTab === 'Orders' && (
          <OrdersTabsWidget />
        )}
        {activeTab === 'Markets' && (
          <MarketAnalyticsWidget ref={marketRef} />
        )}
        {activeTab === 'Options' && (
          <OptionsWidget />
        )}
        {activeTab === 'Basket' && (
          <BasketsComponent />
        )}
        {/* Other tabs can have placeholder content */}
        {['Positions', 'Orders', 'Markets', 'Options', 'Basket'].indexOf(activeTab) === -1 && (
          <div className="text-gray-400 text-center py-20 text-xl">{activeTab} content coming soon...</div>
        )}
      </div>
    </div>
  );
};

export default MainContent; 
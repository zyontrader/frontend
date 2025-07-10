import React, { useState, useEffect } from 'react';
import OptionChainAnalysisWidget from './OptionChainAnalysisWidget';
import OptionChainDisplayWidget from './OptionChainDisplayWidget';
import OptionStrategyBuilderWidget from '../StrategyBuilder/OptionStrategyBuilderWidget';
import { setStrategyTabActive } from '../../store/uiStore';

const tabDefs = [
  { key: 'chain', label: 'Option Chain' },
  { key: 'analysis', label: 'Option Analysis' },
  { key: 'strategy', label: 'Strategy Builder' },
];

const OptionsWidget = () => {
  const [activeTab, setActiveTab] = useState('analysis');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  useEffect(() => {
    setStrategyTabActive(activeTab === 'strategy');
  }, [activeTab]);

  return (
    <div className="w-full font-family-roboto overflow-y-auto flex-1 flex flex-col">
      {/* Custom Tab Bar */}
      <div className="flex border-b border-neutral-700 mb-2">
        {tabDefs.map(tab => (
          <button
            key={tab.key}
            className={`flex-1 text-center py-2 text-base font-medium transition-colors duration-150 cursor-pointer ${activeTab === tab.key ? '!text-blue-400 border-b-2 !border-blue-400' : '!text-neutral-400'}`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className='flex !overflow-y-auto flex-1 '>
        {activeTab === 'chain' && (
          <OptionChainDisplayWidget />
        )}
        {activeTab === 'analysis' && (
          <OptionChainAnalysisWidget />
        )}
        {activeTab === 'strategy' && (
          <OptionStrategyBuilderWidget />
        )}
      </div>
    </div>
  );
};

OptionsWidget.displayName = 'OptionsWidget';

export default OptionsWidget;
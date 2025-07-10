import React, { useState, useEffect } from 'react';
import { getFloatingPanelVisible, getStrategyTabActive } from '../../store/uiStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';
import PositionsWidget from '../Positions/PositionsWidget';

const FloatingBottomLeftPanel = ({
  header = 'Actions'
}) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(getFloatingPanelVisible());
  const [isStrategyBuilder, setIsStrategyBuilder] = useState(getStrategyTabActive());

  useEffect(() => {
    const handler = () => {
      setVisible(getFloatingPanelVisible());
      setIsStrategyBuilder(getStrategyTabActive());
    };
    const unsub = eventBus.on(EVENT_TYPES.UI_UPDATE, handler);
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`${expanded ? 'h-[50vh]' : 'h-6'} w-96 fixed left-0 bottom-0 z-50 bg-neutral-900 border border-neutral-700 rounded-tr-xl shadow-lg transition-all duration-200 overflow-hidden flex flex-col`}
    >
      <div
        className="h-6 flex items-center text-sm justify-between cursor-pointer px-4 py-1 bg-green-500 text-neutral-800 font-semibold select-none rounded-tr"
        onClick={() => setExpanded(e => !e)}
      >
        <span>{isStrategyBuilder ? 'Positions' : header}</span>
        <span className="ml-2 text-xs">{expanded ? '▼' : '▲'}</span>
      </div>
      <div className={`overflow-y-auto opacity-100 ${expanded ? 'flex-1 h-auto' : 'h-0'}`}>
        {isStrategyBuilder && <PositionsWidget />}
      </div>
    </div>
  );
};

export default FloatingBottomLeftPanel; 
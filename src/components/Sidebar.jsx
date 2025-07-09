import React, { useState, useEffect } from 'react';
import WatchlistsWidget from './Watchlists/WatchlistsWidget';
import PositionsWidget from './Positions/PositionsWidget';
import { getSidebarLeftVisible } from '../store/uiStore';
import eventBus, { EVENT_TYPES } from '../utils/eventBus';

const Sidebar = ({ activeTab }) => {
  const [visible, setVisible] = useState(getSidebarLeftVisible());

  useEffect(() => {
    const handler = () => setVisible(getSidebarLeftVisible());
    const unsub = eventBus.on(EVENT_TYPES.UI_UPDATE, handler);
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  if (!visible) return null;

  return (
    <div className="flex flex-col h-full p-2 font-family-roboto">
      {(activeTab === 'Markets' || activeTab === 'Options' || activeTab === 'Basket') ? <PositionsWidget /> : <WatchlistsWidget />}
    </div>
  );
};

export default Sidebar; 
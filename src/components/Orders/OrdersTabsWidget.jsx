import React, { useState, useEffect, useMemo } from 'react';
import OrdersListWidget from './OrdersListWidget';
import * as ordersStore from '../../store/ordersStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';

const tabDefs = [
  {
    key: 'pending',
    label: 'Pending',
    statuses: ['PENDING'],
  },
  {
    key: 'completed',
    label: 'Completed',
    statuses: ['COMPLETE', 'COMPLETED', 'CANCELLED', 'REJECTED'],
  },
];

const OrdersTabsWidget = () => {
  const [orders, setOrders] = useState(() => ordersStore.getOrders());
  const [activeTab, setActiveTab] = useState('completed');

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENT_TYPES.ORDER_UPDATE, () => {
      setOrders(ordersStore.getOrders() || []);
    });
    setOrders(ordersStore.getOrders());
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const counts = useMemo(() => {
    return tabDefs.reduce((acc, tab) => {
      const statusSet = new Set(tab.statuses.map(s => s.toUpperCase()));
      acc[tab.key] = orders.filter(order => statusSet.has(order.status.toUpperCase())).length;
      return acc;
    }, {});
  }, [orders]);

  const activeTabDef = tabDefs.find(tab => tab.key === activeTab);

  return (
    <div className="w-full font-family-roboto">
      {/* Tabs */}
      <div className="flex border-b border-neutral-700 mb-2">
        {tabDefs.map(tab => (
          <button
            key={tab.key}
            className={`flex-1 text-center py-2 text-sm md:text-base font-medium transition-colors duration-150 cursor-pointer ${activeTab === tab.key ? '!text-blue-400 border-b-2 border-blue-400' : '!text-neutral-400'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} <span className="text-sm md:text-base">({counts[tab.key]})</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div>
        <OrdersListWidget key={activeTab} statuses={activeTabDef.statuses} />
      </div>
    </div>
  );
};

export default OrdersTabsWidget; 
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import * as ordersStore from '../../store/ordersStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';
import { isNil } from '../../utils/utils';

/**
 * Displays the status of a list of orders being placed.
 * Shows order type, script id, quantity, and a loading spinner while pending.
 * Updates with the latest order status from ordersStore.
 */
const OrderStatusListWidget = () => {
  const [liveOrders, setLiveOrders] = useState(() => ordersStore.getOrders() || []);

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENT_TYPES.LIVE_ORDER_UPDATE, () => {
      setLiveOrders(ordersStore.getLiveOrders() || []);
    });
    setLiveOrders(ordersStore.getLiveOrders() || []);
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  if (!liveOrders || liveOrders.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 bg-dark-bg-2 rounded-lg p-1 mt-3 w-[400px] relative">
      <div className="flex justify-end">
        <button
          className="top-2 right-2 text-neutral-200 hover:text-white text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Close"
          onClick={() => ordersStore.setLiveOrders([])}
        >
          &times;
        </button>
      </div>
      {liveOrders.map((order, idx) => {
        return (
          <div key={order.scriptId + order.orderType + order.orderQuantity + idx} className="flex flex-1 items-center gap-4 p-2 rounded bg-dark-bg">
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold mr-2
                ${order.orderType === 'BUY' ? 'bg-blue-600' : 'bg-red-600'}
                text-white`}
              style={{ minWidth: 24 }}
            >
              {order.orderType === 'BUY' ? 'B' : 'S'}
            </span>
            <span className="text-sm text-neutral-200 font-semibold flex-1">{order.scriptId}</span>
            <span className="text-sm text-neutral-200 w-[50px] text-right"> X {order.orderQuantity}</span>
            {isNil(order.success) ? (
              <Spin size="small" className="ml-2" />
            ) : (
              <span className="ml-2 text-xs font-semibold">
                {order.success ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#22c55e" />
                    <path d="M7 13.5L11 17L17 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#ef4444" />
                    <path d="M7 7L17 17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M17 7L7 17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                )}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusListWidget; 
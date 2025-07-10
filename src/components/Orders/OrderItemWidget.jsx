import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { formatTime, formatPrice } from '../../utils/formatter';
import { Button } from 'antd';
import { reverseOrder, repeatOrder } from '../../utils/order_utils';
import { cancelOrders } from '../../api/apis';
import * as scriptsStore from '../../store/scriptsStore';
import * as editOrderStore from '../../store/editOrderStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';

const statusColor = {
  COMPLETE: 'text-green-500',
  CANCELLED: 'text-neutral-500',
  REJECTED: 'text-red-500',
  PENDING: 'text-yellow-400',
};

const CustomReloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F66">
    <path d="M320-280 80-520l240-240 57 56-184 184 184 184-57 56Zm480 80v-160q0-50-35-85t-85-35H433l144 144-57 56-240-240 240-240 57 56-144 144h247q83 0 141.5 58.5T880-360v160h-80Z" />
  </svg>
);

const CustomRedoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#69F">
    <path d="m640-280-57-56 184-184-184-184 57-56 240 240-240 240ZM80-200v-160q0-83 58.5-141.5T280-560h247L383-704l57-56 240 240-240 240-57-56 144-144H280q-50 0-85 35t-35 85v160H80Z" />
  </svg>
);

// Custom Delete Icon (thicker, scalable, uses currentColor)
const CustomDeleteIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width="32"
    height="32"
  >
    <rect x="5" y="5" width="14" height="14" rx="2.5" />
    <line x1="9" y1="9" x2="15" y2="15" />
    <line x1="15" y1="9" x2="9" y2="15" />
  </svg>
);

const OrderItemWidget = ({ order, isLast }) => {
  const [script, setScript] = React.useState(() => scriptsStore.getScript(order.scriptId));

  React.useEffect(() => {
    const unsubscribe = eventBus.on(EVENT_TYPES.SCRIPT_UPDATE, order.scriptId, () => {
      setScript(scriptsStore.getScript(order.scriptId));
    });
    setScript(scriptsStore.getScript(order.scriptId));
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [order.scriptId]);

  const orderTypeColor = order.orderType === 'BUY' ? 'text-blue-500' : 'text-red-500';
  const status = order.status.toUpperCase();
  const statusClass = statusColor[status] || 'text-gray-400';

  const handleOrderClick = (e) => {
    // Only allow for pending orders
    if (status !== 'PENDING') return;
    // Prevent click if the target is a button or inside a button (e.g., delete/cancel)
    if (
      e.target.closest('button') ||
      e.target.closest('[role="button"]') ||
      e.target.closest('.order-item-action')
    ) {
      return;
    }
    editOrderStore.setEditOrder(JSON.parse(JSON.stringify(order)));
  };

  return (
    <div
      className={`flex justify-between items-center py-2 ${!isLast ? 'border-b border-neutral-600' : ''}`}
      onClick={handleOrderClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Left side */}
      <div className="flex-1 gap-3">
        <div className="flex items-center gap-4">
          <span className={`text-xs ${orderTypeColor}`}>{order.orderType}</span>
          <span className="text-xs text-neutral-400">{order.filledQuantity} / {order.orderQuantity}</span>
        </div>
        <div className="text-neutral-400 mt-1">{order.scriptId}</div>
        <div className="flex items-center mt-2 gap-2">
          <span className="text-neutral-500 text-xs">{script?.exchange || ''}</span>
          <span className="text-neutral-500 text-xs flex items-center gap-1"><ClockCircleOutlined /> {formatTime(order.lastUpdateTimeMs)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mr-5">
        {status === 'COMPLETE' ? (
          <>
            <Button
              type="text"
              icon={<CustomReloadIcon />}
              color="primary"
              onClick={() => reverseOrder(order)}
            />
            <Button
              type="text"
              icon={<CustomRedoIcon />}
              color="danger"
              onClick={() => repeatOrder(order)}
            />
          </>
        ) : null}

      </div>
      {/* Right side */}
      <div className="flex flex-col items-end ml-3">
        <div className={`text-xs ${statusClass}`}>{status}</div>
        <div className="text-neutral-400 text-base mt-2 ">{order.price ? formatPrice(order.price) : formatPrice(order.limitPrice)}</div>
        <div className="text-neutral-400 text-xxs mt-1">
          {['market', 'limit'].includes(order.kind?.toLowerCase()) ? (
            order.kind?.toUpperCase()
          ) : (['sl', 'slm'].includes(order.kind?.toLowerCase()) && order.triggerPrice) ? (
            <>Trigger: {formatPrice(order.triggerPrice)}</>
          ) : (
            order.kind
          )}
        </div>
      </div>
      {status === 'PENDING' && (
        <div
          className="mt-2 ml-2 text-neutral-400 cursor-pointer order-item-action"
          onClick={e => {
            e.stopPropagation();
            cancelOrders([order]);
          }}
        ><CustomDeleteIcon className="text-neutral-400 text-2xl" /></div>
      )}
    </div>
  );
};

export default OrderItemWidget; 
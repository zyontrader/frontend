import React from 'react';
import OrderItemWidget from './OrderItemWidget';
import * as ordersStore from '../../store/ordersStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';

const OrdersListWidget = ({ statuses }) => {
  const [orders, setOrders] = React.useState(() => ordersStore.getOrders());
  React.useEffect(() => {
    const unsubscribe = eventBus.on(EVENT_TYPES.ORDER_UPDATE, () => {
      setOrders(ordersStore.getOrders() || []);
    });
    setOrders(ordersStore.getOrders());
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);
  const statusSet = new Set(statuses.map(s => s.toUpperCase()));
  const filteredOrders = orders.filter(order => statusSet.has(order.status.toUpperCase()));

  return (
    <div className="flex flex-col font-family-roboto bg-dark-bg-2 rounded-lg p-3 mt-3 flex-1 font-family-roboto">
      {filteredOrders.length === 0 ? (
        <div className="text-center text-lg italic text-neutral-500 py-8">No Orders Found</div>
      ) : (
        filteredOrders.map((order, idx) => (
          <OrderItemWidget
            key={order.orderId}
            order={order}
            isLast={idx === filteredOrders.length - 1}
          />
        ))
      )}
    </div>
  );
};

export default OrdersListWidget; 
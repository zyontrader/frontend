import React, { useState, useEffect } from 'react';
import * as editOrderStore from '../../store/editOrderStore';
import OrderFormWidget from './OrderFormWidget';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';

const OrderPopup = () => {
  const [editOrder, setEditOrder] = useState(() => editOrderStore.getEditOrder());

  useEffect(() => {
    const unsubscribeEditOrder = eventBus.on(EVENT_TYPES.EDIT_ORDER_UPDATE, () => {
      setEditOrder(editOrderStore.getEditOrder());
    });
    
    return () => {
      if (typeof unsubscribeEditOrder === 'function') unsubscribeEditOrder();
    };
  }, []);

  if (!editOrder) return null;

  const handleCancel = () => {
    editOrderStore.setEditOrder(null);
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return editOrder && (
    <div className="fixed inset-0 z-40 flex items-end justify-center p-6" onClick={handleBackdropClick}>
      <div className="w-[50%]">
        <OrderFormWidget 
          onCancel={handleCancel}
          onSuccess={() => editOrderStore.setEditOrder(null)}
        />
      </div>
    </div>
  );
};

export default OrderPopup; 
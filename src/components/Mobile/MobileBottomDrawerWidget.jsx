import React, { useState, useEffect, useCallback } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';
import { getEditOrder, clear as clearEditOrder, setEditOrder as setEditOrderStore } from '../../store/editOrderStore';
import { getSelectedScriptId, getPosition, clear as clearMobileData } from '../../store/mobileDataStore';
import { createEditOrder } from '../../utils/utils';
import OrderFormWidget from '../Orders/OrderFormWidget';
import QuoteSummaryWidget from '../Common/QuoteSummaryWidget';

const MobileBottomDrawerWidget = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [drawerTitle, setDrawerTitle] = useState('Details');
  const [editOrder, setEditOrder] = useState(null);
  const [selectedScriptId, setSelectedScriptId] = useState(null);
  const [position, setPosition] = useState(null);

  // Listen to store updates
  useEffect(() => {
    // Edit order listener
    const editOrderUnsubscribe = eventBus.on(EVENT_TYPES.EDIT_ORDER_UPDATE, () => {
      setEditOrder(getEditOrder());
    });

    // Mobile data listeners
    const mobileDataUnsubscribe = eventBus.on(EVENT_TYPES.MOBILE_DATA_UPDATE, (field) => {
      setSelectedScriptId(getSelectedScriptId());
      setPosition(getPosition());
    });

    // Cleanup listeners on unmount
    return () => {
      editOrderUnsubscribe();
      mobileDataUnsubscribe();
    };
  }, []);
  
  const handleCloseDrawer = useCallback(() => {
    setShowDrawer(false);
    // Clear both stores when drawer is hidden
    clearMobileData();
    clearEditOrder();
  }, []);

  // Button click handlers
  const handleBuy = useCallback(() => {
    setEditOrderStore(createEditOrder(selectedScriptId, 'BUY', 'OPEN', 0));
  }, [selectedScriptId]);

  const handleSell = useCallback(() => {
    setEditOrderStore(createEditOrder(selectedScriptId, 'SELL', 'OPEN', 0));
  }, [selectedScriptId]);

  const handleAdd = useCallback(() => {
    const absQuantity = Math.abs(position.netQuantity);
    const orderType = position.netQuantity < 0 ? 'SELL' : 'BUY';
    const editOrder = createEditOrder(position.scriptId, orderType, 'OPEN', absQuantity);
    setEditOrderStore(editOrder);
  }, [position]);

  const handleExit = useCallback(() => {
    const absQuantity = Math.abs(position.netQuantity);
    const orderType = position.netQuantity >= 0 ? 'SELL' : 'BUY';
    const editOrder = createEditOrder(position.scriptId, orderType, 'CLOSE', absQuantity);
    setEditOrderStore(editOrder);
  }, [position]);

  // Handle edit order display
  useEffect(() => {
    if (editOrder) {
      setShowDrawer(true);
      setDrawerTitle('Edit Order');
      setDrawerContent(
        <OrderFormWidget
          onCancel={() => handleCloseDrawer()}
          onSuccess={() => handleCloseDrawer()}
          isMobile={true}
        />
      );
    } else if (position && position.scriptId) {
      setShowDrawer(true);
      setDrawerTitle(position.scriptId);
      setDrawerContent(
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center gap-3 justify-center">
            <button
              className="p-2 rounded shadow font-semibold p-3 bg-blue-500 text-white min-w-[30%]"
              onClick={handleAdd}
            >
              ADD
            </button>
            <button
              className="p-2 rounded shadow font-semibold p-3 bg-red-600 text-white min-w-[30%]"
              onClick={handleExit}
            >
              EXIT
            </button>
          </div>
          <QuoteSummaryWidget scriptId={position?.scriptId} />
        </div>
      );
    } else if (selectedScriptId) {
      setShowDrawer(true);
      setDrawerTitle(selectedScriptId);
      setDrawerContent(
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center gap-3 justify-center">
            <button
              className="p-2 rounded shadow font-semibold p-3 bg-blue-500 text-white min-w-[30%]"
              onClick={handleBuy}
            >
              BUY
            </button>
            <button
              className="p-2 rounded shadow font-semibold p-3 bg-red-600 text-white min-w-[30%]"
              onClick={handleSell}
            >
              SELL
            </button>
          </div>
          <QuoteSummaryWidget scriptId={selectedScriptId} />
        </div>
      );
    } else {
      setShowDrawer(false);
    }
  }, [editOrder, selectedScriptId, position, handleAdd, handleExit, handleBuy, handleSell, handleCloseDrawer]);

  return (
    <>
      {/* Bottom Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-dark-bg-2 border-t border-neutral-700 transform transition-transform duration-300 ease-in-out z-50 ${showDrawer ? 'translate-y-0' : 'translate-y-full'
          }`}
        style={{ maxHeight: '70vh' }}
      >
        {/* Drawer Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-neutral-600 rounded-full"></div>
        </div>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-2 border-b border-neutral-700">
          <h3 className="font-semibold text-neutral-200">{drawerTitle}</h3>
          <button
            onClick={handleCloseDrawer}
            className="p-2 rounded-full hover:bg-neutral-700 transition-colors"
          >
            <CloseOutlined style={{ fontSize: 18, color: '#9ca3af' }} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto">
          {drawerContent || (
            <div className="text-center text-neutral-400 py-8">
              <p>No content available</p>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {showDrawer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleCloseDrawer}
        />
      )}
    </>
  );
};

export default MobileBottomDrawerWidget; 
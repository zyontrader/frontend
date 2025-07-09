import React, { useState, useEffect } from 'react';
import { formatPrice } from '../../utils/formatter';
import { Switch, Spin } from 'antd';
import { submitOrders } from '../../api/apis';
import * as editOrderStore from '../../store/editOrderStore';
import * as quotesStore from '../../store/quotesStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';

const OrderFormWidget = ({ onCancel, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [editOrder, setEditOrder] = useState(() => editOrderStore.getEditOrder());
  const [quote, setQuote] = useState(() => {
    const eo = editOrderStore.getEditOrder();
    return eo ? quotesStore.getQuote(eo.scriptId) : undefined;
  });

  useEffect(() => {
    const unsubscribeEditOrder = eventBus.on(EVENT_TYPES.EDIT_ORDER_UPDATE, () => {
      setEditOrder(editOrderStore.getEditOrder());
    });
    setEditOrder(editOrderStore.getEditOrder());
    return () => {
      if (typeof unsubscribeEditOrder === 'function') unsubscribeEditOrder();
    };
  }, []);

  // Listen for quote updates for the current scriptId
  useEffect(() => {
    const scriptId = editOrder && editOrder.scriptId;
    if (!scriptId) return;
    setQuote(quotesStore.getQuote(scriptId));
    const unsubscribeQuote = eventBus.on(
      EVENT_TYPES.QUOTE_UPDATE,
      scriptId,
      () => {
        setQuote(quotesStore.getQuote(scriptId));
      }
    );
    return () => {
      if (typeof unsubscribeQuote === 'function') unsubscribeQuote();
    };
  }, [editOrder]);

  if (!editOrder) {
    return null;
  }

  const { scriptId, orderType, kind = 'MARKET' } = editOrder;
  const currentPrice = quote?.price || 0;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      editOrderStore.setEditOrder(null);
    }
  };

  const handleChipClick = (chipValue) => {
    editOrderStore.setEditOrder({
      ...editOrder,
      orderQuantity: chipValue
    });
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      editOrderStore.setEditOrder({
        ...editOrder,
        orderQuantity: value === '' ? '' : parseInt(value, 10)
      });
    }
  };

  const handleKindChange = (newKind) => {
    const newEditOrder = {
      ...editOrder,
      kind: newKind
    };
    // Set initial prices based on order kind and type
    if (newKind === 'LIMIT') {
      newEditOrder.limitPrice = currentPrice;
      newEditOrder.triggerPrice = 0;
    } else if (newKind === 'SL') {
      if (orderType === 'BUY') {
        newEditOrder.triggerPrice = currentPrice;
        newEditOrder.limitPrice = Math.max(currentPrice + 1, 0);
      } else {
        newEditOrder.triggerPrice = currentPrice;
        newEditOrder.limitPrice = Math.max(currentPrice - 1, 0);
      }
    } else {
      // MARKET
      newEditOrder.limitPrice = 0;
      newEditOrder.triggerPrice = 0;
    }
    editOrderStore.setEditOrder(newEditOrder);
  };

  const handleLimitPriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    editOrderStore.setEditOrder({
      ...editOrder,
      limitPrice: value
    });
  };

  const handleTriggerPriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    editOrderStore.setEditOrder({
      ...editOrder,
      triggerPrice: value
    });
  };

  const handleOrderTypeSwitch = (checked) => {
    const newType = checked ? 'BUY' : 'SELL';
    const newEditOrder = {
      ...editOrder,
      orderType: newType
    };
    // Update prices if order kind is SL
    if (kind === 'SL') {
      if (newType === 'BUY') {
        newEditOrder.triggerPrice = currentPrice;
        newEditOrder.limitPrice = Math.max(currentPrice + 1, 0);
      } else {
        newEditOrder.triggerPrice = currentPrice;
        newEditOrder.limitPrice = Math.max(currentPrice - 1, 0);
      }
    }
    editOrderStore.setEditOrder(newEditOrder);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const order = { ...editOrder };
      const response = await submitOrders([order]);
      // If success, close popup
      const opStatus = response?.orderStatus?.[0]?.operationStatus;
      if (opStatus?.success) {
        if (onSuccess) {
          onSuccess(response);
        } else {
          editOrderStore.setEditOrder(null);
        }
      }
      // Toast is shown by default handler
    } catch (e) {
      // Error toast is shown by default handler
    } finally {
      setSubmitting(false);
    }
  };

  const { price, change, changePct } = quote || {};

  return (
    <div className={`font-family-roboto bg-neutral-800 overflow-hidden md:border border-neutral-700 md:rounded-t-xl md:shadow-2xl`}>
      {/* Header: Script Info + Buy/Sell Switch */}
      <div className={`flex items-center justify-between mb-4 py-2 px-3 ${orderType === 'BUY' ? 'bg-order-header-blue' : 'bg-order-header-red'}`}>
        <div className="flex-1">
          <div className="text-base font-bold text-white mb-1">{scriptId}</div>
          <div className="flex items-center gap-4">
            <div className={`text-base text-white`}>{formatPrice(price)}</div>
            <div className={`text-sm text-white`}>
              {change >= 0 ? '+' : ''}{formatPrice(change)} ({changePct >= 0 ? '+' : ''}{formatPrice(changePct)}%)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={orderType === 'BUY'}
            checkedChildren={<span className="font-semibold text-sm text-neutral-100 font-family-roboto">BUY</span>}
            unCheckedChildren={<span className="font-semibold text-sm text-neutral-100 font-family-roboto">SELL</span>}
            onChange={handleOrderTypeSwitch}
            style={{ backgroundColor: orderType === 'BUY' ? '#06f' : '#d22', width: 80 }}
          />
        </div>
      </div>

      <div className="flex flex-col px-3">
        {/* Middle: Quantity + Chips */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-neutral-400 text-sm w-16">Quantity:</span>
          <input
            type="number"
            className={`w-28 px-2 py-1 rounded border border-neutral-600 bg-neutral-800 text-white mr-6 outline-none ${orderType === 'BUY' ? 'border-order-header-blue' : 'border-order-header-red'}`}
            value={editOrder.orderQuantity || 0}
            onChange={handleQuantityChange}
            step={editOrder.lotSize}
            min={editOrder.lotSize}
          />
          {(editOrder.chips || []).map((chip) => (
            <button
              key={chip}
              className="px-3 py-1 rounded bg-neutral-800 text-sm text-neutral-300 border border-neutral-600 hover:bg-neutral-700"
              onClick={() => handleChipClick(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Order Kind */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-neutral-400 text-sm  w-16">Type:</span>
          <button
            className={`px-4 py-1 rounded text-sm border font-bold ${kind === 'MARKET' ? (orderType === 'BUY' ? 'border-order-header-blue text-order-header-blue' : 'border-order-header-red text-order-header-red') : 'border-neutral-400 text-neutral-300'}`}
            onClick={() => handleKindChange('MARKET')}
          >
            Market
          </button>
          <button
            className={`px-4 py-1 rounded text-sm border font-bold ${kind === 'LIMIT' ? (orderType === 'BUY' ? 'border-order-header-blue text-order-header-blue' : 'border-order-header-red text-order-header-red') : 'border-neutral-400 text-neutral-300'}`}
            onClick={() => handleKindChange('LIMIT')}
          >
            Limit
          </button>
          <button
            className={`px-4 py-1 rounded text-sm border font-bold ${kind === 'SL' ? (orderType === 'BUY' ? 'border-order-header-blue text-order-header-blue' : 'border-order-header-red text-order-header-red') : 'border-neutral-400 text-neutral-300'}`}
            onClick={() => handleKindChange('SL')}
          >
            Stop Loss
          </button>
        </div>

        <div className="flex flex-col md:flex-row w-full pb-3">
          <div className="flex flex-1">
            {/* Lower: Price Inputs (only for LIMIT and SL) */}
            {kind !== 'MARKET' && (
              <div className="flex items-center gap-4">
                {kind === 'LIMIT' && (
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-sm w-16">Limit:</span>
                    <input
                      type="number"
                      step="0.50"
                      className={`w-32 px-2 py-1 rounded border border-neutral-600 bg-neutral-800 text-white outline-none ${orderType === 'BUY' ? 'border-order-header-blue' : 'border-order-header-red'}`}
                      value={editOrder.limitPrice || 0}
                      onChange={handleLimitPriceChange}
                    />
                  </div>
                )}
                {kind === 'SL' && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 text-sm w-16">Trigger:</span>
                      <input
                        type="number"
                        step="0.50"
                        className={`w-32 px-2 py-1 rounded border border-neutral-600 bg-neutral-800 text-white outline-none ${orderType === 'BUY' ? 'border-order-header-blue' : 'border-order-header-red'}`}
                        value={editOrder.triggerPrice || 0}
                        onChange={handleTriggerPriceChange}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 text-sm">Limit:</span>
                      <input
                        type="number"
                        step="0.50"
                        className={`w-32 px-2 py-1 rounded border border-neutral-600 bg-neutral-800 text-white outline-none ${orderType === 'BUY' ? 'border-order-header-blue' : 'border-order-header-red'}`}
                        value={editOrder.limitPrice || 0}
                        onChange={handleLimitPriceChange}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-center md:justify-end gap-4 w-full md:w-auto pt-5 md:pt-0">
            <button
              className={`px-8 py-2 rounded text-white font-bold text-base ${orderType === 'BUY' ? 'bg-order-header-blue active:bg-blue-700' : 'bg-order-header-red active:bg-red-700'}`}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting && (
                <Spin size="small" style={{ color: orderType === 'BUY' ? '#fff' : '#fff', marginRight: 8 }} indicator={<span className="ant-spin-dot" style={{ color: orderType === 'BUY' ? '#fff' : '#fff' }}><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg></span>} />
              )}
              Submit
            </button>
            <button className="px-8 py-2 rounded bg-neutral-500 text-white font-bold text-base hover:bg-neutral-600" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFormWidget; 
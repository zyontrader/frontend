import React, { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import CustomStepper from '../Common/CustomStepper';
import { DeleteOutlined } from '@ant-design/icons';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';
import { getScript } from '../../store/scriptsStore';
import { getQuote } from '../../store/quotesStore';
import { formatPrice } from '../../utils/formatter';

const BasketOrderItemWidget = ({ order, isEditMode, onChange, onDelete }) => {
  const [script, setScript] = useState(getScript(order.scriptId));
  const [quote, setQuote] = useState(getQuote(order.scriptId));

  useEffect(() => {
    setScript(getScript(order.scriptId));
    setQuote(getQuote(order.scriptId));
    const unsubScript = eventBus.on(
      EVENT_TYPES.SCRIPT_UPDATE,
      order.scriptId,
      () => setScript(getScript(order.scriptId))
    );
    const unsubQuote = eventBus.on(
      EVENT_TYPES.QUOTE_UPDATE,
      order.scriptId,
      () => setQuote(getQuote(order.scriptId))
    );
    return () => {
      unsubScript && unsubScript();
      unsubQuote && unsubQuote();
    };
  }, [order.scriptId]);

  // Try common price fields
  const price = quote?.price || 0;

  return (
    <li className={'flex items-center gap-3 py-2 !border-b !border-neutral-700 last:!border-none'}>
      {isEditMode ? (
        <Switch
          checked={order.isBuy}
          onChange={v => onChange(order.tempId || order.basketItemId, 'isBuy', v)}
          className={`${order.isBuy ? 'bg-green-500' : 'bg-red-500'} relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none`}
        >
          <span className="sr-only">Toggle Buy/Sell</span>
          <span
            className={`inline-block w-6 h-6 transform bg-white rounded-full shadow transition-transform ${order.isBuy ? 'translate-x-7' : 'translate-x-1'}`}
          />
          <span className={`absolute left-2 text-xs font-bold ${order.isBuy ? 'text-green-900' : 'text-red-900'}`}>{order.isBuy ? 'Buy' : ''}</span>
          <span className={`absolute right-2 text-xs font-bold ${!order.isBuy ? 'text-red-900' : 'text-green-900'}`}>{!order.isBuy ? 'Sell' : ''}</span>
        </Switch>
      ) : (
        <span
          className={
            'px-3 py-1 rounded-full font-bold text-white text-xs ' +
            (order.isBuy ? 'bg-green-500' : 'bg-red-500')
          }
          style={{ minWidth: 48, textAlign: 'center' }}
        >
          {order.isBuy ? 'Buy' : 'Sell'}
        </span>
      )}
      {/* Script name */}
      <span className="flex-1 text-neutral-200 font-medium text-sm">{order.scriptId}</span>
      {/* Quantity */}
      {isEditMode ? (
        <CustomStepper
          value={order.quantity}
          onChange={v => onChange(order.tempId || order.basketItemId, 'quantity', v)}
          min={1}
          step={script?.lot || 1}
          style={{ width: 80 }}
        />
      ) : (
        <span className="text-neutral-400 font-semibold text-sm" style={{ minWidth: 40, textAlign: 'right' }}>Qty: {order.quantity}</span>
      )}
      {/* Price display (only show when not in edit mode) */}
      {!isEditMode && (
        <span className="text-neutral-300 font-semibold text-sm min-w-[60px] text-right">{`₹${formatPrice(price)}`}</span>
      )}
      {/* Delete order button in edit mode */}
      {isEditMode && (
        <button
          onClick={() => onDelete(order.tempId)}
          className="w-8 h-8 flex items-center justify-center rounded bg-red-600 hover:bg-red-700 transition border-2 border-red-500 ml-2"
          title="Delete Order"
        >
          <DeleteOutlined style={{ fontSize: 18, color: 'white' }} />
        </button>
      )}
    </li>
  );
};

export default BasketOrderItemWidget; 
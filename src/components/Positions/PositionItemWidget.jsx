import React, { useEffect, useState } from 'react';
import { formatPrice } from '../../utils/formatter';
import { calculatePositionPnL, createEditOrder } from '../../utils/utils';
import QuoteSummaryWidget from '../Common/QuoteSummaryWidget';
import * as quotesStore from '../../store/quotesStore';
import * as scriptsStore from '../../store/scriptsStore';
import * as editOrderStore from '../../store/editOrderStore';
import * as mobileDataStore from '../../store/mobileDataStore';
import { getIsMobile } from '../../store/uiStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';

// Custom Buy (Plus) Icon
const BuyIcon = ({ className = '' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${className}`}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Custom Sell (Minus) Icon
const SellIcon = ({ className = '' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${className}`}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PositionItemWidget = ({ position }) => {
  const [showSummary, setShowSummary] = useState(false);
  const [script, setScript] = useState(() => scriptsStore.getScript(position.scriptId));
  const [quote, setQuote] = useState(() => quotesStore.getQuote(position.scriptId));
  const isMobile = getIsMobile();

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENT_TYPES.SCRIPT_UPDATE, position.scriptId, () => {
      setScript(scriptsStore.getScript(position.scriptId));
    });
    setScript(scriptsStore.getScript(position.scriptId));
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [position.scriptId]);

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENT_TYPES.QUOTE_UPDATE, position.scriptId, () => {
      setQuote(quotesStore.getQuote(position.scriptId));
    });
    setQuote(quotesStore.getQuote(position.scriptId));
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [position.scriptId]);

  // Net quantity color
  let qtyColor = 'text-blue-400';
  if (position.netQuantity < 0) qtyColor = 'text-red-500';
  if (position.netQuantity === 0) qtyColor = 'text-gray-400';

  // PnL and color
  const pnl = calculatePositionPnL(position, quote);
  const pnlColor = pnl >= 0 ? 'text-green-500' : 'text-red-500';

  // Buy/Sell handlers
  const handleBuy = (e) => {
    e.stopPropagation();
    const orderType = position.netQuantity < 0 ? 'SELL' : 'BUY';
    const editOrder = createEditOrder(position.scriptId, orderType, 'OPEN', 0);
    editOrderStore.setEditOrder(editOrder);
  };

  const handleSell = (e) => {
    e.stopPropagation();
    const absQuantity = Math.abs(position.netQuantity);
    const orderType = position.netQuantity >= 0 ? 'SELL' : 'BUY';
    const editOrder = createEditOrder(position.scriptId, orderType, 'OPEN', absQuantity);
    editOrderStore.setEditOrder(editOrder);
  };

  const handleItemClick = () => {
    // Clear mobile data store and set position
    mobileDataStore.clear();
    mobileDataStore.setPosition(position);
    setShowSummary(s => !s);
  };

  return (
    <div
      className="flex flex-col border-neutral-500 border-b last:border-none group cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="flex justify-between items-center py-2 w-full">
        {/* Left side */}
        <div className='flex-1'>
          <div className={`text-xs font-medium ${qtyColor}`}>{position.netQuantity} <span className="text-gray-500 font-normal">Qty</span></div>
          <div className="text-sm md:text-base text-neutral-400 mt-1">{position.scriptId}</div>
          <div className="flex items-center mt-2">
            <span className="text-fuchsia-400 text-xs mr-3">{script?.exchange || ''}</span>
            <span className="text-neutral-500 text-xs mr-1">Avg.</span>
            <span className="text-neutral-400 text-xs">{formatPrice(position.averagePrice)}</span>
          </div>
        </div>
        <div className="hidden md:block relative w-[2px] self-stretch">
          <div className="absolute right-2 items-center bottom-0 top-0 flex flex-row gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="w-8 h-8 flex items-center justify-center rounded bg-sky-600 active:bg-blue-300 !text-white shadow cursor-pointer"
              onClick={handleBuy}
              title="Buy">
              <BuyIcon />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded bg-red-600 !text-white active:bg-red-500 shadow cursor-pointer"
              onClick={handleSell}
              title="Sell">
              <SellIcon />
            </button>
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-col items-end">
          <div className="text-fuchsia-400 text-xxs">NRML</div>
          <div className={`text-sm md:text-base text-base ${pnlColor}`}>{formatPrice(pnl)}</div>
          <div className="text-gray-400 text-xs mt-1">LTP {formatPrice(quote?.price)}</div>
        </div>
      </div>
      <div
        className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${
          !isMobile && showSummary ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        {!isMobile && showSummary && <QuoteSummaryWidget scriptId={position.scriptId} />}
      </div>
    </div>
  );
};

export default PositionItemWidget; 
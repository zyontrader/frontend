import React, { useEffect, useState } from 'react';
import { formatPrice } from '../../utils/formatter';
import { createEditOrder } from '../../utils/utils';
import QuoteSummaryWidget from '../Common/QuoteSummaryWidget';
import * as quotesStore from '../../store/quotesStore';
import * as scriptsStore from '../../store/scriptsStore';
import * as editOrderStore from '../../store/editOrderStore';
import * as mobileDataStore from '../../store/mobileDataStore';
import { getIsMobile } from '../../store/uiStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';


// Custom Delete Icon SVG (just an X, matching Buy/Sell style)
const DeleteIcon = ({ className = '' }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
        className={`w-5 h-5 ${className}`}>
        <line x1="5" y1="5" x2="19" y2="19" />
        <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
);

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

const WatchlistItemWidget = ({ scriptId, onDelete }) => {
    const [showSummary, setShowSummary] = useState(false);
    const [quote, setQuote] = useState(() => quotesStore.getQuote(scriptId));
    const [script, setScript] = useState(() => scriptsStore.getScript(scriptId));
    const isMobile = getIsMobile();

    useEffect(() => {
        const unsubscribe = eventBus.on(EVENT_TYPES.QUOTE_UPDATE, scriptId, () => {
            setQuote(quotesStore.getQuote(scriptId));
        });
        setQuote(quotesStore.getQuote(scriptId));
        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [scriptId]);

    useEffect(() => {
        const unsubscribe = eventBus.on(EVENT_TYPES.SCRIPT_UPDATE, scriptId, () => {
            setScript(scriptsStore.getScript(scriptId));
        });
        setScript(scriptsStore.getScript(scriptId));
        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [scriptId]);

    if (!script) return null;

    const { price, change, changePct } = quote || {};
    const isPositive = change >= 0;
    const priceColor = isPositive ? 'green' : 'red';

    const handleBuy = (e) => {
        e.stopPropagation();
        const editOrder = createEditOrder(scriptId, 'BUY', 'OPEN', 0);
        editOrderStore.setEditOrder(editOrder);
    };

    const handleSell = (e) => {
        e.stopPropagation();
        const editOrder = createEditOrder(scriptId, 'SELL', 'OPEN', 0);
        editOrderStore.setEditOrder(editOrder);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete && onDelete();
    };

    const handleItemClick = () => {
        // Clear mobile data store and set selected script ID
        mobileDataStore.clear();
        mobileDataStore.setSelectedScriptId(scriptId);
        setShowSummary(s => !s);
    };

    return (
        <div
            className="group watchlist-item-summary flex flex-col border-b border-gray-500 last:border-none cursor-pointer"
            onClick={handleItemClick}
        >
            <div className="flex items-center px py-2 w-full">
                <div className="watchlist-item-detail flex-1">
                    <div className="text-sm md:text-base watchlist-item-detail-main mb-1 text-neutral-400">
                        {script.scriptId || scriptId}
                    </div>
                    <div className="watchlist-item-detail-ex text-fuchsia-700 text-xs">
                        {script.exchange || script.exchangeType || ''}
                    </div>
                </div>
                <div className="hidden md:block relative w-[2px] self-stretch">
                    <div className="right-0 top-0 bottom-0 absolute hover-actions watchlist-item-actions items-center gap-2 mx-4 hidden group-hover:flex">
                        <button
                            className="w-6 h-6 flex items-center justify-center rounded bg-blue-600 active:bg-blue-300 cursor-pointer !text-white shadow"
                            onClick={handleBuy}
                            title="Buy">
                            <BuyIcon />
                        </button>
                        <button
                            className="w-6 h-6 flex items-center justify-center rounded bg-red-600 cursor-pointer !text-white active:bg-red-500 shadow"
                            onClick={handleSell}
                            title="Sell">
                            <SellIcon />
                        </button>
                        <button
                            className="w-6 h-6 flex items-center justify-center rounded bg-fuchsia-700 cursor-pointer !text-white active:bg-fuchsia-800 shadow"
                            onClick={handleDelete}
                            title="Delete">
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
                <div className="watchlist-item-price flex flex-col items-end">
                    <div className={`watchlist-item-price-main text-sm md:text-base ${priceColor === 'green' ? 'text-green-500' : 'text-red-500'}`}>{formatPrice(price)}</div>
                    <div className="watchlist-item-price-change !text-neutral-400 text-right text-xs">
                        {formatPrice(change)} ({formatPrice(changePct)}%)
                    </div>
                </div>
                <div className="block md:hidden">
                    <button
                        className="w-6 h-6 flex items-center justify-center ml-2 rounded bg-transparent text-neutral-400 shadow"
                        onClick={handleDelete}>
                        <DeleteIcon />
                    </button>
                </div>
            </div>
            {!isMobile && (
                <div
                    className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${showSummary ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                        }`}
                >
                    {showSummary && <QuoteSummaryWidget scriptId={scriptId} />}
                </div>
            )}
        </div>
    );
};

export default WatchlistItemWidget; 
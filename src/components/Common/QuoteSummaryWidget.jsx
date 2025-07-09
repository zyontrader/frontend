import React from 'react';
import { formatPrice } from '../../utils/formatter';
import * as quotesStore from '../../store/quotesStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';

const labelClass = "text-neutral-500 text-xs";
const valueClass = "text-neutral-400 text-sm";
const rowClass = "flex items-center py-2";
const altRowClass = "bg-neutral-900";
const keyValueClass = "text-neutral-500 flex-1 px-2";
const keyValueRightClass = "text-neutral-400 flex-1 px-2 text-right";

function formatDateTime(dt) {
  if (!dt) return '-';
  const d = new Date(dt);
  return d.toLocaleString();
}

const QuoteSummaryWidget = ({ scriptId }) => {
  const [quote, setQuote] = React.useState(() => quotesStore.getQuote(scriptId) || {});

  React.useEffect(() => {
    const unsubscribe = eventBus.on(EVENT_TYPES.QUOTE_UPDATE, scriptId, () => {
      setQuote(quotesStore.getQuote(scriptId) || {});
    });
    // Set initial value in case it changed before mount
    setQuote(quotesStore.getQuote(scriptId) || {});
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [scriptId]);

  return (
    <div className="bg-black rounded-lg p-4 w-full">
      {/* Top row: Open, High, Low, Prev. Close */}
      <div className="flex justify-between border-b border-neutral-700 pb-2 mb-2">
        <div className="flex-1 text-center">
          <div className={labelClass}>Open</div>
          <div className={valueClass}>{formatPrice(quote?.dayOhlc?.open)}</div>
        </div>
        <div className="flex-1 text-center">
          <div className={labelClass}>High</div>
          <div className={valueClass}>{formatPrice(quote?.dayOhlc?.high)}</div>
        </div>
        <div className="flex-1 text-center">
          <div className={labelClass}>Low</div>
          <div className={valueClass}>{formatPrice(quote?.dayOhlc?.low)}</div>
        </div>
        <div className="flex-1 text-center">
          <div className={labelClass}>Prev. Close</div>
          <div className={valueClass}>{formatPrice(quote.prevClose)}</div>
        </div>
      </div>
      {/* Key-value rows */}
      <div className={`${rowClass}`}>
        <div className={keyValueClass}>Average Price</div>
        <div className={keyValueRightClass}>{formatPrice(quote.averagePrice)}</div>
      </div>
      <div className={`${rowClass} ${altRowClass}`}>
        <div className={keyValueClass}>Volume</div>
        <div className={keyValueRightClass}>{quote.dayVolume ?? '-'}</div>
      </div>
      <div className={rowClass}>
        <div className={keyValueClass}>Open Interest</div>
        <div className={keyValueRightClass}>{quote.oi ?? '-'}</div>
      </div>
      <div className={`${rowClass} ${altRowClass}`}>
        <div className={keyValueClass}>Last Traded Time</div>
        <div className={keyValueRightClass}>{formatDateTime(quote.ltTimeMs)}</div>
      </div>
    </div>
  );
};

export default QuoteSummaryWidget; 
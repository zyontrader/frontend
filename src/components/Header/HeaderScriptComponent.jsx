import React, { useEffect, useState } from 'react';
import { formatPrice } from '../../utils/formatter';
import * as quotesStore from '../../store/quotesStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';

const scriptNames = {
  nifty: 'NIFTY',
  banknifty: 'BANKNIFTY',
  sensex: 'SENSEX',
  indiavix: 'INDIAVIX',
};

const HeaderScriptComponent = ({ scriptId }) => {
  const [data, setData] = useState(() => quotesStore.getQuote(scriptId) || {});

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENT_TYPES.QUOTE_UPDATE, scriptId, () => {
      setData(quotesStore.getQuote(scriptId) || {});
    });
    setData(quotesStore.getQuote(scriptId) || {});
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [scriptId]);

  if (!data) return null;

  const { price, change } = data;
  const isPositive = change >= 0 || !change;
  const color = isPositive ? 'text-price-green' : 'text-price-red';

  return (
    <div className="text-center hidden [&:nth-child(1)]:block [&:nth-child(2)]:block md:block py-1 justify-center rounded items-center font-family-roboto">
      <div className="text-sm md:text-base text-neutral-400 font-semibold mr-2">{scriptNames[scriptId] || scriptId}</div>
      <div className={`text-sm md:text-base text-center flex items-center gap-1 ${color}`}>
        <div>{formatPrice(price)}</div>
        <div className="text-xs">
          ({change > 0 ? '+' : ''}{formatPrice(change)})
        </div>
      </div>
    </div>
  );
};

export default HeaderScriptComponent; 
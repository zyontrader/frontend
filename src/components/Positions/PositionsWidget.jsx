import React, { useEffect, useState, useRef, useMemo } from 'react';
import { calculatePositionPnL } from '../../utils/utils';
import { formatPrice } from '../../utils/formatter';
import PositionItemWidget from './PositionItemWidget';
import OptionsAnalyticsPopup from '../OptionsAnalytics/OptionsAnalyticsPopup';
import * as positionsStore from '../../store/positionsStore';
import * as quotesStore from '../../store/quotesStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';
import { getStrategyTabActive } from '../../store/uiStore';
import { exitAll, sync } from '../../api/apis';
import { Spin } from 'antd';

const PositionsWidget = () => {
  const [showAnalyticsPopup, setShowAnalyticsPopup] = useState(false);
  const [positions, setPositions] = useState(() => positionsStore.getPositions());
  const [quotes, setQuotes] = useState({});
  const quoteUnsubRef = useRef({});
  const [hideAnalyze, setHideAnalyze] = useState(getStrategyTabActive());
  const [loadingExitAll, setLoadingExitAll] = useState(false);

  useEffect(() => {
    const unsubscribe = eventBus.on(EVENT_TYPES.POSITION_UPDATE, () => {
      setPositions(positionsStore.getPositions());
    });
    setPositions(positionsStore.getPositions());
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Subscribe only to quotes for scriptIds in positions
  useEffect(() => {
    // Cleanup previous listeners
    Object.entries(quoteUnsubRef.current).forEach(([scriptId, unsubscribe]) => {
      if (typeof unsubscribe === 'function') unsubscribe();
    });
    quoteUnsubRef.current = {};

    // Subscribe to new scriptIds
    const newQuotes = {};
    positions.forEach(pos => {
      const scriptId = pos.scriptId;
      const quote = quotesStore.getQuote(scriptId);
      if (quote) newQuotes[scriptId] = quote;
      const unsubscribe = eventBus.on(EVENT_TYPES.QUOTE_UPDATE, scriptId, () => {
        setQuotes(prev => ({ ...prev, [scriptId]: quotesStore.getQuote(scriptId) }));
      });
      quoteUnsubRef.current[scriptId] = unsubscribe;
    });
    setQuotes(newQuotes);

    return () => {
      Object.entries(quoteUnsubRef.current).forEach(([scriptId, unsubscribe]) => {
        if (typeof unsubscribe === 'function') unsubscribe();
      });
      quoteUnsubRef.current = {};
    };
  }, [positions]);

  useEffect(() => {
    const unsub = eventBus.on(EVENT_TYPES.UI_UPDATE, 'isStrategyTabActive', () => {
      setHideAnalyze(getStrategyTabActive());
    });
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  // Calculate total P&L
  const totalPnL = useMemo(() => {
    return positions.reduce((sum, pos) => {
      const quote = quotes[pos.scriptId];
      return sum + calculatePositionPnL(pos, quote || {});
    }, 0);
  }, [positions, quotes]);

  const totalPnLColor = totalPnL >= 0 ? 'text-price-green' : 'text-price-red';

  const handleAnalyzeClick = () => {
    setShowAnalyticsPopup(true);
  };

  return (
    <div className="bg-dark-bg-2 rounded-lg p-3 flex-1 font-family-roboto relative overflow-hidden">
      {/* Overlay Loader */}
      {loadingExitAll && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50" style={{backdropFilter: 'blur(2px)'}}>
          <Spin size="large" className="mb-4" />
          <div className="text-orange-400 text-lg font-semibold mt-2">Exiting...</div>
        </div>
      )}
      {/* Total P&L */}
      <div className="bg-black text-center py-3 rounded mb-2 border border-neutral-700 mx-3">
        <div className="text-neutral-400 text-sm">Total P&amp;L</div>
        <div className={`${totalPnLColor} text-2xl`}>{formatPrice(totalPnL)}</div>
      </div>
      {/* Actions */}
      <div className="flex justify-end gap-3 text-sm mb-2 mx-3">
        <button
          className="text-orange-400 hover:underline"
          disabled={loadingExitAll}
          onClick={async () => {
            setLoadingExitAll(true);
            try {
              await exitAll();
            } catch (err) {
              // error handled elsewhere
            } finally {
              setLoadingExitAll(false);
            }
            sync();
          }}
        >
          Exit All
        </button>
        {!hideAnalyze && (
          <button 
            className="text-orange-400 hover:underline"
            onClick={handleAnalyzeClick}
          >
            Analyze
          </button>
        )}
      </div>
      {/* Positions List */}
      <div className="flex flex-col gap-0.5">
        {positions.map((pos, idx) => (
          <PositionItemWidget key={pos.scriptId + idx} position={pos} />
        ))}
      </div>
      {/* Analytics Popup */}
      <OptionsAnalyticsPopup
        visible={showAnalyticsPopup}
        onClose={() => setShowAnalyticsPopup(false)}
        includePositions={true}
        basketId={null}
      />
    </div>
  );
};

export default PositionsWidget; 
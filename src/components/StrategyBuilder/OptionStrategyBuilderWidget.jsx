import React from 'react';
import StrategyBuilderCarousel from './StrategyBuilderCarousel';
import { getSelectedUnderlying, getSelectedExpiry, getUnderlyings, getExpiries } from '../../store/optionChainsStore';
import { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import { optionChainAnalysis } from '../../api/apis';
import OptionsAnalyticsWidget from '../OptionsAnalytics/OptionsAnalyticsWidget';

const { Option } = Select;

const strategyMap = {
  straddle: {
    id: 'SHORT_STRADDLE',
    image: 'straddle.svg',
    label: 'Straddle',
  },
  strangle: {
    id: 'SHORT_STRANGLE',
    image: 'strangle.svg',
    label: 'Strangle',
  },
  batman: {
    id: 'BATMAN',
    image: 'batman.svg',
    label: 'Batman',
  },
  crown: {
    id: 'crown',
    image: 'crown.svg',
    label: 'Crown',
  },
  iron_condor: {
    id: 'IRON_CONDOR',
    image: 'iron_condor.svg',
    label: 'Iron Condor',
  },
  iron_fly: {
    id: 'IRON_FLY',
    image: 'iron_fly.svg',
    label: 'Iron Fly',
  },
  sell_put: {
    id: 'SELL_PUT',
    image: 'sell_put.svg',
    label: 'Sell Put',
  },
  buy_call: {
    id: 'BUY_CALL',
    image: 'buy_call.svg',
    label: 'Buy Call',
  },
  bull_call_spread: {
    id: 'BULL_CALL_SPREAD',
    image: 'bull_call_spread.svg',
    label: 'Bull Call Spread',
  },
  bull_call_ratio: {
    id: 'BULL_CALL_RATIO',
    image: 'bull_call_ratio.svg',
    label: 'Bull Call Ratio',
  },
  bull_put_ratio: {
    id: 'BULL_PUT_RATIO',
    image: 'bull_put_ratio.svg',
    label: 'Bull Put Ratio',
  },
  bull_put_spread: {
    id: 'BULL_PUT_SPREAD',
    image: 'bull_put_spread.svg',
    label: 'Bull Put Spread',
  },
  sell_call: {
    id: 'SELL_CALL',
    image: 'sell_call.svg',
    label: 'Sell Call',
  },
  buy_put: {
    id: 'BUY_PUT',
    image: 'buy_put.svg',
    label: 'Buy Put',
  },
  bear_put_spread: {
    id: 'BEAR_PUT_SPREAD',
    image: 'bear_put_spread.svg',
    label: 'Bear Put Spread',
  },
  bear_put_ratio: {
    id: 'BEAR_PUT_RATIO',
    image: 'bear_put_ratio.svg',
    label: 'Bear Put Ratio',
  },
  bear_call_spread: {
    id: 'BEAR_CALL_SPREAD',
    image: 'bear_call_spread.svg',
    label: 'Bear Call Spread',
  },
  bear_call_ratio: {
    id: 'BEAR_CALL_RATIO',
    image: 'bear_call_ratio.svg',
    label: 'Bear Call Ratio',
  },
};

const sampleData = Object.values(strategyMap);

const OptionStrategyBuilderWidget = () => {
  const analyticsRef = useRef(null);
  const [selectedUnderlying, setSelectedUnderlyingState] = useState(getSelectedUnderlying());
  const [selectedExpiry, setSelectedExpiryState] = useState(getSelectedExpiry());
  const [underlyings, setUnderlyingsState] = useState(getUnderlyings());
  const [expiries, setExpiriesState] = useState(getExpiries());
  const [loading, setLoading] = useState(false);

  // API call logic
  const invokeApi = (underlying, expiry) => {
    setLoading(true);
    optionChainAnalysis({ underlying, expiry })
      .then(data => {
        setSelectedUnderlyingState(data?.optionChainAnalysis?.underlying);
        setSelectedExpiryState(data?.optionChainAnalysis?.expiry);
        setUnderlyingsState(data?.optionUnderlyings || []);
        setExpiriesState(data?.optionExpirires || []);
      })
      .catch(err => {
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!selectedUnderlying || !selectedExpiry) {
      invokeApi();
    }
  }, [selectedUnderlying, selectedExpiry]);

  const handleUnderlyingChange = (val) => {
    setSelectedUnderlyingState(val);
    setSelectedExpiryState(null);
    invokeApi(val, null);
  };

  const handleExpiryChange = (val) => {
    setSelectedExpiryState(val);
    invokeApi(selectedUnderlying, val);
  };

  const handleStrategySelect = (strategy) => {
    if (
      analyticsRef.current &&
      strategy?.id &&
      selectedUnderlying &&
      selectedExpiry
    ) {
      analyticsRef.current.fetchStrategyItems(
        strategy.id,
        selectedUnderlying,
        selectedExpiry
      );
    }
  };

  return (
    <div className="flex-1 rounded-lg shadow p-2 pr-4 flex flex-col justify-start overflow-x-hidden">
      <div className="flex gap-2 items-center mb-4">
        <Select
          value={selectedUnderlying}
          onChange={handleUnderlyingChange}
          className="w-32"
          disabled={loading}
        >
          {underlyings.map(u => (
            <Option key={u} value={u}>{u}</Option>
          ))}
        </Select>
        <Select
          value={selectedExpiry}
          onChange={handleExpiryChange}
          className="w-40"
          disabled={loading || !selectedUnderlying}
        >
          {expiries.map(e => (
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
      </div>

      <div className="w-full">
        <StrategyBuilderCarousel
          data={sampleData}
          onSelect={handleStrategySelect}
        />
      </div>

      {/* Analytics Widgets Inline */}
      <div className="">
        <OptionsAnalyticsWidget
          ref={analyticsRef}
          enableScriptSearch={true}
          allowDeletePositions={true} />
      </div>
    </div>
  );
};

export default OptionStrategyBuilderWidget; 
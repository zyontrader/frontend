import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Select, Checkbox, Switch } from 'antd';
import OptionsAnalyticsChartWidget from './OptionsAnalyticsChartWidget';
import CustomStepper from '../Common/CustomStepper';
import OptionsAnalyticsStatsWidget from './OptionsAnalyticsStatsWidget';
import { optionAnalysis, getItemsForStrategy } from '../../api/apis';
import * as optionAnalyticsStore from '../../store/optionAnalyticsStore';
import { getIsMobile } from '../../store/uiStore';
import eventBus, { EVENT_TYPES } from '../../utils/eventBus';
import ScriptsSearchWidget from '../Common/ScriptsSearchWidget';
import { getScript } from '../../store/scriptsStore';
import { formatPrice } from '../../utils/formatter';
const { Option } = Select;

const OptionsAnalyticsWidget = React.memo(React.forwardRef(({ enableScriptSearch = false, allowDeletePositions = false }, ref) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedUnderlying, setSelectedUnderlying] = useState(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [ivAdjustment, setIvAdjustment] = useState(0.0);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef();
  const isMobile = getIsMobile();

  function setData() {
    let data = optionAnalyticsStore.getAnalytics();
    setAnalyticsData(data);
    setSelectedUnderlying(data?.underlying);
    setSelectedPrice(data?.currentPrice);
    setSelectedDateIndex(data?.datesIndex);
    setIvAdjustment(data?.ivUpdate * 100 || 0);
  }

  useEffect(() => {
    setData();
    const unsubscribe = eventBus.on(EVENT_TYPES.OPTION_ANALYTICS_UPDATE, () => setData());
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Function to call API with current state
  const callOptionAnalysis = useCallback(async (newDateIndex = null, newIvAdjustment = null, newPositions = null, newUnderlying = null) => {
    setLoading(true);
    try {
      // Use passed values or current state values
      const dateIndexToUse = newDateIndex !== null ? newDateIndex : selectedDateIndex;
      const ivToUse = newIvAdjustment !== null ? newIvAdjustment : ivAdjustment;
      const positionsToUse = newPositions || analyticsData?.allItems || [];
      const underlyingToUse = newUnderlying || selectedUnderlying;
      // Get the selected date from the dates array
      const selectedDate = (analyticsData?.dates || [])[dateIndexToUse];
      const date = new Date(selectedDate);
      const dateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; // YYYY-MM-dd format
      const analysisData = {
        analysisPositions: positionsToUse.map(item => ({
          scriptId: item.scriptId,
          netQuantity: item.netQuantity,
          price: item.price,
          disabled: item.disabled
        })),
        targetDate: dateTime,
        ivUpdate: ivToUse / 100,
        underlying: underlyingToUse
      };
      const response = await optionAnalysis(null, analysisData);
      const dataCopy = JSON.parse(JSON.stringify(response.optionAnalysis || response));
      setAnalyticsData(dataCopy);
      if (dataCopy) {
        setSelectedPrice(dataCopy.currentPrice);
      }
    } catch (err) {
      setAnalyticsData(null);
      console.error('Failed to update analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [analyticsData, selectedDateIndex, ivAdjustment, selectedUnderlying]);

  // Update underlying and trigger API call
  const handleUnderlyingChange = useCallback((value) => {
    setSelectedUnderlying(value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callOptionAnalysis(null, null, null, value), 100);
  }, [callOptionAnalysis]);

  // Update positions and trigger API call
  const handlePositionChange = useCallback((idx, updates) => {
    const newAllItems = [...analyticsData.allItems];
    newAllItems[idx] = { ...newAllItems[idx], ...updates };
    const newAnalyticsData = { ...analyticsData, allItems: newAllItems };
    setAnalyticsData(newAnalyticsData);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callOptionAnalysis(null, null, newAllItems), 100);
  }, [analyticsData, callOptionAnalysis]);

  // Update date and trigger API call
  const handleDateChange = useCallback((value) => {
    setSelectedDateIndex(value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callOptionAnalysis(value), 100);
  }, [callOptionAnalysis]);

  // Update IV and trigger API call
  const handleIvChange = useCallback((value) => {
    setIvAdjustment(value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callOptionAnalysis(null, value), 100);
  }, [callOptionAnalysis]);

  // Memoize handlePriceSelect to prevent chart re-renders
  const handlePriceSelect = useCallback((price) => {
    setSelectedPrice(price);
  }, []);

  // Memoize position change handlers to prevent recreation
  const createPositionHandlers = useMemo(() => {
    return (idx) => ({
      handleDisabledChange: (e) => handlePositionChange(idx, { disabled: !e.target.checked }),
      handleQuantitySignChange: (checked) => {
        const pos = analyticsData?.allItems[idx];
        if (pos) {
          const newQuantity = checked ? Math.abs(pos.netQuantity) : -Math.abs(pos.netQuantity);
          handlePositionChange(idx, { netQuantity: newQuantity });
        }
      },
      handleQuantityChange: (value) => {
        const pos = analyticsData?.allItems[idx];
        if (pos) {
          const sign = pos.netQuantity >= 0 ? 1 : -1;
          handlePositionChange(idx, { netQuantity: value * sign });
        }
      }
    });
  }, [analyticsData, handlePositionChange]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Expose fetchStrategyItems method to parent via ref
  React.useImperativeHandle(ref, () => ({
    async fetchStrategyItems(strategyId, underlying, expiry) {
      setLoading(true);
      let items = [];
      try {
        const response = await getItemsForStrategy(strategyId, underlying, expiry);
        if (response && response.strategyPositions) {
          items = response.strategyPositions;
        }
      } catch (err) { }
      setAnalyticsData(prev => ({
        ...prev,
        allItems: items
      }));
      callOptionAnalysis(null, null, items);
    }
  }));

  return (
    <div className="flex flex-col md:flex-row gap-3 items-start justify-stretch">
      {isMobile && (
        < div className="flex-1 min-w-[320px] w-full md:w-auto">
          <div className="mt-3 bg-neutral-900 shadow-lg rounded-lg p-3 mb-3 border border-neutral-700">
            <OptionsAnalyticsChartWidget
              analyticsData={analyticsData}
              onPriceSelect={handlePriceSelect}
            />
          </div>
          <OptionsAnalyticsStatsWidget
            analyticsData={analyticsData}
            selectedPrice={selectedPrice} />
        </div>
      )}
      <div className="flex-1 min-w-[320px] flex flex-col justify-stretch w-full max-w-[580px]">
        {enableScriptSearch && (
          <div className="mb-1 mt-3">
            <ScriptsSearchWidget
              showBuySell={false}
              onScriptSelected={scriptId => {
                const newPositions = analyticsData?.allItems || [];
                const script = getScript(scriptId);
                newPositions.push({
                  scriptId,
                  netQuantity: script.lot || 1,
                  disabled: false
                });
                callOptionAnalysis(null, null, newPositions);
                return true; // close search
              }}
            />
          </div>
        )}
        <div className='flex-1 mt-3 bg-neutral-900 shadow-lg rounded-lg p-3 mb-3 border border-neutral-700'>
          {/* Underlying Selector */}
          <div className="mb-4">
            <label className="text-sm text-neutral-400">Underlying</label>
            <Select
              value={selectedUnderlying}
              className="w-full mt-2"
              onChange={handleUnderlyingChange}
            >
              {analyticsData?.underlyings?.map((u) => (
                <Option key={u} value={u}>{u}</Option>
              ))}
            </Select>
          </div>
          {/* Positions List */}
          <div className="mb-4">
            {analyticsData?.allItems.map((pos, idx) => {
              const handlers = createPositionHandlers(idx);
              return (
                <>
                  <div key={pos.scriptId} className="flex flex-col md:flex-row gap-2 mb-2 bg-gray-50 rounded-md px-2 py-2">
                    <div className="block md:hidden font-semibold w-full flex-1 text-start text-gray-700 text-sm truncate">{pos.scriptId}</div>
                    <div className="flex items-center flex-1">
                      <Checkbox
                        checked={!pos.disabled}
                        className="w-6 m-0"
                        onChange={handlers.handleDisabledChange}
                      />
                      <Switch
                        checked={pos.netQuantity > 0}
                        onChange={handlers.handleQuantitySignChange}
                        checkedChildren={null}
                        unCheckedChildren={null}
                        className={pos.netQuantity > 0 ? '!bg-blue-600 hover:!bg-blue-600 focus:!bg-blue-600 active:!bg-blue-600' : '!bg-red-600 hover:!bg-red-600 focus:!bg-red-600 active:!bg-red-600'}
                        style={{ minWidth: 40 }}
                      />
                      <div className="hidden md:block w-32 flex-1 text-start text-gray-800 text-sm truncate">{pos.scriptId}</div>
                      <div className="flex-1 block md:hidden"></div>
                      <CustomStepper
                        value={Math.abs(pos.netQuantity)}
                        onChange={handlers.handleQuantityChange}
                        min={0}
                        step={getScript(pos.scriptId)?.lot || 1}
                        style={{ width: 70 }}
                      />
                      <div className="w-20 text-right text-gray-700 text-base">₹{formatPrice(pos.price)}</div>
                      {allowDeletePositions && (
                        <button
                          className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold"
                          title="Delete position"
                          onClick={() => {
                            const newAllItems = analyticsData.allItems.filter((_, i) => i !== idx);
                            setAnalyticsData({ ...analyticsData, allItems: newAllItems });
                            callOptionAnalysis(null, null, newAllItems);
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          {/* Target Date Selector */}
          <div className="mb-4">
            <label className="text-sm text-neutral-400">Target Date</label>
            <Select value={selectedDateIndex} onChange={handleDateChange} className="w-full mt-2">
              {(analyticsData?.dates || []).map((date, idx) => (
                <Option key={idx} value={idx}>{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</Option>
              ))}
            </Select>
          </div>
          {/* IV Adjustment */}
          <div className="mb-4">
            <label className="text-sm text-neutral-400">IV Adjustment: {ivAdjustment}%</label>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={ivAdjustment}
              onChange={e => handleIvChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {/* Loading indicator */}
          {loading && (
            <div className="text-center py-2">
              <div className="text-sm text-zyon-blue">Updating analysis...</div>
            </div>
          )}
        </div>
      </div>
      {!isMobile && (
        < div className="flex-1 min-w-[320px]">
          <div className="mt-3 bg-neutral-900 shadow-lg rounded-lg p-3 mb-3 border border-neutral-700">
            <OptionsAnalyticsChartWidget
              analyticsData={analyticsData}
              onPriceSelect={handlePriceSelect}
            />
          </div>
          <OptionsAnalyticsStatsWidget
            analyticsData={analyticsData}
            selectedPrice={selectedPrice} />
        </div>
      )}
    </div >
  );
}));

OptionsAnalyticsWidget.displayName = 'OptionsAnalyticsWidget';

export default OptionsAnalyticsWidget; 
import React, { useRef, useEffect, useState } from 'react';
import { formatPrice } from '../../utils/formatter';
import { Select, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import {
  getSelectedUnderlying,
  getSelectedExpiry,
  getUnderlyings,
  getExpiries,
} from '../../store/optionChainsStore';
import { getIsMobile } from '../../store/uiStore';
import { optionChainAnalysis } from '../../api/apis';
const { Option } = Select;

// Helper for K/M formatting
function formatK(value) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return value;
}

const OptionChainDisplayWidget = () => {
  const scrollContainerRef = useRef(null);
  const atmRowRef = useRef(null);
  const [selectedUnderlying, setSelectedUnderlyingState] = useState(getSelectedUnderlying());
  const [selectedExpiry, setSelectedExpiryState] = useState(getSelectedExpiry());
  const [underlyings, setUnderlyingsState] = useState(getUnderlyings());
  const [expiries, setExpiriesState] = useState(getExpiries());

  // Store option chain analysis data in local state
  const [chainData, setChainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMobile = getIsMobile();

  const invokeApi = (underlying, expiry) => {
    setLoading(true);
    setError(null);
    optionChainAnalysis({ underlying, expiry })
      .then(data => {
        setChainData(data.optionChainAnalysis);
        setSelectedUnderlyingState(data?.optionChainAnalysis?.underlying);
        setSelectedExpiryState(data?.optionChainAnalysis?.expiry);
        setUnderlyingsState(data?.optionUnderlyings || []);
        setExpiriesState(data?.optionExpirires || []);
      })
      .catch(err => {
        setError('Failed to load option chain. Please try again.');
        setChainData(null);
        console.error('optionChainAnalysis error', err);
      })
      .finally(() => setLoading(false));
  }

  // On mount, trigger optionChainAnalysis with selected underlying and expiry
  useEffect(() => {
    invokeApi(selectedUnderlying, selectedExpiry);
    // eslint-disable-next-line
  }, []);

  const strikes = chainData?.optionChain?.strikes || [];
  const lastUnderlying = chainData?.underlyingPrice || 0;
  const atmIdx = (strikes.length && lastUnderlying != null)
    ? strikes.reduce((bestIdx, row, idx) => {
      return Math.abs(row.strike - lastUnderlying) < Math.abs(strikes[bestIdx].strike - lastUnderlying) ? idx : bestIdx;
    }, 0)
    : 0;

  // Find max OI for bar scaling
  const maxCallOI = Math.max(...strikes.map(row => row.callQuote?.oi || 0));
  const maxPutOI = Math.max(...strikes.map(row => row.putQuote?.oi || 0));
  const maxOI = Math.max(maxCallOI, maxPutOI);

  useEffect(() => {
    if (atmRowRef.current && scrollContainerRef.current) {
      // Scroll so that the ATM row is centered vertically in the container
      const row = atmRowRef.current;
      const container = scrollContainerRef.current;
      const rowRect = row.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offset = rowRect.top - containerRect.top - containerRect.height / 2 + rowRect.height / 2;
      container.scrollTo({
        top: container.scrollTop + offset,
        behavior: 'smooth',
      });
    }
  }, [chainData]);

  const handleRefresh = () => {
    invokeApi(selectedUnderlying, selectedExpiry);
  };

  const handleUnderlyingChange = (val) => {
    setSelectedUnderlyingState(val);
    setSelectedExpiryState(null);
    setError(null);
    invokeApi(val, null);
  };

  const handleExpiryChange = (val) => {
    setSelectedExpiryState(val);
    setError(null);
    invokeApi(selectedUnderlying, val);
  };

  return (
    <div className="w-full overflow-y-auto flex-1 flex flex-col mt-2 md:mt-0">
      <div className="flex gap-2 items-center mb-4">
        <Select
          className="w-32"
          value={selectedUnderlying}
          onChange={handleUnderlyingChange}
          disabled={loading}
        >
          {underlyings.map(u => (
            <Option key={u} value={u}>{u}</Option>
          ))}
        </Select>
        <Select
          className="w-40"
          value={selectedExpiry}
          onChange={handleExpiryChange}
          disabled={loading || !selectedUnderlying}
        >
          {expiries.map(e => (
            <Option key={e} value={e}>{e}</Option>
          ))}
        </Select>
        <button
          onClick={handleRefresh}
          type="primary"
          className="w-7 h-7 flex rounded bg-button-blue active:bg-blue-300 text-white shadow items-center justify-center"
          disabled={loading}
        >
          <ReloadOutlined style={{ fontSize: 18, fontWeight: 700 }} />
        </button>
      </div>
      <div ref={scrollContainerRef} className="flex flex-1 overflow-y-auto bg-dark-bg rounded-lg border border-neutral-800 w-full">
        {loading ? (
          <div className="flex flex-1 items-center justify-center h-40"><Spin size="large" /></div>
        ) : error ? (
          <div className="p-4 flex-1 text-red-400 font-semibold text-base content-center text-center">
            An error occurred while loading the option chain. Please try again.
          </div>
        ) : (
          <table className="w-full text-xs font-family-roboto">
            <thead className='sticky top-0 z-30'>
              <tr className="bg-dark-bg-2 text-neutral-300 text-center">
                <th colSpan={3} className="border-r border-neutral-700 text-red-300 font-semibold text-base py-2 bg-dark-bg-2">CALLS</th>
                <th colSpan={2} className="bg-dark-bg-2 text-neutral-400 font-semibold text-sm py-2"></th>
                <th colSpan={3} className="border-l border-neutral-700 text-green-300 font-semibold text-base py-2 bg-dark-bg-2">PUTS</th>
              </tr>
              <tr className="bg-dark-bg-2 text-neutral-400 text-center text-sm">
                {!isMobile && <th className=" bg-dark-bg-2">OI Chg%</th>}
                <th className=" bg-dark-bg-2">OI</th>
                <th className=" bg-dark-bg-2">LTP</th>
                <th className=" bg-dark-bg-2">Strike</th>
                <th className=" bg-dark-bg-2">IV</th>
                <th className=" bg-dark-bg-2">LTP</th>
                <th className=" bg-dark-bg-2">OI</th>
                {!isMobile && <th className=" bg-dark-bg-2">OI Chg%</th>}
              </tr>
            </thead>
            <tbody>
              {strikes.map((row, idx) => {
                const callOI = row.callQuote?.oi || 0;
                const putOI = row.putQuote?.oi || 0;
                const callOIChg = (row.callOiDiffs || [])[3] || 0;
                const putOIChg = (row.putOiDiffs || [])[3] || 0;
                const callLTP = row.callQuote?.price || 0;
                const putLTP = row.putQuote?.price || 0;
                const iv = row.iv || 14.20;
                const isATM = idx === atmIdx;
                // OI Chg% (dummy, as % not in sample, so use OIChange/OI)
                const callOIChgPct = callOI ? Math.round((callOIChg / callOI) * 100) : 0;
                const putOIChgPct = putOI ? Math.round((putOIChg / putOI) * 100) : 0;
                return (
                  <tr
                    key={row.strike}
                    ref={isATM ? atmRowRef : null}
                    className={`text-center text-sm ${isATM ? 'bg-blue-950/40' : idx % 2 ? 'bg-dark-bg-2' : ''}`}
                  >
                    {/* CALLS */}
                    {!isMobile && <td className={`p-1 text-xs ${callOIChgPct < 0 ? 'text-red-400' : 'text-green-300'}`}>{callOIChgPct ? `${callOIChgPct > 0 ? '+' : ''}${callOIChgPct}%` : '-'}</td>}
                    <td className='p-1'>
                      <div className="relative h-4 flex items-center">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 rounded bg-red-200/20" style={{ width: `${(callOI / maxOI) * 100}%` }} />
                        <div className="relative z-10 text-red-400 text-xs font-semibold w-full text-right">{callOI ? formatK(callOI) : '-'}</div>
                      </div>
                    </td>
                    <td className="p-1 text-red-200 font-medium">{formatPrice(callLTP)}</td>
                    {/* STRIKE */}
                    <td className="p-1 bg-dark-bg-2 font-semibold text-blue-200 border-x border-neutral-700">{row.strike}</td>
                    {/* PUTS */}
                    <td className="p-1 text-gray-200">{iv ? formatPrice(iv) : '14.20'}</td>
                    <td className="p-1 text-green-200 font-medium">{formatPrice(putLTP)}</td>
                    <td>
                      <div className="relative h-4 flex items-center">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 rounded bg-green-200/20" style={{ width: `${(putOI / maxPutOI) * 100}%` }} />
                        <div className="relative z-10 text-green-300 font-semibold" style={{ fontSize: '11px' }}>{putOI ? formatK(putOI) : '-'}</div>
                      </div>
                    </td>
                    {!isMobile && <td className={`p-1 text-xs ${putOIChgPct < 0 ? 'text-red-400' : 'text-green-300'}`}>{putOIChgPct ? `${putOIChgPct > 0 ? '+' : ''}${putOIChgPct}%` : '-'}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OptionChainDisplayWidget; 
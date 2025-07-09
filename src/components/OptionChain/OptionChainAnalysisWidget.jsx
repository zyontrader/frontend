import React, { useState, useEffect, useMemo } from 'react';
import { Select, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatPrice } from '../../utils/formatter';
import { optionChainAnalysis } from '../../api/apis';
import {
  getSelectedUnderlying,
  getSelectedExpiry,
  getUnderlyings,
  getExpiries,
} from '../../store/optionChainsStore';
import { getIsMobile } from '../../store/uiStore';
import { RadioGroup } from '@headlessui/react';

const { Option } = Select;

const OptionChainAnalysisWidget = () => {
  const [selectedUnderlying, setSelectedUnderlyingState] = useState(getSelectedUnderlying());
  const [selectedExpiry, setSelectedExpiryState] = useState(getSelectedExpiry());
  const [underlyings, setUnderlyingsState] = useState(getUnderlyings());
  const [expiries, setExpiriesState] = useState(getExpiries());
  const [chainData, setChainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hideOI, setHideOI] = useState(false);
  const [oiChangeIndex, setOiChangeIndex] = useState(3);
  const isMobile = getIsMobile();

  // API call logic
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
        setError('An error occurred while loading the option chain. Please try again.');
        setChainData(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    invokeApi(selectedUnderlying, selectedExpiry);
    // eslint-disable-next-line
  }, []);

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

  const handleRefresh = () => {
    invokeApi(selectedUnderlying, selectedExpiry);
  };

  const handleIntervalChange = (value) => {
    setOiChangeIndex(value);
  };

  // Use chainData for all chart data
  const chartData = useMemo(() => chainData?.optionChain?.strikes || [], [chainData]);
  const pcrSeries = useMemo(() => chainData?.pcrSeries || [], [chainData]);
  const timestamps = useMemo(() => chainData?.timestamps || [], [chainData]);
  const callsActiveData = useMemo(() => chainData?.callsActiveData || [], [chainData]);
  const putsActiveData = useMemo(() => chainData?.putsActiveData || [], [chainData]);
  const underlyingPrices = useMemo(() => chainData?.underlyingPrices || [], [chainData]);
  const latestUnderlying = useMemo(() => chainData?.underlyingPrice || 0, [chainData]);

  // Prepare data for Active Strikes and PCR chart
  const activeStrikesChartData = useMemo(() =>
    timestamps.map((ts, i) => {
      const obj = {
        time: new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        PCR: pcrSeries[i],
      };
      // Add each active strike OI series
      callsActiveData.forEach((call, idx) => {
        obj[call.scriptId] = call.ois[i];
      });
      putsActiveData.forEach((put, idx) => {
        obj[put.scriptId] = put.ois[i];
      });
      // Add underlying price
      obj['Underlying'] = underlyingPrices[i];
      return obj;
    }), [timestamps, pcrSeries, callsActiveData, putsActiveData, underlyingPrices]
  );

  // Debug: what series are present?
  const callSeries = useMemo(() => callsActiveData.map(call => call.scriptId), [callsActiveData]);
  const putSeries = useMemo(() => putsActiveData.map(put => put.scriptId), [putsActiveData]);
  const hasSeries = useMemo(() => callSeries.length > 0 || putSeries.length > 0, [callSeries, putSeries]);

  const minStrike = useMemo(() => latestUnderlying ? latestUnderlying * 0.95 : -Infinity, [latestUnderlying]);
  const maxStrike = useMemo(() => latestUnderlying ? latestUnderlying * 1.05 : Infinity, [latestUnderlying]);
  const optionChainBarData = useMemo(() =>
    chartData
      .filter(row => row.strike >= minStrike && row.strike <= maxStrike)
      .map(row => {
        // Return a new object to avoid mutating the original
        const putOiChange = row.putOiDiffs && row.putQuote ? row.putOiDiffs[oiChangeIndex] || 0 : row.putQuote?.oiChange || 0;
        const callOiChange = row.callOiDiffs && row.callQuote ? row.callOiDiffs[oiChangeIndex] || 0 : row.callQuote?.oiChange || 0;
        return {
          ...row,
          putQuote: row.putQuote ? { ...row.putQuote, oiChange: putOiChange } : undefined,
          callQuote: row.callQuote ? { ...row.callQuote, oiChange: callOiChange } : undefined,
        };
      })
      .map(row => {
        if (hideOI) {
          return {
            strike: row.strike,
            'PE OI Change': row.putQuote?.oiChange || 0,
            'CE OI Change': row.callQuote?.oiChange || 0,
            isPEOIChangeNegative: (row.putQuote?.oiChange || 0) < 0,
            isCEOIChangeNegative: (row.callQuote?.oiChange || 0) < 0
          }
        }
        return {
          strike: row.strike,
          'PE OI': (row.putQuote?.oiChange <= 0 ? row.putQuote?.oi : (row.putQuote?.oi - row.putQuote?.oiChange)) || 0,
          'CE OI': (row.callQuote?.oiChange <= 0 ? row.callQuote?.oi : (row.callQuote?.oi - row.callQuote?.oiChange)) || 0,
          'PE OI Change': Math.abs(row.putQuote?.oiChange || 0),
          'CE OI Change': Math.abs(row.callQuote?.oiChange || 0),
          isPEOIChangeNegative: (row.putQuote?.oiChange || 0) < 0,
          isCEOIChangeNegative: (row.callQuote?.oiChange || 0) < 0,
          actualCEOI: row.callQuote?.oi || 0,
          actualPEOI: row.putQuote?.oi || 0,
        }
      }),
    [chartData, oiChangeIndex, minStrike, maxStrike, hideOI]
  );

  // Colors for chart series
  const seriesColors = [
    '#DD5555',
    '#DD9955',
    '#55DD55',
    '#55DDAA',
  ];

  // Helper for Y-axis formatting
  function formatYAxisLabel(value) {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return value;
  }

  // Custom tooltip for Active Strikes OI chart
  const CustomActiveStrikesTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-dark-bg-2 p-2 rounded shadow text-xs">
        <div className="font-bold text-blue-300 mb-1">{label}</div>
        {payload.map((entry, idx) => {
          // Only format OI series (not Underlying or PCR)
          const isOI = callSeries.includes(entry.name) || putSeries.includes(entry.name);
          const isUnderlying = entry.name === 'Underlying';
          let value = entry.value;
          if (isOI) value = formatYAxisLabel(entry.value);
          else if (isUnderlying) value = formatPrice(entry.value);
          return (
            <div key={entry.name} className='flex items-center mt-2 ' style={{ color: entry.color }}>
              <div className="flex-1 text-sm mr-3">{entry.name}</div>
              <div className='text-sm'>{value}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Compute gradient stops for PCR
  const pcrGradientStops = React.useMemo(() => {
    if (!activeStrikesChartData.length) return [];
    const stops = [];
    activeStrikesChartData.forEach((point, idx) => {
      const percentage = (idx * 100) / activeStrikesChartData.length;
      const color = point.PCR >= 1.0 ? '#66DD66' : '#DD5555';
      stops.push({ offset: `${percentage}%`, stopColor: color });
    });
    return stops;
  }, [activeStrikesChartData]);

  // Custom tooltip for PCR chart
  const CustomPCRTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-dark-bg-2 p-2 rounded shadow text-xs">
        <div className="font-bold text-blue-300 mb-1">{label}</div>
        {payload.map((entry, idx) => {
          let value = formatPrice(entry.value);
          return (
            <div key={entry.name} className='flex items-center mt-2 ' style={{ color: entry.color }}>
              <div className="flex-1 text-sm mr-3">{entry.name}</div>
              <div className='text-sm'>{value}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Custom legend for PCR chart
  const CustomPCRLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="recharts-default-legend" style={{ display: 'flex', gap: 16, margin: 0, padding: 0, justifyContent: 'center' }}>
        {payload.map((entry) => (
          <li key={entry.value} style={{ color: '#ccc', display: 'flex', alignItems: 'center', fontSize: 13, listStyle: 'none' }}>
            <svg width="14" height="14" style={{ marginRight: 6 }}>
              <rect width="14" height="14" fill={entry.color} />
            </svg>
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  // Custom tooltip for Option Chain bar chart
  const CustomOIBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-dark-bg-2 opacity-80 p-2 rounded shadow text-xs">
        <div className="font-bold text-blue-300 mb-1">Strike: {label}</div>
        {payload.map((entry, idx) => {
          let value = entry.value;
          const absVal = Math.abs(entry.value);
          let formatted = formatYAxisLabel(absVal);
          if (entry.name.endsWith('PE OI Change')) {
            if (entry.payload?.isPEOIChangeNegative) {
              formatted = '-' + formatted;
            } else {
              formatted = '+' + formatted;
            }
          } else if (entry.name.endsWith('CE OI Change')) {
            if (entry.payload?.isCEOIChangeNegative) {
              formatted = '-' + formatted;
            } else {
              formatted = '+' + formatted;
            }
          } else if (entry.name.endsWith('CE OI')) {
            formatted = formatYAxisLabel(entry.payload?.actualCEOI);
          } else if (entry.name.endsWith('PE OI')) {
            formatted = formatYAxisLabel(entry.payload?.actualPEOI);
          } else if (entry.value < 0) formatted = '-' + formatted;
          value = formatted;
          // Set color for OI Change
          let color = entry.color;
          if (entry.name === 'PE OI Change') color = '#AAFFAA';
          if (entry.name === 'CE OI Change') color = '#FFAA99';
          return (
            <div key={entry.name} className='flex items-center mt-2 ' style={{ color }}>
              <div className="flex-1 text-sm mr-3">{entry.name}</div>
              <div className='text-sm'>{value}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Custom bar shape for OI Change bars
  const CustomBarWithPattern = (props) => {
    const { x, y, width, height, fill, payload, dataKey } = props;
    let barFill = fill;
    if (dataKey === 'PE OI Change') {
      barFill = payload.isPEOIChangeNegative ? 'url(#slashPE)' : '#AAFFAA';
    } else if (dataKey === 'CE OI Change') {
      barFill = payload.isCEOIChangeNegative ? 'url(#slashCE)' : '#FFAA99';
    }
    let drawY = y;
    let drawHeight = height;
    if (height < 0) {
      drawY = y + height;
      drawHeight = -height;
    }
    return <rect x={x} y={drawY} width={width} height={drawHeight} fill={barFill} />;
  };

  // Custom centered vertical cursor
  const CenteredCursor = (props) => {
    // For BarChart, props.x is the left edge of the bar, props.width is the bar width
    // For LineChart, props.points[0].x is the x position of the hovered point
    const x = props.x !== undefined
      ? props.x + (props.width ? props.width / 2 : 0)
      : (props.points && props.points[0] && props.points[0].x) || 0;
    return (
      <line
        x1={x}
        x2={x}
        y1={props.y || 0}
        y2={(props.y || 0) + (props.height || props.viewBox?.height || 0)}
        stroke="#888"
        strokeWidth={2}
        opacity={0.7}
      />
    );
  };

  return (
    <div className="w-full bg-dark-bg p-2 rounded-lg flex flex-col flex-1">
      {/* Header Controls */}
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
        <button
          onClick={handleRefresh}
          type="primary"
          className="w-7 h-7 flex rounded bg-button-blue active:bg-blue-300 text-white shadow items-center justify-center"
          disabled={loading}
        >
          <ReloadOutlined style={{ fontSize: 18, fontWeight: 700 }} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center h-40"><Spin size="large" /></div>
      ) : error ? (
        <div className="p-4 flex-1 text-red-400 font-semibold text-base items-center justify-center content-center text-center">
          {error}
        </div>
      ) : (
        <>
          {/* Option Chain Bar Chart */}
          <div>
            <div className="flex items-center mb-2">
              <div className="text-lg font-bold text-blue-400">{isMobile ? 'OI' : 'Open Interest'}</div>
              <div className="flex items-center gap-2 ml-4 flex-1 justify-end">
                <label className="flex items-center gap-1 mr-4">
                  <span className="text-sm text-neutral-400 select-none pr-1">Hide OI</span>
                  <input
                    type="checkbox"
                    checked={hideOI}
                    onChange={e => setHideOI(e.target.checked)}
                    className="accent-blue-500 w-4 h-4"
                  />
                </label>
                <div className="flex items-center">
                  <span className="hidden md:block text-sm text-neutral-400 mr-2">Change in OI since</span>
                  <RadioGroup value={oiChangeIndex} onChange={handleIntervalChange} className="flex gap-1 bg-neutral-800 rounded p-1">
                    {[{ label: '5', value: 0 }, { label: '15', value: 1 }, { label: '60', value: 2 }, { label: 'Close', value: 3 }].map(opt => (
                      <RadioGroup.Option key={opt.value} value={opt.value}>
                        {({ checked }) => (
                          <span
                            className={
                              'px-3 py-1 rounded font-medium cursor-pointer transition-colors text-sm md:text-base' +
                              (checked
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-transparent text-blue-400 hover:bg-blue-900/20')
                            }
                          >
                            {opt.label}{isMobile ? '' : opt.value < 3 ? ' Mins' : ''}
                          </span>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" aspect={isMobile ? 1.5 : 3}>
              <BarChart data={optionChainBarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <pattern id="slashPE" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(60)">
                    <rect width="4" height="4" fill="#AAFFAA" />
                    <line x1="0" y1="0" x2="0" y2="4" stroke="#009900" strokeWidth="2" />
                  </pattern>
                  <pattern id="slashCE" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(60)">
                    <rect width="4" height="4" fill="#FFAA99" />
                    <line x1="0" y1="0" x2="0" y2="4" stroke="#AA0000" strokeWidth="2" />
                  </pattern>
                </defs>
                <CartesianGrid stroke="#232526" />
                <XAxis dataKey="strike" stroke="#888" fontSize={12} angle={-45} textAnchor="end" height={60} />
                <YAxis stroke="#888" fontSize={12} tickFormatter={formatYAxisLabel} width={isMobile ? 40 : 60} />
                <RechartsTooltip cursor={<CenteredCursor />} content={CustomOIBarTooltip} />
                <Bar dataKey="PE OI" stackId="pe" fill="#55DD55" />
                <Bar dataKey="PE OI Change" stackId="pe" shape={props => <CustomBarWithPattern {...props} dataKey="PE OI Change" />} />
                <Bar dataKey="CE OI" stackId="ce" fill="#FF4444" />
                <Bar dataKey="CE OI Change" stackId="ce" shape={props => <CustomBarWithPattern {...props} dataKey="CE OI Change" />} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PCR Chart */}
          <div className="mb-8">
            <div className="text-lg font-bold text-blue-400 mb-2">Put/Call Ratio (PCR)</div>
            <ResponsiveContainer width="100%" aspect={isMobile ? 1.5 : 3}>
              <LineChart data={activeStrikesChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pcrGradient" x1="0" y1="0" x2="1" y2="0">
                    {pcrGradientStops.map((stop, idx) => (
                      <stop key={idx} offset={stop.offset} stopColor={stop.stopColor} />
                    ))}
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#232526" />
                <XAxis dataKey="time" stroke="#888" fontSize={12} />
                <YAxis yAxisId="left" stroke="#888" fontSize={12} domain={['auto', 'auto']} width={isMobile ? 40 : 60} />
                <YAxis yAxisId="right" orientation="right" hide={true} domain={['auto', 'auto']} />
                <RechartsTooltip content={CustomPCRTooltip} />
                <Legend content={CustomPCRLegend} />
                <Line yAxisId="left" type="monotone" dataKey="PCR" stroke="url(#pcrGradient)" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="Underlying" stroke="#777777" strokeWidth={1} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Active Strikes Chart */}
          <div className="mb-8">
            <div className="text-lg font-bold text-blue-400 mb-2">Active Strikes OI</div>
            {!hasSeries && <div className="text-red-400">No active strike series to plot.</div>}
            <ResponsiveContainer width="100%" aspect={isMobile ? 1.5 : 3}>
              <LineChart data={activeStrikesChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#232526" />
                <XAxis dataKey="time" stroke="#888" fontSize={12} />
                <YAxis yAxisId="left" stroke="#888" fontSize={12} tickFormatter={formatYAxisLabel} domain={['auto', 'auto']} width={isMobile ? 40 : 60} />
                <YAxis yAxisId="right" orientation="right" hide={true} domain={['auto', 'auto']} />
                <RechartsTooltip content={CustomActiveStrikesTooltip} />
                <Legend />
                {/* Active strike lines only */}
                {callsActiveData.map((call, idx) => (
                  <Line
                    key={call.scriptId}
                    yAxisId="left"
                    type="monotone"
                    dataKey={call.scriptId}
                    stroke={seriesColors[idx % seriesColors.length]}
                    strokeWidth={1}
                    dot={false}
                  />
                ))}
                {putsActiveData.map((put, idx) => (
                  <Line
                    key={put.scriptId}
                    yAxisId="left"
                    type="monotone"
                    dataKey={put.scriptId}
                    stroke={seriesColors[(idx + callsActiveData.length) % seriesColors.length]}
                    strokeWidth={1}
                    dot={false}
                  />
                ))}
                {/* Underlying price line */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="Underlying"
                  stroke="#FF4D9D"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default OptionChainAnalysisWidget; 
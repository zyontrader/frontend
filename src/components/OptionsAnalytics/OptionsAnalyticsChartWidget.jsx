import React, { useState, useMemo, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { getIsMobile } from '../../store/uiStore';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#1f2937',
        border: '1px solid #374151',
        borderRadius: '4px',
        padding: '8px',
        color: '#f9fafb'
      }}>
        <p style={{ margin: '0 0 4px 0', color: '#9ca3af' }}>
          Price: ₹{label?.toLocaleString('en-IN')}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{
            margin: '2px 0',
            color: entry.color,
            fontSize: '12px'
          }}>
            {entry.name}: ₹{entry.value?.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const OptionsAnalyticsChartWidget = React.memo(({ analyticsData, onPriceSelect }) => {
  // eslint-disable-next-line
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [crosshairX, setCrosshairX] = useState(null);
  const [clickedPrice, setClickedPrice] = useState(null);
  const isMobile = getIsMobile();

  // Call onPriceSelect when clickedPrice changes
  React.useEffect(() => {
    if (onPriceSelect && clickedPrice !== null) {
      onPriceSelect(clickedPrice);
    }
  }, [clickedPrice, onPriceSelect]);

  // Generate chart data from analyticsData
  const chartData = useMemo(() => {
    if (!analyticsData) return [];
    const data = [];
    const currentProj = analyticsData?.currentProjections || {};
    const expiryProj = analyticsData?.expiryProjections || {};
    Object.keys(currentProj).forEach(price => {
      data.push({
        price: parseFloat(price),
        currentProfit: currentProj[price].profit,
        expiryProfit: expiryProj[price]?.profit || 0
      });
    });
    const sortedData = data.sort((a, b) => a.price - b.price);
    return sortedData;
  }, [analyticsData]);

  // Get current price from analyticsData
  const currentPrice = analyticsData?.currentPrice;
  // Get underlying value from analyticsData
  const underlyingValue = analyticsData?.underlyingPrice;
  // Get underlying asset name from analyticsData
  const underlyingName = analyticsData?.underlying;

  // Calculate gradient stops based on profit values
  const gradientStops = useMemo(() => {
    if (!chartData.length) return [];
    // Create gradient stops based on profit values
    const stops = [];
    chartData.forEach((point, index) => {
      const percentage = index * 100 / chartData.length;
      const color = point.currentProfit >= 0 ? '#10b981' : '#ef4444';
      stops.push({
        offset: `${percentage}%`,
        stopColor: color
      });
    });
    return stops;
  }, [chartData]);

  // Memoize static objects
  const chartMargin = useMemo(() => ({ top: 20, right: 30, left: 20, bottom: 20 }), []);
  const legendStyle = useMemo(() => ({
    paddingTop: '10px',
    color: '#9ca3af',
    fontSize: '12px'
  }), []);

  // Memoize event handlers
  const handleMouseMove = useCallback((event) => {
    if (event && event.activePayload && event.activePayload[0]) {
      const price = event.activePayload[0].payload.price;
      setCrosshairX(price);
      setSelectedPrice(price);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCrosshairX(null);
    setSelectedPrice(null);
  }, []);

  const handleClick = useCallback((data) => {
    // Try different ways to get the price
    let price = null;

    // Method 1: Check if it's a direct click on a data point
    if (data && data.activePayload && data.activePayload[0]) {
      price = data.activePayload[0].payload.price;
    }
    // Method 2: Check if it's a click event with chart coordinates
    else if (data && data.chartX !== undefined && chartData.length > 0) {
      // Find closest point to clicked position
      const chartWidth = 400; // Approximate chart width
      const priceRange = chartData[chartData.length - 1].price - chartData[0].price;
      const clickedX = data.chartX;
      const xRatio = clickedX / chartWidth;
      const estimatedPrice = chartData[0].price + (priceRange * xRatio);

      // Find the closest actual data point
      let closestPrice = chartData[0].price;
      let minDistance = Math.abs(estimatedPrice - chartData[0].price);

      chartData.forEach(point => {
        const distance = Math.abs(estimatedPrice - point.price);
        if (distance < minDistance) {
          minDistance = distance;
          closestPrice = point.price;
        }
      });

      price = closestPrice;
    }
    // Method 3: Use activeLabel which contains the price
    else if (data && data.activeLabel !== undefined) {
      price = data.activeLabel;
    }
    // Method 4: Check if it's a mouse event
    else if (data && data.nativeEvent) {
      // For now, let's just select a middle point
      const middleIndex = Math.floor(chartData.length / 2);
      price = chartData[middleIndex].price;
    }

    if (price !== null) {
      setClickedPrice(price);
    } else {
    }
  }, [chartData]);

  // Memoize label objects
  const currentPriceLabel = useMemo(() => ({
    value: `${underlyingName}: ₹${underlyingValue?.toLocaleString('en-IN')}`,
    position: 'top',
    fill: '#6b7280',
    fontSize: 12,
    fontWeight: 'bold'
  }), [underlyingName, underlyingValue]);

  const clickedPriceLabel = useMemo(() => ({
    value: `Selected: ₹${clickedPrice?.toLocaleString('en-IN')}`,
    position: 'top',
    fill: '#ec4899',
    fontSize: 10,
    fontWeight: 'bold'
  }), [clickedPrice]);

  // Memoize tick formatters to prevent recreation
  const xAxisTickFormatter = useCallback((value) => `₹${value.toFixed(2).replace(/\.?0+$/, '')}`, []);
  const yAxisTickFormatter = useCallback((value) => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 1_000_000) {
      return `${sign}₹${(absValue / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (absValue >= 1_000) {
      return `${sign}₹${(absValue / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return `${sign}₹${absValue}`;
  }, []);

  // Memoize dot functions to prevent recreation on every render
  const currentProfitDot = useCallback((props) => {
    const { cx, cy, payload } = props;
    if (payload.price === clickedPrice || payload.price === currentPrice) {
      return (
        <g>
          <circle
            cx={cx}
            cy={cy}
            r={4}
            fill={payload.price === clickedPrice ? '#ec4899' : '#6b7280'}
            stroke="#ffffff"
            strokeWidth={2}
          />
          <text
            x={cx + 8}
            y={cy - 8}
            fontSize="10"
            fill={payload.price === clickedPrice ? '#ec4899' : '#6b7280'}
            fontWeight="bold"
          >
            ₹{payload.currentProfit.toLocaleString('en-IN')}
          </text>
        </g>
      );
    }
    return null;
  }, [clickedPrice, currentPrice]);

  const expiryProfitDot = useCallback((props) => {
    const { cx, cy, payload } = props;
    if (payload.price === clickedPrice || payload.price === currentPrice) {
      return (
        <g>
          <circle
            cx={cx}
            cy={cy}
            r={4}
            fill={payload.price === clickedPrice ? '#ec4899' : '#6b7280'}
            stroke="#ffffff"
            strokeWidth={2}
          />
          <text
            x={cx + 8}
            y={cy + 8}
            fontSize="10"
            fill={payload.price === clickedPrice ? '#ec4899' : '#6b7280'}
            fontWeight="bold"
          >
            ₹{payload.expiryProfit.toLocaleString('en-IN')}
          </text>
        </g>
      );
    }
    return null;
  }, [clickedPrice, currentPrice]);

  // Memoize activeDot functions
  const currentProfitActiveDot = useMemo(() => ({
    r: 4,
    fill: (entry) => entry.currentProfit >= 0 ? '#10b981' : '#ef4444',
    stroke: '#ffffff',
    strokeWidth: 2
  }), []);

  const expiryProfitActiveDot = useMemo(() => ({ 
    r: 4, 
    fill: '#8b5cf6', 
    stroke: '#ffffff', 
    strokeWidth: 2 
  }), []);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">No data available</div>
    );
  }

  return (
    <div className="relative md:h-[400px]">
      <ResponsiveContainer width="100%"
        height={isMobile ? null : "100%"}
        aspect={isMobile ? 1.5 : null}>
        <LineChart
          data={chartData}
          margin={chartMargin}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {/* SVG Definitions for gradient */}
          <defs>
            <linearGradient id="currentProfitGradient" x1="0" y1="0" x2="1" y2="0">
              {gradientStops.map((stop, index) => (
                <stop
                  key={index}
                  offset={stop.offset}
                  stopColor={stop.stopColor}
                />
              ))}
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            opacity={0.3}
          />

          <XAxis
            dataKey="price"
            tickFormatter={xAxisTickFormatter}
            stroke="#9ca3af"
            fontSize={12}
            tickLine={{ stroke: '#9ca3af' }}
            axisLine={{ stroke: '#374151' }}
          />

          <YAxis
            tickFormatter={yAxisTickFormatter}
            stroke="#9ca3af"
            width={isMobile ? 30 : 60}
            fontSize={12}
            tickLine={{ stroke: '#9ca3af' }}
            axisLine={{ stroke: '#374151' }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend wrapperStyle={legendStyle} />

          {/* Zero line */}
          <ReferenceLine
            y={0}
            stroke="#6b7280"
            strokeDasharray="3 3"
            strokeWidth={1}
          />

          {/* Current Price line */}
          <ReferenceLine
            x={currentPrice}
            stroke="#6b7280"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={currentPriceLabel}
          />

          {/* Crosshair */}
          {crosshairX && (
            <ReferenceLine
              x={crosshairX}
              stroke="#6b7280"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          )}

          {/* Clicked Price line */}
          {clickedPrice && (
            <ReferenceLine
              x={clickedPrice}
              stroke="#ec4899"
              strokeWidth={1}
              label={clickedPriceLabel}
            />
          )}

          {/* Current P&L line with dynamic gradient colors */}
          <Line
            type="monotone"
            dataKey="currentProfit"
            stroke="url(#currentProfitGradient)"
            strokeWidth={3}
            dot={currentProfitDot}
            activeDot={currentProfitActiveDot}
            name="Current P&L"
          />

          {/* Expiry P&L line */}
          <Line
            type="monotone"
            dataKey="expiryProfit"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={expiryProfitDot}
            activeDot={expiryProfitActiveDot}
            name="Expiry P&L"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

OptionsAnalyticsChartWidget.displayName = 'OptionsAnalyticsChartWidget';

export default OptionsAnalyticsChartWidget; 
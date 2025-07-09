import React from 'react';
import { Card } from 'antd';
import { formatPrice } from '../../utils/formatter';

const OptionsAnalyticsStatsWidget = ({ analyticsData, selectedPrice }) => {
  if (!analyticsData) {
    return (
      <Card className="mb-4">
        <div className="text-center py-8 text-gray-400">No data available</div>
      </Card>
    );
  }

  // Extract data from analyticsData
  const { maxProfit, maxLoss, breakEvens, currentPrice } = analyticsData;

  // Calculate Greeks based on selected price (simplified calculations)
  const calculateGreeks = (price) => {
    if (!price || !analyticsData.currentProjections || !analyticsData.currentProjections[price]) {
      return { delta: 0, theta: 0, gamma: 0, vega: 0 };
    }

    const currentData = analyticsData.currentProjections[price];

    // Simplified Greek calculations (in a real implementation, these would be more complex)
    // For now, using placeholder calculations based on the data structure
    const delta = currentData.delta || 0;
    const theta = currentData.theta || 0;
    const gamma = currentData.gamma || 0;
    const vega = currentData.vega || 0;

    return { delta, theta, gamma, vega };
  };

  const greeks = calculateGreeks(selectedPrice || currentPrice);

  return (
    <div className="bg-neutral-900 shadow-lg rounded-lg p-3 mb-3 border border-neutral-700">
      <div className="flex gap-8">
        {/* Left Section: Max Profit, Max Loss, Breakeven */}
        <div className="flex-1">
          <div className="space-y-1 md:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Max Profit:</span>
              <span className="text-sm font-medium text-price-green">
                {maxProfit ? '₹' + formatPrice(maxProfit) : 'Unlimited'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Max Loss:</span>
              <span className="text-sm font-medium text-price-red">
                {maxLoss ? '₹' + formatPrice(maxLoss) : 'Unlimited'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Breakeven:</span>
              <span className="text-sm font-medium text-neutral-400">
                {breakEvens && breakEvens.length > 0
                  ? breakEvens.map(be => `₹${formatPrice(be)}`).join(', ')
                  : '--'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Greeks */}
        <div className="flex-1">
          <div className="space-y-1 md:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Delta:</span>
              <span className={`text-sm font-medium ${greeks.delta >= 0 ? 'text-price-green' : 'text-price-red'}`}>
                {formatPrice(greeks.delta)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Theta:</span>
              <span className={`text-sm font-medium ${greeks.theta >= 0 ? 'text-price-green' : 'text-price-red'}`}>
                {formatPrice(greeks.theta)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Gamma:</span>
              <span className={`text-sm font-medium ${greeks.gamma >= 0 ? 'text-price-green' : 'text-price-red'}`}>
                {formatPrice(greeks.gamma)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Vega:</span>
              <span className={`text-sm font-medium ${greeks.vega >= 0 ? 'text-price-green' : 'text-price-red'}`}>
                {formatPrice(greeks.vega)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsAnalyticsStatsWidget; 
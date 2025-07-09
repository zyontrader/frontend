import React from 'react';
import { Card } from 'antd';
import { formatPrice } from '../../utils/formatter';

const TopMoverCarouselItem = ({ scriptId, price, change, changePct, volume }) => {
  const isPositive = change > 0;
  return (
    <Card
      className={`w-48 m-2 flex flex-col items-center justify-center ${isPositive ? 'border-green-500' : 'border-red-500'}`}
      bordered
      size="small"
      bodyStyle={{ padding: 12 }}
    >
      <div className="text-base font-semibold text-gray-800 mb-1">{scriptId}</div>
      <div className="text-xl font-bold text-gray-900 mb-1">{formatPrice(typeof price === 'object' ? price.parsedValue : price)}</div>
      <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}
        >{isPositive ? '+' : ''}{formatPrice(typeof change === 'object' ? change.parsedValue : change)}
        <span className="ml-1">({isPositive ? '+' : ''}{formatPrice(changePct)}%)</span>
      </div>
      {volume !== undefined && (
        <div className="text-xs text-gray-400 mt-1">Vol: {formatPrice(typeof volume === 'object' ? volume.parsedValue : volume)}</div>
      )}
    </Card>
  );
};

export default TopMoverCarouselItem; 
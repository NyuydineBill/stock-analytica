import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StockPriceData {
  date: string;
  price: number;
  volume: number;
}

interface StockPriceChartProps {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  className?: string;
}

const StockPriceChart: React.FC<StockPriceChartProps> = ({
  symbol,
  name,
  currentPrice,
  priceChange,
  priceChangePercent,
  className = ""
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'MAX'>('1Y');
  const [chartData, setChartData] = useState<StockPriceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data generation based on selected period
  const generateMockData = (period: string) => {
    const data: StockPriceData[] = [];
    const now = new Date();
    let days = 0;
    let interval = 1;

    switch (period) {
      case '1D':
        days = 1;
        interval = 0.25; // 15-minute intervals
        break;
      case '5D':
        days = 5;
        interval = 1;
        break;
      case '1M':
        days = 30;
        interval = 1;
        break;
      case '3M':
        days = 90;
        interval = 1;
        break;
      case '6M':
        days = 180;
        interval = 1;
        break;
      case '1Y':
        days = 365;
        interval = 7; // Weekly data
        break;
      case '3Y':
        days = 1095;
        interval = 30; // Monthly data
        break;
      case '5Y':
        days = 1825;
        interval = 30; // Monthly data
        break;
      case 'MAX':
        days = 2555; // ~7 years
        interval = 30; // Monthly data
        break;
    }

    const basePrice = currentPrice - priceChange;
    const volatility = 0.02; // 2% daily volatility

    for (let i = days; i >= 0; i -= interval) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate realistic price movement
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = basePrice * (1 + randomChange + (i / days) * (priceChange / basePrice));
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.max(price, 0.01), // Ensure positive price
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }

    return data;
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setChartData(generateMockData(selectedPeriod));
      setIsLoading(false);
    }, 500);
  }, [selectedPeriod, currentPrice, priceChange]);

  const periods = [
    { key: '1D', label: '1D' },
    { key: '5D', label: '5D' },
    { key: '1M', label: '1M' },
    { key: '3M', label: '3M' },
    { key: '6M', label: '6M' },
    { key: '1Y', label: '1Y' },
    { key: '3Y', label: '3Y' },
    { key: '5Y', label: '5Y' },
    { key: 'MAX', label: 'MAX' }
  ];

  const isPositive = priceChange >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeIcon = isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;

  const maxPrice = Math.max(...chartData.map(d => d.price));
  const minPrice = Math.min(...chartData.map(d => d.price));
  const priceRange = maxPrice - minPrice;

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">{symbol}</CardTitle>
            <p className="text-gray-600">{name}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${currentPrice.toFixed(2)}</div>
            <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
              {changeIcon}
              <span>{isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Time Period Selector */}
        <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-lg">
          {periods.map((period) => (
            <Button
              key={period.key}
              variant={selectedPeriod === period.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod(period.key as any)}
              className={`text-xs px-3 py-1 ${
                selectedPeriod === period.key 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <div className="relative">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="h-64 relative">
              {/* Price Chart */}
              <svg className="w-full h-full" viewBox={`0 0 ${chartData.length * 10} 240`}>
                <defs>
                  <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.3"/>
                    <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                
                {/* Area fill */}
                <path
                  d={chartData.map((point, index) => {
                    const x = index * 10;
                    const y = 240 - ((point.price - minPrice) / priceRange) * 200;
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="url(#priceGradient)"
                  stroke={isPositive ? "#10B981" : "#EF4444"}
                  strokeWidth="2"
                  fillOpacity="0.3"
                />
                
                {/* Line chart */}
                <path
                  d={chartData.map((point, index) => {
                    const x = index * 10;
                    const y = 240 - ((point.price - minPrice) / priceRange) * 200;
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke={isPositive ? "#10B981" : "#EF4444"}
                  strokeWidth="2"
                />
              </svg>

              {/* Price labels */}
              <div className="absolute top-0 right-0 text-xs text-gray-500">
                ${maxPrice.toFixed(2)}
              </div>
              <div className="absolute bottom-0 right-0 text-xs text-gray-500">
                ${minPrice.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Volume Chart (for longer periods) */}
        {selectedPeriod !== '1D' && selectedPeriod !== '5D' && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Volume</div>
            <div className="h-16 flex items-end gap-1">
              {chartData.slice(-20).map((point, index) => {
                const maxVolume = Math.max(...chartData.map(d => d.volume));
                const height = (point.volume / maxVolume) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 bg-gray-300 rounded-sm hover:bg-gray-400 transition-colors"
                    style={{ height: `${height}%` }}
                    title={`${point.date}: ${point.volume.toLocaleString()} volume`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Chart Info */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Open:</span>
            <span className="ml-2 font-medium">${chartData[0]?.price.toFixed(2) || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500">High:</span>
            <span className="ml-2 font-medium">${maxPrice.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">Low:</span>
            <span className="ml-2 font-medium">${minPrice.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">Volume:</span>
            <span className="ml-2 font-medium">
              {chartData[chartData.length - 1]?.volume.toLocaleString() || 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockPriceChart; 
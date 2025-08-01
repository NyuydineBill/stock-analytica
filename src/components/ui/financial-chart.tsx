import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChartDataPoint {
  year: string;
  value: number;
}

interface FinancialChartProps {
  type: 'line' | 'bar';
  title: string;
  metric: string;
  change: string;
  data: ChartDataPoint[];
  className?: string;
}

const FinancialChart: React.FC<FinancialChartProps> = ({
  type,
  title,
  metric,
  change,
  data,
  className = ""
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  const isPositiveChange = change.includes('+');
  const changeColor = isPositiveChange ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="font-semibold text-gray-900 text-lg mb-1">{title}</h4>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">{metric}</span>
            <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{change}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-40 flex items-end justify-between gap-3">
        {data.map((point, index) => {
          const height = range > 0 ? ((point.value - minValue) / range) * 100 : 50;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              {type === 'line' ? (
                <div className="relative w-full">
                  {/* Line chart - simplified version */}
                  <div 
                    className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600" 
                    style={{ height: `${height}%` }}
                  />
                  {/* Add connecting lines for line chart effect */}
                  {index < data.length - 1 && (
                    <div 
                      className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 transform -translate-y-1"
                      style={{ 
                        height: '2px',
                        top: `${height}%`,
                        transform: 'translateY(-50%)'
                      }}
                    />
                  )}
                </div>
              ) : (
                <div 
                  className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600" 
                  style={{ height: `${height}%` }}
                />
              )}
              <span className="text-xs text-gray-600 mt-2 font-medium">{point.year}</span>
              <span className="text-xs text-gray-500 mt-1">{point.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialChart; 
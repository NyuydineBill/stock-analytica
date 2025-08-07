import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';

interface HighlightedPeriod {
  startDate: string;
  endDate: string;
  priceChange: number;
  volumeChange: number;
  newsEvents: NewsEvent[];
}

interface NewsEvent {
  date: string;
  title: string;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
  source: string;
}

interface ChartHighlightingProps {
  symbol: string;
  className?: string;
}

const ChartHighlighting: React.FC<ChartHighlightingProps> = ({ symbol, className = "" }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<HighlightedPeriod | null>(null);
  const [isHighlighting, setIsHighlighting] = useState(false);

  // Mock highlighted periods - in real implementation, this would be generated from user interactions
  const highlightedPeriods: HighlightedPeriod[] = [
    {
      startDate: '2023-07-01',
      endDate: '2023-12-31',
      priceChange: 15.2,
      volumeChange: 25.8,
      newsEvents: [
        {
          date: '2023-10-15',
          title: 'Q3 Earnings Beat Expectations',
          summary: 'Company reported strong Q3 results with revenue growth of 12% and EPS of $2.45, beating analyst estimates.',
          impact: 'positive',
          source: 'Financial Times'
        },
        {
          date: '2023-11-20',
          title: 'New Product Launch',
          summary: 'Major product announcement drove significant market interest and analyst upgrades.',
          impact: 'positive',
          source: 'Reuters'
        },
        {
          date: '2023-12-05',
          title: 'Regulatory Concerns',
          summary: 'Regulatory investigation announcement caused temporary price volatility.',
          impact: 'negative',
          source: 'Wall Street Journal'
        }
      ]
    },
    {
      startDate: '2023-01-01',
      endDate: '2023-06-30',
      priceChange: -8.5,
      volumeChange: -12.3,
      newsEvents: [
        {
          date: '2023-02-15',
          title: 'Supply Chain Issues',
          summary: 'Supply chain disruptions impacted production and delivery timelines.',
          impact: 'negative',
          source: 'Bloomberg'
        },
        {
          date: '2023-04-10',
          title: 'Competitor Launch',
          summary: 'Major competitor launched rival product, creating market pressure.',
          impact: 'negative',
          source: 'TechCrunch'
        },
        {
          date: '2023-06-01',
          title: 'Market Recovery',
          summary: 'Market sentiment improved as supply chain issues began to resolve.',
          impact: 'positive',
          source: 'MarketWatch'
        }
      ]
    }
  ];

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Chart Period Analysis</CardTitle>
            <p className="text-gray-600">Highlight chart periods to see news and events</p>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">Future Feature</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">How to Use</h4>
          </div>
          <p className="text-sm text-gray-700">
            Click and drag on the stock price chart above to highlight a specific time period. 
            The system will automatically analyze news events and market developments during that period 
            to explain price movements and provide context for the highlighted timeframe.
          </p>
        </div>

        {/* Sample Highlighted Periods */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Periods (Future Feature)</h3>
          
          {highlightedPeriods.map((period, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {Math.abs(period.priceChange).toFixed(1)}% {period.priceChange >= 0 ? 'gain' : 'loss'}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPeriod(selectedPeriod === period ? null : period)}
                >
                  {selectedPeriod === period ? 'Hide' : 'View'} Details
                </Button>
              </div>

              {selectedPeriod === period && (
                <div className="mt-4 space-y-4">
                  {/* Period Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-lg font-bold ${period.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {period.priceChange >= 0 ? '+' : ''}{period.priceChange.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Price Change</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {period.volumeChange >= 0 ? '+' : ''}{period.volumeChange.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Volume Change</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {period.newsEvents.length}
                      </div>
                      <div className="text-xs text-gray-600">News Events</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {period.newsEvents.filter(e => e.impact === 'positive').length}
                      </div>
                      <div className="text-xs text-gray-600">Positive Events</div>
                    </div>
                  </div>

                  {/* News Events */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Events During Period</h4>
                    <div className="space-y-3">
                      {period.newsEvents.map((event, eventIndex) => (
                        <div key={eventIndex} className="border-l-4 border-gray-200 pl-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getImpactIcon(event.impact)}
                              <h5 className="font-medium text-gray-900">{event.title}</h5>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{event.date}</span>
                              <Badge className={`text-xs ${getImpactColor(event.impact)}`}>
                                {event.impact}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{event.summary}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {event.source}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">AI Analysis Summary</h4>
                    <p className="text-sm text-gray-700">
                      During this {Math.abs(period.priceChange).toFixed(1)}% {period.priceChange >= 0 ? 'price increase' : 'price decline'}, 
                      {period.newsEvents.filter(e => e.impact === 'positive').length} positive events and 
                      {period.newsEvents.filter(e => e.impact === 'negative').length} negative events occurred. 
                      The most significant driver was {period.newsEvents.reduce((max, event) => 
                        event.impact === 'positive' ? event : max).title.toLowerCase()}, 
                      which {period.priceChange >= 0 ? 'contributed to the upward momentum' : 'created downward pressure'} 
                      during this period.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Future Features */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h4 className="font-semibold text-gray-900">Coming Soon</h4>
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Interactive chart highlighting with mouse drag</li>
            <li>• Real-time news analysis for selected periods</li>
            <li>• AI-powered event correlation with price movements</li>
            <li>• Export highlighted periods with analysis</li>
            <li>• Custom date range selection</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartHighlighting; 
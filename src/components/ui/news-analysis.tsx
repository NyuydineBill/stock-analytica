import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Calendar, Target, Zap } from 'lucide-react';

interface NewsItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  source: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: 'high' | 'medium' | 'low';
  priceImpact: number; // Expected price impact in percentage
  timeframe: 'immediate' | 'short-term' | 'long-term';
  category: 'earnings' | 'regulatory' | 'market' | 'product' | 'management' | 'economic';
}

interface NewsAnalysisProps {
  symbol: string;
  name: string;
  className?: string;
}

const NewsAnalysis: React.FC<NewsAnalysisProps> = ({ symbol, name, className = "" }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'immediate' | 'short-term' | 'long-term'>('all');
  const [selectedImpact, setSelectedImpact] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  // Mock news data - in real implementation, this would come from a news API
  const mockNewsData: NewsItem[] = [
    {
      id: '1',
      date: '2024-01-15',
      title: 'Strong Q4 Earnings Beat Expectations',
      summary: 'Company reported Q4 earnings of $2.45 per share, beating analyst estimates of $2.30. Revenue grew 15% year-over-year.',
      source: 'Financial Times',
      impact: 'positive',
      confidence: 'high',
      priceImpact: 8.5,
      timeframe: 'immediate',
      category: 'earnings'
    },
    {
      id: '2',
      date: '2024-01-14',
      title: 'New Product Launch Announced',
      summary: 'Company announced revolutionary new product line expected to generate $500M in additional revenue over next 18 months.',
      source: 'Reuters',
      impact: 'positive',
      confidence: 'medium',
      priceImpact: 12.0,
      timeframe: 'short-term',
      category: 'product'
    },
    {
      id: '3',
      date: '2024-01-13',
      title: 'Regulatory Investigation Initiated',
      summary: 'Federal regulators announced investigation into business practices. Potential fines could reach $100M.',
      source: 'Wall Street Journal',
      impact: 'negative',
      confidence: 'high',
      priceImpact: -5.2,
      timeframe: 'short-term',
      category: 'regulatory'
    },
    {
      id: '4',
      date: '2024-01-12',
      title: 'CEO Announces Retirement',
      summary: 'Long-time CEO announced retirement effective end of year. Succession plan in place with internal candidate.',
      source: 'Bloomberg',
      impact: 'neutral',
      confidence: 'medium',
      priceImpact: -1.5,
      timeframe: 'long-term',
      category: 'management'
    },
    {
      id: '5',
      date: '2024-01-11',
      title: 'Market Share Gains in Key Segment',
      summary: 'Company gained 3% market share in core business segment, now leading with 28% market share.',
      source: 'MarketWatch',
      impact: 'positive',
      confidence: 'high',
      priceImpact: 6.8,
      timeframe: 'short-term',
      category: 'market'
    },
    {
      id: '6',
      date: '2024-01-10',
      title: 'Supply Chain Disruption Resolved',
      summary: 'Major supply chain issue resolved ahead of schedule. Production back to full capacity.',
      source: 'CNBC',
      impact: 'positive',
      confidence: 'medium',
      priceImpact: 3.2,
      timeframe: 'immediate',
      category: 'product'
    },
    {
      id: '7',
      date: '2024-01-09',
      title: 'Interest Rate Impact Analysis',
      summary: 'Analysis shows company well-positioned for current interest rate environment with strong cash flow.',
      source: 'Barron\'s',
      impact: 'positive',
      confidence: 'low',
      priceImpact: 2.1,
      timeframe: 'long-term',
      category: 'economic'
    },
    {
      id: '8',
      date: '2024-01-08',
      title: 'Competitor Launches Rival Product',
      summary: 'Major competitor announced new product that directly competes with company\'s flagship offering.',
      source: 'TechCrunch',
      impact: 'negative',
      confidence: 'medium',
      priceImpact: -4.7,
      timeframe: 'short-term',
      category: 'market'
    }
  ];

  const filteredNews = mockNewsData.filter(news => {
    const timeframeMatch = selectedTimeframe === 'all' || news.timeframe === selectedTimeframe;
    const impactMatch = selectedImpact === 'all' || news.impact === selectedImpact;
    return timeframeMatch && impactMatch;
  });

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

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'earnings':
        return 'bg-blue-100 text-blue-800';
      case 'regulatory':
        return 'bg-red-100 text-red-800';
      case 'market':
        return 'bg-purple-100 text-purple-800';
      case 'product':
        return 'bg-green-100 text-green-800';
      case 'management':
        return 'bg-orange-100 text-orange-800';
      case 'economic':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate':
        return 'bg-red-100 text-red-800';
      case 'short-term':
        return 'bg-yellow-100 text-yellow-800';
      case 'long-term':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate aggregate impact
  const aggregateImpact = filteredNews.reduce((sum, news) => sum + news.priceImpact, 0);
  const positiveNews = filteredNews.filter(news => news.impact === 'positive').length;
  const negativeNews = filteredNews.filter(news => news.impact === 'negative').length;
  const neutralNews = filteredNews.filter(news => news.impact === 'neutral').length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">News Analysis</CardTitle>
            <p className="text-gray-600">Recent developments and their impact on {symbol}</p>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">Next 12 months</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className={`text-2xl font-bold ${aggregateImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {aggregateImpact >= 0 ? '+' : ''}{aggregateImpact.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Expected Impact</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{positiveNews}</div>
            <div className="text-sm text-gray-600">Positive News</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{negativeNews}</div>
            <div className="text-sm text-gray-600">Negative News</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{neutralNews}</div>
            <div className="text-sm text-gray-600">Neutral News</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Timeframe:</span>
            {['all', 'immediate', 'short-term', 'long-term'].map(timeframe => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe as any)}
                className="text-xs"
              >
                {timeframe === 'all' ? 'All' : 
                 timeframe === 'immediate' ? 'Immediate' :
                 timeframe === 'short-term' ? 'Short-term' : 'Long-term'}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Impact:</span>
            {['all', 'positive', 'negative', 'neutral'].map(impact => (
              <Button
                key={impact}
                variant={selectedImpact === impact ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedImpact(impact as any)}
                className="text-xs"
              >
                {impact.charAt(0).toUpperCase() + impact.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* News List */}
        <div className="space-y-4">
          {filteredNews.map((news) => (
            <div key={news.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getImpactIcon(news.impact)}
                  <h4 className="font-semibold text-gray-900">{news.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getConfidenceColor(news.confidence)}>
                    {news.confidence} confidence
                  </Badge>
                  <Badge className={getTimeframeColor(news.timeframe)}>
                    {news.timeframe}
                  </Badge>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{news.summary}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(news.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {news.source}
                  </div>
                  <Badge className={getCategoryColor(news.category)}>
                    {news.category}
                  </Badge>
                </div>
                
                <div className={`text-lg font-bold ${news.priceImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {news.priceImpact >= 0 ? '+' : ''}{news.priceImpact.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Analysis Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">AI Analysis Summary</h4>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            Based on recent news analysis, {symbol} is expected to experience a {aggregateImpact >= 0 ? 'positive' : 'negative'} 
            impact of approximately {Math.abs(aggregateImpact).toFixed(1)}% over the next 12 months. Key drivers include 
            {positiveNews > 0 ? ` ${positiveNews} positive developments` : ''}
            {negativeNews > 0 ? ` and ${negativeNews} negative factors` : ''}. 
            The most significant impact is expected from {filteredNews.length > 0 ? 
              filteredNews.reduce((max, news) => Math.abs(news.priceImpact) > Math.abs(max.priceImpact) ? news : max).title.toLowerCase() : 
              'ongoing market conditions'}. 
            Investors should monitor {filteredNews.filter(n => n.confidence === 'high').length > 0 ? 
              'high-confidence developments' : 'market conditions'} closely.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsAnalysis; 
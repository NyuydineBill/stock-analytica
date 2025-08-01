import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Target, 
  Zap,
  FileText,
  Download,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Globe,
  Newspaper,
  Users,
  Activity
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface EarningsData {
  symbol: string;
  companyName: string;
  reportDate: string;
  quarter: string;
  fiscalYear: string;
  status: 'upcoming' | 'released' | 'missed';
  expectedEPS: number;
  actualEPS?: number;
  expectedRevenue: number;
  actualRevenue?: number;
  priceChange: number;
  priceChangePercent: number;
  marketCap: number;
  sector: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  analystRating: 'buy' | 'hold' | 'sell';
  surprisePercent?: number;
}

interface MarketSentiment {
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  sources: string[];
  keyMetrics: {
    positiveNews: number;
    negativeNews: number;
    neutralNews: number;
    analystUpgrades: number;
    analystDowngrades: number;
  };
}

const EarningsAnalysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('earnings');

  // Mock data for earnings
  const earningsData: EarningsData[] = [
    {
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      reportDate: '2024-01-25',
      quarter: 'Q1 2024',
      fiscalYear: '2024',
      status: 'released',
      expectedEPS: 2.10,
      actualEPS: 2.18,
      expectedRevenue: 117.9,
      actualRevenue: 119.6,
      priceChange: 3.45,
      priceChangePercent: 2.1,
      marketCap: 3000000000000,
      sector: 'Technology',
      sentiment: 'positive',
      analystRating: 'buy',
      surprisePercent: 3.8
    },
    {
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      reportDate: '2024-01-30',
      quarter: 'Q2 2024',
      fiscalYear: '2024',
      status: 'upcoming',
      expectedEPS: 2.78,
      expectedRevenue: 61.1,
      priceChange: 0,
      priceChangePercent: 0,
      marketCap: 2800000000000,
      sector: 'Technology',
      sentiment: 'neutral',
      analystRating: 'buy'
    },
    {
      symbol: 'TSLA',
      companyName: 'Tesla, Inc.',
      reportDate: '2024-01-24',
      quarter: 'Q4 2023',
      fiscalYear: '2023',
      status: 'released',
      expectedEPS: 0.73,
      actualEPS: 0.71,
      expectedRevenue: 25.6,
      actualRevenue: 25.2,
      priceChange: -12.30,
      priceChangePercent: -5.2,
      marketCap: 800000000000,
      sector: 'Automotive',
      sentiment: 'negative',
      analystRating: 'hold',
      surprisePercent: -2.7
    }
  ];

  const marketSentiment: MarketSentiment = {
    overallSentiment: 'bullish',
    confidence: 78,
    sources: ['Reuters', 'Bloomberg', 'CNBC', 'MarketWatch', 'Yahoo Finance'],
    keyMetrics: {
      positiveNews: 156,
      negativeNews: 89,
      neutralNews: 234,
      analystUpgrades: 23,
      analystDowngrades: 8
    }
  };

  const quarters = [
    { value: 'q1-2024', label: 'Q1 2024' },
    { value: 'q4-2023', label: 'Q4 2023' },
    { value: 'q3-2023', label: 'Q3 2023' },
    { value: 'q2-2023', label: 'Q2 2023' }
  ];

  const handleEarningsAnalysis = () => {
    if (!selectedStock || !selectedQuarter) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleViewDetails = (symbol: string) => {
    toast({
      title: "Navigating to Analysis",
      description: `Opening detailed analysis for ${symbol}`,
    });
    navigate(`/analyze/${symbol}`);
  };

  const handleGenerateReport = (symbol: string) => {
    toast({
      title: "Generating Report",
      description: `Creating research report for ${symbol}`,
    });
    navigate(`/report/${symbol}`);
  };

  const handleViewReport = () => {
    if (selectedStock) {
      toast({
        title: "Opening Report",
        description: `Viewing earnings report for ${selectedStock}`,
      });
      navigate(`/report/${selectedStock}`);
    }
  };

  const handleUpdateSentiment = () => {
    toast({
      title: "Updating Sentiment",
      description: "Refreshing market sentiment data...",
    });
    // In a real app, this would call an API
  };

  const handleViewDetailedAnalysis = () => {
    toast({
      title: "Detailed Analysis",
      description: "Opening comprehensive sentiment analysis view",
    });
    // In a real app, this would open a detailed view
  };

  const handleAnalystActivity = () => {
    toast({
      title: "Analyst Activity",
      description: "Loading analyst activity and rating changes",
    });
    // In a real app, this would open analyst activity view
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'released':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'upcoming':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'missed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Earnings Analysis</h1>
              <p className="text-gray-600">Analyze quarterly earnings and market sentiment</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="earnings">Earnings Calendar</TabsTrigger>
            <TabsTrigger value="analysis">Earnings Analysis</TabsTrigger>
            <TabsTrigger value="sentiment">Market Sentiment</TabsTrigger>
          </TabsList>

          {/* Earnings Calendar Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Upcoming Earnings</CardTitle>
                <CardDescription>Track earnings releases and key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.map((earnings, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{earnings.symbol}</h3>
                            <p className="text-sm text-gray-600">{earnings.companyName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(earnings.status)}
                          <Badge variant="outline" className={getSentimentColor(earnings.sentiment)}>
                            {earnings.sentiment}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Report Date</p>
                          <p className="font-medium text-gray-900">{earnings.reportDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Quarter</p>
                          <p className="font-medium text-gray-900">{earnings.quarter}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Expected EPS</p>
                          <p className="font-medium text-gray-900">${earnings.expectedEPS}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Expected Revenue</p>
                          <p className="font-medium text-gray-900">${earnings.expectedRevenue}B</p>
                        </div>
                      </div>

                      {earnings.status === 'released' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-sm text-gray-600">Actual EPS</p>
                            <p className="font-medium text-gray-900">${earnings.actualEPS}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Actual Revenue</p>
                            <p className="font-medium text-gray-900">${earnings.actualRevenue}B</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Surprise</p>
                            <p className={`font-medium ${earnings.surprisePercent && earnings.surprisePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {earnings.surprisePercent && earnings.surprisePercent > 0 ? '+' : ''}{earnings.surprisePercent}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Price Change</p>
                            <p className={`font-medium ${earnings.priceChangePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {earnings.priceChangePercent > 0 ? '+' : ''}{earnings.priceChangePercent}%
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          onClick={() => handleViewDetails(earnings.symbol)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          onClick={() => handleGenerateReport(earnings.symbol)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Earnings Analysis</CardTitle>
                <CardDescription>Analyze specific earnings releases and their impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stock-select">Select Stock</Label>
                      <Select value={selectedStock} onValueChange={setSelectedStock}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a stock..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AAPL">AAPL - Apple Inc.</SelectItem>
                          <SelectItem value="MSFT">MSFT - Microsoft Corporation</SelectItem>
                          <SelectItem value="TSLA">TSLA - Tesla, Inc.</SelectItem>
                          <SelectItem value="GOOGL">GOOGL - Alphabet Inc.</SelectItem>
                          <SelectItem value="AMZN">AMZN - Amazon.com, Inc.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="quarter-select">Select Quarter</Label>
                      <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a quarter..." />
                        </SelectTrigger>
                        <SelectContent>
                          {quarters.map((quarter) => (
                            <SelectItem key={quarter.value} value={quarter.value}>
                              {quarter.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleEarningsAnalysis}
                      disabled={!selectedStock || !selectedQuarter || isAnalyzing}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Earnings'}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {isAnalyzing && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Analysis Progress</span>
                          <span className="text-sm text-gray-600">{analysisProgress}%</span>
                        </div>
                        <Progress value={analysisProgress} className="w-full" />
                        <div className="text-sm text-gray-600">
                          {analysisProgress < 30 && "Gathering earnings data..."}
                          {analysisProgress >= 30 && analysisProgress < 60 && "Analyzing financial metrics..."}
                          {analysisProgress >= 60 && analysisProgress < 90 && "Processing market sentiment..."}
                          {analysisProgress >= 90 && "Generating comprehensive report..."}
                        </div>
                      </div>
                    )}

                    {!isAnalyzing && analysisProgress === 100 && (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-800">Analysis Complete</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            Comprehensive earnings analysis report generated successfully.
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={handleViewReport}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Report
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                              toast({
                                title: "Downloading PDF",
                                description: "Preparing earnings analysis report for download",
                              });
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Sentiment Tab */}
          <TabsContent value="sentiment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Market Sentiment Analysis</CardTitle>
                <CardDescription>Overall market sentiment and analyst activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Overall Sentiment */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Overall Market Sentiment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                          marketSentiment.overallSentiment === 'bullish' ? 'bg-green-100' :
                          marketSentiment.overallSentiment === 'bearish' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {marketSentiment.overallSentiment === 'bullish' ? (
                            <TrendingUp className="w-10 h-10 text-green-600" />
                          ) : marketSentiment.overallSentiment === 'bearish' ? (
                            <TrendingDown className="w-10 h-10 text-red-600" />
                          ) : (
                            <Activity className="w-10 h-10 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 capitalize">{marketSentiment.overallSentiment}</h3>
                          <p className="text-sm text-gray-600">Confidence: {marketSentiment.confidence}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Metrics */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Positive News</span>
                          <span className="font-medium text-green-600">{marketSentiment.keyMetrics.positiveNews}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Negative News</span>
                          <span className="font-medium text-red-600">{marketSentiment.keyMetrics.negativeNews}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Neutral News</span>
                          <span className="font-medium text-gray-600">{marketSentiment.keyMetrics.neutralNews}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Analyst Upgrades</span>
                          <span className="font-medium text-green-600">{marketSentiment.keyMetrics.analystUpgrades}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Analyst Downgrades</span>
                          <span className="font-medium text-red-600">{marketSentiment.keyMetrics.analystDowngrades}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Data Sources */}
                <Card className="border-0 shadow-sm mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Data Sources</CardTitle>
                    <CardDescription>News and analysis sources used for sentiment analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {marketSentiment.sources.map((source, index) => (
                        <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                          <Newspaper className="w-3 h-3 mr-1" />
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleUpdateSentiment}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Update Sentiment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={handleViewDetailedAnalysis}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Detailed Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={handleAnalystActivity}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Analyst Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EarningsAnalysis; 
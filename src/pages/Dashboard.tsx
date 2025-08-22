import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import UploadZone from "@/components/ui/upload-zone";
import StockCard from "@/components/ui/stock-card";
import { FileText, TrendingUp, BarChart3, Upload, Sparkles, Target, Zap, DollarSign, TrendingDown, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockStocks, mockPortfolio, sectorPerformance } from "@/data/mockData";
import ExcelUpload from "@/components/ui/excel-upload";
import { useDashboard } from "@/hooks/useDashboard";

interface Stock {
  symbol: string;
  name: string;
  sector?: string;
  exchange?: string;
  country?: string;
  rating?: number;
  hasReport?: boolean;
  currentPrice?: number;
  priceChange?: number;
  priceChangePercent?: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [showExcelUpload, setShowExcelUpload] = useState(false);

  // Use the new dashboard hook
  const {
    uploadedStocks,
    selectedStocks,
    isUploading,
    stats,
    sectorPerformance: apiSectorPerformance,
    handleFileUpload,
    handleStockSelection,
    handleSelectAll,
    hasReport,
    getStockRating,
    setUploadedStocks,
    setSelectedStocks,
  } = useDashboard();

  const handleExcelUploadComplete = (stocks: any[]) => {
    setUploadedStocks(stocks.map(stock => ({
      id: Math.random(), // Temporary ID
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector,
      exchange: stock.exchange,
      country: stock.country,
      current_price: stock.price,
      price_change: 0,
      price_change_percent: 0,
      market_cap: "0",
      pe_ratio: null,
      dividend_yield: null,
      volume: 0,
    })));
    setShowExcelUpload(false);
  };

  const handleBatchAnalyze = () => {
    if (selectedStocks.length === 1) {
      // Single stock - navigate to regular analysis
      navigate(`/analyze/${selectedStocks[0]}`);
    } else if (selectedStocks.length > 1) {
      // Multiple stocks - navigate to batch analysis
      navigate('/batch-analyze', { 
        state: { 
          selectedStocks: selectedStocks,
          stocksData: uploadedStocks.filter(stock => selectedStocks.includes(stock.symbol))
        }
      });
    }
  };

  // Use API data if available, fallback to mock data
  const sectorData = apiSectorPerformance.length > 0 ? apiSectorPerformance : sectorPerformance;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {/* <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          AI-Powered Equity Research
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Transform Your Stock Analysis
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload your Excel stock list and generate professional equity research reports using advanced AI analysis. 
          Get institutional-grade insights in minutes, not hours.
        </p>
      </div> */}

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
              <div className="p-2 rounded-lg bg-blue-600 shadow-md group-hover:scale-110 transition-transform duration-200">
                {index === 0 && <BarChart3 className="h-4 w-4 text-white" />}
                {index === 1 && <FileText className="h-4 w-4 text-white" />}
                {index === 2 && <TrendingUp className="h-4 w-4 text-white" />}
                {index === 3 && <DollarSign className="h-4 w-4 text-white" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-sm text-gray-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Overview */}
      {uploadedStocks.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Market Overview</CardTitle>
            <CardDescription className="text-gray-600">
              Sector performance and market trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sectorData.map((sector, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">{sector.sector}</h4>
                    <p className="text-sm text-gray-600">Sector performance</p>
                  </div>
                  <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                    {sector.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{sector.performance > 0 ? '+' : ''}{sector.performance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      {uploadedStocks.length === 0 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
            <p className="text-gray-600">
              Upload your Excel stock list to begin generating professional research reports
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <UploadZone 
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
              className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-200"
            />
          </div>
          
          {/* Features */}
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mt-12">
            <div className="text-center space-y-3">
              {/* <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div> */}
              <h3 className="font-semibold text-gray-900">Easy Upload</h3>
              <p className="text-sm text-gray-600">Drag & drop Excel files or browse to upload your stock list</p>
            </div>
            <div className="text-center space-y-3">
              {/* <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div> */}
              <h3 className="font-semibold text-gray-900">AI Analysis</h3>
              <p className="text-sm text-gray-600">Advanced AI generates comprehensive equity research reports</p>
            </div>
            <div className="text-center space-y-3">
              {/* <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div> */}
              <h3 className="font-semibold text-gray-900">Quick Results</h3>
              <p className="text-sm text-gray-600">Get professional reports in 3-5 minutes per stock</p>
            </div>
          </div>

          {/* Sample Report Button */}
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/report/AAPL')}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-600 transition-all duration-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Sample Research Report
            </Button>
          </div>
        </div>
      )}

      {/* Stock List */}
      {uploadedStocks.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Stock Universe</h2>
              <p className="text-gray-600">
                {uploadedStocks.length} stocks loaded from your file
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setUploadedStocks([])}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New File
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {uploadedStocks.map((stock, index) => (
              <div key={index} className="transform hover:scale-105 transition-transform duration-200">
                <StockCard
                  symbol={stock.symbol}
                  name={stock.name}
                  sector={stock.sector}
                  exchange={stock.exchange}
                  country={stock.country}
                  rating={getStockRating(stock.symbol)}
                  hasReport={hasReport(stock.symbol)}
                  currentPrice={stock.current_price}
                  priceChange={stock.price_change}
                  priceChangePercent={stock.price_change_percent}
                  onAnalyze={() => navigate(`/analyze/${stock.symbol}`)}
                  onViewReport={() => navigate(`/report/${stock.symbol}`)}
                  onSelect={() => handleStockSelection(stock.symbol, !selectedStocks.includes(stock.symbol))}
                  isSelected={selectedStocks.includes(stock.symbol)}
                />
              </div>
            ))}
          </div>

          {/* Batch Selection Controls */}
          <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Checkbox
                id="select-all"
                checked={selectedStocks.length === uploadedStocks.length && uploadedStocks.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium text-gray-700">
                Select All ({selectedStocks.length} of {uploadedStocks.length} selected)
              </label>
            </div>
            
            {selectedStocks.length > 0 && (
              <Button 
                onClick={handleBatchAnalyze}
                className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {selectedStocks.length === 1 ? 'Analyze Stock' : `Batch Analyze (${selectedStocks.length})`}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {uploadedStocks.length > 0 && (
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600">
              Manage your research workflow efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => {
                  if (selectedStocks.length > 0) {
                    handleBatchAnalyze();
                  } else {
                    // Select all stocks for batch analysis
                    setSelectedStocks(uploadedStocks.map(stock => stock.symbol));
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Batch Reports
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/portfolio')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:shadow-md transition-all duration-200"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Portfolio Rankings
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/report/AAPL')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:shadow-md transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Sample Report
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/earnings')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:shadow-md transition-all duration-200"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Earnings Analysis
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/reports')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:shadow-md transition-all duration-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                View All Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Excel Upload Modal */}
      {showExcelUpload && (
        <ExcelUpload
          onUploadComplete={handleExcelUploadComplete}
          onClose={() => setShowExcelUpload(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
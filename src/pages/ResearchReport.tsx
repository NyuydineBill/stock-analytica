import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Star, ChevronRight, TrendingUp, TrendingDown, Minus, Target, AlertTriangle, CheckCircle, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import FinancialChart from "@/components/ui/financial-chart";
import { mockAnalysisResults } from "@/data/mockData";
import StockRating from "@/components/ui/stock-rating";
import PDFExport from "@/components/ui/pdf-export";

interface ReportSection {
  id: string;
  title: string;
  content: string;
  charts?: ChartData[];
}

interface ChartData {
  type: 'line' | 'bar';
  title: string;
  metric: string;
  change: string;
  data: { year: string; value: number }[];
}

interface StockRating {
  value: number;
  label: string;
  color: string;
  description: string;
}

const ResearchReport = () => {
  const navigate = useNavigate();
  const { symbol } = useParams();
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("summary");
  const [showRating, setShowRating] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const [ratingHistory, setRatingHistory] = useState<any[]>([]);

  // Get analysis data from mock data
  const analysisData = mockAnalysisResults[symbol || "AAPL"];
  const stockData = {
    symbol: symbol || "AAPL",
    name: analysisData?.companyName || "Apple Inc.",
    sector: analysisData?.sector || "Technology",
    exchange: analysisData?.exchange || "NASDAQ",
    price: `$${analysisData?.currentPrice?.toFixed(2) || "245.67"}`,
    change: `${analysisData?.priceChangePercent >= 0 ? '+' : ''}${analysisData?.priceChangePercent?.toFixed(2) || "0.96"}%`
  };

  const ratingScale: StockRating[] = [
    { value: -5, label: "Strong Sell", color: "bg-gray-400", description: "High conviction negative view" },
    { value: -3, label: "Sell", color: "bg-gray-500", description: "Negative bias" },
    { value: -1, label: "Underweight", color: "bg-gray-600", description: "Slight negative bias" },
    { value: 0, label: "Neutral", color: "bg-gray-700", description: "No strong conviction" },
    { value: 1, label: "Overweight", color: "bg-gray-800", description: "Slight positive bias" },
    { value: 3, label: "Buy", color: "bg-gray-900", description: "Positive bias" },
    { value: 5, label: "Strong Buy", color: "bg-black", description: "High conviction positive view" }
  ];

  const reportSections: ReportSection[] = analysisData?.sections || [
    {
      id: "summary",
      title: "Executive Summary",
      content: "Analysis data not available for this stock."
    }
  ];

  const getRatingInfo = (value: number) => {
    return ratingScale.find(r => r.value === value) || ratingScale[3]; // Default to neutral
  };

  const currentRating = getRatingInfo(rating);

  const renderChart = (chart: ChartData) => {
    return (
      <FinancialChart
        type={chart.type}
        title={chart.title}
        metric={chart.metric}
        change={chart.change}
        data={chart.data}
      />
    );
  };

  const handleRatingChange = (newRating: number, newNotes: string) => {
    setRating(newRating);
    setNotes(newNotes);
  };

  const handleRatingHistory = (history: any[]) => {
    setRatingHistory(history);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Equity Research Report: {stockData.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {stockData.symbol} • {stockData.sector} • {stockData.exchange}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  {stockData.price} ({stockData.change})
                </Badge>
                {analysisData && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Target: ${analysisData.targetPrice?.toFixed(2)}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        analysisData.recommendation === 'Strong Buy' || analysisData.recommendation === 'Buy' 
                          ? 'text-gray-900 border-gray-900' 
                          : analysisData.recommendation === 'Sell' || analysisData.recommendation === 'Strong Sell'
                          ? 'text-gray-600 border-gray-600'
                          : 'text-gray-700 border-gray-700'
                      }`}
                    >
                      {analysisData.recommendation}
                    </Badge>
                    <Badge variant="outline" className="text-gray-600 border-gray-600">
                      Risk: {analysisData.riskLevel}
                    </Badge>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowRating(true)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Rate Stock
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPDFExport(true)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {reportSections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left flex items-center justify-between p-2 rounded-md transition-colors ${
                          activeSection === section.id
                            ? "bg-gray-50 text-gray-700"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-sm">
                          {index + 1}. {section.title}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              {/* Rating Section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Stock Rating</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentRating.color} text-white mb-2`}>
                      <Star className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{currentRating.label}</h3>
                    <p className="text-sm text-gray-600">{currentRating.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rating-slider">Rating: {rating}</Label>
                    <Slider
                      id="rating-slider"
                      value={[rating]}
                      onValueChange={(value) => setRating(value[0])}
                      max={5}
                      min={-5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Strong Sell</span>
                      <span>Neutral</span>
                      <span>Strong Buy</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Personal Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add your thoughts on this stock..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Rating</Button>
                </CardContent>
              </Card>
            </div>

            {/* Report Content */}
            <div className="lg:col-span-3">
              {/* Key Metrics Summary */}
              {analysisData && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                          ${analysisData.financialMetrics.revenue.current}B
                        </div>
                        <div className="text-sm text-gray-600">Revenue</div>
                        <div className={`text-xs ${analysisData.financialMetrics.revenue.trend === 'up' ? 'text-gray-900' : 'text-gray-600'}`}>
                          {analysisData.financialMetrics.revenue.growth}% YoY
                        </div>
                      </div>
                                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-600">
                          {analysisData.financialMetrics.profitMargin.current}%
                        </div>
                        <div className="text-sm text-gray-600">Profit Margin</div>
                        <div className="text-xs text-gray-500">
                          vs {analysisData.financialMetrics.profitMargin.industry}% industry
                        </div>
                      </div>
                                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-600">
                          {analysisData.financialMetrics.roe}%
                        </div>
                        <div className="text-sm text-gray-600">ROE</div>
                        <div className="text-xs text-gray-500">Return on Equity</div>
                      </div>
                                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-600">
                          {analysisData.analystConsensus.buy}
                        </div>
                        <div className="text-sm text-gray-600">Buy Ratings</div>
                        <div className="text-xs text-gray-500">
                          {analysisData.analystConsensus.hold} Hold, {analysisData.analystConsensus.sell} Sell
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-8">
                  {reportSections.map((section) => (
                    <div key={section.id} className="mb-8 last:mb-0">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {section.id === "summary" ? "1. " : 
                         section.id === "overview" ? "2. " :
                         section.id === "financial" ? "3. " :
                         section.id === "valuation" ? "4. " :
                         section.id === "recommendation" ? "5. " : ""}
                        {section.title}
                      </h2>
                      
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed mb-6">
                          {section.content}
                        </p>
                      </div>

                      {/* Key Points */}
                      {section.keyPoints && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Key Points</h4>
                          <ul className="space-y-2">
                            {section.keyPoints.map((point, index) => (
                              <li key={index} className="flex items-start gap-2 text-gray-800">
                                <CheckCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Charts */}
                      {section.charts && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {section.charts.map((chart, index) => (
                            <div key={index}>
                              {renderChart(chart)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <a href="#" className="text-gray-600 hover:text-gray-800">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Privacy Policy</a>
              <span>©2024 Equity Insights. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Rate {stockData.symbol}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowRating(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <StockRating
                symbol={stockData.symbol}
                name={stockData.name}
                currentRating={rating}
                currentNotes={notes}
                ratingHistory={ratingHistory}
                onRatingChange={handleRatingChange}
                onRatingHistory={handleRatingHistory}
              />
            </div>
          </div>
        </div>
      )}

      {/* PDF Export Modal */}
      {showPDFExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Export PDF - {stockData.symbol}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPDFExport(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <PDFExport
                stockSymbol={stockData.symbol}
                stockName={stockData.name}
                reportData={analysisData}
                rating={rating}
                ratingNotes={notes}
                onExportComplete={() => setShowPDFExport(false)}
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ResearchReport; 
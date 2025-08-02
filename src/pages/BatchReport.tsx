import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Star, ChevronRight, TrendingUp, TrendingDown, Minus, Target, AlertTriangle, CheckCircle, X, Users, BarChart3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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

const BatchReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("summary");
  const [showRating, setShowRating] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const [ratingHistory, setRatingHistory] = useState<any[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [stocksData, setStocksData] = useState<Stock[]>([]);
  const [analysisSections, setAnalysisSections] = useState<string[]>([]);
  const [analysisDepth, setAnalysisDepth] = useState<string>('standard');

  // Get data from navigation state
  useEffect(() => {
    if (location.state) {
      setSelectedStocks(location.state.selectedStocks || []);
      setStocksData(location.state.stocksData || []);
      setAnalysisSections(location.state.analysisSections || []);
      setAnalysisDepth(location.state.analysisDepth || 'standard');
    }
  }, [location.state]);

  const ratingScale: StockRating[] = [
    { value: -5, label: "Strong Sell", color: "bg-gray-400", description: "High conviction negative view" },
    { value: -3, label: "Sell", color: "bg-gray-500", description: "Negative bias" },
    { value: -1, label: "Underweight", color: "bg-gray-600", description: "Slight negative bias" },
    { value: 0, label: "Neutral", color: "bg-gray-700", description: "No strong conviction" },
    { value: 1, label: "Overweight", color: "bg-gray-800", description: "Slight positive bias" },
    { value: 3, label: "Buy", color: "bg-gray-900", description: "Positive bias" },
    { value: 5, label: "Strong Buy", color: "bg-black", description: "High conviction positive view" }
  ];

  // Generate batch report sections
  const generateBatchReportSections = (): ReportSection[] => {
    const sections: ReportSection[] = [
      {
        id: "overview",
        title: "Portfolio Overview",
        content: `This batch analysis covers ${selectedStocks.length} stocks across various sectors using ${analysisDepth} depth analysis. The portfolio consists of ${selectedStocks.length} stocks with diverse sector representation including Technology, Consumer Discretionary, and Automotive. Each stock has been analyzed using the professional equity research format covering Company Overview, Products & Sector Review, Valuation Review, Sentiment Guidance, and Investment Thesis.`
      },
      {
        id: "sector",
        title: "Sector Analysis",
        content: `Sector analysis reveals strong tailwinds in Technology driven by AI adoption and cloud computing growth. Consumer Discretionary shows recovery potential with improving consumer spending. Automotive sector faces both opportunities (EV adoption) and challenges (competition, pricing pressure). Regulatory environment remains favorable for most sectors, though increased scrutiny on big tech companies could impact future operations.`
      },
      {
        id: "valuation",
        title: "Valuation Summary",
        content: `Valuation analysis shows a mix of growth and value opportunities across the portfolio. Technology stocks trade at premium multiples justified by strong growth prospects and AI leadership positions. Consumer Discretionary stocks offer attractive valuations relative to recovery potential. Overall portfolio valuation appears balanced with upside potential across multiple scenarios.`
      },
      {
        id: "sentiment",
        title: "Market Sentiment",
        content: `Analyst sentiment across the portfolio is generally positive, with strong Buy ratings for technology leaders and mixed sentiment for more cyclical names. Recent trend revisions show upward momentum for AI-related stocks and stabilization for consumer-facing companies. Institutional ownership remains strong across the portfolio.`
      },
      {
        id: "thesis",
        title: "Investment Thesis",
        content: `The investment thesis for this portfolio focuses on diversification across sectors and market caps. Bull case (60% probability): Technology leadership continues, consumer recovery accelerates, and AI adoption drives growth. Bear case (25% probability): Economic slowdown, regulatory headwinds, and competition intensifies. Base case (15% probability): Steady execution with moderate growth across sectors.`
      }
    ];

    return sections.filter(section => analysisSections.includes(section.id) || section.id === "overview");
  };

  const reportSections: ReportSection[] = generateBatchReportSections();

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

  if (selectedStocks.length === 0) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">No Batch Report Data</CardTitle>
              <CardDescription>Please go back to the dashboard and run a batch analysis to view results.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Batch Research Report
              </h1>
              <p className="text-gray-600">
                Analysis results for {selectedStocks.length} stocks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowRating(true)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Target className="w-4 h-4 mr-2" />
              Rate Portfolio
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPDFExport(true)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Portfolio Overview</CardTitle>
            <CardDescription>Summary of analyzed stocks and key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{selectedStocks.length}</div>
                  <div className="text-sm text-gray-600">Total Stocks</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{analysisSections.length}</div>
                  <div className="text-sm text-gray-600">Analysis Sections</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{analysisDepth}</div>
                  <div className="text-sm text-gray-600">Analysis Depth</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Analyzed Stocks</CardTitle>
            <CardDescription>Individual stock analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stocksData.map((stock, index) => {
                const analysisData = mockAnalysisResults[stock.symbol];
                return (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{stock.symbol}</h3>
                        <p className="text-sm text-gray-600">{stock.name}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/report/${stock.symbol}`)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sector:</span>
                        <span className="font-medium">{stock.sector}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">${stock.currentPrice?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Change:</span>
                        <span className={`font-medium ${stock.priceChangePercent && stock.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.priceChangePercent ? `${stock.priceChangePercent >= 0 ? '+' : ''}${stock.priceChangePercent.toFixed(2)}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Report Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reportSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                {reportSections.map((section) => (
                  <div key={section.id} className={activeSection === section.id ? 'block' : 'hidden'}>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                    
                    {section.charts && section.charts.length > 0 && (
                      <div className="space-y-6">
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

        {/* Modals */}
        {showRating && (
          <StockRating
            onClose={() => setShowRating(false)}
            onRatingChange={handleRatingChange}
            onRatingHistory={handleRatingHistory}
            rating={rating}
            notes={notes}
            history={ratingHistory}
          />
        )}

        {showPDFExport && (
          <PDFExport
            onClose={() => setShowPDFExport(false)}
            stockSymbol="BATCH"
            reportData={{
              stocks: selectedStocks,
              sections: reportSections,
              analysisDepth: analysisDepth
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default BatchReport; 
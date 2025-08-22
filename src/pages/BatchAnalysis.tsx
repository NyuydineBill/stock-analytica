import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "@/components/ui/progress-indicator";
import Layout from "@/components/layout/Layout";
import { ArrowLeft, Play, Settings, Target, Clock, Zap, FileText, BarChart3, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import ReportConfig, { ReportConfiguration } from "@/components/ui/report-config";
import StockRating from "@/components/ui/stock-rating";
import PDFExport from "@/components/ui/pdf-export";
import { bulkConfigure, getBulkProgress, mapSectionsToConfig } from "@/services/reports";

interface AnalysisStep {
  id: string;
  label: string;
  description: string;
  required: boolean;
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

const BatchAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSections, setSelectedSections] = useState<string[]>(['overview', 'sector', 'valuation', 'sentiment', 'thesis']);
  const [analysisDepth, setAnalysisDepth] = useState('standard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showReportConfig, setShowReportConfig] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const [reportConfig, setReportConfig] = useState<ReportConfiguration | null>(null);
  const [stockRating, setStockRating] = useState(0);
  const [ratingNotes, setRatingNotes] = useState('');
  const [ratingHistory, setRatingHistory] = useState<any[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [stocksData, setStocksData] = useState<Stock[]>([]);

  // Get data from navigation state
  useEffect(() => {
    if (location.state) {
      setSelectedStocks(location.state.selectedStocks || []);
      setStocksData(location.state.stocksData || []);
    }
  }, [location.state]);

  const analysisSections: AnalysisStep[] = [
    {
      id: 'overview',
      label: 'Company Overview',
      description: 'Company description, business history, management changes, revenue breakdown, SWOT & Porter\'s 5 Forces',
      required: true
    },
    {
      id: 'sector',
      label: 'Products & Sector Review',
      description: 'Industry tailwinds, regulatory environment, political & economic factors, sector trends',
      required: false
    },
    {
      id: 'valuation',
      label: 'Valuation Review',
      description: 'Analyst price targets, relative value vs peers, key valuation drivers',
      required: false
    },
    {
      id: 'sentiment',
      label: 'Sentiment Guidance',
      description: 'Analyst trend revisions, sentiment analysis, consensus estimates',
      required: false
    },
    {
      id: 'thesis',
      label: 'Investment Thesis',
      description: 'Bull case, bear case, and scenario probability assessment',
      required: true
    }
  ];

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    const section = analysisSections.find(s => s.id === sectionId);
    if (section?.required) return; // Don't allow unchecking required sections

    if (checked) {
      setSelectedSections([...selectedSections, sectionId]);
    } else {
      setSelectedSections(selectedSections.filter(id => id !== sectionId));
    }
  };

  const startAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setCurrentStep(1);
      setProgress(0);

      const config = mapSectionsToConfig(selectedSections);

      const bulk = await bulkConfigure({
        stock_symbols: selectedStocks,
        include_company_overview: config.include_company_overview,
        include_sector_review: config.include_sector_review,
        include_valuation_analysis: config.include_valuation_analysis,
        include_sentiment_analysis: config.include_sentiment_analysis,
        include_investment_thesis: config.include_investment_thesis,
      });

      const batchId = bulk.batch_id;

      const poll = async () => {
        try {
          const res = await getBulkProgress(batchId);
          setProgress(res.progress);
          const completed = res.reports.filter(r => r.status === 'completed').length;
          setCurrentStep(completed + 1);
          if (res.progress < 100) {
            setTimeout(poll, 2000);
          } else {
            setIsAnalyzing(false);
            navigate('/batch-report', {
              state: {
                selectedStocks: selectedStocks,
                stocksData: stocksData,
                analysisSections: selectedSections,
                analysisDepth: analysisDepth,
                batchId: batchId,
                generatedReports: res.reports.map(r => ({
                  id: String((r as any).id ?? (r as any).report_id ?? ''),
                  stock_symbol: r.stock_symbol,
                  stock_name: stocksData.find(s => s.symbol === r.stock_symbol)?.name || r.stock_symbol,
                  status: r.status as any,
                  progress: r.progress,
                  current_step: '',
                  created_at: new Date().toISOString(),
                })),
              }
            });
          }
        } catch (e) {
          console.error('Polling error', e);
          setTimeout(poll, 3000);
        }
      };

      poll();
    } catch (error) {
      console.error('Failed to start batch analysis', error);
      setIsAnalyzing(false);
    }
  };

  const handleConfigChange = (config: ReportConfiguration) => {
    setReportConfig(config);
  };

  const handleRatingChange = (rating: number, notes: string) => {
    setStockRating(rating);
    setRatingNotes(notes);
  };

  const handleRatingHistory = (history: any[]) => {
    setRatingHistory(history);
  };

  const handleStartAnalysis = () => {
    setShowReportConfig(false);
    startAnalysis();
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
              <CardTitle className="text-xl font-bold text-gray-900">No Stocks Selected</CardTitle>
              <CardDescription>Please go back to the dashboard and select stocks for batch analysis.</CardDescription>
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
              <h1 className="text-2xl font-bold text-gray-900">Batch Stock Analysis</h1>
              <p className="text-gray-600">
                Analyzing {selectedStocks.length} stocks with {selectedSections.length} sections
              </p>
            </div>
          </div>
        </div>

        {/* Selected Stocks Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Selected Stocks ({selectedStocks.length})
            </CardTitle>
            <CardDescription>Stocks that will be analyzed in this batch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {stocksData.map((stock, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-900">{stock.symbol}</div>
                    <div className="text-sm text-gray-600">{stock.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Configuration */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Analysis Sections */}
          <Card className="border-0 shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Analysis Sections</CardTitle>
              <CardDescription>Select which sections to include in your research reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisSections.map((section) => (
                <div key={section.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={section.id}
                    checked={selectedSections.includes(section.id)}
                    onCheckedChange={(checked) => handleSectionToggle(section.id, checked as boolean)}
                    disabled={section.required}
                  />
                  <div className="space-y-1">
                    <Label htmlFor={section.id} className="text-sm font-medium text-gray-900">
                      {section.label}
                      {section.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Analysis Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Analysis Settings</CardTitle>
              <CardDescription>Configure the depth and scope of analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-900">Analysis Depth</Label>
                <RadioGroup value={analysisDepth} onValueChange={setAnalysisDepth}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="basic" id="basic" />
                    <Label htmlFor="basic" className="text-sm text-gray-700">Basic (5-10 min)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="text-sm text-gray-700">Standard (10-15 min)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comprehensive" id="comprehensive" />
                    <Label htmlFor="comprehensive" className="text-sm text-gray-700">Comprehensive (15-20 min)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-900">Estimated Time</Label>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(selectedStocks.length * (analysisDepth === 'basic' ? 5 : analysisDepth === 'standard' ? 10 : 15))} min
                </div>
                <p className="text-sm text-gray-600">
                  For {selectedStocks.length} stocks with {analysisDepth} analysis
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowReportConfig(true)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Report Configuration
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRating(true)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Target className="w-4 h-4 mr-2" />
              Rating History
            </Button>
          </div>
          <Button
            onClick={startAnalysis}
            disabled={isAnalyzing || selectedSections.length === 0}
            className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isAnalyzing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Batch Analysis
              </>
            )}
          </Button>
        </div>

        {/* Progress Indicator Modal */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4">
              <ProgressIndicator
                progress={progress}
                currentStep={currentStep}
                totalSteps={selectedStocks.length * 5}
                stepLabel={`Stock ${Math.ceil(currentStep / 5)} of ${selectedStocks.length}`}
              />
            </div>
          </div>
        )}

        {/* Modals */}
        {showReportConfig && (
          <ReportConfig
            onClose={() => setShowReportConfig(false)}
            onConfigChange={handleConfigChange}
            config={reportConfig}
          />
        )}

        {showRating && (
          <StockRating
            onClose={() => setShowRating(false)}
            onRatingChange={handleRatingChange}
            onRatingHistory={handleRatingHistory}
            rating={stockRating}
            notes={ratingNotes}
            history={ratingHistory}
          />
        )}

        {showPDFExport && (
          <PDFExport
            onClose={() => setShowPDFExport(false)}
            stockSymbol="BATCH"
            reportData={{}}
          />
        )}
      </div>
    </Layout>
  );
};

export default BatchAnalysis;

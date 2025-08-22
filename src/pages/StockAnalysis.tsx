import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "@/components/ui/progress-indicator";
import Layout from "@/components/layout/Layout";
import { ArrowLeft, Play, Settings, Target, Clock, Zap, FileText, BarChart3, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { analysisSteps } from "@/data/mockData";
import ReportConfig, { ReportConfiguration } from "@/components/ui/report-config";
import StockRating from "@/components/ui/stock-rating";
import PDFExport from "@/components/ui/pdf-export";
import { startComprehensiveAnalysis, getComprehensiveReport, generateReport, getReportProgress, mapSectionsToConfig } from "@/services/reports";

interface AnalysisStep {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

const StockAnalysis = () => {
  const navigate = useNavigate();
  const { symbol: routeSymbol } = useParams();
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
  const [estimatedTime, setEstimatedTime] = useState<number>(120); // Default 2 minutes
  const progressIntervalRef = useRef<number | null>(null);
  const pollTimeoutRef = useRef<number | null>(null);
  const pollStartTimeRef = useRef<number>(0);
  const pollAttemptsRef = useRef<number>(0);

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

  // Using analysisSteps from mockData

  const mockStock = {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    exchange: "NASDAQ",
    country: "US"
  };

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    const section = analysisSections.find(s => s.id === sectionId);
    if (section?.required) return; // Don't allow unchecking required sections

    if (checked) {
      setSelectedSections([...selectedSections, sectionId]);
    } else {
      setSelectedSections(selectedSections.filter(id => id !== sectionId));
    }
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
    };
  }, []);

  const startAnalysis = async () => {
    if (isAnalyzing) return;
    const stockSymbol = routeSymbol || mockStock.symbol;
    try {
      setIsAnalyzing(true);
      setCurrentStep(1);
      setProgress(0);

      // Clear any previous timers to avoid duplicate pollers
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }

      const progressTimer = window.setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 85));
      }, 1000);
      progressIntervalRef.current = progressTimer;

      // Use new comprehensive analysis endpoint with configurations
      const configPayload = mapSectionsToConfig(selectedSections);
      
      const comprehensiveResult = await startComprehensiveAnalysis({
        stock_symbol: stockSymbol,
        analysis_depth: analysisDepth as 'standard' | 'comprehensive',
        include_company_overview: configPayload.include_company_overview,
        include_sector_review: configPayload.include_sector_review,
        include_valuation_analysis: configPayload.include_valuation_analysis,
        include_sentiment_analysis: configPayload.include_sentiment_analysis,
        include_investment_thesis: configPayload.include_investment_thesis,
        report_type: 'individual',
        estimated_time: 120, // Default 2 minutes
      });

      // Store the estimated time from backend response
      if (comprehensiveResult.estimated_time) {
        setEstimatedTime(comprehensiveResult.estimated_time);
      }

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      const reportId = comprehensiveResult.report_id;
      if (!reportId) {
        setIsAnalyzing(false);
        console.error('No report id returned from comprehensive analysis');
        return;
      }

      // Poll report progress until completed
      pollStartTimeRef.current = Date.now();
      pollAttemptsRef.current = 0;
      const poll = async () => {
        try {
          const comprehensiveReport = await getComprehensiveReport(reportId);
          const report = comprehensiveReport.report;
          
          if (typeof report.progress === 'number') {
            setProgress(report.progress);
          }

          // Update current step from the report
          if (report.current_step) {
            // Map backend steps to frontend step numbers
            const stepMap: { [key: string]: number } = {
              'Initializing analysis...': 1,
              'Analyzing company fundamentals...': 2,
              'Conducting sector research...': 3,
              'Performing valuation analysis...': 4,
              'Generating investment scenarios...': 5,
              'Analysis completed': 6
            };
            const mappedStep = stepMap[report.current_step] || currentStep;
            setCurrentStep(mappedStep);
          }

          const status = String(report.status || '').toLowerCase();
          const numeric = report.progress || 0;
          const isDone = status === 'completed' || status === 'failed' || numeric >= 100;

          if (!isDone) {
            // Safety stop: 15 minutes or 600 attempts
            const elapsedMs = Date.now() - pollStartTimeRef.current;
            pollAttemptsRef.current += 1;
            if (elapsedMs > 15 * 60 * 1000 || pollAttemptsRef.current > 600) {
              setIsAnalyzing(false);
              if (pollTimeoutRef.current) {
                clearTimeout(pollTimeoutRef.current);
                pollTimeoutRef.current = null;
              }
              navigate(`/report/${stockSymbol}`, { state: { reportId } });
              return;
            }
            const t = window.setTimeout(poll, 2000);
            pollTimeoutRef.current = t;
          } else {
            setIsAnalyzing(false);
            if (pollTimeoutRef.current) {
              clearTimeout(pollTimeoutRef.current);
              pollTimeoutRef.current = null;
            }
            
            // Redirect to the comprehensive report page with the report ID
            navigate(`/report/${reportId}`, { 
              state: { 
                reportId,
                stockSymbol,
                fromComprehensiveAnalysis: true 
              } 
            });
          }
        } catch (e) {
          // If 404 during early propagation, wait and retry quietly
          const t = window.setTimeout(poll, 2500);
          pollTimeoutRef.current = t;
        }
      };

      poll();
    } catch (error) {
      console.error('Failed to start analysis', error);
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

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mockStock.symbol} Analysis</h1>
              <p className="text-gray-600">{mockStock.name}</p>
            </div>
          </div>
        </div>

        {!isAnalyzing ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Configuration Panel */}
            <div className="space-y-6">
              {/* New Flow Information */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    New Simplified Analysis Flow
                  </CardTitle>
                  <CardDescription className="text-gray-700">
                    The new comprehensive analysis automatically starts generation after configuration, reducing the process from 3 steps to 2 steps.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Configure analysis sections and depth</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Start analysis (configuration + generation in one step)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Monitor progress and view results</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ReportConfig
                onConfigChange={handleConfigChange}
                onStartAnalysis={handleStartAnalysis}
              />
            </div>

            {/* Stock Information & Summary */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Stock Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Symbol</Label>
                    <div className="text-lg font-bold text-gray-900">{mockStock.symbol}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Company Name</Label>
                    <div className="text-gray-900">{mockStock.name}</div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                      {mockStock.sector}
                    </Badge>
                    <Badge variant="outline" className="border-gray-300 text-gray-600">
                      {mockStock.exchange}
                    </Badge>
                    <Badge variant="outline" className="border-gray-300 text-gray-600">
                      {mockStock.country}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-700 font-medium">Selected Sections:</span>
                      <span className="font-bold text-gray-900">{selectedSections.length} of {analysisSections.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-700 font-medium">Analysis Depth:</span>
                      <span className="font-bold text-gray-900 capitalize">{analysisDepth}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-700 font-medium">Estimated Time:</span>
                      <span className="font-bold text-gray-900">{Math.ceil(estimatedTime / 60)} minutes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
                size="lg"
                onClick={startAnalysis}
                disabled={selectedSections.length === 0 || isAnalyzing}
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Analysis
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={analysisSteps.length}
              stepLabel={analysisSteps[currentStep - 1] || `Step ${currentStep}`}
              progress={progress}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StockAnalysis;
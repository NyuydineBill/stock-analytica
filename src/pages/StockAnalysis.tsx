import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "@/components/ui/progress-indicator";
import Layout from "@/components/layout/Layout";
import { ArrowLeft, Play, Settings, Target, Clock, Zap, FileText, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analysisSteps } from "@/data/mockData";
import ReportConfig, { ReportConfiguration } from "@/components/ui/report-config";
import StockRating from "@/components/ui/stock-rating";
import PDFExport from "@/components/ui/pdf-export";

interface AnalysisStep {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

const StockAnalysis = () => {
  const navigate = useNavigate();
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

  const analysisSections: AnalysisStep[] = [
    {
      id: 'overview',
      label: 'Company Overview',
      description: 'Business analysis, SWOT, and Porter\'s Five Forces',
      required: true
    },
    {
      id: 'sector',
      label: 'Sector Review',
      description: 'Industry trends and regulatory environment',
      required: false
    },
    {
      id: 'valuation',
      label: 'Valuation Analysis',
      description: 'Price targets and peer comparison',
      required: false
    },
    {
      id: 'sentiment',
      label: 'Sentiment Analysis',
      description: 'Analyst trends and market sentiment',
      required: false
    },
    {
      id: 'thesis',
      label: 'Investment Thesis',
      description: 'Bull, bear, and base case scenarios',
      required: true
    },
    {
      id: 'projections',
      label: 'Financial Projections',
      description: 'Revenue and earnings forecasts',
      required: false
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

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setCurrentStep(1);
    setProgress(0);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          // Navigate to the research report page after analysis is complete
          setTimeout(() => {
            navigate(`/report/${mockStock.symbol}`);
          }, 1000);
          return 100;
        }
        
        if (newProgress % 20 === 0) {
          setCurrentStep(prev => prev + 1);
        }
        
        return newProgress;
      });
    }, 1500);
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
                      <span className="font-bold text-gray-900">{analysisDepth === 'comprehensive' ? '5-7' : '3-4'} minutes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
                size="lg"
                onClick={startAnalysis}
                disabled={selectedSections.length === 0}
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
              stepLabel={analysisSteps[currentStep - 1]}
              progress={progress}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StockAnalysis;
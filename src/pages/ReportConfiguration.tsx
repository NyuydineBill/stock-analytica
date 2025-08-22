import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Settings, Play, CheckCircle, AlertCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
// import { useGenerateReportMutation } from "@/store/api";
import { bulkConfigure } from "@/services/reports";
import { useToast } from "@/hooks/use-toast";

interface Stock {
  symbol: string;
  name: string;
  sector?: string;
  exchange?: string;
  current_price?: number | string | null;
  price_change_percent?: number | string | null;
}

interface ReportSection {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  included: boolean;
}

const ReportConfiguration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get selected stocks from navigation state
  const selectedStocks: Stock[] = location.state?.selectedStocks || [];
  const stocksData: Stock[] = location.state?.stocksData || [];
  
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'company_overview',
    'sector_review', 
    'valuation_analysis',
    'sentiment_analysis',
    'investment_thesis'
  ]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);

  // const [generateReport] = useGenerateReportMutation();

  const reportSections: ReportSection[] = [
    {
      id: 'company_overview',
      title: 'Company Overview',
      description: 'Comprehensive analysis of company fundamentals, business model, and market position',
      estimatedTime: '30-45 seconds',
      included: true
    },
    {
      id: 'sector_review',
      title: 'Sector Review',
      description: 'Industry analysis, competitive landscape, and sector-specific trends',
      estimatedTime: '20-30 seconds',
      included: true
    },
    {
      id: 'valuation_analysis',
      title: 'Valuation Analysis',
      description: 'Financial metrics, peer comparison, and fair value assessment',
      estimatedTime: '25-35 seconds',
      included: true
    },
    {
      id: 'sentiment_analysis',
      title: 'Market Sentiment',
      description: 'Analyst ratings, news sentiment, and market consensus',
      estimatedTime: '20-30 seconds',
      included: true
    },
    {
      id: 'investment_thesis',
      title: 'Investment Thesis',
      description: 'Bull/bear scenarios, key catalysts, and investment recommendation',
      estimatedTime: '30-40 seconds',
      included: true
    }
  ];

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSections.length === reportSections.length) {
      setSelectedSections([]);
    } else {
      setSelectedSections(reportSections.map(section => section.id));
    }
  };

  const handleGenerateReports = async () => {
    console.log('🚀 Starting bulk analysis...');
    console.log('Selected stocks:', selectedStocks);
    console.log('Selected sections:', selectedSections);

    if (selectedSections.length === 0) {
      toast({
        title: "No sections selected",
        description: "Please select at least one report section to generate.",
        variant: "destructive"
      });
      return;
    }

    if (selectedStocks.length === 0) {
      toast({
        title: "No stocks selected",
        description: "Please select at least one stock to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await bulkConfigure({
        stock_symbols: selectedStocks.map(s => s.symbol),
        include_company_overview: selectedSections.includes('company_overview'),
        include_sector_review: selectedSections.includes('sector_review'),
        include_valuation_analysis: selectedSections.includes('valuation_analysis'),
        include_sentiment_analysis: selectedSections.includes('sentiment_analysis'),
        include_investment_thesis: selectedSections.includes('investment_thesis'),
      });

      toast({
        title: "Batch started",
        description: `Tracking ${selectedStocks.length} reports...`,
      });

      navigate('/batch-report', { 
        state: { 
          batchId: res.batch_id,
          generatedReports: (res.reports || []).map((r: any) => ({
            id: String(r.id ?? r.report_id ?? ''),
            stock_symbol: r.stock_symbol,
            stock_name: stocksData.find(s => s.symbol === r.stock_symbol)?.name || r.stock_symbol,
            status: r.status,
            progress: 0,
            current_step: '',
            created_at: new Date().toISOString(),
          })),
          selectedStocks: selectedStocks.map(s => s.symbol),
          stocksData: stocksData,
        }
      });

    } catch (error: any) {
      console.error('💥 Report generation failed:', error);
      toast({
        title: "Batch start failed",
        description: error?.data?.detail || "An error occurred while starting batch analysis.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getTotalEstimatedTime = () => {
    const selectedSectionCount = selectedSections.length;
    const estimatedTimePerStock = selectedSectionCount * 30; // ~30 seconds per section
    const totalTime = selectedStocks.length * estimatedTimePerStock;
    return Math.ceil(totalTime / 60); // Convert to minutes
  };

  return (
    <Layout>
      <div className="space-y-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Report Configuration</h1>
              <p className="text-gray-600">
                Configure AI analysis for {selectedStocks.length} selected stocks
              </p>
            </div>
          </div>
        </div>

        {/* Selected Stocks Summary */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Selected Stocks ({selectedStocks.length})
            </CardTitle>
            <CardDescription>
              Stocks that will be analyzed with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {selectedStocks.map((stock, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">{stock.symbol}</div>
                    <div className="text-sm text-gray-600">{stock.name}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stock.sector || 'N/A'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Sections Configuration */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Report Sections
                </CardTitle>
                <CardDescription>
                  Select which sections to include in your AI analysis
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={handleSelectAll}
                className="text-sm"
              >
                {selectedSections.length === reportSections.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportSections.map((section) => (
                <div key={section.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={section.id}
                    checked={selectedSections.includes(section.id)}
                    onCheckedChange={() => handleSectionToggle(section.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor={section.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                        {section.title}
                      </label>
                      <Badge variant="outline" className="text-xs">
                        {section.estimatedTime}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generation Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Generation Summary
            </CardTitle>
            <CardDescription>
              Review your configuration before generating reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedStocks.length}</div>
                <div className="text-sm text-gray-600">Stocks to Analyze</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedSections.length}</div>
                <div className="text-sm text-gray-600">Sections Selected</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-orange-600">~{getTotalEstimatedTime()} min</div>
                <div className="text-sm text-gray-600">Estimated Time</div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <div>• {selectedStocks.length} stocks × {selectedSections.length} sections = {selectedStocks.length * selectedSections.length} AI analyses</div>
                <div>• Each section takes approximately 30 seconds to generate</div>
                <div>• Reports will be generated in parallel for faster processing</div>
              </div>
              <Button
                onClick={handleGenerateReports}
                disabled={isGenerating || selectedSections.length === 0}
                className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Reports...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate AI Reports
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportConfiguration; 
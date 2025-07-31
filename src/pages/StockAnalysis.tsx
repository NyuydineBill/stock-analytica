import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "@/components/ui/progress-indicator";
import Layout from "@/components/layout/Layout";
import { ArrowLeft, Play, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AnalysisStep {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

const StockAnalysis = () => {
  const navigate = useNavigate();
  const [selectedSections, setSelectedSections] = useState<string[]>(['overview', 'thesis']);
  const [analysisDepth, setAnalysisDepth] = useState('standard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);

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
    }
  ];

  const analysisSteps = [
    "Analyzing company fundamentals...",
    "Conducting sector research...",
    "Performing valuation analysis...",
    "Generating investment scenarios...",
    "Finalizing report structure..."
  ];

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
          return 100;
        }
        
        if (newProgress % 20 === 0) {
          setCurrentStep(prev => prev + 1);
        }
        
        return newProgress;
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        <div>
          <h1 className="text-2xl font-bold">{mockStock.symbol} Analysis</h1>
          <p className="text-muted-foreground">{mockStock.name}</p>
        </div>
      </div>

      {!isAnalyzing ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Report Configuration
                </CardTitle>
                <CardDescription>
                  Customize your equity research report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Report Sections</Label>
                  <div className="mt-3 space-y-3">
                    {analysisSections.map((section) => (
                      <div key={section.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={section.id}
                          checked={selectedSections.includes(section.id)}
                          onCheckedChange={(checked) => 
                            handleSectionToggle(section.id, checked as boolean)
                          }
                          disabled={section.required}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={section.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                          >
                            {section.label}
                            {section.required && (
                              <Badge variant="secondary" className="text-xs">Required</Badge>
                            )}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Analysis Depth</Label>
                  <RadioGroup
                    value={analysisDepth}
                    onValueChange={setAnalysisDepth}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1">
                        <div>
                          <div className="font-medium">Standard Analysis</div>
                          <div className="text-sm text-muted-foreground">
                            Essential metrics and analysis (3-4 minutes)
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="comprehensive" id="comprehensive" />
                      <Label htmlFor="comprehensive" className="flex-1">
                        <div>
                          <div className="font-medium">Comprehensive Analysis</div>
                          <div className="text-sm text-muted-foreground">
                            Deep-dive with additional insights (5-7 minutes)
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stock Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-sm text-muted-foreground">Symbol</Label>
                  <div className="text-lg font-semibold">{mockStock.symbol}</div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm text-muted-foreground">Company Name</Label>
                  <div>{mockStock.name}</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">{mockStock.sector}</Badge>
                  <Badge variant="outline">{mockStock.exchange}</Badge>
                  <Badge variant="outline">{mockStock.country}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selected Sections:</span>
                    <span>{selectedSections.length} of {analysisSections.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Analysis Depth:</span>
                    <span className="capitalize">{analysisDepth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Time:</span>
                    <span>{analysisDepth === 'comprehensive' ? '5-7' : '3-4'} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              className="w-full" 
              size="lg"
              onClick={startAnalysis}
              disabled={selectedSections.length === 0}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </div>
        </div>
      ) : (
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={analysisSteps.length}
          stepLabel={analysisSteps[currentStep - 1]}
          progress={progress}
        />
      )}
      </div>
    </Layout>
  );
};

export default StockAnalysis;
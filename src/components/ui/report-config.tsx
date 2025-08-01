import React, { useState } from 'react';
import { Settings, Check, FileText, Building2, TrendingUp, Target, MessageSquare, BarChart3, Zap } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Separator } from './separator';

interface ReportSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
  estimatedTime: string;
}

interface ReportConfigProps {
  onConfigChange: (config: ReportConfiguration) => void;
  onStartAnalysis: () => void;
}

export interface ReportConfiguration {
  sections: string[];
  analysisDepth: 'standard' | 'comprehensive';
  includeCharts: boolean;
  includeValuation: boolean;
  includeSentiment: boolean;
  estimatedTime: number;
}

const ReportConfig: React.FC<ReportConfigProps> = ({ onConfigChange, onStartAnalysis }) => {
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'company-overview',
    'investment-thesis'
  ]);
  const [analysisDepth, setAnalysisDepth] = useState<'standard' | 'comprehensive'>('standard');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeValuation, setIncludeValuation] = useState(true);
  const [includeSentiment, setIncludeSentiment] = useState(true);

  const reportSections: ReportSection[] = [
    {
      id: 'company-overview',
      title: 'Company Overview',
      description: 'Business description, history, management, and SWOT analysis',
      icon: <Building2 className="h-5 w-5" />,
      required: true,
      estimatedTime: '2-3 min'
    },
    {
      id: 'sector-review',
      title: 'Sector Review',
      description: 'Regulatory environment, political factors, and industry trends',
      icon: <TrendingUp className="h-5 w-5" />,
      required: false,
      estimatedTime: '1-2 min'
    },
    {
      id: 'valuation-review',
      title: 'Valuation Analysis',
      description: 'Price targets, peer comparisons, and key valuation drivers',
      icon: <Target className="h-5 w-5" />,
      required: false,
      estimatedTime: '2-3 min'
    },
    {
      id: 'sentiment-guidance',
      title: 'Sentiment Analysis',
      description: 'Analyst revisions, consensus estimates, and market sentiment',
      icon: <MessageSquare className="h-5 w-5" />,
      required: false,
      estimatedTime: '1-2 min'
    },
    {
      id: 'investment-thesis',
      title: 'Investment Thesis',
      description: 'Bull, bear, and base case scenarios with probability assignments',
      icon: <BarChart3 className="h-5 w-5" />,
      required: true,
      estimatedTime: '2-3 min'
    }
  ];

  const handleSectionToggle = (sectionId: string) => {
    const section = reportSections.find(s => s.id === sectionId);
    if (section?.required) return; // Can't deselect required sections

    setSelectedSections(prev => {
      const newSections = prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId];
      
      updateConfiguration(newSections);
      return newSections;
    });
  };

  const updateConfiguration = (sections: string[]) => {
    const totalTime = sections.reduce((acc, sectionId) => {
      const section = reportSections.find(s => s.id === sectionId);
      const timeRange = section?.estimatedTime || '1-2 min';
      const avgTime = (parseInt(timeRange.split('-')[0]) + parseInt(timeRange.split('-')[1])) / 2;
      return acc + avgTime;
    }, 0);

    const config: ReportConfiguration = {
      sections,
      analysisDepth,
      includeCharts,
      includeValuation,
      includeSentiment,
      estimatedTime: Math.round(totalTime)
    };

    onConfigChange(config);
  };

  const handleDepthChange = (depth: 'standard' | 'comprehensive') => {
    setAnalysisDepth(depth);
    updateConfiguration(selectedSections);
  };

  const handleOptionChange = (option: 'charts' | 'valuation' | 'sentiment', value: boolean) => {
    switch (option) {
      case 'charts':
        setIncludeCharts(value);
        break;
      case 'valuation':
        setIncludeValuation(value);
        break;
      case 'sentiment':
        setIncludeSentiment(value);
        break;
    }
    updateConfiguration(selectedSections);
  };

  const getSelectedSectionsCount = () => selectedSections.length;
  const getTotalEstimatedTime = () => {
    return selectedSections.reduce((acc, sectionId) => {
      const section = reportSections.find(s => s.id === sectionId);
      const timeRange = section?.estimatedTime || '1-2 min';
      const avgTime = (parseInt(timeRange.split('-')[0]) + parseInt(timeRange.split('-')[1])) / 2;
      return acc + avgTime;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-gray-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Report Configuration</h2>
          <p className="text-sm text-gray-600">Customize your research report settings</p>
        </div>
      </div>

      {/* Analysis Depth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Analysis Depth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={analysisDepth} onValueChange={handleDepthChange}>
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Standard Analysis</div>
                      <div className="text-sm text-gray-600">
                        Comprehensive coverage with key insights and recommendations
                      </div>
                    </div>
                    <Badge variant="outline">Recommended</Badge>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comprehensive" id="comprehensive" />
                <Label htmlFor="comprehensive" className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Comprehensive Analysis</div>
                      <div className="text-sm text-gray-600">
                        Deep-dive analysis with extensive research and detailed scenarios
                      </div>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      +50% Time
                    </Badge>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Report Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Sections
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select which sections to include in your research report
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportSections.map((section) => (
              <div key={section.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => handleSectionToggle(section.id)}
                  disabled={section.required}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={section.id} className="flex items-center gap-2 cursor-pointer">
                      {section.icon}
                      <span className="font-medium">{section.title}</span>
                      {section.required && (
                        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                          Required
                        </Badge>
                      )}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {section.estimatedTime}
                      </Badge>
                      {selectedSections.includes(section.id) && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Options */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-charts"
                checked={includeCharts}
                onCheckedChange={(checked) => handleOptionChange('charts', checked as boolean)}
              />
              <Label htmlFor="include-charts" className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Include Charts & Visualizations</div>
                    <div className="text-sm text-gray-600">
                      Add financial charts, trend analysis, and data visualizations
                    </div>
                  </div>
                </div>
              </Label>
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-valuation"
                checked={includeValuation}
                onCheckedChange={(checked) => handleOptionChange('valuation', checked as boolean)}
              />
              <Label htmlFor="include-valuation" className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Detailed Valuation Metrics</div>
                    <div className="text-sm text-gray-600">
                      Include P/E ratios, DCF analysis, and peer comparisons
                    </div>
                  </div>
                </div>
              </Label>
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-sentiment"
                checked={includeSentiment}
                onCheckedChange={(checked) => handleOptionChange('sentiment', checked as boolean)}
              />
              <Label htmlFor="include-sentiment" className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Market Sentiment Analysis</div>
                    <div className="text-sm text-gray-600">
                      Include news sentiment, analyst revisions, and market positioning
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                {getSelectedSectionsCount()} sections selected
              </div>
              <div className="text-sm text-gray-600">
                Estimated time: {getTotalEstimatedTime()} minutes
              </div>
            </div>
            <Button onClick={onStartAnalysis} className="bg-black hover:bg-gray-800">
              <Zap className="h-4 w-4 mr-2" />
              Start Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportConfig; 
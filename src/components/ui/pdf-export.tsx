import React, { useState } from 'react';
import { Download, FileText, CheckCircle, Loader2, Settings, Printer } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';

interface PDFExportProps {
  stockSymbol: string;
  stockName: string;
  reportData: any;
  rating?: number;
  ratingNotes?: string;
  onExportComplete?: () => void;
}

const PDFExport: React.FC<PDFExportProps> = ({
  stockSymbol,
  stockName,
  reportData,
  rating,
  ratingNotes,
  onExportComplete
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportOptions, setExportOptions] = useState({
    includeRating: true,
    includeCharts: true,
    includeExecutiveSummary: true,
    includeFullReport: true,
    includeAppendix: false,
    watermark: false,
    pageNumbers: true
  });

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);

    // Simulate PDF generation steps
    const steps = [
      { name: 'Preparing report data...', duration: 1000 },
      { name: 'Generating charts and visualizations...', duration: 2000 },
      { name: 'Formatting content...', duration: 1500 },
      { name: 'Adding rating information...', duration: 1000 },
      { name: 'Applying professional styling...', duration: 1500 },
      { name: 'Finalizing PDF...', duration: 1000 }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setProgress(((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    // Simulate download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(
      `Equity Research Report - ${stockSymbol}\n\n` +
      `This is a mock PDF export for ${stockName} (${stockSymbol}).\n\n` +
      `In a real implementation, this would generate a professional PDF with:\n` +
      `- Executive Summary\n` +
      `- Company Overview\n` +
      `- Financial Analysis\n` +
      `- Valuation Review\n` +
      `- Investment Thesis\n` +
      `- Charts and Visualizations\n` +
      `- Rating: ${rating || 'Not rated'}\n` +
      `- Notes: ${ratingNotes || 'No notes'}\n\n` +
      `Export Options:\n` +
      Object.entries(exportOptions)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n')
    );
    link.download = `Equity_Research_${stockSymbol}_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();

    setIsExporting(false);
    setProgress(0);
    onExportComplete?.();
  };

  const handleOptionChange = (option: keyof typeof exportOptions) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const getFileSize = () => {
    const baseSize = 2.5; // MB
    const additionalSize = Object.values(exportOptions).filter(Boolean).length * 0.3;
    return (baseSize + additionalSize).toFixed(1);
  };

  return (
    <div className="space-y-4">
      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-rating"
                checked={exportOptions.includeRating}
                onCheckedChange={() => handleOptionChange('includeRating')}
              />
              <Label htmlFor="include-rating" className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Include Rating & Notes</div>
                    <div className="text-sm text-gray-600">
                      Add your personal rating and analysis notes
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    +0.3MB
                  </Badge>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-charts"
                checked={exportOptions.includeCharts}
                onCheckedChange={() => handleOptionChange('includeCharts')}
              />
              <Label htmlFor="include-charts" className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Include Charts & Visualizations</div>
                    <div className="text-sm text-gray-600">
                      Add financial charts and data visualizations
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    +0.3MB
                  </Badge>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-executive-summary"
                checked={exportOptions.includeExecutiveSummary}
                onCheckedChange={() => handleOptionChange('includeExecutiveSummary')}
              />
              <Label htmlFor="include-executive-summary" className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Executive Summary</div>
                    <div className="text-sm text-gray-600">
                      Include key findings and recommendations
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    +0.2MB
                  </Badge>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-full-report"
                checked={exportOptions.includeFullReport}
                onCheckedChange={() => handleOptionChange('includeFullReport')}
              />
              <Label htmlFor="include-full-report" className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Full Report</div>
                    <div className="text-sm text-gray-600">
                      Include complete analysis sections
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    +1.2MB
                  </Badge>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-appendix"
                checked={exportOptions.includeAppendix}
                onCheckedChange={() => handleOptionChange('includeAppendix')}
              />
              <Label htmlFor="include-appendix" className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Appendix & References</div>
                    <div className="text-sm text-gray-600">
                      Include data sources and methodology
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    +0.5MB
                  </Badge>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="watermark"
                checked={exportOptions.watermark}
                onCheckedChange={() => handleOptionChange('watermark')}
              />
              <Label htmlFor="watermark" className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Add Watermark</div>
                    <div className="text-sm text-gray-600">
                      Include "Draft" watermark on pages
                    </div>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="page-numbers"
                checked={exportOptions.pageNumbers}
                onCheckedChange={() => handleOptionChange('pageNumbers')}
              />
              <Label htmlFor="page-numbers" className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Page Numbers</div>
                    <div className="text-sm text-gray-600">
                      Include page numbers and table of contents
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Summary */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                Estimated file size: {getFileSize()} MB
              </div>
              <div className="text-sm text-gray-600">
                Format: Professional PDF
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Print Preview - {stockSymbol}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-white">
                      <h2 className="text-xl font-bold mb-2">Equity Research Report</h2>
                      <h3 className="text-lg font-semibold mb-4">{stockName} ({stockSymbol})</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        This is a preview of how the PDF will look when printed.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>• Executive Summary</div>
                        <div>• Company Overview</div>
                        <div>• Financial Analysis</div>
                        <div>• Valuation Review</div>
                        <div>• Investment Thesis</div>
                        {rating && <div>• Rating: {rating}/5</div>}
                        {ratingNotes && <div>• Notes: {ratingNotes}</div>}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="bg-black hover:bg-gray-800"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
            </div>
          </div>

          {isExporting && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="text-sm text-gray-600">
                {progress < 20 && "Preparing report data..."}
                {progress >= 20 && progress < 40 && "Generating charts and visualizations..."}
                {progress >= 40 && progress < 60 && "Formatting content..."}
                {progress >= 60 && progress < 80 && "Adding rating information..."}
                {progress >= 80 && progress < 100 && "Applying professional styling..."}
                {progress >= 100 && "Finalizing PDF..."}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFExport; 
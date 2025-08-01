import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Progress } from './progress';

interface StockData {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  country: string;
  marketCap?: string;
  price?: number;
}

interface ExcelUploadProps {
  onUploadComplete: (stocks: StockData[]) => void;
  onClose: () => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onUploadComplete, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedStocks, setProcessedStocks] = useState<StockData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Mock stock data that would be extracted from Excel
  const mockExtractedStocks: StockData[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', exchange: 'NASDAQ', country: 'USA', marketCap: '2.8T', price: 245.67 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', exchange: 'NASDAQ', country: 'USA', marketCap: '2.9T', price: 388.47 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', exchange: 'NASDAQ', country: 'USA', marketCap: '1.8T', price: 142.56 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', exchange: 'NASDAQ', country: 'USA', marketCap: '1.6T', price: 155.63 },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', exchange: 'NASDAQ', country: 'USA', marketCap: '800B', price: 248.42 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', exchange: 'NASDAQ', country: 'USA', marketCap: '1.2T', price: 485.09 },
    { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', exchange: 'NASDAQ', country: 'USA', marketCap: '1.1T', price: 334.92 },
    { symbol: 'BRK.A', name: 'Berkshire Hathaway Inc.', sector: 'Financial Services', exchange: 'NYSE', country: 'USA', marketCap: '800B', price: 548000 },
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', exchange: 'NYSE', country: 'USA', marketCap: '400B', price: 158.76 },
    { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services', exchange: 'NYSE', country: 'USA', marketCap: '500B', price: 245.33 },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services', exchange: 'NYSE', country: 'USA', marketCap: '450B', price: 158.92 },
    { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples', exchange: 'NYSE', country: 'USA', marketCap: '350B', price: 145.67 },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare', exchange: 'NYSE', country: 'USA', marketCap: '480B', price: 512.45 },
    { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary', exchange: 'NYSE', country: 'USA', marketCap: '320B', price: 312.78 },
    { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial Services', exchange: 'NYSE', country: 'USA', marketCap: '380B', price: 398.56 }
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );

    if (excelFile) {
      handleFileUpload(excelFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setProgress(0);
    setErrors([]);

    // Simulate file processing steps
    const steps = [
      { name: 'Validating file format...', duration: 1000 },
      { name: 'Extracting stock data...', duration: 2000 },
      { name: 'Validating stock symbols...', duration: 1500 },
      { name: 'Processing company information...', duration: 1000 },
      { name: 'Finalizing data...', duration: 500 }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setProgress(((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    // Simulate some validation errors
    const mockErrors = Math.random() > 0.7 ? ['Invalid symbol: INVALID', 'Missing sector for: TEST'] : [];
    setErrors(mockErrors);

    // Filter out any "invalid" stocks
    const validStocks = mockExtractedStocks.filter(stock => 
      !mockErrors.some(error => error.includes(stock.symbol))
    );

    setProcessedStocks(validStocks);
    setIsProcessing(false);
  };

  const handleConfirmUpload = () => {
    onUploadComplete(processedStocks);
    onClose();
  };

  const handleRetry = () => {
    setUploadedFile(null);
    setProcessedStocks([]);
    setErrors([]);
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Upload Stock List</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!uploadedFile ? (
            // Upload Interface
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Excel File
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your Excel file here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Supported formats: .xlsx, .xls
              </p>
              
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
            </div>
          ) : isProcessing ? (
            // Processing State
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                <span className="text-gray-700">Processing Excel file...</span>
              </div>
              
              <Progress value={progress} className="w-full" />
              
              <div className="text-sm text-gray-600">
                {progress < 20 && "Validating file format..."}
                {progress >= 20 && progress < 40 && "Extracting stock data..."}
                {progress >= 40 && progress < 60 && "Validating stock symbols..."}
                {progress >= 60 && progress < 80 && "Processing company information..."}
                {progress >= 80 && "Finalizing data..."}
              </div>
            </div>
          ) : (
            // Results State
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">File processed successfully!</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">File:</span>
                  <span className="ml-2 font-medium">{uploadedFile.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Stocks Found:</span>
                  <span className="ml-2 font-medium">{processedStocks.length}</span>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Validation Warnings</span>
                  </div>
                  <ul className="text-sm text-red-600 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Preview of Uploaded Stocks</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {processedStocks.slice(0, 5).map((stock, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {stock.symbol}
                        </Badge>
                        <span className="font-medium">{stock.name}</span>
                      </div>
                      <div className="text-gray-600">
                        {stock.sector} • {stock.exchange}
                      </div>
                    </div>
                  ))}
                  {processedStocks.length > 5 && (
                    <div className="text-sm text-gray-500 text-center pt-2">
                      +{processedStocks.length - 5} more stocks
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleConfirmUpload} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Upload
                </Button>
                <Button variant="outline" onClick={handleRetry}>
                  Upload Another File
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExcelUpload; 
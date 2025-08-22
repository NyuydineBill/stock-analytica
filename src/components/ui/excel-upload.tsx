import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { useUploadFileMutation, useGetUploadStatusQuery, useGetUploadStocksQuery } from '@/store/api';
import { useToast } from '@/hooks/use-toast';

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
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [processedStocks, setProcessedStocks] = useState<StockData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');

  const { toast } = useToast();
  const [uploadFile] = useUploadFileMutation();

  // RTK Query hooks for upload status and stocks
  const { data: uploadStatus } = useGetUploadStatusQuery(uploadId!, { 
    skip: !uploadId,
    pollingInterval: uploadId ? 2000 : 0
  });

  const { data: uploadStocks } = useGetUploadStocksQuery(uploadId!, { 
    skip: !uploadId || !uploadStatus?.processed 
  });

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
    const spreadsheetFile = files.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.oasis.opendocument.spreadsheet' ||
      file.type === 'text/csv' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls') ||
      file.name.endsWith('.ods') ||
      file.name.endsWith('.csv')
    );

    if (spreadsheetFile) {
      handleFileUpload(spreadsheetFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a spreadsheet file (.xlsx, .xls, .ods, .csv)",
        variant: "destructive"
      });
    }
  }, [toast]);

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
    setCurrentStep('Uploading file...');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload file using RTK Query
      const uploadResult = await uploadFile(formData).unwrap();
      setUploadId(uploadResult.id);
      setCurrentStep('Processing stocks...');
      setProgress(25);

    } catch (error: any) {
      console.error('Upload error:', error);
      setIsProcessing(false);
      setErrors([error.data?.detail || 'Upload failed']);
      toast({
        title: "Upload failed",
        description: error.data?.detail || "Failed to upload file",
        variant: "destructive"
      });
    }
  };

  // Monitor upload processing with useEffect
  useEffect(() => {
    if (uploadStatus?.processed) {
      setProgress(100);
      setCurrentStep('Upload complete!');
      
      // Get processed stocks - handle both response formats
      const stocks = uploadStocks?.results || uploadStocks?.stocks || uploadStocks || [];
      if (Array.isArray(stocks)) {
        const processedStocksData = stocks.map((stock: any) => ({
          symbol: stock.symbol,
          name: stock.name,
          sector: stock.sector,
          exchange: stock.exchange,
          country: stock.country,
          marketCap: stock.market_cap,
          price: stock.current_price
        }));
        setProcessedStocks(processedStocksData);
      }
      
      setIsProcessing(false);
      toast({
        title: "Upload successful",
        description: `Processed ${uploadStatus.stock_count || uploadStatus.count || stocks.length} stocks`,
      });
    } else if (uploadStatus?.validation_errors?.length > 0) {
      setErrors(uploadStatus.validation_errors);
      setIsProcessing(false);
      toast({
        title: "Upload completed with errors",
        description: `${uploadStatus.validation_errors.length} validation errors found`,
        variant: "destructive"
      });
    } else if (uploadId && uploadStatus) {
      const stockCount = uploadStatus.stock_count || uploadStatus.count || 0;
      setProgress(25 + stockCount * 2);
    }
  }, [uploadStatus, uploadStocks, uploadId, toast]);

  const handleConfirmUpload = () => {
    onUploadComplete(processedStocks);
    onClose();
  };

  const handleRetry = () => {
    setUploadedFile(null);
    setUploadId(null);
    setProcessedStocks([]);
    setErrors([]);
    setProgress(0);
    setCurrentStep('');
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
                Upload Spreadsheet File
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your spreadsheet file here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Supported formats: .xlsx, .xls, .ods, .csv
              </p>
              
              <input
                type="file"
                accept=".xlsx,.xls,.ods,.csv"
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
                <span className="text-gray-700">{currentStep}</span>
              </div>
              
              <Progress value={progress} className="w-full" />
              
              <div className="text-sm text-gray-600">
                {uploadStatus && (
                  <div>
                    <p>Stocks processed: {uploadStatus.stock_count || 0}</p>
                    {uploadStatus.validation_errors?.length > 0 && (
                      <p className="text-red-600">
                        Errors: {uploadStatus.validation_errors.length}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Results State
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {errors.length > 0 ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                <span className="text-gray-700">
                  {errors.length > 0 ? 'Upload completed with errors' : 'Upload completed successfully'}
                </span>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {processedStocks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      Processed Stocks ({processedStocks.length})
                    </h4>
                    <Badge variant="secondary">
                      {processedStocks.length} stocks
                    </Badge>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {processedStocks.map((stock, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-gray-900">{stock.symbol}</div>
                          <div className="text-sm text-gray-600">{stock.name}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {stock.sector} • {stock.exchange}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleConfirmUpload} disabled={processedStocks.length === 0}>
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
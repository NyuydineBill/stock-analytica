import { useState, useEffect } from 'react';
import {
  useGetPortfolioStatsQuery,
  useGetSectorPerformanceQuery,
  useGetReportStatusQuery,
  useGetRatingsSummaryQuery,
  useUploadFileMutation,
  useGetUploadStatusQuery,
  useGetUploadStocksQuery,
  Stock,
  PortfolioStats,
  SectorPerformance,
  ReportStatus,
  RatingsSummary,
} from '@/store/api';

export const useDashboard = () => {
  const [uploadedStocks, setUploadedStocks] = useState<Stock[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);

  // API Queries
  const { data: portfolioStats, isLoading: portfolioLoading } = useGetPortfolioStatsQuery();
  const { data: sectorData, isLoading: sectorLoading } = useGetSectorPerformanceQuery();
  const { data: reportStatus, isLoading: reportLoading } = useGetReportStatusQuery();
  const { data: ratingsSummary, isLoading: ratingsLoading } = useGetRatingsSummaryQuery();
  
  // Upload mutations
  const [uploadFile, { isLoading: uploadLoading }] = useUploadFileMutation();
  
  // Upload status queries (only when we have an upload ID)
  const { data: uploadStatus } = useGetUploadStatusQuery(currentUploadId!, {
    skip: !currentUploadId,
    pollingInterval: currentUploadId ? 2000 : 0, // Poll every 2 seconds when uploading
  });
  
  const { data: uploadStocks } = useGetUploadStocksQuery(currentUploadId!, {
    skip: !currentUploadId || !uploadStatus?.processed,
  });

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadFile(formData).unwrap();
      setCurrentUploadId(result.id);
      
      // If already processed, set stocks immediately
      if (result.processed && result.stocks) {
        setUploadedStocks(result.stocks);
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };

  // Monitor upload progress
  useEffect(() => {
    if (uploadStatus?.processed && uploadStocks) {
      // Handle both possible response formats
      const stocks = uploadStocks.results || uploadStocks.stocks || uploadStocks;
      if (Array.isArray(stocks)) {
        setUploadedStocks(stocks);
        setIsUploading(false);
        setCurrentUploadId(null);
      }
    }
  }, [uploadStatus, uploadStocks]);

  // Handle stock selection
  const handleStockSelection = (symbol: string, checked: boolean) => {
    if (checked) {
      setSelectedStocks([...selectedStocks, symbol]);
    } else {
      setSelectedStocks(selectedStocks.filter(s => s !== symbol));
    }
  };

  const handleSelectAll = () => {
    if (selectedStocks.length === (uploadedStocks?.length || 0)) {
      setSelectedStocks([]);
    } else {
      setSelectedStocks((uploadedStocks || []).map(stock => stock.symbol));
    }
  };

  // Get stats for dashboard
  const getStats = () => {
    const stats = [
      {
        title: "Total Stocks",
        value: (uploadedStocks?.length || 0).toString(),
        description: "Uploaded for analysis",
      },
      {
        title: "Generated Reports",
        value: reportStatus?.completed?.toString() || "0",
        description: "Complete research reports",
      },
      {
        title: "Portfolio Value",
        value: portfolioStats ? `$${portfolioStats.total_value.toLocaleString()}` : "$0",
        description: portfolioStats ? `Total return: ${portfolioStats.total_return_percent}%` : "No data",
      },
      {
        title: "Market Performance",
        value: portfolioStats?.market_performance || "+0.0%",
        description: "S&P 500 YTD return",
      }
    ];
    return stats;
  };

  // Get sector performance data
  const getSectorPerformance = () => {
    return sectorData?.sectors || [];
  };

  // Check if stock has report
  const hasReport = (symbol: string) => {
    return reportStatus?.recent_reports?.some(
      report => report.stock_symbol === symbol && report.status === 'completed'
    ) || false;
  };

  // Get stock rating
  const getStockRating = (symbol: string) => {
    return ratingsSummary?.top_rated_stocks?.find(
      stock => stock.stock_symbol === symbol
    )?.rating || 0;
  };

  return {
    // Data
    uploadedStocks: uploadedStocks || [],
    selectedStocks,
    portfolioStats,
    sectorPerformance: getSectorPerformance(),
    reportStatus,
    ratingsSummary,
    
    // Loading states
    isUploading: isUploading || uploadLoading,
    portfolioLoading,
    sectorLoading,
    reportLoading,
    ratingsLoading,
    
    // Stats
    stats: getStats(),
    
    // Actions
    handleFileUpload,
    handleStockSelection,
    handleSelectAll,
    hasReport,
    getStockRating,
    
    // Utilities
    setUploadedStocks,
    setSelectedStocks,
  };
}; 
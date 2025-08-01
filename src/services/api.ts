// API service for future integration with real backend
// Currently uses mock data for demo purposes

import { mockStocks, mockAnalysisResults, mockPortfolio } from '@/data/mockData';
import type { StockData, AnalysisResult } from '@/data/mockData';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface AnalysisRequest {
  symbol: string;
  sections: string[];
  depth: 'standard' | 'comprehensive';
}

export interface RatingRequest {
  symbol: string;
  rating: number;
  notes?: string;
}

class ApiService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  private useMockData = true; // Toggle for demo vs real API

  // Stock Management
  async uploadStockList(file: File): Promise<ApiResponse<StockData[]>> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        data: mockStocks,
        success: true,
        message: `Successfully processed ${mockStocks.length} stocks`
      };
    }

    // Real API implementation would go here
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseUrl}/stocks/upload`, {
        method: 'POST',
        body: formData
      });
      return await response.json();
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to upload stock list'
      };
    }
  }

  async getStocks(): Promise<ApiResponse<StockData[]>> {
    if (this.useMockData) {
      return {
        data: mockStocks,
        success: true
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/stocks`);
      return await response.json();
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to fetch stocks'
      };
    }
  }

  // Analysis Management
  async startAnalysis(request: AnalysisRequest): Promise<ApiResponse<{ analysisId: string }>> {
    if (this.useMockData) {
      // Simulate analysis processing
      await new Promise(resolve => setTimeout(resolve, 5000));
      return {
        data: { analysisId: `analysis_${request.symbol}_${Date.now()}` },
        success: true,
        message: 'Analysis started successfully'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/analysis/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      return await response.json();
    } catch (error) {
      return {
        data: { analysisId: '' },
        success: false,
        error: 'Failed to start analysis'
      };
    }
  }

  async getAnalysisResult(symbol: string): Promise<ApiResponse<AnalysisResult>> {
    if (this.useMockData) {
      const result = mockAnalysisResults[symbol];
      if (!result) {
        return {
          data: {} as AnalysisResult,
          success: false,
          error: 'Analysis not found'
        };
      }
      return {
        data: result,
        success: true
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/analysis/${symbol}`);
      return await response.json();
    } catch (error) {
      return {
        data: {} as AnalysisResult,
        success: false,
        error: 'Failed to fetch analysis'
      };
    }
  }

  async getAnalysisStatus(analysisId: string): Promise<ApiResponse<{ status: string; progress: number }>> {
    if (this.useMockData) {
      // Simulate progress updates
      const progress = Math.min(100, Math.random() * 100);
      const status = progress < 100 ? 'processing' : 'completed';
      
      return {
        data: { status, progress },
        success: true
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/analysis/status/${analysisId}`);
      return await response.json();
    } catch (error) {
      return {
        data: { status: 'error', progress: 0 },
        success: false,
        error: 'Failed to get analysis status'
      };
    }
  }

  // Rating Management
  async saveRating(request: RatingRequest): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        data: { success: true },
        success: true,
        message: 'Rating saved successfully'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      return await response.json();
    } catch (error) {
      return {
        data: { success: false },
        success: false,
        error: 'Failed to save rating'
      };
    }
  }

  async getRatings(): Promise<ApiResponse<{ symbol: string; rating: number; notes?: string }[]>> {
    if (this.useMockData) {
      const ratings = mockStocks
        .filter(stock => stock.rating !== undefined)
        .map(stock => ({
          symbol: stock.symbol,
          rating: stock.rating!,
          notes: `Analysis completed on ${stock.lastAnalysis}`
        }));

      return {
        data: ratings,
        success: true
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/ratings`);
      return await response.json();
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to fetch ratings'
      };
    }
  }

  // Portfolio Management
  async getPortfolio(): Promise<ApiResponse<typeof mockPortfolio>> {
    if (this.useMockData) {
      return {
        data: mockPortfolio,
        success: true
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/portfolio`);
      return await response.json();
    } catch (error) {
      return {
        data: mockPortfolio,
        success: false,
        error: 'Failed to fetch portfolio'
      };
    }
  }

  // Export Management
  async exportReport(symbol: string, format: 'pdf' | 'excel'): Promise<ApiResponse<{ downloadUrl: string }>> {
    if (this.useMockData) {
      // Simulate export generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        data: { downloadUrl: `/exports/${symbol}_report.${format}` },
        success: true,
        message: 'Report exported successfully'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/export/${symbol}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ format })
      });
      return await response.json();
    } catch (error) {
      return {
        data: { downloadUrl: '' },
        success: false,
        error: 'Failed to export report'
      };
    }
  }

  // Utility method to toggle between mock and real API
  setUseMockData(useMock: boolean) {
    this.useMockData = useMock;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    if (this.useMockData) {
      return {
        data: { status: 'healthy', timestamp: new Date().toISOString() },
        success: true
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return await response.json();
    } catch (error) {
      return {
        data: { status: 'unhealthy', timestamp: new Date().toISOString() },
        success: false,
        error: 'Service unavailable'
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService; 
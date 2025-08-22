import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, getHeaders } from '@/config/api';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  last_login: string;
  is_active: boolean;
  profile: {
    user: string;
    subscription_type: string;
    api_calls_limit: number;
    api_calls_used: number;
    api_calls_remaining: number;
    last_reset: string;
    default_analysis_depth: string;
    email_notifications: boolean;
    earnings_alerts: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface Stock {
  id: number;
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  country: string;
  current_price: number | string | null;
  price_change: number | string | null;
  price_change_percent: number | string | null;
  market_cap: string;
  pe_ratio: number | null;
  dividend_yield: number | null;
  volume: number | string | null;
  rating?: number;
  hasReport?: boolean;
}

export interface PortfolioStats {
  total_value: number;
  total_return_percent: number;
  total_stocks: number;
  generated_reports: number;
  market_performance: string;
}

export interface SectorPerformance {
  sector: string;
  performance: number;
  trend: 'up' | 'down';
}

export interface ReportStatus {
  total_reports: number;
  completed: number;
  in_progress: number;
  failed: number;
  recent_reports: Array<{
    id: string; // Changed from number to string since API returns UUIDs
    stock_symbol: string;
    status: string;
    created_at: string;
    progress: number;
  }>;
}

export interface StockRating {
  stock_symbol: string;
  rating: number;
  notes: string;
  created_at: string;
}

export interface RatingsSummary {
  total_ratings: number;
  average_rating: number;
  rating_distribution: Record<string, number>;
  top_rated_stocks: Array<{
    stock_symbol: string;
    stock_name: string;
    rating: number;
    notes: string;
  }>;
}

// New Critical Endpoints Interfaces
export interface RealTimeStockData {
  current_price: number;
  price_change: number;
  price_change_percent: number;
  market_cap: number;
  pe_ratio: number;
  pb_ratio: number;
  ps_ratio: number;
  dividend_yield: number;
  volume: number;
  avg_volume: number;
  week_52_high: number;
  week_52_low: number;
  beta: number;
}

export interface EnhancedValuationData {
  valuation_metrics: {
    dcf_analysis: {
      fair_value: number;
      bull_case: number;
      bear_case: number;
      confidence: number;
    };
    relative_valuation: {
      pe_vs_peers: string;
      pb_vs_peers: string;
      ps_vs_peers: string;
    };
    growth_metrics: {
      revenue_growth_5y: number;
      earnings_growth_5y: number;
      fcf_growth_5y: number;
    };
  };
}

export interface MarketSentimentData {
  analyst_consensus: {
    buy_ratings: number;
    hold_ratings: number;
    sell_ratings: number;
    consensus_price_target: number;
    upside_potential: number;
    recent_upgrades: number;
    recent_downgrades: number;
  };
  institutional_activity: {
    institutional_ownership: number;
    insider_ownership: number;
    short_interest: number;
    short_interest_ratio: number;
  };
  market_indicators: {
    rsi: number;
    macd: number;
    moving_averages: {
      sma_50: number;
      sma_200: number;
    };
  };
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface EnhancedChartData {
  price_charts: {
    daily: ChartDataPoint[];
    weekly: ChartDataPoint[];
    monthly: ChartDataPoint[];
  };
  technical_indicators: {
    rsi: ChartDataPoint[];
    macd: ChartDataPoint[];
    bollinger_bands: {
      upper: ChartDataPoint[];
      middle: ChartDataPoint[];
      lower: ChartDataPoint[];
    };
  };
  volume_analysis: {
    volume_profile: ChartDataPoint[];
    unusual_volume: ChartDataPoint[];
  };
}

export interface NewsEvent {
  date: string;
  type: string;
  title: string;
  impact: 'positive' | 'negative' | 'neutral';
  price_change?: number;
  summary: string;
}

export interface NewsTimelineData {
  recent_events: NewsEvent[];
  upcoming_events: Omit<NewsEvent, 'price_change' | 'summary'>[];
}

export interface PeerStock {
  symbol: string;
  name: string;
  pe_ratio: number;
  pb_ratio: number;
  revenue_growth: number;
  market_cap: number;
}

export interface PeerComparisonData {
  peer_group: PeerStock[];
  relative_performance: {
    vs_peers_1m: number;
    vs_peers_3m: number;
    vs_peers_1y: number;
  };
}

export interface RiskAssessmentData {
  risk_metrics: {
    volatility: number | null;
    beta: number | null;
    var_95: number | null;
    max_drawdown: number | null;
  };
  regulatory_risks: Array<Record<string, 'high' | 'medium' | 'low'>>;
  operational_risks: Array<Record<string, 'high' | 'medium' | 'low'>>;
  last_updated?: string;
}

export interface UploadResponse {
  id: string;
  count: number;
  upload_id: string;
  upload_status: string;
  processed_at: string;
  stocks: Stock[];
  processed: boolean;
  stock_count: number;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  type: 'company_overview' | 'sector_review' | 'valuation_analysis' | 'sentiment_analysis' | 'investment_thesis';
  status: 'completed' | 'in_progress' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string; // Changed from number to string since API returns UUIDs
  stock: number;
  stock_symbol: string;
  stock_name: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  current_step: string;
  sections: ReportSection[];
  created_at: string;
  updated_at: string;
}

// API Slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      // Don't set Content-Type globally - let individual endpoints set it
      // This allows FormData to set its own multipart boundary
      return headers;
    },
  }),
  tagTypes: ['User', 'Stocks', 'Reports', 'Ratings', 'Portfolio', 'Uploads'],
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation<AuthResponse, { username: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
        prepareHeaders: (headers) => {
          const token = localStorage.getItem('access_token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          headers.set('Content-Type', 'application/json');
          return headers;
        },
      }),
    }),
    register: builder.mutation<AuthResponse, {
      username: string;
      email: string;
      password: string;
      password_confirm: string;
      first_name: string;
      last_name: string;
    }>({
      query: (userData) => ({
        url: '/auth/register/',
        method: 'POST',
        body: userData,
        prepareHeaders: (headers) => {
          const token = localStorage.getItem('access_token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          headers.set('Content-Type', 'application/json');
          return headers;
        },
      }),
    }),
    refreshToken: builder.mutation<{ access: string }, { refresh: string }>({
      query: (refreshData) => ({
        url: '/token/refresh/',
        method: 'POST',
        body: refreshData,
        prepareHeaders: (headers) => {
          const token = localStorage.getItem('access_token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          headers.set('Content-Type', 'application/json');
          return headers;
        },
      }),
    }),
    getUserProfile: builder.query<User, void>({
      query: () => '/auth/profile/',
      providesTags: ['User'],
    }),

    // Stocks
    getStocks: builder.query<{ results: Stock[] }, {
      sector?: string;
      exchange?: string;
      search?: string;
      ordering?: string;
      page?: number;
    }>({
      query: (params) => ({
        url: '/stocks/',
        params,
      }),
      providesTags: ['Stocks'],
    }),
    getStockDetails: builder.query<Stock, number>({
      query: (id) => `/stocks/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Stocks', id }],
    }),
    getStockPriceHistory: builder.query<any, { stockId: number; period?: string; interval?: string }>({
      query: ({ stockId, period = '1Y', interval = '1d' }) => ({
        url: `/stocks/${stockId}/price_history/`,
        params: { period, interval },
      }),
    }),

    // Reports - Updated to use available endpoints
    generateReport: builder.mutation<Report, {
      stock_symbol: string;
      include_company_overview?: boolean;
      include_sector_review?: boolean;
      include_valuation_analysis?: boolean;
      include_sentiment_analysis?: boolean;
      include_investment_thesis?: boolean;
    }>({
      query: (reportConfig) => {
        console.log('🔧 API Call - generateReport:', {
          url: '/reports/configure/',
          method: 'POST',
          body: reportConfig
        });
        
        return {
          url: '/reports/configure/',
          method: 'POST',
          body: reportConfig,
          prepareHeaders: (headers) => {
            const token = localStorage.getItem('access_token');
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            console.log('🔧 Headers:', Object.fromEntries(headers.entries()));
            return headers;
          },
        };
      },
      invalidatesTags: ['Reports'],
    }),
    getReport: builder.query<Report, string>({
      query: (id) => `/reports/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Reports', id }],
    }),
    getUserReports: builder.query<{ results: Report[] }, void>({
      query: () => '/reports/',
      providesTags: ['Reports'],
    }),
    getReportSections: builder.query<{ sections: ReportSection[] }, string>({
      query: (reportId) => `/reports/${reportId}/sections/`,
      providesTags: (result, error, reportId) => [{ type: 'Reports', id: reportId }],
    }),
    regenerateReportSection: builder.mutation<ReportSection, {
      reportId: string;
      sectionType: string;
    }>({
      query: ({ reportId, sectionType }) => ({
        url: `/reports/${reportId}/sections/${sectionType}/regenerate/`,
        method: 'POST',
        prepareHeaders: (headers) => {
          const token = localStorage.getItem('access_token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          headers.set('Content-Type', 'application/json');
          return headers;
        },
      }),
      invalidatesTags: (result, error, { reportId }) => [{ type: 'Reports', id: reportId }],
    }),
    getReportStatus: builder.query<ReportStatus, void>({
      query: () => '/reports/', // Use main reports endpoint instead of /status
      providesTags: ['Reports'],
      transformResponse: (response: any) => {
        // Transform the reports list into a status summary format
        if (Array.isArray(response)) {
          const totalReports = response.length;
          const completed = response.filter(r => r.status === 'completed').length;
          const inProgress = response.filter(r => r.status === 'in_progress' || r.status === 'processing').length;
          const failed = response.filter(r => r.status === 'failed').length;
          
          const recentReports = response
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5)
            .map(report => ({
              id: report.id,
              stock_symbol: report.stock_symbol,
              status: report.status,
              created_at: report.created_at,
              progress: report.progress || 0
            }));
          
          return {
            total_reports: totalReports,
            completed,
            in_progress: inProgress,
            failed,
            recent_reports: recentReports
          };
        }
        return {
          total_reports: 0,
          completed: 0,
          in_progress: 0,
          failed: 0,
          recent_reports: []
        };
      },
    }),

    // Ratings
    createRating: builder.mutation<any, {
      stock: number;
      rating: number;
      notes?: string;
      investment_thesis?: string;
    }>({
      query: (ratingData) => ({
        url: '/ratings/',
        method: 'POST',
        body: ratingData,
        prepareHeaders: (headers) => {
          const token = localStorage.getItem('access_token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          headers.set('Content-Type', 'application/json');
          return headers;
        },
      }),
      invalidatesTags: ['Ratings'],
    }),
    getRatingsSummary: builder.query<RatingsSummary, void>({
      query: () => '/ratings/', // Use main ratings endpoint instead of /summary
      providesTags: ['Ratings'],
      transformResponse: (response: any) => {
        // Transform the ratings list into a summary format
        if (Array.isArray(response)) {
          const totalRatings = response.length;
          const averageRating = totalRatings > 0 
            ? response.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings 
            : 0;
          
          const ratingDistribution = response.reduce((acc, rating) => {
            const stars = rating.rating.toString();
            acc[stars] = (acc[stars] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          const topRatedStocks = response
            .filter(rating => rating.rating >= 4)
            .slice(0, 5)
            .map(rating => ({
              stock_symbol: rating.stock_symbol,
              stock_name: rating.stock_name || rating.stock_symbol,
              rating: rating.rating,
              notes: rating.notes || ''
            }));
          
          return {
            total_ratings: totalRatings,
            average_rating: averageRating,
            rating_distribution: ratingDistribution,
            top_rated_stocks: topRatedStocks
          };
        }
        return {
          total_ratings: 0,
          average_rating: 0,
          rating_distribution: {},
          top_rated_stocks: []
        };
      },
    }),

    // Portfolio
    getPortfolioStats: builder.query<PortfolioStats, void>({
      query: () => '/portfolio/stats/',
      providesTags: ['Portfolio'],
    }),
    getUserPortfolio: builder.query<{ results: Stock[] }, void>({
      query: () => '/stocks/portfolio/',
      providesTags: ['Portfolio'],
    }),

    // Market Data
    getSectorPerformance: builder.query<{ sectors: SectorPerformance[] }, void>({
      query: () => '/market/sector-performance/',
    }),

    // New Critical Endpoints
    getRealTimeStockData: builder.query<RealTimeStockData, string>({
      query: (symbol) => `/stocks/${symbol}/current-data/`,
      providesTags: (result, error, symbol) => [{ type: 'StockData', id: symbol }],
    }),

    getEnhancedValuation: builder.query<EnhancedValuationData, string>({
      query: (symbol) => `/stocks/${symbol}/valuation-details/`,
      providesTags: (result, error, symbol) => [{ type: 'Valuation', id: symbol }],
    }),

    getMarketSentiment: builder.query<MarketSentimentData, string>({
      query: (symbol) => `/stocks/${symbol}/market-sentiment/`,
      providesTags: (result, error, symbol) => [{ type: 'Sentiment', id: symbol }],
    }),

    getEnhancedChartData: builder.query<EnhancedChartData, string>({
      query: (symbol) => `/stocks/${symbol}/chart-data/`,
      providesTags: (result, error, symbol) => [{ type: 'ChartData', id: symbol }],
    }),

    getNewsTimeline: builder.query<NewsTimelineData, string>({
      query: (symbol) => `/stocks/${symbol}/news-timeline/`,
      providesTags: (result, error, symbol) => [{ type: 'News', id: symbol }],
    }),

    getPeerComparison: builder.query<PeerComparisonData, string>({
      query: (symbol) => `/stocks/${symbol}/peer-comparison/`,
      providesTags: (result, error, symbol) => [{ type: 'PeerComparison', id: symbol }],
    }),

    getRiskAssessment: builder.query<RiskAssessmentData, string>({
      query: (symbol) => `/stocks/${symbol}/risk-assessment/`,
      providesTags: (result, error, symbol) => [{ type: 'RiskAssessment', id: symbol }],
    }),

    // File Upload
    uploadFile: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: '/uploads/',
        method: 'POST',
        body: formData,
        // Don't set Content-Type for FormData - let browser set multipart boundary
        prepareHeaders: (headers) => {
          const token = localStorage.getItem('access_token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          // Don't set Content-Type - let FormData set its own
          return headers;
        },
      }),
      invalidatesTags: ['Uploads'],
    }),
    getUploadStatus: builder.query<any, string>({
      query: (uploadId) => `/uploads/${uploadId}/`,
      providesTags: (result, error, id) => [{ type: 'Uploads', id }],
    }),
    getUploadStocks: builder.query<{ results: Stock[] }, string>({
      query: (uploadId) => `/uploads/${uploadId}/stocks/`,
      providesTags: (result, error, id) => [{ type: 'Uploads', id }],
    }),

    // News
    getNewsFeed: builder.query<any, {
      stock_symbol?: string;
      category?: string;
      impact?: string;
      months_back?: number;
    }>({
      query: (params) => ({
        url: '/news/',
        params,
      }),
    }),
    analyzeNewsImpact: builder.mutation<any, {
      stock_symbol: string;
      timeframe?: string;
      impact?: string;
      category?: string;
    }>({
      query: (analysisData) => ({
        url: '/news/analyze/',
        method: 'POST',
        body: analysisData,
        prepareHeaders: (headers) => {
          const token = localStorage.getItem('access_token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          headers.set('Content-Type', 'application/json');
          return headers;
        },
      }),
    }),

    // Valuation
    getRelativeValuation: builder.mutation<any, { stock_symbol: string }>({
      query: (data) => ({
        url: '/valuations/relative/',
        method: 'POST',
        body: data,
        prepareHeaders: (headers) => {
          const token = localStorage.getItem('access_token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          headers.set('Content-Type', 'application/json');
          return headers;
        },
      }),
    }),
    getDCFAnalysis: builder.mutation<any, { stock_symbol: string }>({
      query: (data) => ({
        url: '/valuations/dcf/',
        method: 'POST',
        body: data,
        prepareHeaders: (headers) => {
          const token = localStorage.getItem('access_token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          headers.set('Content-Type', 'application/json');
          return headers;
        },
      }),
    }),
  }),
});

// Export hooks
export const {
  // Authentication
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useGetUserProfileQuery,

  // Stocks
  useGetStocksQuery,
  useGetStockDetailsQuery,
  useGetStockPriceHistoryQuery,

  // Reports
  useGenerateReportMutation,
  useGetReportQuery,
  useGetUserReportsQuery,
  useGetReportStatusQuery,
  useGetReportSectionsQuery,
  useRegenerateReportSectionMutation,

  // Ratings
  useCreateRatingMutation,
  useGetRatingsSummaryQuery,

  // Portfolio
  useGetPortfolioStatsQuery,
  useGetUserPortfolioQuery,

  // Market Data
  useGetSectorPerformanceQuery,
  useGetRealTimeStockDataQuery,
  useGetEnhancedValuationQuery,
  useGetMarketSentimentQuery,
  useGetEnhancedChartDataQuery,
  useGetNewsTimelineQuery,
  useGetPeerComparisonQuery,
  useGetRiskAssessmentQuery,

  // File Upload
  useUploadFileMutation,
  useGetUploadStatusQuery,
  useGetUploadStocksQuery,

  // News
  useGetNewsFeedQuery,
  useAnalyzeNewsImpactMutation,

  // Valuation
  useGetRelativeValuationMutation,
  useGetDCFAnalysisMutation,
} = api; 
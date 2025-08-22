import { API_CONFIG, getHeaders, handleApiError } from '@/config/api';

export interface ReportConfigPayload {
  include_company_overview: boolean;
  include_sector_review: boolean;
  include_valuation_analysis: boolean;
  include_sentiment_analysis: boolean;
  include_investment_thesis: boolean;
}

export interface ConfigureReportRequest {
  stock_symbol: string;
  config: ReportConfigPayload;
}

export interface ConfigureReportResponse {
  id?: string | number;
  report_id?: string | number;
  stock_symbol?: string;
  status?: string;
}

// New comprehensive analysis interfaces based on backend specification
export interface ComprehensiveAnalysisRequest {
  stock_symbol: string;
  analysis_depth: 'standard' | 'comprehensive';
  include_company_overview: boolean;
  include_sector_review: boolean;
  include_valuation_analysis: boolean;
  include_sentiment_analysis: boolean;
  include_investment_thesis: boolean;
  report_type: 'individual' | 'comparative' | 'batch';
  estimated_time?: number; // in seconds (optional)
}

export interface ComprehensiveAnalysisResponse {
  status: string;
  message: string;
  report_id: string;
  task_id: string;
  stock_symbol: string;
  analysis_type: string;
  configuration: {
    analysis_depth: 'standard' | 'comprehensive';
    include_company_overview: boolean;
    include_sector_review: boolean;
    include_valuation_analysis: boolean;
    include_sentiment_analysis: boolean;
    include_investment_thesis: boolean;
    report_type: 'individual' | 'comparative' | 'batch';
  };
  estimated_time: number;
}

export interface ComprehensiveReportResponse {
  status: string;
  report: {
    id: string;
    stock_symbol: string;
    stock_name: string;
    status: 'completed' | 'in_progress' | 'failed';
    progress: number;
    current_step: string;
    created_at: string;
    completed_at?: string;
    
    configuration: {
      analysis_depth: 'standard' | 'comprehensive';
      include_company_overview: boolean;
      include_sector_review: boolean;
      include_valuation_analysis: boolean;
      include_sentiment_analysis: boolean;
      include_investment_thesis: boolean;
      report_type: 'individual' | 'comparative' | 'batch';
    };
    
    sections: {
      company_overview?: {
        title: string;
        content: string;
        status: 'completed' | 'in_progress' | 'failed';
        data?: any;
        key_highlights?: string[];
        competitive_advantages?: string[];
        risk_factors?: string[];
        growth_drivers?: string[];
        metrics?: Array<{
          label: string;
          value: string;
          trend: string;
        }>;
        charts?: any[];
        tables?: any[];
        metadata?: any;
        quality_score?: number;
        word_count?: number;
      };
      valuation_analysis?: {
        title: string;
        content: string;
        status: 'completed' | 'in_progress' | 'failed';
        data?: any;
        [key: string]: any;
      };
      sentiment_analysis?: {
        title: string;
        content: string;
        status: 'completed' | 'in_progress' | 'failed';
        data?: any;
        [key: string]: any;
      };
      investment_thesis?: {
        title: string;
        content: string;
        status: 'completed' | 'in_progress' | 'failed';
        data?: any;
        [key: string]: any;
      };
      [key: string]: any;
    };
    
    additional_data?: {
      valuation_analysis?: {
        current_pe?: number;
        current_pb?: number;
        current_ps?: number;
        fair_value?: number;
        valuation_summary?: any;
      };
      market_sentiment?: {
        overall_sentiment?: string;
        confidence_score?: number;
        positive_news_count?: number;
        negative_news_count?: number;
        neutral_news_count?: number;
        upgrades_count?: number;
        downgrades_count?: number;
      };
    };
    
    data_sources: {
      perplexity: 'success' | 'failed' | 'pending';
      gemini: 'success' | 'failed' | 'pending';
      fmp: 'success' | 'failed' | 'pending';
      yahoo?: 'success' | 'failed' | 'pending';
      openai?: 'success' | 'failed' | 'pending';
    };
    
    comprehensive_data_summary?: any;
    
    metadata?: {
      total_sections?: number;
      sections_with_errors?: number;
      data_sources_used?: string[];
      generation_method?: string;
      fallback_sections_used?: boolean;
    };
  };
}

// Legacy interfaces for backward compatibility
export interface GenerateReportRequest {
  stock_symbol: string;
  config: ReportConfigPayload;
}

export interface GenerateReportResponse {
  id?: string | number;
  report_id?: string | number;
  status?: string;
  progress?: number;
}

export interface ReportProgressResponse {
  id: string;
  stock_symbol: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  sections?: any[];
}

export interface BulkConfigureRequest {
  stock_symbols: string[];
  include_company_overview: boolean;
  include_sector_review: boolean;
  include_valuation_analysis: boolean;
  include_sentiment_analysis: boolean;
  include_investment_thesis: boolean;
}

export interface BulkConfigureResponse {
  batch_id: string;
  status: string;
  reports: Array<{
    stock_symbol?: string;
    id?: string | number;
    report_id?: string | number;
    status: string;
  }>;
}

export interface BulkProgressResponse {
  batch_id: string;
  status: string;
  progress: number;
  reports: Array<{
    stock_symbol: string;
    report_id: string;
    status: string;
    progress: number;
  }>;
}

const base = API_CONFIG.BASE_URL;

export async function configureReport(request: ConfigureReportRequest): Promise<ConfigureReportResponse> {
  try {
    const res = await fetch(`${base}/reports/configure/`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      const error: any = { status: res.status, message: await res.text() };
      handleApiError(error);
      throw new Error(`Configure failed (${res.status})`);
    }
    return res.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// New comprehensive analysis function based on backend specification
export async function startComprehensiveAnalysis(request: ComprehensiveAnalysisRequest): Promise<ComprehensiveAnalysisResponse> {
  try {
    const res = await fetch(`${base}/reports/comprehensive/`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      const error: any = { status: res.status, message: await res.text() };
      handleApiError(error);
      throw new Error(`Comprehensive analysis failed (${res.status})`);
    }
    return res.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getComprehensiveReport(reportId: string): Promise<ComprehensiveReportResponse> {
  try {
    const res = await fetch(`${base}/reports/comprehensive/${reportId}/`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const error: any = { status: res.status, message: await res.text() };
      handleApiError(error);
      throw new Error(`Get comprehensive report failed (${res.status})`);
    }
    return res.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Legacy function for backward compatibility
export async function generateReport(request: GenerateReportRequest): Promise<GenerateReportResponse> {
  try {
    const res = await fetch(`${base}/reports/generate/`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      const error: any = { status: res.status, message: await res.text() };
      handleApiError(error);
      throw new Error(`Generate failed (${res.status})`);
    }
    return res.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function bulkConfigure(request: BulkConfigureRequest): Promise<BulkConfigureResponse> {
  try {
    const res = await fetch(`${base}/reports/bulk_configure/`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      const error: any = { status: res.status, message: await res.text() };
      handleApiError(error);
      throw new Error(`Bulk configure failed (${res.status})`);
    }
    return res.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getBulkProgress(batchId: string): Promise<BulkProgressResponse> {
  try {
    const res = await fetch(`${base}/reports/bulk/${batchId}/progress/`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    if (!res.ok) {
      const error: any = { status: res.status, message: await res.text() };
      handleApiError(error);
      throw new Error(`Bulk progress failed (${res.status})`);
    }
    return res.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export function mapSectionsToConfig(sectionIds: string[]): ReportConfigPayload {
  const normalized = new Set(sectionIds);
  return {
    include_company_overview: normalized.has('company-overview') || normalized.has('overview'),
    include_sector_review: normalized.has('sector-review') || normalized.has('sector'),
    include_valuation_analysis: normalized.has('valuation-review') || normalized.has('valuation'),
    include_sentiment_analysis: normalized.has('sentiment-guidance') || normalized.has('sentiment'),
    include_investment_thesis: normalized.has('investment-thesis') || normalized.has('thesis'),
  };
}

export async function getReportProgress(reportId: string): Promise<ReportProgressResponse> {
  try {
    if (!reportId || reportId === 'undefined' || reportId === 'null') {
      throw new Error('Invalid reportId');
    }
    const res = await fetch(`${base}/reports/${reportId}/progress/`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    if (!res.ok) {
      const message = await res.text();
      const error: any = { status: res.status, message };
      // Avoid noisy logs for polling 404s. Surface others.
      if (res.status !== 404) {
        handleApiError(error);
      }
      throw error;
    }
    return res.json();
  } catch (error) {
    // Swallow logging here to keep polling quiet; caller decides.
    throw error;
  }
}

export async function getReport(reportId: string): Promise<any> {
  try {
    const res = await fetch(`${base}/reports/${reportId}/`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    if (!res.ok) {
      const error: any = { status: res.status, message: await res.text() };
      handleApiError(error);
      throw new Error(`Get report failed (${res.status})`);
    }
    return res.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getReportSections(reportId: string): Promise<any> {
  try {
    const res = await fetch(`${base}/reports/${reportId}/sections/`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    if (!res.ok) {
      const error: any = { status: res.status, message: await res.text() };
      handleApiError(error);
      throw new Error(`Get report sections failed (${res.status})`);
    }
    return res.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}


import { ComprehensiveReportResponse } from '@/services/reports';

// Transform new comprehensive report format to old format for backward compatibility
export function transformComprehensiveToLegacy(comprehensiveReport: ComprehensiveReportResponse) {
  const { report } = comprehensiveReport;
  
  // Transform sections object to array format
  const sectionsArray = Object.entries(report.sections).map(([key, section]) => ({
    id: key,
    title: section?.title || toTitle(key),
    content: section?.content || '',
    type: key as any,
    status: section?.status || 'completed',
    created_at: report.created_at,
    updated_at: report.completed_at || report.created_at,
    data: section?.data || {},
  }));

  // Return in old format
  return {
    id: report.id,
    stock_symbol: report.stock_symbol,
    stock_name: report.stock_name,
    status: report.status,
    progress: report.progress,
    current_step: report.current_step,
    sections: sectionsArray,
    created_at: report.created_at,
    updated_at: report.completed_at || report.created_at,
    // Add any additional fields that might be expected
    data_sources: report.data_sources,
  };
}

// Helper function to convert snake_case to Title Case
function toTitle(text: string): string {
  return text
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

// Check if a report is in the new comprehensive format
export function isComprehensiveFormat(report: any): report is ComprehensiveReportResponse {
  return report && 
         report.report && 
         report.report.sections && 
         typeof report.report.sections === 'object' &&
         !Array.isArray(report.report.sections);
} 
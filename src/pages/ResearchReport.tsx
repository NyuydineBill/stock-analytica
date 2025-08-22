import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Star, ChevronRight, CheckCircle, RefreshCw, X, TrendingUp, TrendingDown, PieChart as PieIcon, BarChart2, LineChart as LineIcon, Zap, FileText, AlertTriangle, Shield, Settings, BarChart3 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import StockRating from "@/components/ui/stock-rating";
import PDFExport from "@/components/ui/pdf-export";
import { useGetReportQuery, useGetReportSectionsQuery, useRegenerateReportSectionMutation, useGetRealTimeStockDataQuery, useGetEnhancedValuationQuery, useGetMarketSentimentQuery, useGetEnhancedChartDataQuery, useGetNewsTimelineQuery, useGetPeerComparisonQuery, useGetRiskAssessmentQuery } from "@/store/api";
import { transformComprehensiveToLegacy, isComprehensiveFormat } from "@/utils/reportTransformers";
import { getComprehensiveReport } from "@/services/reports";
import { useToast } from "@/hooks/use-toast";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

// Interfaces
interface ReportSection {
  id: string;
  title: string;
  content: string;
  type: 'company_overview' | 'sector_review' | 'valuation_analysis' | 'sentiment_analysis' | 'investment_thesis';
  status: 'completed' | 'in_progress' | 'failed';
  created_at: string;
  updated_at: string;
  data?: any;
  charts?: any[];
  keyPoints?: string[];
}

interface StockRatingInfo {
  value: number;
  label: string;
  color: string;
  description: string;
}

// Utility Functions
const isPlainObject = (value: unknown): value is Record<string, any> => !!value && typeof value === 'object' && !Array.isArray(value);

const toTitle = (text: string) => text.replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));

// Safe render function to prevent object rendering errors
const safeRender = (value: any): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length > 0 ? `${value.length} items` : 'Empty';
  if (typeof value === 'object') return 'Object data';
  return String(value);
};

const formatMarketCap = (cap?: number) => {
  if (!cap || isNaN(cap)) return '—';
  if (cap >= 1e12) return `${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `${(cap / 1e6).toFixed(2)}M`;
  return cap.toLocaleString();
};

// Safe object entries function to prevent errors when mapping over objects
const safeObjectEntries = (obj: any): [string, any][] => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return [];
  try {
    return Object.entries(obj);
  } catch (error) {
    console.warn('Error getting object entries:', error);
    return [];
  }
};

// Safe object values function
const safeObjectValues = (obj: any): any[] => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return [];
  try {
    return Object.values(obj);
  } catch (error) {
    console.warn('Error getting object values:', error);
    return [];
  }
};

// Chart Rendering Components
const CHART_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6b7280"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-lg">
        <p className="font-bold text-gray-900 text-base mb-2">{label}</p>
        {payload.map((pld: any, index: number) => (
          <div key={index} style={{ color: pld.color }} className="text-sm">
            {`${pld.name}: ${pld.value.toLocaleString()}`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const renderCharts = (charts: any[]) => {
  if (!Array.isArray(charts) || charts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 my-8">
      {charts.map((chart, idx) => {
        if (!chart || !Array.isArray(chart.labels) || !Array.isArray(chart.values)) return null;
        
        const data = chart.labels.map((label: string, i: number) => ({
          name: label,
          value: chart.values[i],
        }));

        const renderChart = () => {
          switch (chart.type) {
            case 'Pie':
              return (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">{`${(percent * 100).toFixed(0)}%`}</text>;
                    }}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconSize={12} />
                  </PieChart>
                </ResponsiveContainer>
              );
            case 'Bar':
              return (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240, 240, 240, 0.7)' }} />
                    <Bar dataKey="value" barSize={25}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              );
            case 'Line':
              return (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} padding={{ left: 20, right: 20 }} />
                    <YAxis tickFormatter={(value) => value.toLocaleString()} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2.5} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              );
            default:
              return <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-x-auto">{JSON.stringify(chart, null, 2)}</pre>;
          }
        };

        const ChartIcon = chart.type === 'Pie' ? PieIcon : chart.type === 'Bar' ? BarChart2 : LineIcon;

        return (
          <Card key={idx} className="bg-white border border-gray-200/80 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
            <CardHeader className="bg-gray-50/80 border-b border-gray-200/80 p-5">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                <ChartIcon className="w-6 h-6 text-blue-600" />
                {chart.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {renderChart()}
              {chart.description && <p className="text-sm text-gray-600 mt-4 text-center px-4">{chart.description}</p>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};


// Structured Data Rendering
const renderStructuredData = (data: any): JSX.Element => {
    if (data === null || data === undefined) return <p className="text-gray-500 italic">Not Available</p>;
    if (typeof data !== 'object') return <p className="text-gray-800 leading-relaxed">{String(data)}</p>;
  
    if (Array.isArray(data)) {
        // If array of primitives, join them. Otherwise, list them.
        if (data.every(item => typeof item !== 'object')) {
            return <p className="text-gray-700">{data.join(", ")}</p>;
        }
        return (
            <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
            {data.map((item, idx) => <li key={idx}>{renderStructuredData(item)}</li>)}
            </ul>
        );
    }
  
    return (
        <div className="space-y-4 mt-2">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4 items-start">
                    <div className="col-span-1 font-semibold text-gray-800 break-words">{toTitle(key)}</div>
                    <div className="col-span-2 text-gray-700">{renderStructuredData(value)}</div>
                </div>
            ))}
        </div>
    );
  };
  
  const renderDataAsCards = (data: any): JSX.Element => {
    if (!isPlainObject(data)) return renderStructuredData(data);
  
    const entries = Object.entries(data);
    if (entries.length === 0) return <></>;
  
    return (
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {entries.map(([key, value]) => (
          <Card key={key} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            <CardHeader className="p-5">
              <CardTitle className="text-lg font-bold text-gray-800">{toTitle(key)}</CardTitle>
            </CardHeader>
            <CardContent className="text-base text-gray-700 px-5 pb-5">
              {isPlainObject(value) && typeof (value as any).text === 'string'
                ? <p className="whitespace-pre-wrap leading-relaxed">{(value as any).text}</p>
                : renderStructuredData(value)}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

// Main Component
const ResearchReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { symbol, id } = useParams();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const [regenerating, setRegenerating] = useState<string | null>(null);

  const reportId = id || location.state?.reportId;
  
  // Debug logging
  console.log('ResearchReport - URL params:', { id, symbol });
  console.log('ResearchReport - reportId:', reportId);
  console.log('ResearchReport - location.state:', location.state);
  console.log('ResearchReport - current URL:', window.location.href);
  console.log('ResearchReport - pathname:', window.location.pathname);
  
  // Validate reportId
  if (reportId && typeof reportId !== 'string') {
    console.error('Invalid reportId:', reportId);
  }
  
  // API Queries
  const { data: report, isLoading: reportLoading, error: reportError } = useGetReportQuery(reportId!, {
    skip: !reportId || typeof reportId !== 'string'
  });
  
  const { data: sectionsData, isLoading: sectionsLoading } = useGetReportSectionsQuery(reportId!, {
    skip: !reportId || typeof reportId !== 'string' || !report
  });

  // New Critical Endpoint Queries
  const { data: realTimeStockData, isLoading: stockDataLoading } = useGetRealTimeStockDataQuery(symbol!, {
    skip: !symbol || typeof symbol !== 'string'
  });

  const { data: enhancedValuation, isLoading: valuationLoading } = useGetEnhancedValuationQuery(symbol!, {
    skip: !symbol || typeof symbol !== 'string'
  });

  const { data: marketSentiment, isLoading: sentimentLoading } = useGetMarketSentimentQuery(symbol!, {
    skip: !symbol || typeof symbol !== 'string'
  });

  const { data: enhancedChartData, isLoading: chartDataLoading } = useGetEnhancedChartDataQuery(symbol!, {
    skip: !symbol || typeof symbol !== 'string'
  });

  const { data: newsTimeline, isLoading: newsLoading } = useGetNewsTimelineQuery(symbol!, {
    skip: !symbol || typeof symbol !== 'string'
  });

  const { data: peerComparison, isLoading: peerLoading } = useGetPeerComparisonQuery(symbol!, {
    skip: !symbol || typeof symbol !== 'string'
  });

  const { data: riskAssessment, isLoading: riskLoading } = useGetRiskAssessmentQuery(symbol!, {
    skip: !symbol || typeof symbol !== 'string'
  });

  const [reportSections, setReportSections] = useState<ReportSection[]>([]);
  const [comprehensiveReport, setComprehensiveReport] = useState<any>(null);
  const [isReloading, setIsReloading] = useState(false);

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set report sections when data is available
  useEffect(() => {
    let processedReport = report;
    
    // Check if this is a new comprehensive format report and transform it
    if (report && isComprehensiveFormat(report)) {
      processedReport = transformComprehensiveToLegacy(report);
    }
    
    if (processedReport?.sections && processedReport.sections.length > 0) {
      setReportSections(processedReport.sections);
    } else if (sectionsData?.sections) {
      setReportSections(sectionsData.sections);
    }
    
    if (reportSections.length > 0 && !activeSection) {
      setActiveSection(reportSections[0].id);
    }
  }, [report, sectionsData?.sections, reportSections.length, activeSection]);

  // Auto-reload comprehensive report data if coming from comprehensive analysis
  useEffect(() => {
    if (location.state?.fromComprehensiveAnalysis && reportId) {
      // Small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        reloadComprehensiveReport();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [reportId, location.state?.fromComprehensiveAnalysis]);

  const loading = reportLoading || sectionsLoading;

  // Regenerate section mutation
  const [regenerateSection, { isLoading: isRegenerating }] = useRegenerateReportSectionMutation();

  // Function to reload comprehensive report data
  const reloadComprehensiveReport = async () => {
    if (!reportId || typeof reportId !== 'string') return;
    
    setIsReloading(true);
    try {
      const comprehensiveData = await getComprehensiveReport(reportId);
      setComprehensiveReport(comprehensiveData);
      
      // Transform to legacy format for compatibility
      if (isComprehensiveFormat(comprehensiveData)) {
        const transformedReport = transformComprehensiveToLegacy(comprehensiveData);
        setReportSections(transformedReport.sections || []);
      }
      
      toast({ title: "Report Reloaded", description: "Latest comprehensive analysis data loaded successfully." });
    } catch (error) {
      console.error('Failed to reload comprehensive report:', error);
      toast({ 
        title: "Reload Failed", 
        description: "Failed to reload the latest report data.", 
        variant: "destructive" 
      });
    } finally {
      setIsReloading(false);
    }
  };

  const handleRegenerateSection = async (sectionId: string, sectionType: string) => {
    if (!reportId || typeof reportId !== 'string') {
      toast({ 
        title: "Error", 
        description: "Invalid report ID. Please go back and try again.", 
        variant: "destructive" 
      });
      return;
    }
    
    setRegenerating(sectionId);
    toast({ title: "Regenerating Section", description: `Asking the AI to rewrite the ${toTitle(sectionType)}...` });
    
    try {
      await regenerateSection({
        reportId: reportId,
        sectionType: sectionType
      }).unwrap();
      
      toast({ title: "Section Regenerated", description: "The section has been updated." });
    } catch (error) {
      toast({ 
        title: "Regeneration Failed", 
        description: "Failed to regenerate the section. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setRegenerating(null);
    }
  };

  const ratingScale: StockRatingInfo[] = useMemo(() => [
    { value: -5, label: "Strong Sell", color: "bg-red-700", description: "High conviction negative view" },
    { value: -3, label: "Sell", color: "bg-red-500", description: "Negative bias" },
    { value: 0, label: "Neutral", color: "bg-gray-500", description: "No strong conviction" },
    { value: 3, label: "Buy", color: "bg-green-500", description: "Positive bias" },
    { value: 5, label: "Strong Buy", color: "bg-green-700", description: "High conviction positive view" }
  ], []);

  const currentRating = ratingScale.find(r => r.value === rating) || ratingScale.find(r => r.value === 0)!;
  const stockInfo = useMemo(() => {
    let processedReport = report;
    
    // Check if this is a new comprehensive format report and transform it
    if (report && isComprehensiveFormat(report)) {
      processedReport = transformComprehensiveToLegacy(report);
    }
    
    return {
      symbol: processedReport?.stock_symbol || symbol || 'UNKNOWN',
      name: processedReport?.stock_name || 'Company',
      price: realTimeStockData?.current_price || processedReport?.current_price,
      change: realTimeStockData?.price_change || processedReport?.price_change,
      marketCap: realTimeStockData?.market_cap || processedReport?.market_cap,
      peRatio: realTimeStockData?.pe_ratio || processedReport?.pe_ratio,
      sector: processedReport?.sector || 'Unknown',
      exchange: processedReport?.exchange || 'Unknown',
      status: processedReport?.status || 'loading',
      progress: processedReport?.progress || 0,
      analysisDepth: processedReport?.analysis_depth || 'standard',
      // Enhanced data from new endpoints
      pbRatio: realTimeStockData?.pb_ratio,
      psRatio: realTimeStockData?.ps_ratio,
      dividendYield: realTimeStockData?.dividend_yield,
      volume: realTimeStockData?.volume,
      week52High: realTimeStockData?.week_52_high,
      week52Low: realTimeStockData?.week_52_low,
      beta: realTimeStockData?.beta,
    };
  }, [report, symbol, realTimeStockData]);

  if (!reportId) {
    return <Layout><div className="text-center p-12 text-lg text-red-600">No report ID provided. Please go back and try again.</div></Layout>;
  }

  if (typeof reportId !== 'string') {
    return <Layout><div className="text-center p-12 text-lg text-red-600">Invalid report ID format. Please go back and try again.</div></Layout>;
  }

  if (loading) {
    return <Layout><div className="flex justify-center items-center h-screen text-lg text-gray-600">Loading financial report...</div></Layout>;
  }

  if (reportError) {
    return <Layout><div className="text-center p-12 text-lg text-red-600">Failed to load report. Please go back and try again.</div></Layout>;
  }

  if (!report) {
    return <Layout><div className="text-center p-12 text-lg text-red-600">Report not found or failed to load. Please go back and try again.</div></Layout>;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100/50">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200/80 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-5">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{stockInfo.name}</h1>
                  <p className="text-base text-gray-600">{stockInfo.symbol} &middot; {stockInfo.exchange}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <Badge variant={stockInfo.status === 'completed' ? 'default' : 'outline'} className={`capitalize ${stockInfo.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'}`}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {toTitle(stockInfo.status)} ({stockInfo.progress}%)
                </Badge>
                
                {/* Reload Button for Comprehensive Analysis */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={reloadComprehensiveReport}
                  disabled={isReloading}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isReloading ? 'animate-spin' : ''}`} />
                  {isReloading ? 'Reloading...' : 'Reload'}
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => setShowRatingModal(true)}>
                  <Star className="h-4 w-4 mr-2" /> Rate
                </Button>
                <Button variant="default" size="sm" onClick={() => setShowPDFExport(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" /> Export PDF
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-10">
          <div className="grid grid-cols-12 gap-10">
            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-3">
              <div className="sticky top-28 space-y-8">
                <Card className="shadow-md rounded-xl">
                  <CardHeader className="p-5"><CardTitle className="text-lg">Table of Contents</CardTitle></CardHeader>
                  <CardContent className="p-5 pt-0">
                    <nav className="space-y-2">
                      {reportSections.map((section, index) => (
                        <a
                          key={section.id}
                          href={`#section-${section.id}`}
                          onClick={(e) => { e.preventDefault(); document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth' }); setActiveSection(section.id); }}
                          className={`flex items-center justify-between p-3 rounded-lg text-base font-medium transition-all duration-200 ${
                            activeSection === section.id ? 'bg-blue-100 text-blue-900 shadow-inner' : 'hover:bg-gray-100/80 hover:text-gray-900'
                          }`}
                        >
                          <span>{index + 1}. {section.title}</span>
                          <ChevronRight className="h-5 w-5" />
                        </a>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
                <Card className="shadow-md rounded-xl">
                  <CardHeader className="p-5"><CardTitle className="text-lg">Your Rating</CardTitle></CardHeader>
                  <CardContent className="p-5 pt-0 space-y-5">
                    <div className="text-center">
                      <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg ${currentRating.color}`}>
                        <Star className="w-10 h-10" />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">{currentRating.label}</h3>
                      <p className="text-base text-gray-600">{currentRating.description}</p>
                    </div>
                    <Button className="w-full py-3 text-base" variant="outline" onClick={() => setShowRatingModal(true)}>Change Rating</Button>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9 space-y-10">
              {/* Key Metrics */}
              <Card className="shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gray-50 p-6 border-b"><CardTitle className="text-xl">Key Financial Metrics</CardTitle></CardHeader>
                <CardContent className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { label: "Current Price", value: stockInfo.price ? `$${stockInfo.price.toFixed(2)}` : '—', change: stockInfo.change, color: "text-gray-900" },
                        { label: "Market Cap", value: formatMarketCap(stockInfo.marketCap), color: "text-gray-900" },
                        { label: "P/E Ratio", value: stockInfo.peRatio?.toFixed(1) || '—', color: "text-gray-900" },
                        { label: "P/B Ratio", value: stockInfo.pbRatio?.toFixed(2) || '—', color: "text-gray-900" },
                        { label: "P/S Ratio", value: stockInfo.psRatio?.toFixed(2) || '—', color: "text-gray-900" },
                        { label: "Dividend Yield", value: stockInfo.dividendYield ? `${stockInfo.dividendYield.toFixed(2)}%` : '—', color: "text-gray-900" },
                        { label: "Volume", value: stockInfo.volume ? stockInfo.volume.toLocaleString() : '—', color: "text-gray-900" },
                        { label: "Beta", value: stockInfo.beta?.toFixed(2) || '—', color: "text-gray-900" },
                    ].map(metric => (
                        <div key={metric.label} className="bg-gray-100/70 p-4 rounded-xl shadow-sm">
                            <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
                            <p className={`text-2xl font-bold my-2 ${metric.color}`}>{metric.value}</p>
                            {metric.change && (
                                <p className={`flex items-center justify-center gap-1.5 text-sm font-semibold ${String(metric.change).startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {String(metric.change).startsWith('+') ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    {metric.change}
                                </p>
                            )}
                        </div>
                    ))}
                </CardContent>
              </Card>

              {/* Comprehensive Analysis Summary */}
              {comprehensiveReport && (
                <Card className="shadow-xl rounded-2xl overflow-hidden border-2 border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <Zap className="w-6 h-6 text-green-600" />
                      Comprehensive Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Data Sources Status */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Data Sources</h4>
                        <div className="space-y-2">
                          {Object.entries(comprehensiveReport.report.data_sources || {}).map(([source, statusData]) => {
                            // Handle the new data structure with source, timestamp, status, error
                            const status = typeof statusData === 'object' ? statusData.status : statusData;
                            const isSuccess = status === 'success';
                            const hasError = status === 'error';
                            
                            return (
                              <div key={source} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700 capitalize">
                                    {source.replace(/_/g, ' ')}
                                  </span>
                                  <Badge 
                                    variant={isSuccess ? 'default' : 'destructive'}
                                    className={isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                  >
                                    {isSuccess ? '✓' : '✗'} {status}
                                  </Badge>
                                </div>
                                {hasError && typeof statusData === 'object' && statusData.error && (
                                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                                    {String(statusData.error).substring(0, 100)}...
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Analysis Quality */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Analysis Quality</h4>
                        <div className="space-y-2">
                          {comprehensiveReport.report.metadata && (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Total Sections</span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {safeRender(comprehensiveReport.report.metadata.total_sections)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Generation Method</span>
                                <span className="text-sm font-semibold text-gray-900 capitalize">
                                  {safeRender(comprehensiveReport.report.metadata.generation_method)?.replace(/_/g, ' ') || 'Unknown'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Data Sources Used</span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {comprehensiveReport.report.metadata.data_sources_used?.length || 0}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Configuration */}
                      {comprehensiveReport.report.configuration && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Analysis Configuration</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Depth</span>
                              <Badge variant="outline" className="capitalize">
                                {comprehensiveReport.report.configuration.analysis_depth}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Report Type</span>
                              <Badge variant="outline" className="capitalize">
                                {comprehensiveReport.report.configuration.report_type}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Sections</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {safeObjectValues(comprehensiveReport.report.configuration).filter(v => v === true).length}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Market Data */}
              {(realTimeStockData || enhancedValuation || marketSentiment) && (
                <Card className="shadow-xl rounded-2xl overflow-hidden border-2 border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      Enhanced Market Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* 52-Week Range */}
                      {realTimeStockData && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">52-Week Range</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">High</span>
                              <span className="text-sm font-semibold text-green-600">${realTimeStockData.week_52_high?.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Low</span>
                              <span className="text-sm font-semibold text-red-600">${realTimeStockData.week_52_low?.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ 
                                  width: `${((stockInfo.price - realTimeStockData.week_52_low) / (realTimeStockData.week_52_high - realTimeStockData.week_52_low)) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Enhanced Valuation */}
                      {enhancedValuation && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Valuation Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Fair Value</span>
                              <span className="text-sm font-semibold text-gray-900">${enhancedValuation.valuation_metrics.dcf_analysis.fair_value?.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Bull Case</span>
                              <span className="text-sm font-semibold text-green-600">${enhancedValuation.valuation_metrics.dcf_analysis.bull_case?.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Bear Case</span>
                              <span className="text-sm font-semibold text-red-600">${enhancedValuation.valuation_metrics.dcf_analysis.bear_case?.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Market Sentiment */}
                      {marketSentiment && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Analyst Consensus</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Buy</span>
                              <span className="text-sm font-semibold text-green-600">{marketSentiment.analyst_consensus.buy_ratings}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Hold</span>
                              <span className="text-sm font-semibold text-yellow-600">{marketSentiment.analyst_consensus.hold_ratings}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Sell</span>
                              <span className="text-sm font-semibold text-red-600">{marketSentiment.analyst_consensus.sell_ratings}</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Target</span>
                                <span className="text-sm font-semibold text-blue-600">${marketSentiment.analyst_consensus.consensus_price_target?.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* News Timeline */}
              {newsTimeline && (
                <Card className="shadow-xl rounded-2xl overflow-hidden border-2 border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <FileText className="w-6 h-6 text-purple-600" />
                      News & Events Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Recent Events */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 text-lg">Recent Events</h4>
                        <div className="space-y-3">
                          {newsTimeline.recent_events.slice(0, 5).map((event, idx) => (
                            <div key={idx} className="bg-white border rounded-lg p-4 shadow-sm">
                              <div className="flex items-start justify-between mb-2">
                                <Badge 
                                  variant={event.impact === 'positive' ? 'default' : event.impact === 'negative' ? 'destructive' : 'outline'}
                                  className={`capitalize ${
                                    event.impact === 'positive' ? 'bg-green-100 text-green-800' : 
                                    event.impact === 'negative' ? 'bg-red-100 text-red-800' : 
                                    'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {event.impact}
                                </Badge>
                                <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                              <h5 className="font-semibold text-gray-900 mb-1">{event.title}</h5>
                              <p className="text-sm text-gray-600 mb-2">{event.summary}</p>
                              {event.price_change && (
                                <div className={`text-sm font-semibold ${event.price_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {event.price_change > 0 ? '+' : ''}{event.price_change}%
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Upcoming Events */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 text-lg">Upcoming Events</h4>
                        <div className="space-y-3">
                          {newsTimeline.upcoming_events.slice(0, 5).map((event, idx) => (
                            <div key={idx} className="bg-white border rounded-lg p-4 shadow-sm">
                              <div className="flex items-start justify-between mb-2">
                                <Badge variant="outline" className="capitalize">
                                  {event.type}
                                </Badge>
                                <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                              <h5 className="font-semibold text-gray-900 mb-1">{event.title}</h5>
                              <Badge 
                                variant="outline" 
                                className={`capitalize ${
                                  event.estimated_impact === 'positive' ? 'border-green-300 text-green-700' : 
                                  event.estimated_impact === 'negative' ? 'border-red-300 text-red-700' : 
                                  'border-gray-300 text-gray-700'
                                }`}
                              >
                                {event.estimated_impact} impact expected
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Peer Comparison */}
              {peerComparison && (
                <Card className="shadow-xl rounded-2xl overflow-hidden border-2 border-orange-200">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 border-b">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <BarChart2 className="w-6 h-6 text-orange-600" />
                      Peer Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Relative Performance */}
                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 text-lg mb-4">Relative Performance vs Peers</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600">1 Month</p>
                            <p className={`text-2xl font-bold ${peerComparison.relative_performance.vs_peers_1m > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {peerComparison.relative_performance.vs_peers_1m > 0 ? '+' : ''}{peerComparison.relative_performance.vs_peers_1m}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">3 Months</p>
                            <p className={`text-2xl font-bold ${peerComparison.relative_performance.vs_peers_3m > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {peerComparison.relative_performance.vs_peers_3m > 0 ? '+' : ''}{peerComparison.relative_performance.vs_peers_3m}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">1 Year</p>
                            <p className={`text-2xl font-bold ${peerComparison.relative_performance.vs_peers_1y > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {peerComparison.relative_performance.vs_peers_1y > 0 ? '+' : ''}{peerComparison.relative_performance.vs_peers_1y}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Peer Group */}
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-4">Peer Group Analysis</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="text-left p-3 border-b font-semibold text-gray-700">Company</th>
                                <th className="text-center p-3 border-b font-semibold text-gray-700">P/E Ratio</th>
                                <th className="text-center p-3 border-b font-semibold text-gray-700">P/B Ratio</th>
                                <th className="text-center p-3 border-b font-semibold text-gray-700">Revenue Growth</th>
                                <th className="text-center p-3 border-b font-semibold text-gray-700">Market Cap</th>
                              </tr>
                            </thead>
                            <tbody>
                              {peerComparison.peer_group.map((peer, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="p-3 border-b">
                                    <div>
                                      <p className="font-semibold text-gray-900">{peer.symbol}</p>
                                      <p className="text-sm text-gray-600">{peer.name}</p>
                                    </div>
                                  </td>
                                  <td className="text-center p-3 border-b text-gray-900">{peer.pe_ratio?.toFixed(1) || '—'}</td>
                                  <td className="text-center p-3 border-b text-gray-900">{peer.pb_ratio?.toFixed(2) || '—'}</td>
                                  <td className="text-center p-3 border-b text-gray-900">{peer.revenue_growth?.toFixed(1)}%</td>
                                  <td className="text-center p-3 border-b text-gray-900">{formatMarketCap(peer.market_cap)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Risk Assessment */}
              {riskAssessment && (
                <Card className="shadow-xl rounded-2xl overflow-hidden border-2 border-red-200">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 p-6 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        Risk Assessment
                      </CardTitle>
                      {riskAssessment.last_updated && (
                        <div className="text-xs text-gray-500">
                          Last updated: {new Date(riskAssessment.last_updated).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Risk Metrics */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-gray-600" />
                          Risk Metrics
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">Volatility</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {riskAssessment.risk_metrics.volatility !== null ? riskAssessment.risk_metrics.volatility.toFixed(2) : '—'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">Beta</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {riskAssessment.risk_metrics.beta !== null ? riskAssessment.risk_metrics.beta.toFixed(2) : '—'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">VaR (95%)</span>
                            <span className="text-sm font-semibold text-red-600">
                              {riskAssessment.risk_metrics.var_95 !== null ? `${riskAssessment.risk_metrics.var_95.toFixed(1)}%` : '—'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">Max Drawdown</span>
                            <span className="text-sm font-semibold text-red-600">
                              {riskAssessment.risk_metrics.max_drawdown !== null ? `${riskAssessment.risk_metrics.max_drawdown.toFixed(1)}%` : '—'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Regulatory Risks */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-600" />
                          Regulatory Risks
                        </h4>
                        <div className="space-y-2">
                          {riskAssessment.regulatory_risks.map((riskObj, index) => {
                            const [riskType, level] = Object.entries(riskObj)[0];
                            return (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-700 capitalize">{riskType.replace(/_/g, ' ')}</span>
                                <Badge 
                                  variant={level === 'high' ? 'destructive' : level === 'medium' ? 'default' : 'outline'}
                                  className={`capitalize ${
                                    level === 'high' ? 'bg-red-100 text-red-800 border-red-200' : 
                                    level === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                                    'bg-green-100 text-green-800 border-green-200'
                                  }`}
                                >
                                  {level}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Operational Risks */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-gray-600" />
                          Operational Risks
                        </h4>
                        <div className="space-y-2">
                          {riskAssessment.operational_risks.map((riskObj, index) => {
                            const [riskType, level] = Object.entries(riskObj)[0];
                            return (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-700 capitalize">{riskType.replace(/_/g, ' ')}</span>
                                <Badge 
                                  variant={level === 'high' ? 'destructive' : level === 'medium' ? 'default' : 'outline'}
                                  className={`capitalize ${
                                    level === 'high' ? 'bg-red-100 text-red-800 border-red-200' : 
                                    level === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                                    'bg-green-100 text-green-800 border-green-200'
                                  }`}
                                >
                                  {level}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Risk Summary */}
                    <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">Risk Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-red-700">
                            High Risk: {riskAssessment.regulatory_risks.filter(r => Object.values(r)[0] === 'high').length + 
                                       riskAssessment.operational_risks.filter(r => Object.values(r)[0] === 'high').length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-yellow-700">
                            Medium Risk: {riskAssessment.regulatory_risks.filter(r => Object.values(r)[0] === 'medium').length + 
                                         riskAssessment.operational_risks.filter(r => Object.values(r)[0] === 'medium').length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-green-700">
                            Low Risk: {riskAssessment.regulatory_risks.filter(r => Object.values(r)[0] === 'low').length + 
                                      riskAssessment.operational_risks.filter(r => Object.values(r)[0] === 'low').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Chart Data */}
              {enhancedChartData && (
                <Card className="shadow-xl rounded-2xl overflow-hidden border-2 border-indigo-200">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <LineIcon className="w-6 h-6 text-indigo-600" />
                      Advanced Technical Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      {/* Price Charts */}
                      {enhancedChartData.price_charts && (
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg mb-4">Price Performance</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {safeObjectEntries(enhancedChartData.price_charts).map(([period, data]) => {
                              // Ensure data is a valid array
                              if (!Array.isArray(data) || data.length === 0) return null;
                              
                              return (
                                <div key={period} className="bg-white border rounded-lg p-4">
                                  <h5 className="font-semibold text-gray-900 mb-3 capitalize">{period} Chart</h5>
                                  <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={data}>
                                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                      <XAxis 
                                        dataKey="date" 
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                      />
                                      <YAxis tick={{ fontSize: 10 }} />
                                      <Tooltip 
                                        content={({ active, payload, label }) => {
                                          if (active && payload && payload.length) {
                                            return (
                                              <div className="bg-white p-3 rounded-lg border shadow-lg">
                                                <p className="font-semibold">{new Date(label).toLocaleDateString()}</p>
                                                <p className="text-blue-600">Price: ${payload[0].value?.toFixed(2)}</p>
                                              </div>
                                            );
                                          }
                                          return null;
                                        }}
                                      />
                                      <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#3b82f6" 
                                        strokeWidth={2} 
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Technical Indicators */}
                      {enhancedChartData.technical_indicators && (
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg mb-4">Technical Indicators</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* RSI */}
                            {enhancedChartData.technical_indicators.rsi && (
                              <div className="bg-white border rounded-lg p-4">
                                <h5 className="font-semibold text-gray-900 mb-3">RSI (Relative Strength Index)</h5>
                                <ResponsiveContainer width="100%" height={200}>
                                  <LineChart data={enhancedChartData.technical_indicators.rsi}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                    <XAxis 
                                      dataKey="date" 
                                      tick={{ fontSize: 10 }}
                                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                    />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                                    <Tooltip 
                                      content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                          return (
                                            <div className="bg-white p-3 rounded-lg border shadow-lg">
                                              <p className="font-semibold">{new Date(label).toLocaleDateString()}</p>
                                              <p className="text-blue-600">RSI: {payload[0].value?.toFixed(1)}</p>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Line 
                                      type="monotone" 
                                      dataKey="value" 
                                      stroke="#8b5cf6" 
                                      strokeWidth={2} 
                                      dot={false}
                                    />
                                    {/* Overbought/oversold lines */}
                                    <Line 
                                      type="monotone" 
                                      data={[{ date: '0', value: 70 }, { date: '1', value: 70 }]} 
                                      dataKey="value" 
                                      stroke="#ef4444" 
                                      strokeDasharray="5 5"
                                      strokeOpacity={0.5}
                                    />
                                    <Line 
                                      type="monotone" 
                                      data={[{ date: '0', value: 30 }, { date: '1', value: 30 }]} 
                                      dataKey="value" 
                                      stroke="#ef4444" 
                                      strokeDasharray="5 5"
                                      strokeOpacity={0.5}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            )}

                            {/* MACD */}
                            {enhancedChartData.technical_indicators.macd && (
                              <div className="bg-white border rounded-lg p-4">
                                <h5 className="font-semibold text-gray-900 mb-3">MACD (Moving Average Convergence Divergence)</h5>
                                <ResponsiveContainer width="100%" height={200}>
                                  <BarChart data={enhancedChartData.technical_indicators.macd}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                    <XAxis 
                                      dataKey="date" 
                                      tick={{ fontSize: 10 }}
                                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                    />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip 
                                      content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                          return (
                                            <div className="bg-white p-3 rounded-lg border shadow-lg">
                                              <p className="font-semibold">{new Date(label).toLocaleDateString()}</p>
                                              <p className="text-blue-600">MACD: {payload[0].value?.toFixed(2)}</p>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Bar 
                                      dataKey="value" 
                                      fill={enhancedChartData.technical_indicators.macd.map((d: any) => d.value > 0 ? '#10b981' : '#ef4444')}
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Volume Analysis */}
                      {enhancedChartData.volume_analysis && (
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg mb-4">Volume Analysis</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {enhancedChartData.volume_analysis.volume_profile && (
                              <div className="bg-white border rounded-lg p-4">
                                <h5 className="font-semibold text-gray-900 mb-3">Volume Profile</h5>
                                <ResponsiveContainer width="100%" height={200}>
                                  <BarChart data={enhancedChartData.volume_analysis.volume_profile}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                    <XAxis 
                                      dataKey="date" 
                                      tick={{ fontSize: 10 }}
                                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                    />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip 
                                      content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                          return (
                                            <div className="bg-white p-3 rounded-lg border shadow-lg">
                                              <p className="font-semibold">{new Date(label).toLocaleDateString()}</p>
                                              <p className="text-blue-600">Volume: {payload[0].value?.toLocaleString()}</p>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Bar dataKey="value" fill="#f59e0b" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            )}

                            {enhancedChartData.volume_analysis.unusual_volume && (
                              <div className="bg-white border rounded-lg p-4">
                                <h5 className="font-semibold text-gray-900 mb-3">Unusual Volume</h5>
                                <ResponsiveContainer width="100%" height={200}>
                                  <BarChart data={enhancedChartData.volume_analysis.unusual_volume}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                    <XAxis 
                                      dataKey="date" 
                                      tick={{ fontSize: 10 }}
                                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                    />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip 
                                      content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                          return (
                                            <div className="bg-white p-3 rounded-lg border shadow-lg">
                                              <p className="font-semibold">{new Date(label).toLocaleDateString()}</p>
                                              <p className="text-blue-600">Volume: {payload[0].value?.toLocaleString()}</p>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Bar dataKey="value" fill="#ec4899" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Report Sections */}
              {reportSections.map((section, index) => {
                // Get the comprehensive section data if available
                const comprehensiveSection = comprehensiveReport?.report?.sections?.[section.id];
                const hasEnhancedData = comprehensiveSection?.data?.enhanced_content;
                
                return (
                  <Card key={section.id} id={`section-${section.id}`} className="scroll-mt-28 shadow-xl rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gray-50 p-6 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">
                            {index + 1}
                          </span>
                          <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
                          {section.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-500" />}
                        </div>
                        
                        {/* Section Quality Score */}
                        {comprehensiveSection?.quality_score && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Quality:</span>
                            <Badge 
                              variant={comprehensiveSection.quality_score >= 0.8 ? 'default' : comprehensiveSection.quality_score >= 0.6 ? 'secondary' : 'destructive'}
                              className={comprehensiveSection.quality_score >= 0.8 ? 'bg-green-100 text-green-800' : comprehensiveSection.quality_score >= 0.6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                            >
                              {Math.round(comprehensiveSection.quality_score * 100)}%
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      {/* Section Metadata */}
                      {comprehensiveSection?.metadata && (
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                          {comprehensiveSection.metadata.word_count && (
                            <span>📝 {comprehensiveSection.metadata.word_count} words</span>
                          )}
                          {comprehensiveSection.metadata.has_charts && (
                            <span>📊 Charts available</span>
                          )}
                          {comprehensiveSection.metadata.has_tables && (
                            <span>📋 Tables available</span>
                          )}
                          {comprehensiveSection.metadata.has_metrics && (
                            <span>📈 Metrics available</span>
                          )}
                        </div>
                      )}
                    </CardHeader>
                    
                    <CardContent className="p-8">
                      {/* Enhanced Content Display */}
                      {hasEnhancedData && (
                        <div className="space-y-8">
                          {/* Main Content */}
                          <div className="prose prose-gray max-w-none prose-lg">
                            <div dangerouslySetInnerHTML={{ __html: comprehensiveSection.data.enhanced_content.content?.replace(/\n/g, '<br/>') || section.content }} />
                          </div>
                          
                          {/* Key Highlights */}
                          {comprehensiveSection.key_highlights && comprehensiveSection.key_highlights.length > 0 && (
                            <div className="bg-blue-50 p-6 rounded-xl">
                              <h4 className="text-lg font-semibold text-blue-900 mb-4">🎯 Key Highlights</h4>
                              <ul className="space-y-2">
                                {comprehensiveSection.key_highlights.map((highlight, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span className="text-blue-800">{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Competitive Advantages */}
                          {comprehensiveSection.competitive_advantages && comprehensiveSection.competitive_advantages.length > 0 && (
                            <div className="bg-green-50 p-6 rounded-xl">
                              <h4 className="text-lg font-semibold text-green-900 mb-4">🏆 Competitive Advantages</h4>
                              <ul className="space-y-2">
                                {comprehensiveSection.competitive_advantages.map((advantage, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span className="text-green-800">{advantage}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Risk Factors */}
                          {comprehensiveSection.risk_factors && comprehensiveSection.risk_factors.length > 0 && (
                            <div className="bg-red-50 p-6 rounded-xl">
                              <h4 className="text-lg font-semibold text-red-900 mb-4">⚠️ Risk Factors</h4>
                              <ul className="space-y-2">
                                {comprehensiveSection.risk_factors.map((risk, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span className="text-red-800">{risk}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Growth Drivers */}
                          {comprehensiveSection.growth_drivers && comprehensiveSection.growth_drivers.length > 0 && (
                            <div className="bg-purple-50 p-6 rounded-xl">
                              <h4 className="text-lg font-semibold text-purple-900 mb-4">🚀 Growth Drivers</h4>
                              <ul className="space-y-2">
                                {comprehensiveSection.growth_drivers.map((driver, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-purple-600 mt-1">•</span>
                                    <span className="text-purple-800">{driver}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Metrics */}
                          {comprehensiveSection.metrics && comprehensiveSection.metrics.length > 0 && (
                            <div className="bg-gray-50 p-6 rounded-xl">
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Key Metrics</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {comprehensiveSection.metrics.map((metric, idx) => (
                                  <div key={idx} className="bg-white p-4 rounded-lg border">
                                    <div className="text-sm text-gray-600">{metric.label}</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                      {metric.value}{metric.unit}
                                    </div>
                                    {metric.description && (
                                      <div className="text-xs text-gray-500 mt-1">{metric.description}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Charts */}
                          {comprehensiveSection.charts && comprehensiveSection.charts.length > 0 && (
                            <div className="bg-white border rounded-xl p-6">
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">📈 Charts & Visualizations</h4>
                              <div className="space-y-8">
                                {comprehensiveSection.charts.map((chart, idx) => (
                                  <div key={idx} className="border rounded-lg p-6">
                                    <h5 className="font-semibold text-gray-800 mb-2">{chart.title}</h5>
                                    <p className="text-sm text-gray-600 mb-4">{chart.description}</p>
                                    
                                    {/* Render actual charts based on type */}
                                    <div className="h-80 w-full">
                                      {chart.type === 'Pie' && chart.labels && chart.values && (
                                        <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                            <Pie
                                              data={chart.labels.map((label, i) => ({
                                                name: label,
                                                value: chart.values[i],
                                                fill: CHART_COLORS[i % CHART_COLORS.length]
                                              }))}
                                              cx="50%"
                                              cy="50%"
                                              outerRadius={80}
                                              labelLine={false}
                                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            />
                                            <Tooltip 
                                              content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                  return (
                                                    <div className="bg-white p-3 rounded-lg border shadow-lg">
                                                      <p className="font-semibold">{payload[0].name}</p>
                                                      <p className="text-blue-600">Value: {payload[0].value}</p>
                                                    </div>
                                                  );
                                                }
                                                return null;
                                              }}
                                            />
                                          </PieChart>
                                        </ResponsiveContainer>
                                      )}
                                      
                                      {chart.type === 'Bar' && chart.labels && chart.values && (
                                        <ResponsiveContainer width="100%" height="100%">
                                          <BarChart data={chart.labels.map((label, i) => ({
                                            name: label,
                                            value: chart.values[i]
                                          }))}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip 
                                              content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                  return (
                                                    <div className="bg-white p-3 rounded-lg border shadow-lg">
                                                      <p className="font-semibold">{payload[0].name}</p>
                                                      <p className="text-blue-600">Value: {payload[0].value}</p>
                                                    </div>
                                                  );
                                                }
                                                return null;
                                              }}
                                            />
                                            <Bar dataKey="value" fill="#3b82f6" />
                                          </BarChart>
                                        </ResponsiveContainer>
                                      )}
                                      
                                      {chart.type === 'Line' && chart.labels && chart.values && (
                                        <ResponsiveContainer width="100%" height="100%">
                                          <LineChart data={chart.labels.map((label, i) => ({
                                            name: label,
                                            value: chart.values[i]
                                          }))}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip 
                                              content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                  return (
                                                    <div className="bg-white p-3 rounded-lg border shadow-lg">
                                                      <p className="font-semibold">{payload[0].name}</p>
                                                      <p className="text-blue-600">Value: {payload[0].value}</p>
                                                    </div>
                                                  );
                                                }
                                                return null;
                                              }}
                                            />
                                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                                          </LineChart>
                                        </ResponsiveContainer>
                                      )}
                                      
                                      {/* Fallback for unsupported chart types */}
                                      {!['Pie', 'Bar', 'Line'].includes(chart.type) && (
                                        <div className="bg-gray-50 p-4 rounded text-center h-full flex items-center justify-center">
                                          <span className="text-gray-500">Chart type "{chart.type}" not yet supported</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Chart Legend */}
                                    {chart.labels && chart.values && (
                                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {chart.labels.map((label, i) => (
                                          <div key={i} className="flex items-center gap-2 text-sm">
                                            <div 
                                              className="w-3 h-3 rounded-full" 
                                              style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                                            />
                                            <span className="text-gray-700">{label}</span>
                                            <span className="text-gray-500 font-medium">
                                              {chart.type === 'Pie' 
                                                ? `${((chart.values[i] / chart.values.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%`
                                                : chart.values[i]
                                              }
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Tables */}
                          {comprehensiveSection.tables && comprehensiveSection.tables.length > 0 && (
                            <div className="bg-white border rounded-xl p-6">
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Data Tables</h4>
                              <div className="space-y-6">
                                {comprehensiveSection.tables.map((table, idx) => (
                                  <div key={idx} className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b">
                                      <h5 className="font-semibold text-gray-800">{table.title}</h5>
                                    </div>
                                    <div className="overflow-x-auto">
                                      <table className="w-full">
                                        <thead className="bg-gray-100">
                                          <tr>
                                            {table.columns?.map((col, colIdx) => (
                                              <th key={colIdx} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                                {col}
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {table.rows?.map((row, rowIdx) => (
                                            <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                              {row.map((cell, cellIdx) => (
                                                <td key={cellIdx} className="px-4 py-2 text-sm text-gray-600">
                                                  {cell}
                                                </td>
                                              ))}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Fallback to basic content if no enhanced data */}
                      {!hasEnhancedData && (
                        <div className="prose prose-gray max-w-none prose-lg">
                          <p>{section.content}</p>
                        </div>
                      )}
                      
                      {/* Regenerate Button */}
                      <div className="mt-6 pt-6 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRegenerateSection(section.id, section.type)} 
                          disabled={regenerating === section.id || isRegenerating}
                          className="w-full"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${regenerating === section.id ? 'animate-spin' : ''}`} />
                          Regenerate {section.title}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>

        {/* Modals */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-2xl rounded-2xl">
                <CardHeader className="p-6 flex flex-row items-center justify-between border-b">
                    <CardTitle className="text-2xl">Rate {stockInfo.symbol}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowRatingModal(false)}><X className="h-5 w-5" /></Button>
                </CardHeader>
                <CardContent className="p-6">
                    <StockRating
                        symbol={stockInfo.symbol}
                        name={stockInfo.name}
                        currentRating={rating}
                        currentNotes={notes}
                        onRatingChange={(newRating, newNotes) => { setRating(newRating); setNotes(newNotes); setShowRatingModal(false); }}
                        onRatingHistory={() => {}}
                    />
                </CardContent>
            </Card>
          </div>
        )}

        {showPDFExport && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl shadow-2xl rounded-2xl">
                    <CardHeader className="p-6 flex flex-row items-center justify-between border-b">
                        <CardTitle className="text-2xl">Export PDF - {stockInfo.symbol}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setShowPDFExport(false)}><X className="h-5 w-5" /></Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        <PDFExport
                            stockSymbol={stockInfo.symbol}
                            stockName={stockInfo.name}
                            reportData={report}
                            rating={rating}
                            ratingNotes={notes}
                            onExportComplete={() => setShowPDFExport(false)}
                        />
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default ResearchReport;
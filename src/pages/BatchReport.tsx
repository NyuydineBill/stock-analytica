import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, FileText, CheckCircle, Clock, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import Layout from "@/components/layout/Layout";
// import { useGetReportQuery } from "@/store/api";
import { getBulkProgress } from "@/services/reports";

interface GeneratedReport {
  id: number;
  stock_symbol: string;
  stock_name: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  current_step: string;
  created_at: string;
}

const BatchReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state
  const generatedReports: GeneratedReport[] = location.state?.generatedReports || [];
  const selectedStocks: string[] = location.state?.selectedStocks || [];
  const stocksData: any[] = location.state?.stocksData || [];
  
  const [reportStatuses, setReportStatuses] = useState<GeneratedReport[]>(generatedReports);
  const [completedReports, setCompletedReports] = useState<GeneratedReport[]>([]);
  const [failedReports, setFailedReports] = useState<GeneratedReport[]>([]);

  // Poll for report status updates (real backend)
  useEffect(() => {
    const batchId = location.state?.batchId;
    if (!batchId) return;

    let isCancelled = false;
    let timeoutRef: number | null = null;

    const poll = async () => {
      try {
        const res = await getBulkProgress(batchId);
        if (isCancelled) return;
        const updatedReports: GeneratedReport[] = res.reports.map(r => ({
          id: String((r as any).id ?? (r as any).report_id ?? '' ) as unknown as number,
          stock_symbol: r.stock_symbol,
          stock_name: stocksData.find(s => s.symbol === r.stock_symbol)?.name || r.stock_symbol,
          status: (r.status as any) || 'in_progress',
          progress: r.progress || 0,
          current_step: '',
          created_at: new Date().toISOString(),
        }));
        setReportStatuses(updatedReports);
        setCompletedReports(updatedReports.filter(r => r.status === 'completed'));
        setFailedReports(updatedReports.filter(r => r.status === 'failed'));
        if (res.progress < 100) {
          timeoutRef = window.setTimeout(poll, 2000);
        }
      } catch (e) {
        if (!isCancelled) {
          timeoutRef = window.setTimeout(poll, 3000);
        }
      }
    };

    poll();
    return () => { isCancelled = true; if (timeoutRef) clearTimeout(timeoutRef); };
  }, [location.state, stocksData]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewReport = (report: GeneratedReport) => {
    if (report.status === 'completed') {
      navigate(`/report/${report.stock_symbol}`, { 
        state: { reportId: report.id }
      });
    }
  };

  const handleDownloadAll = () => {
    // Implementation for downloading all completed reports
    console.log('Downloading all completed reports...');
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Batch Report Generation</h1>
              <p className="text-gray-600">
                AI analysis progress for {selectedStocks.length} stocks
              </p>
            </div>
          </div>
          {completedReports.length > 0 && (
            <Button
              onClick={handleDownloadAll}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download All Reports
            </Button>
          )}
        </div>

        {/* Progress Summary */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{reportStatuses.length}</div>
                  <div className="text-sm text-gray-600">Total Reports</div>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{completedReports.length}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {reportStatuses.filter(r => r.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <Clock className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{failedReports.length}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Status List */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Report Status</CardTitle>
            <CardDescription>
              Real-time progress of AI analysis for each stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportStatuses.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(report.status)}
                    <div>
                      <div className="font-semibold text-gray-900">{report.stock_symbol}</div>
                      <div className="text-sm text-gray-600">{report.stock_name}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {report.current_step || 'Initializing...'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(report.progress)}% complete
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(report.status)}>
                      {report.status.replace('_', ' ')}
                    </Badge>
                    
                    {report.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        View Report
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Summary */}
        {completedReports.length > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Analysis Summary
              </CardTitle>
              <CardDescription>
                Key insights from completed reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Top Performers</h4>
                  <div className="space-y-2">
                    {completedReports.slice(0, 3).map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="font-medium">{report.stock_symbol}</span>
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          Analysis Complete
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Sector Breakdown</h4>
                  <div className="space-y-2">
                    {stocksData.slice(0, 3).map((stock, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="font-medium">{stock.sector || 'N/A'}</span>
                        <span className="text-sm text-gray-600">{stock.symbol}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default BatchReport; 
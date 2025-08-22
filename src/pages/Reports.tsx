import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useGetUserReportsQuery } from '@/store/api';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: string; // Changed from number to string since API returns UUIDs
  stock: number;
  stock_symbol: string;
  stock_name: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  current_step: string;
  created_at: string;
  updated_at: string;
}

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: reportsData, isLoading, error, refetch } = useGetUserReportsQuery();
  
  const reports = reportsData?.results || [];
  
  // Debug logging
  console.log('Reports - reportsData:', reportsData);
  console.log('Reports - reports array:', reports);
  if (reports.length > 0) {
    console.log('Reports - first report:', reports[0]);
    console.log('Reports - first report.id:', reports[0].id, 'type:', typeof reports[0].id);
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'queued':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'queued':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Queued</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'in_progress':
        return 'bg-blue-600';
      case 'queued':
        return 'bg-yellow-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReportClick = (report: Report) => {
    console.log('Reports - handleReportClick called with:', report);
    console.log('Reports - report.id:', report.id, 'type:', typeof report.id);
    
    if (report.status === 'completed') {
      // Navigate to the new comprehensive report view
      const url = `/report/${report.id}`;
      console.log('Reports - navigating to comprehensive report:', url);
      navigate(url, { 
        state: { 
          reportId: report.id,
          stockSymbol: report.stock_symbol,
          fromComprehensiveAnalysis: true 
        } 
      });
    } else {
      // Show toast for incomplete reports
      toast({
        title: "Report Not Ready",
        description: `The ${report.stock_symbol} report is still ${report.status.replace('_', ' ')}. Please wait for completion.`,
        variant: "default"
      });
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing",
      description: "Fetching latest report status...",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading reports...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center p-12">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Reports</h2>
          <p className="text-gray-600 mb-4">Failed to load your research reports.</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  const completedReports = reports.filter(r => r.status === 'completed');
  const inProgressReports = reports.filter(r => r.status === 'in_progress');
  const queuedReports = reports.filter(r => r.status === 'queued');
  const failedReports = reports.filter(r => r.status === 'failed');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Research Reports</h1>
              <p className="text-gray-600 mt-2">Track and manage your AI-generated equity research reports</p>
            </div>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedReports.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <RefreshCw className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgressReports.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{failedReports.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
                <p className="text-gray-600 mb-4">Start by generating your first research report from the dashboard.</p>
                <Button onClick={() => navigate('/')}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card 
                key={report.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  report.status === 'completed' ? 'hover:border-blue-300' : ''
                }`}
                onClick={() => handleReportClick(report)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(report.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {report.stock_symbol} - {report.stock_name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(report.status)}
                            {report.status === 'in_progress' && (
                              <span className="text-sm text-gray-600">
                                {report.current_step}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Created</div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(report.created_at)}
                        </div>
                      </div>
                      
                      {report.status === 'completed' && (
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4 mr-2" />
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar for In Progress Reports */}
                  {report.status === 'in_progress' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{report.progress}%</span>
                      </div>
                      <Progress value={report.progress} className="h-2" />
                    </div>
                  )}
                  
                  {/* Last Updated */}
                  <div className="mt-4 text-xs text-gray-500">
                    Last updated: {formatDate(report.updated_at)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports; 
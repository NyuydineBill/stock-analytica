import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UploadZone from "@/components/ui/upload-zone";
import StockCard from "@/components/ui/stock-card";
import { FileText, TrendingUp, BarChart3, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Stock {
  symbol: string;
  name: string;
  sector?: string;
  exchange?: string;
  country?: string;
  rating?: number;
  hasReport?: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [uploadedStocks, setUploadedStocks] = useState<Stock[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for demonstration
  const mockStocks: Stock[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      sector: "Technology",
      exchange: "NASDAQ",
      country: "US",
      rating: 4,
      hasReport: true
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      sector: "Technology",
      exchange: "NASDAQ",
      country: "US",
      rating: 3,
      hasReport: true
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      sector: "Technology",
      exchange: "NASDAQ",
      country: "US"
    }
  ];

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      setUploadedStocks(mockStocks);
      setIsUploading(false);
    }, 2000);
  };

  const stats = [
    {
      title: "Total Stocks",
      value: uploadedStocks.length.toString(),
      description: "Uploaded for analysis",
      icon: BarChart3
    },
    {
      title: "Generated Reports",
      value: uploadedStocks.filter(stock => stock.hasReport).length.toString(),
      description: "Complete research reports",
      icon: FileText
    },
    {
      title: "Rated Stocks",
      value: uploadedStocks.filter(stock => stock.rating !== undefined).length.toString(),
      description: "With manual ratings",
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Upload stock lists and generate professional equity research reports
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Section */}
      {uploadedStocks.length === 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Get Started</h2>
            <p className="text-muted-foreground">
              Upload your Excel stock list to begin generating research reports
            </p>
          </div>
          <UploadZone 
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            className="max-w-2xl"
          />
        </div>
      )}

      {/* Stock List */}
      {uploadedStocks.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Stock Universe</h2>
              <p className="text-muted-foreground">
                {uploadedStocks.length} stocks loaded from your file
              </p>
            </div>
            <Button variant="outline" onClick={() => setUploadedStocks([])}>
              <Upload className="w-4 h-4 mr-2" />
              Upload New File
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {uploadedStocks.map((stock, index) => (
              <StockCard
                key={index}
                symbol={stock.symbol}
                name={stock.name}
                sector={stock.sector}
                exchange={stock.exchange}
                country={stock.country}
                rating={stock.rating}
                hasReport={stock.hasReport}
                onAnalyze={() => navigate(`/analyze/${stock.symbol}`)}
                onViewReport={() => console.log(`View report for ${stock.symbol}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {uploadedStocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your research workflow efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                Generate Batch Reports
              </Button>
              <Button variant="outline" onClick={() => navigate('/portfolio')}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Portfolio Rankings
              </Button>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
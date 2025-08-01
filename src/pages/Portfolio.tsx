import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RatingBadge from "@/components/ui/rating-badge";
import Layout from "@/components/layout/Layout";
import { Search, Download, FileText, TrendingUp, ArrowUpDown, Filter, BarChart3, Eye, Target, AlertTriangle } from "lucide-react";
import { mockStocks, mockPortfolio, mockAnalysisResults } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

interface PortfolioStock {
  symbol: string;
  name: string;
  sector: string;
  rating: number;
  lastUpdated: string;
  hasReport: boolean;
  priceTarget?: string;
  upsideDownside?: string;
}

const Portfolio = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"symbol" | "rating" | "lastUpdated">("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  const portfolioStocks: PortfolioStock[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      sector: "Technology",
      rating: 4,
      lastUpdated: "2024-01-15",
      hasReport: true,
      priceTarget: "$250.00",
      upsideDownside: "+15%"
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      sector: "Technology",
      rating: 3,
      lastUpdated: "2024-01-14",
      hasReport: true,
      priceTarget: "$420.00",
      upsideDownside: "+8%"
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      sector: "Technology",
      rating: 2,
      lastUpdated: "2024-01-13",
      hasReport: true,
      priceTarget: "$180.00",
      upsideDownside: "+5%"
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      sector: "Automotive",
      rating: -1,
      lastUpdated: "2024-01-12",
      hasReport: true,
      priceTarget: "$220.00",
      upsideDownside: "-12%"
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      sector: "Technology",
      rating: 5,
      lastUpdated: "2024-01-11",
      hasReport: true,
      priceTarget: "$850.00",
      upsideDownside: "+25%"
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      sector: "Consumer Discretionary",
      rating: 1,
      lastUpdated: "2024-01-10",
      hasReport: true,
      priceTarget: "$180.00",
      upsideDownside: "+3%"
    }
  ];

  const filteredAndSortedStocks = portfolioStocks
    .filter(stock => {
      const matchesSearch = 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = selectedFilter === "all" || 
        (selectedFilter === "strong-buy" && stock.rating >= 3) ||
        (selectedFilter === "buy" && stock.rating >= 1 && stock.rating < 3) ||
        (selectedFilter === "neutral" && stock.rating === 0) ||
        (selectedFilter === "sell" && stock.rating < 0);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "symbol":
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "lastUpdated":
          aValue = new Date(a.lastUpdated).getTime();
          bValue = new Date(b.lastUpdated).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getDistribution = () => {
    const distribution = {
      strongBuy: portfolioStocks.filter(s => s.rating >= 3).length,
      buy: portfolioStocks.filter(s => s.rating >= 1 && s.rating < 3).length,
      neutral: portfolioStocks.filter(s => s.rating === 0).length,
      sell: portfolioStocks.filter(s => s.rating < 0).length
    };
    return distribution;
  };

  const handleUpdateRating = (symbol: string) => {
    // Set loading state
    setLoadingStates(prev => ({ ...prev, [`update-${symbol}`]: true }));
    
    // Simulate a brief delay for better UX
    setTimeout(() => {
      // Navigate to stock analysis page to update rating
      navigate(`/analyze/${symbol}`);
    }, 300);
  };

  const handleViewReport = (symbol: string) => {
    // Set loading state
    setLoadingStates(prev => ({ ...prev, [`view-${symbol}`]: true }));
    
    // Simulate a brief delay for better UX
    setTimeout(() => {
      // Navigate to research report page
      navigate(`/report/${symbol}`);
    }, 300);
  };

  const distribution = getDistribution();

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Rankings</h1>
              <p className="text-gray-600">
                Manage and track your stock ratings and research reports
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid gap-6 md:grid-cols-4">
                      <Card className="border-0 bg-gray-50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                Strong Buy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{distribution.strongBuy}</div>
              <p className="text-xs text-gray-600 mt-1">Rating: +3 to +5</p>
            </CardContent>
          </Card>
          
                      <Card className="border-0 bg-gray-50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                Buy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{distribution.buy}</div>
              <p className="text-xs text-gray-600 mt-1">Rating: +1 to +2</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-gray-50 to-slate-50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                Neutral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700">{distribution.neutral}</div>
              <p className="text-xs text-gray-600 mt-1">Rating: 0</p>
            </CardContent>
          </Card>
          
                      <Card className="border-0 bg-gray-50 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Sell
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{distribution.sell}</div>
              <p className="text-xs text-gray-600 mt-1">Rating: -1 to -5</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search stocks by symbol, name, or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
              className={selectedFilter === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              All
            </Button>
            <Button 
              variant={selectedFilter === "strong-buy" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("strong-buy")}
              className={selectedFilter === "strong-buy" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Strong Buy
            </Button>
            <Button 
              variant={selectedFilter === "buy" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("buy")}
              className={selectedFilter === "buy" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Buy
            </Button>
            <Button 
              variant={selectedFilter === "sell" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("sell")}
              className={selectedFilter === "sell" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Sell
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export Rankings
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
              <FileText className="w-4 h-4 mr-2" />
              Export Reports
            </Button>
          </div>
        </div>

        {/* Portfolio Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Stock Rankings</CardTitle>
            <CardDescription className="text-gray-600">
              {filteredAndSortedStocks.length} of {portfolioStocks.length} stocks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                      onClick={() => handleSort("symbol")}
                    >
                      <div className="flex items-center gap-1">
                        Symbol
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">Company</TableHead>
                    <TableHead className="font-semibold text-gray-700">Sector</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                      onClick={() => handleSort("rating")}
                    >
                      <div className="flex items-center gap-1">
                        Rating
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">Price Target</TableHead>
                    <TableHead className="font-semibold text-gray-700">Upside/Downside</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                      onClick={() => handleSort("lastUpdated")}
                    >
                      <div className="flex items-center gap-1">
                        Last Updated
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedStocks.map((stock) => (
                    <TableRow key={stock.symbol} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-bold text-gray-900">{stock.symbol}</TableCell>
                      <TableCell className="text-gray-700">{stock.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                          {stock.sector}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <RatingBadge rating={stock.rating} size="sm" />
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{stock.priceTarget}</TableCell>
                      <TableCell                       className={`font-medium ${
                        stock.upsideDownside?.startsWith('+') ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {stock.upsideDownside}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(stock.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                            onClick={() => handleUpdateRating(stock.symbol)}
                            title="Update Rating & Analysis"
                            disabled={loadingStates[`update-${stock.symbol}`]}
                          >
                            {loadingStates[`update-${stock.symbol}`] ? (
                              <div className="w-3 h-3 mr-1 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            )}
                            {loadingStates[`update-${stock.symbol}`] ? 'Updating...' : 'Update'}
                          </Button>
                          {stock.hasReport && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                              onClick={() => handleViewReport(stock.symbol)}
                              title="View Research Report"
                              disabled={loadingStates[`view-${stock.symbol}`]}
                            >
                              {loadingStates[`view-${stock.symbol}`] ? (
                                <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Portfolio;
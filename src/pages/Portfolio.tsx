import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RatingBadge from "@/components/ui/rating-badge";
import Layout from "@/components/layout/Layout";
import { Search, Download, FileText, TrendingUp, ArrowUpDown } from "lucide-react";

interface PortfolioStock {
  symbol: string;
  name: string;
  sector: string;
  rating: number;
  lastUpdated: string;
  hasReport: boolean;
}

const Portfolio = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"symbol" | "rating" | "lastUpdated">("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const portfolioStocks: PortfolioStock[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      sector: "Technology",
      rating: 4,
      lastUpdated: "2024-01-15",
      hasReport: true
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      sector: "Technology",
      rating: 3,
      lastUpdated: "2024-01-14",
      hasReport: true
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      sector: "Technology",
      rating: 2,
      lastUpdated: "2024-01-13",
      hasReport: true
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      sector: "Automotive",
      rating: -1,
      lastUpdated: "2024-01-12",
      hasReport: true
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      sector: "Technology",
      rating: 5,
      lastUpdated: "2024-01-11",
      hasReport: true
    }
  ];

  const filteredAndSortedStocks = portfolioStocks
    .filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchTerm.toLowerCase())
    )
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

  const distribution = getDistribution();

  return (
    <Layout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Rankings</h1>
        <p className="text-muted-foreground">
          Manage and track your stock ratings and research reports
        </p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Strong Buy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rating-strong-buy">{distribution.strongBuy}</div>
            <p className="text-xs text-muted-foreground">Rating: +3 to +5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Buy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rating-buy">{distribution.buy}</div>
            <p className="text-xs text-muted-foreground">Rating: +1 to +2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Neutral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rating-neutral">{distribution.neutral}</div>
            <p className="text-xs text-muted-foreground">Rating: 0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sell</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rating-sell">{distribution.sell}</div>
            <p className="text-xs text-muted-foreground">Rating: -1 to -5</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Rankings
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Portfolio Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Rankings</CardTitle>
          <CardDescription>
            {filteredAndSortedStocks.length} of {portfolioStocks.length} stocks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("symbol")}
                >
                  <div className="flex items-center gap-1">
                    Symbol
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("rating")}
                >
                  <div className="flex items-center gap-1">
                    Rating
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("lastUpdated")}
                >
                  <div className="flex items-center gap-1">
                    Last Updated
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedStocks.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{stock.sector}</Badge>
                  </TableCell>
                  <TableCell>
                    <RatingBadge rating={stock.rating} size="sm" />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(stock.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Update
                      </Button>
                      {stock.hasReport && (
                        <Button variant="outline" size="sm">
                          <FileText className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </Layout>
  );
};

export default Portfolio;
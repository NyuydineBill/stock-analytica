import { useState, useEffect, useRef } from "react";
import { 
  BarChart3, 
  Home, 
  TrendingUp, 
  Search, 
  User, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  ChevronDown,
  FileText,
  Target
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { mockStocks } from "@/data/mockData";
import NotificationDropdown from "../ui/notification-dropdown";
import UserProfileDropdown from "../ui/user-profile-dropdown";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { toast } = useToast();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Get current page title and breadcrumbs
  const getPageInfo = () => {
    const path = location.pathname;
    
    if (path === '/') {
      return {
        title: "Dashboard",
        subtitle: "Equity Research Platform"
      };
    }
    
    if (path.startsWith('/analyze/')) {
      const symbol = path.split('/')[2];
      const stock = mockStocks.find(s => s.symbol === symbol);
      return {
        title: `${symbol} Analysis`,
        subtitle: stock?.name || "Stock Analysis"
      };
    }
    
    if (path.startsWith('/report/')) {
      const symbol = path.split('/')[2];
      const stock = mockStocks.find(s => s.symbol === symbol);
      return {
        title: `${symbol} Research Report`,
        subtitle: stock?.name || "Equity Research Report"
      };
    }
    
    if (path === '/portfolio') {
      return {
        title: "Portfolio",
        subtitle: "Stock Ratings & Performance"
      };
    }
    
    return {
      title: "Stock Analytica",
      subtitle: "Equity Research Platform"
    };
  };

  const pageInfo = getPageInfo();

  // Filter stocks based on search query
  const filteredStocks = searchQuery
    ? mockStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleStockSelect = (symbol: string) => {
    console.log('Navigating to:', symbol);
    setSearchQuery("");
    setShowSearchResults(false);
    setIsSearching(true);
    toast({
      title: "Analysis Started",
      description: `Analyzing ${symbol}...`,
    });
    setTimeout(() => {
      navigate(`/analyze/${symbol}`);
      setIsSearching(false);
    }, 100);
  };

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
    setIsMobileMenuOpen(false);
    setShowNotifications(false);
    setShowUserProfile(false);
  };

  // Close search results and mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchResults(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/portfolio', label: 'Portfolio', icon: TrendingUp },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => handleNavigation('/')}
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 
                className="text-xl font-bold text-gray-900 cursor-pointer hover:text-black transition-colors"
                onClick={() => handleNavigation('/')}
              >
                Stock Analytica
              </h1>
              <p className="text-sm text-gray-500 font-medium">Equity Research Platform</p>
            </div>
          </div>



          {/* Page Title - Mobile */}
          <div className="lg:hidden flex-1 ml-4">
            <h2 className="text-lg font-semibold text-gray-900">{pageInfo.title}</h2>
            <p className="text-xs text-gray-500">{pageInfo.subtitle}</p>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button 
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"} 
                  size="sm"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden sm:block" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors w-64"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && filteredStocks.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {filteredStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handleStockSelect(stock.symbol)}
                    >
                      <div>
                        <div className="font-medium text-gray-900">{stock.symbol}</div>
                        <div className="text-sm text-gray-500">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">${stock.currentPrice?.toFixed(2)}</div>
                        <div className={`text-sm ${stock.priceChangePercent && stock.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.priceChangePercent && stock.priceChangePercent >= 0 ? '+' : ''}{stock.priceChangePercent?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* No Results Message */}
              {showSearchResults && searchQuery && filteredStocks.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                  <div className="text-sm text-gray-500">No stocks found for "{searchQuery}"</div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserProfile(false);
                }}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 animate-pulse">
                  3
                </Badge>
              </Button>
              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                onMarkAllRead={() => {
                  toast({
                    title: "Notifications",
                    description: "All notifications marked as read",
                  });
                }}
              />
            </div>

            {/* Settings */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => handleNavigation('/settings')}
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>

            {/* User Profile */}
            <div className="relative">
              <div 
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                onClick={() => {
                  setShowUserProfile(!showUserProfile);
                  setShowNotifications(false);
                }}
              >
                <User className="w-4 h-4 text-white" />
              </div>
              <UserProfileDropdown
                isOpen={showUserProfile}
                onClose={() => setShowUserProfile(false)}
                onNavigate={handleNavigation}
              />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200" ref={mobileMenuRef}>
            <div className="pt-4 space-y-2">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive(item.path) 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-500 mb-2 px-3">Quick Actions</div>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => handleNavigation('/report/AAPL')}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    View Sample Report
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => handleNavigation('/analyze/AAPL')}
                  >
                    <Target className="w-4 h-4 mr-3" />
                    Analyze Apple
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
    
    </>
  );
};

export default Header;
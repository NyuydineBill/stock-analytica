import { useState, useEffect, useRef } from "react";
import { 
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
  Calendar,
  LogOut
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { mockStocks } from "@/data/mockData";
import NotificationDropdown from "../ui/notification-dropdown";
import UserProfileDropdown from "../ui/user-profile-dropdown";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { toast } = useToast();
  const searchRef = useRef<HTMLDivElement>(null);

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
    
    if (path === '/earnings') {
      return {
        title: "Earnings Analysis",
        subtitle: "Quarterly Earnings & Market Sentiment"
      };
    }
    
    if (path === '/reports') {
      return {
        title: "Research Reports",
        subtitle: "AI-Generated Equity Research Reports"
      };
    }
    
    if (path.startsWith('/reports/') && path.includes('/progress/')) {
      const reportId = path.split('/')[2];
      return {
        title: "Research Report",
        subtitle: `Report #${reportId} Analysis`
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
    navigate(`/analyze/${symbol}`);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchResults(false);
        setShowUserProfile(false);
        setShowNotifications(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  // If not authenticated, don't render the header
  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <div className="flex space-x-0.5">
                  <div className="w-0.5 h-2 bg-white rounded-full"></div>
                  <div className="w-0.5 h-3 bg-white rounded-full"></div>
                  <div className="w-0.5 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">StockA</h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => handleNavigation('/')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleNavigation('/portfolio')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/portfolio') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Portfolio</span>
            </button>
            <button
              onClick={() => handleNavigation('/earnings')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/earnings') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Earnings</span>
            </button>
            <button
              onClick={() => handleNavigation('/reports')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/reports') 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Reports</span>
            </button>
          </nav>

          {/* Right side - Search, Actions, Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search - Responsive sizing */}
            <div className="relative hidden sm:block" ref={searchRef}>
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-64 transition-all duration-200"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && filteredStocks.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredStocks.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleStockSelect(stock.symbol)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-150"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{stock.symbol}</div>
                        <div className="text-sm text-gray-500">{stock.name}</div>
                      </div>
                      <div className="text-sm text-gray-400">{stock.sector}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {/* Notifications */}
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">3</span>
              </button>

              {/* Settings */}
              <button 
                onClick={() => handleNavigation('/settings')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowUserProfile(!showUserProfile)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden lg:block text-sm font-medium">
                    {user?.username || 'User'}
                  </span>
                  <ChevronDown className="w-4 h-4 hidden lg:block" />
                </button>

                {/* User Profile Dropdown */}
                <UserProfileDropdown
                  isOpen={showUserProfile}
                  onClose={() => setShowUserProfile(false)}
                  onNavigate={(path) => {
                    handleNavigation(path);
                    setShowUserProfile(false);
                  }}
                />
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

                {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-200" ref={searchRef}>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {/* Mobile Search Results */}
                {showSearchResults && filteredStocks.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {filteredStocks.map((stock) => (
                      <button
                        key={stock.symbol}
                        onClick={() => handleStockSelect(stock.symbol)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-150"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                        <div className="text-sm text-gray-400">{stock.sector}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="p-4 space-y-2">
              <button
                onClick={() => handleNavigation('/')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/') ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavigation('/portfolio')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/portfolio') ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Portfolio</span>
              </button>
              <button
                onClick={() => handleNavigation('/earnings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/earnings') ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Earnings</span>
              </button>
              <button
                onClick={() => handleNavigation('/reports')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/reports') ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Reports</span>
              </button>
              
              <Separator className="my-4" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications Dropdown */}
      <NotificationDropdown
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
};

export default Header;
import { BarChart3, Home, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center w-8 h-8 bg-primary rounded cursor-pointer"
            onClick={() => navigate('/')}
          >
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 
              className="text-lg font-semibold tracking-tight cursor-pointer"
              onClick={() => navigate('/')}
            >
              Stock Analytica
            </h1>
            <p className="text-xs text-muted-foreground">Equity Research Platform</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <Button 
            variant={isActive('/') ? "default" : "ghost"} 
            size="sm"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button 
            variant={isActive('/portfolio') ? "default" : "ghost"} 
            size="sm"
            onClick={() => navigate('/portfolio')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Portfolio
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
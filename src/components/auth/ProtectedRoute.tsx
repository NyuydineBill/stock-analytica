import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, profileLoading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'profileLoading:', profileLoading);

  // Check authentication directly from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');
      const isAuth = !!(token && userData);
      
      console.log('ProtectedRoute - Direct auth check:', isAuth);
      
      if (isAuth) {
        console.log('ProtectedRoute - Authenticated, rendering children');
        setIsChecking(false);
      } else {
        console.log('ProtectedRoute - Not authenticated, redirecting to login');
        setIsChecking(false);
      }
    };

    // Check immediately
    checkAuth();
    
    // Also check after a short delay to catch state updates
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated]); // Dependency on isAuthenticated to re-run when useAuth updates

  // Show loading spinner while checking authentication
  if (profileLoading || isChecking) {
    console.log('ProtectedRoute - Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Check authentication directly
  const token = localStorage.getItem('access_token');
  const userData = localStorage.getItem('user_data');
  const isDirectlyAuthenticated = !!(token && userData);

  // Redirect to login if not authenticated
  if (!isDirectlyAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  console.log('ProtectedRoute - Authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute; 
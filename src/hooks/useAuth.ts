import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation, useRefreshTokenMutation, useGetUserProfileQuery } from '@/store/api';
import { User } from '@/store/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [login, { isLoading: loginLoading, error: loginError }] = useLoginMutation();
  const [register, { isLoading: registerLoading, error: registerError }] = useRegisterMutation();
  const [refreshToken] = useRefreshTokenMutation();
  
  // Only fetch user profile if we have a token and are authenticated
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.clear();
      }
    }
  }, []);

  // Update user when profile is loaded (optional enhancement)
  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    }
  }, [userProfile]);

  const handleLogin = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      console.log('Attempting login...');
      const result = await login(credentials).unwrap();
      console.log('Login successful:', result);
      
      // Store tokens and user data
      localStorage.setItem('access_token', result.tokens.access);
      localStorage.setItem('refresh_token', result.tokens.refresh);
      localStorage.setItem('user_data', JSON.stringify(result.user));
      
      // Set authentication state immediately
      setUser(result.user);
      setIsAuthenticated(true);
      
      console.log('User authenticated, redirecting...');
      // Redirect to intended page or homepage
      const from = location.state?.from?.pathname || '/';
      console.log('Redirecting to:', from);
      navigate(from, { replace: true });
      
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [login, navigate, location.state?.from?.pathname]);

  const handleRegister = useCallback(async (userData: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
  }) => {
    try {
      const result = await register(userData).unwrap();
      
      // Store tokens and user data
      localStorage.setItem('access_token', result.tokens.access);
      localStorage.setItem('refresh_token', result.tokens.refresh);
      localStorage.setItem('user_data', JSON.stringify(result.user));
      
      // Set authentication state
      setUser(result.user);
      setIsAuthenticated(true);
      
      // Redirect to homepage
      navigate('/', { replace: true });
      
      return result;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, [register, navigate]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  }, [navigate]);

  const handleTokenRefresh = useCallback(async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const result = await refreshToken({ refresh: refreshTokenValue }).unwrap();
      localStorage.setItem('access_token', result.access);
      
      return result.access;
    } catch (error) {
      console.error('Token refresh failed:', error);
      handleLogout();
    }
  }, [refreshToken, handleLogout]);

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken: handleTokenRefresh,
    loginLoading,
    registerLoading,
    profileLoading: false, // Don't block on profile loading for initial auth
    loginError,
    registerError,
  };
}; 
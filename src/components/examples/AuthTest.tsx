import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AuthTest: React.FC = () => {
  const { user, isAuthenticated, login, logout, loginLoading } = useAuth();

  const handleTestLogin = async () => {
    try {
      await login({ username: 'admin', password: 'admin' });
    } catch (error) {
      console.error('Test login failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Authentication Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </div>
        
        <div>
          <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'No user'}
        </div>
        
        <div>
          <strong>LocalStorage Token:</strong> {localStorage.getItem('access_token') ? 'Present' : 'Missing'}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleTestLogin} disabled={loginLoading}>
            {loginLoading ? 'Logging in...' : 'Test Login'}
          </Button>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTest; 
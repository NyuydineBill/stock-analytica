export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

export const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error?.status === 401) {
    // Unauthorized - redirect to login
    localStorage.clear();
    window.location.href = '/login';
    return;
  }
  
  if (error?.status === 403) {
    // Forbidden - show permission error
    console.error('Permission denied');
    return;
  }
  
  if (error?.status === 500) {
    // Server error
    console.error('Server error. Please try again later.');
    return;
  }
  
  // Generic error
  console.error('An error occurred. Please try again.');
}; 
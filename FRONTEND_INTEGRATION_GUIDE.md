# Stock Analytica Frontend Integration Guide

## 🚀 **Complete API Integration Documentation**

This guide provides everything your frontend team needs to integrate with the Stock Analytica backend API.

---

## 📋 **Quick Start Checklist**

- [ ] Backend server running at `http://localhost:8000`
- [ ] CORS configured (already done)
- [ ] JWT token handling implemented
- [ ] Error handling for API responses
- [ ] Loading states for async operations

---

## � **File Upload & AI Processing Flow**

This section covers the complete end-to-end flow from file upload through AI analysis completion.

### **🔄 Complete Workflow Overview**

```
User Uploads Excel → File Validation → Stock Processing → AI Analysis → Report Generation
     ↓                    ↓                ↓               ↓              ↓
  Frontend UI         Backend Tasks     Yahoo Finance    OpenAI API     PDF Export
```

### **📁 Step 1: File Upload Endpoint**

Upload Excel files containing stock symbols for bulk processing.

```javascript
const uploadStockFile = async (file, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/uploads/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        // Don't set Content-Type for FormData - browser sets it automatically
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const uploadResult = await response.json();
    return uploadResult;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// Expected Excel file format:
// | symbol | name                | sector     | exchange | country |
// |--------|-------------------- |------------|----------|---------|
// | AAPL   | Apple Inc.          | Technology | NASDAQ   | USA     |
// | GOOGL  | Alphabet Inc.       | Technology | NASDAQ   | USA     |
// | MSFT   | Microsoft Corp.     | Technology | NASDAQ   | USA     |

// Response format:
// {
//   "id": "uuid-here",
//   "file": "/media/uploads/stocks/filename.xlsx",
//   "uploaded_at": "2024-01-15T10:30:00Z",
//   "processed": false,
//   "stock_count": 0,
//   "validation_errors": []
// }
```

### **📊 Step 2: Monitor Upload Processing**

Track the asynchronous processing of uploaded stocks.

```javascript
const checkUploadStatus = async (uploadId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/uploads/${uploadId}/`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to check upload status');
    }

    const uploadStatus = await response.json();
    return uploadStatus;
  } catch (error) {
    console.error('Error checking upload status:', error);
    throw error;
  }
};

// Polling implementation for upload progress
const pollUploadProgress = async (uploadId, onUpdate, maxAttempts = 60) => {
  let attempts = 0;
  
  const poll = async () => {
    try {
      const status = await checkUploadStatus(uploadId);
      
      if (onUpdate) {
        onUpdate(status);
      }
      
      if (status.processed) {
        return status; // Processing complete
      }
      
      if (attempts >= maxAttempts) {
        throw new Error('Upload processing timeout');
      }
      
      attempts++;
      setTimeout(poll, 2000); // Check every 2 seconds
    } catch (error) {
      console.error('Error polling upload progress:', error);
      throw error;
    }
  };
  
  return poll();
};

// Usage example:
const handleFileUpload = async (file) => {
  try {
    // Start upload
    const uploadResult = await uploadStockFile(file);
    
    // Monitor progress
    const finalStatus = await pollUploadProgress(
      uploadResult.id,
      (status) => {
        console.log(`Processing: ${status.stock_count} stocks processed`);
        if (status.validation_errors.length > 0) {
          console.warn('Validation errors:', status.validation_errors);
        }
      }
    );
    
    console.log(`Upload complete: ${finalStatus.stock_count} stocks added`);
    return finalStatus;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

### **🚀 Step 3: Generate AI-Powered Reports**

Create comprehensive stock analysis reports using AI.

```javascript
const generateStockReport = async (stockId, reportOptions = {}) => {
  try {
    const reportData = {
      stock: stockId,
      include_company_overview: reportOptions.includeCompanyOverview ?? true,
      include_sector_review: reportOptions.includeSectorReview ?? true,
      include_valuation_analysis: reportOptions.includeValuationAnalysis ?? true,
      include_sentiment_analysis: reportOptions.includeSentimentAnalysis ?? true,
      include_investment_thesis: reportOptions.includeInvestmentThesis ?? true,
      ...reportOptions
    };

    const response = await fetch(`${API_BASE_URL}/reports/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reportData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const reportResult = await response.json();
    return reportResult;
  } catch (error) {
    console.error('Report generation error:', error);
    throw error;
  }
};

// Response format:
// {
//   "id": "uuid-here",
//   "stock": 1,
//   "status": "queued",
//   "progress": 0,
//   "current_step": "Initializing analysis...",
//   "created_at": "2024-01-15T10:30:00Z"
// }
```

### **📈 Step 4: Monitor AI Report Generation**

Track real-time progress of AI analysis across multiple phases.

```javascript
const checkReportProgress = async (reportId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to check report status');
    }

    const reportStatus = await response.json();
    return reportStatus;
  } catch (error) {
    console.error('Error checking report status:', error);
    throw error;
  }
};

// Advanced polling with detailed progress tracking
const pollReportGeneration = async (reportId, onProgress, maxAttempts = 180) => {
  let attempts = 0;
  
  const poll = async () => {
    try {
      const report = await checkReportProgress(reportId);
      
      if (onProgress) {
        onProgress({
          progress: report.progress,
          currentStep: report.current_step,
          status: report.status,
          timeElapsed: new Date() - new Date(report.created_at)
        });
      }
      
      // Check completion states
      if (report.status === 'completed') {
        return report; // Success!
      }
      
      if (report.status === 'failed') {
        throw new Error(`Report generation failed: ${report.current_step}`);
      }
      
      if (attempts >= maxAttempts) {
        throw new Error('Report generation timeout (5 minutes)');
      }
      
      attempts++;
      setTimeout(poll, 1000); // Check every second for responsive updates
    } catch (error) {
      console.error('Error polling report progress:', error);
      throw error;
    }
  };
  
  return poll();
};

// React component for report generation with progress
const ReportGenerator = ({ stockId }) => {
  const [reportProgress, setReportProgress] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      setReportProgress({ progress: 0, currentStep: 'Starting analysis...' });
      
      // Start report generation
      const reportResult = await generateStockReport(stockId, {
        includeCompanyOverview: true,
        includeSectorReview: true,
        includeValuationAnalysis: true,
        includeSentimentAnalysis: true,
        includeInvestmentThesis: true
      });
      
      // Monitor progress with real-time updates
      const completedReport = await pollReportGeneration(
        reportResult.id,
        (progress) => {
          setReportProgress(progress);
        }
      );
      
      setGeneratedReport(completedReport);
      setReportProgress({ progress: 100, currentStep: 'Analysis complete!' });
    } catch (error) {
      console.error('Report generation failed:', error);
      setReportProgress({ 
        progress: 0, 
        currentStep: `Error: ${error.message}`,
        error: true 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="report-generator">
      <button 
        onClick={handleGenerateReport} 
        disabled={isGenerating}
        className="generate-btn"
      >
        {isGenerating ? 'Generating Report...' : 'Generate AI Report'}
      </button>
      
      {reportProgress && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${reportProgress.progress}%` }}
            />
          </div>
          <div className={`progress-text ${reportProgress.error ? 'error' : ''}`}>
            {reportProgress.currentStep} ({reportProgress.progress}%)
          </div>
          {reportProgress.timeElapsed && (
            <div className="time-elapsed">
              Time elapsed: {Math.round(reportProgress.timeElapsed / 1000)}s
            </div>
          )}
        </div>
      )}
      
      {generatedReport && (
        <div className="report-result">
          <h3>Report Generated Successfully!</h3>
          <div className="report-sections">
            {Object.entries(generatedReport.sections || {}).map(([section, content]) => (
              <div key={section} className="report-section">
                <h4>{section.replace('_', ' ').toUpperCase()}</h4>
                <div className="section-content">
                  {typeof content === 'object' ? (
                    <pre>{JSON.stringify(content, null, 2)}</pre>
                  ) : (
                    <p>{content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => downloadReportPDF(generatedReport.id)}>
            Download PDF Report
          </button>
        </div>
      )}
    </div>
  );
};
```

### **🤖 Step 5: AI Processing Phases**

Understanding what happens during AI analysis:

```javascript
// The AI goes through these phases for each report:

const AI_PROCESSING_PHASES = {
  'company_overview': {
    description: 'Analyzing company fundamentals...',
    estimatedTime: '30-45 seconds',
    aiModel: 'GPT-4',
    includes: [
      'Company description and market position',
      'Business history analysis (5 years)',
      'Management changes and leadership',
      'Revenue breakdown by product lines',
      'Geographic revenue distribution',
      'SWOT Analysis',
      'Porter's Five Forces assessment'
    ]
  },
  
  'sector_review': {
    description: 'Conducting sector research...',
    estimatedTime: '20-30 seconds',
    aiModel: 'GPT-4',
    includes: [
      'Regulatory environment analysis',
      'Political and economic factors',
      'Industry trends and dynamics',
      'Competitive landscape',
      'Market opportunities and threats'
    ]
  },
  
  'valuation_analysis': {
    description: 'Performing valuation analysis...',
    estimatedTime: '25-35 seconds',
    aiModel: 'GPT-4',
    includes: [
      'Current analyst price targets',
      'Relative valuation vs peers',
      'Key valuation drivers',
      'Fair value analysis',
      'Valuation methodology discussion'
    ]
  },
  
  'sentiment_analysis': {
    description: 'Analyzing market sentiment...',
    estimatedTime: '20-30 seconds',
    aiModel: 'GPT-4',
    includes: [
      'Analyst trend revisions',
      'Overall sentiment assessment',
      'Consensus estimates and forecasts',
      'Market sentiment indicators',
      'Recent rating changes impact'
    ]
  },
  
  'investment_thesis': {
    description: 'Generating investment scenarios...',
    estimatedTime: '30-40 seconds',
    aiModel: 'GPT-4',
    includes: [
      'Bull Case (20-40% probability)',
      'Bear Case (20-40% probability)',
      'Base Case (40-60% probability)',
      'Key catalysts and risk factors',
      'Investment recommendation'
    ]
  }
};

// Total estimated time: 2-3 minutes per complete report
```

### **📄 Step 6: Export Generated Reports**

Download reports in various formats.

```javascript
const downloadReportPDF = async (reportId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/export/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ format: 'pdf' })
    });

    if (!response.ok) {
      throw new Error('Failed to initiate PDF export');
    }

    const exportTask = await response.json();
    
    // Poll for export completion
    const downloadInfo = await pollExportProgress(exportTask.task_id);
    
    // Trigger download
    window.open(downloadInfo.download_url, '_blank');
    
    return downloadInfo;
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};

const pollExportProgress = async (taskId) => {
  // Similar polling logic as report generation
  // Returns download URL when ready
};
```

### **🔄 Step 7: Complete Integration Example**

Here's a complete workflow component:

```javascript
const StockAnalysisWorkflow = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processedStocks, setProcessedStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [generatedReports, setGeneratedReports] = useState({});

  const handleCompleteWorkflow = async (file) => {
    try {
      // Step 1: Upload file
      setCurrentStep('uploading');
      const uploadResult = await uploadStockFile(file);
      setUploadedFile(uploadResult);
      
      // Step 2: Wait for processing
      setCurrentStep('processing');
      const finalStatus = await pollUploadProgress(uploadResult.id, (status) => {
        console.log(`Processed ${status.stock_count} stocks`);
      });
      
      // Step 3: Get processed stocks
      setCurrentStep('fetching');
      const stocksResponse = await fetch(`${API_BASE_URL}/uploads/${uploadResult.id}/stocks/`, {
        headers: getHeaders()
      });
      const stocks = await stocksResponse.json();
      setProcessedStocks(stocks);
      
      // Step 4: Ready for analysis
      setCurrentStep('ready');
      
    } catch (error) {
      console.error('Workflow failed:', error);
      setCurrentStep('error');
    }
  };

  const generateReportForStock = async (stock) => {
    try {
      setCurrentStep('analyzing');
      setSelectedStock(stock);
      
      const reportResult = await generateStockReport(stock.id);
      
      const completedReport = await pollReportGeneration(reportResult.id, (progress) => {
        console.log(`${stock.symbol}: ${progress.currentStep} (${progress.progress}%)`);
      });
      
      setGeneratedReports(prev => ({
        ...prev,
        [stock.id]: completedReport
      }));
      
      setCurrentStep('complete');
    } catch (error) {
      console.error(`Analysis failed for ${stock.symbol}:`, error);
    }
  };

  return (
    <div className="workflow-container">
      <div className="workflow-steps">
        <div className={`step ${currentStep === 'upload' ? 'active' : ''}`}>
          1. Upload Excel File
        </div>
        <div className={`step ${currentStep === 'processing' ? 'active' : ''}`}>
          2. Process Stocks
        </div>
        <div className={`step ${currentStep === 'analyzing' ? 'active' : ''}`}>
          3. AI Analysis
        </div>
        <div className={`step ${currentStep === 'complete' ? 'active' : ''}`}>
          4. Download Reports
        </div>
      </div>
      
      {/* Implementation of each step's UI */}
      {/* File upload, stock list, report generation, etc. */}
    </div>
  );
};
```

### **⚙️ Backend Processing Details**

**Celery Task Queue Processing:**
- `process_stock_upload` - Validates Excel and creates Stock records
- `generate_stock_report` - Orchestrates AI analysis phases
- `export_report_pdf` - Generates downloadable PDF reports

**External API Integrations:**
- **Yahoo Finance API** - Real-time stock data and price history
- **OpenAI GPT-4 API** - AI-powered analysis and report generation
- **News APIs** - Market sentiment and news analysis

**Processing Time Estimates:**
- File Upload: Instant
- Stock Processing: 30-60 seconds (depends on file size)
- AI Report Generation: 2-3 minutes per stock
- PDF Export: 10-15 seconds

---

## 🔍 **API Documentation**

```javascript
// API Configuration
const API_BASE_URL = "http://localhost:8000/api";
const API_TIMEOUT = 30000; // 30 seconds

// API Headers
const getHeaders = (includeAuth = true) => {
  const headers = {
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
```

---

## 🔐 **Authentication Flow**

### 1. User Registration
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password_confirm: userData.password, // Required!
        first_name: userData.firstName,
        last_name: userData.lastName
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    
    // Store tokens
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Usage Example
const handleRegistration = async () => {
  try {
    const result = await registerUser({
      username: 'newuser',
      email: 'user@example.com',
      password: 'securepassword123',
      firstName: 'John',
      lastName: 'Doe'
    });
    
    // Redirect to dashboard or show success
    window.location.href = '/dashboard';
  } catch (error) {
    // Handle registration errors
    const errors = JSON.parse(error.message);
    console.log('Validation errors:', errors);
  }
};
```

### 2. User Login
```javascript
const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    
    // Store tokens and user data
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

### 3. Token Refresh
```javascript
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ refresh: refreshToken })
    });

    if (!response.ok) {
      // Refresh token expired, redirect to login
      localStorage.clear();
      window.location.href = '/login';
      return;
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    
    return data.access;
  } catch (error) {
    console.error('Token refresh error:', error);
    localStorage.clear();
    window.location.href = '/login';
  }
};

// Auto-refresh interceptor
const apiCall = async (url, options = {}) => {
  try {
    let response = await fetch(url, options);
    
    if (response.status === 401) {
      // Try to refresh token
      await refreshToken();
      
      // Retry original request
      const newToken = localStorage.getItem('access_token');
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`
      };
      response = await fetch(url, options);
    }
    
    return response;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
```

---

## 📊 **Stock Management**

### 1. Get All Stocks (with filtering)
```javascript
const getStocks = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters
    if (filters.sector) queryParams.append('sector', filters.sector);
    if (filters.exchange) queryParams.append('exchange', filters.exchange);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.ordering) queryParams.append('ordering', filters.ordering);
    if (filters.page) queryParams.append('page', filters.page);

    const response = await apiCall(`${API_BASE_URL}/stocks/?${queryParams}`, {
      headers: getHeaders()
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};

// Usage Examples
const loadStocks = async () => {
  // Get all stocks
  const allStocks = await getStocks();
  
  // Get technology stocks only
  const techStocks = await getStocks({ sector: 'Technology' });
  
  // Search for specific stocks
  const searchResults = await getStocks({ search: 'Apple' });
  
  // Get sorted stocks
  const sortedStocks = await getStocks({ ordering: '-current_price' });
};
```

### 2. Get Stock Details
```javascript
const getStockDetails = async (stockId) => {
  try {
    const response = await apiCall(`${API_BASE_URL}/stocks/${stockId}/`, {
      headers: getHeaders()
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stock details:', error);
    throw error;
  }
};
```

### 3. Get Stock Price History
```javascript
const getStockPriceHistory = async (stockId, period = '1Y', interval = '1d') => {
  try {
    const response = await apiCall(
      `${API_BASE_URL}/stocks/${stockId}/price_history/?period=${period}&interval=${interval}`,
      { headers: getHeaders() }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
};

// Chart Integration Example
const createPriceChart = async (stockId) => {
  const priceData = await getStockPriceHistory(stockId, '6M', '1d');
  
  // Format for Chart.js or similar
  const chartData = {
    labels: priceData.data.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [{
      label: `${priceData.symbol} Price`,
      data: priceData.data.map(item => item.close),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    }]
  };
  
  return chartData;
};
```

---

## 📈 **Report Generation**

### 1. Generate New Report
```javascript
const generateReport = async (reportConfig) => {
  try {
    const response = await apiCall(`${API_BASE_URL}/reports/configure/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        stock_symbol: reportConfig.stockSymbol,
        include_company_overview: reportConfig.includeCompanyOverview || true,
        include_sector_review: reportConfig.includeSectorReview || true,
        include_valuation_analysis: reportConfig.includeValuationAnalysis || true,
        include_sentiment_analysis: reportConfig.includeSentimentAnalysis || true,
        include_investment_thesis: reportConfig.includeInvestmentThesis || true
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

// Usage Example
const handleReportGeneration = async () => {
  try {
    const report = await generateReport({
      stockSymbol: 'AAPL',
      includeCompanyOverview: true,
      includeSectorReview: true,
      includeValuationAnalysis: true,
      includeSentimentAnalysis: false,
      includeInvestmentThesis: true
    });
    
    // Start polling for completion
    pollReportProgress(report.id);
  } catch (error) {
    console.error('Report generation failed:', error);
  }
};
```

### 2. Poll Report Progress
```javascript
const pollReportProgress = async (reportId) => {
  const checkProgress = async () => {
    try {
      const response = await apiCall(`${API_BASE_URL}/reports/${reportId}/`, {
        headers: getHeaders()
      });
      
      const report = await response.json();
      
      // Update UI with progress
      updateProgressBar(report.progress);
      updateStatusMessage(report.current_step);
      
      if (report.status === 'completed') {
        // Report is ready
        displayReport(report);
      } else if (report.status === 'failed') {
        // Handle error
        showError('Report generation failed');
      } else {
        // Continue polling
        setTimeout(checkProgress, 2000); // Poll every 2 seconds
      }
    } catch (error) {
      console.error('Error checking report progress:', error);
    }
  };
  
  checkProgress();
};

const updateProgressBar = (progress) => {
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = `${progress}%`;
  progressBar.textContent = `${progress}%`;
};

const updateStatusMessage = (message) => {
  const statusElement = document.getElementById('status-message');
  statusElement.textContent = message;
};
```

### 3. Get User's Reports
```javascript
const getUserReports = async () => {
  try {
    const response = await apiCall(`${API_BASE_URL}/reports/`, {
      headers: getHeaders()
    });

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};
```

---

## ⭐ **Stock Ratings**

### 1. Create/Update Stock Rating
```javascript
const createStockRating = async (ratingData) => {
  try {
    const response = await apiCall(`${API_BASE_URL}/ratings/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        stock: ratingData.stockId,
        rating: ratingData.rating, // 1-5
        notes: ratingData.notes,
        investment_thesis: ratingData.investmentThesis
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating rating:', error);
    throw error;
  }
};

// Star Rating Component Example
const StarRating = ({ stockId, currentRating, onRatingChange }) => {
  const handleRating = async (rating) => {
    try {
      await createStockRating({
        stockId: stockId,
        rating: rating,
        notes: '', // Could be from a form
        investmentThesis: ''
      });
      
      onRatingChange(rating);
    } catch (error) {
      console.error('Rating failed:', error);
    }
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          className={star <= currentRating ? 'star filled' : 'star'}
          onClick={() => handleRating(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};
```

### 2. Get User's Portfolio (Rated Stocks)
```javascript
const getUserPortfolio = async () => {
  try {
    const response = await apiCall(`${API_BASE_URL}/stocks/portfolio/`, {
      headers: getHeaders()
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};
```

---

## 📰 **News and Analysis**

### 1. Get News Feed (Public Endpoint)
```javascript
const getNewsFeed = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.stockSymbol) queryParams.append('stock_symbol', filters.stockSymbol);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.impact) queryParams.append('impact', filters.impact);
    if (filters.monthsBack) queryParams.append('months_back', filters.monthsBack);

    const response = await fetch(`${API_BASE_URL}/news/?${queryParams}`, {
      headers: getHeaders(false) // Public endpoint, no auth needed
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// News Component Example
const NewsFeed = ({ stockSymbol }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await getNewsFeed({ 
          stockSymbol: stockSymbol,
          monthsBack: 3 
        });
        setNews(newsData.results);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [stockSymbol]);

  if (loading) return <div>Loading news...</div>;

  return (
    <div className="news-feed">
      {news.map(article => (
        <div key={article.id} className="news-item">
          <h3>{article.title}</h3>
          <p>{article.summary}</p>
          <div className="news-meta">
            <span className={`impact ${article.impact}`}>{article.impact}</span>
            <span className="source">{article.source}</span>
            <span className="date">{new Date(article.published_date).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 2. Analyze News Impact
```javascript
const analyzeNewsImpact = async (stockSymbol, filters = {}) => {
  try {
    const response = await apiCall(`${API_BASE_URL}/news/analyze/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        stock_symbol: stockSymbol,
        timeframe: filters.timeframe || 'all',
        impact: filters.impact || 'all',
        category: filters.category || 'all'
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing news impact:', error);
    throw error;
  }
};
```

---

## 💰 **Valuation Analysis**

### 1. Get Relative Valuation
```javascript
const getRelativeValuation = async (stockSymbol) => {
  try {
    const response = await apiCall(`${API_BASE_URL}/valuations/relative/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ stock_symbol: stockSymbol })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting relative valuation:', error);
    throw error;
  }
};

// Valuation Chart Component
const ValuationChart = ({ stockSymbol }) => {
  const [valuation, setValuation] = useState(null);

  useEffect(() => {
    const loadValuation = async () => {
      try {
        const data = await getRelativeValuation(stockSymbol);
        setValuation(data);
      } catch (error) {
        console.error('Failed to load valuation:', error);
      }
    };

    loadValuation();
  }, [stockSymbol]);

  if (!valuation) return <div>Loading valuation...</div>;

  return (
    <div className="valuation-analysis">
      <h3>Peer Comparison</h3>
      <div className="metrics">
        <div className="metric">
          <label>Current P/E:</label>
          <span>{valuation.currentMetrics.peRatio}</span>
        </div>
        <div className="metric">
          <label>Peer Avg P/E:</label>
          <span>{valuation.summary.peerAvgPE}</span>
        </div>
        <div className="metric">
          <label>Status:</label>
          <span className={valuation.summary.valuationStatus.toLowerCase()}>
            {valuation.summary.valuationStatus}
          </span>
        </div>
      </div>
    </div>
  );
};
```

### 2. Get DCF Analysis
```javascript
const getDCFAnalysis = async (stockSymbol) => {
  try {
    const response = await apiCall(`${API_BASE_URL}/valuations/dcf/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ stock_symbol: stockSymbol })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting DCF analysis:', error);
    throw error;
  }
};
```

---

## 📊 **File Upload (Excel Stock Lists)**

```javascript
const uploadStockFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiCall(`${API_BASE_URL}/uploads/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        // Don't set Content-Type for FormData
      },
      body: formData
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// File Upload Component
const StockFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const upload = await uploadStockFile(file);
      
      // Poll for processing completion
      pollUploadProgress(upload.id);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
    }
  };

  const pollUploadProgress = async (uploadId) => {
    const checkProgress = async () => {
      try {
        const response = await apiCall(`${API_BASE_URL}/uploads/${uploadId}/`, {
          headers: getHeaders()
        });
        
        const upload = await response.json();
        
        if (upload.processed) {
          setProgress(`✅ Processed ${upload.stock_count} stocks`);
          setUploading(false);
          
          // Get the processed stocks
          const stocks = await apiCall(`${API_BASE_URL}/uploads/${uploadId}/stocks/`, {
            headers: getHeaders()
          });
          
          console.log('Processed stocks:', stocks);
        } else {
          setProgress('⏳ Processing...');
          setTimeout(checkProgress, 2000);
        }
      } catch (error) {
        console.error('Error checking upload progress:', error);
        setUploading(false);
      }
    };
    
    checkProgress();
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {progress && <div className="progress">{progress}</div>}
    </div>
  );
};
```

---

## 🔔 **Real-time Updates**

For real-time price updates, you can implement polling:

```javascript
const PriceUpdateService = {
  intervals: new Map(),
  
  startPriceUpdates: (stockId, callback, intervalMs = 30000) => {
    const updatePrice = async () => {
      try {
        const stock = await getStockDetails(stockId);
        callback(stock);
      } catch (error) {
        console.error('Price update failed:', error);
      }
    };

    const intervalId = setInterval(updatePrice, intervalMs);
    PriceUpdateService.intervals.set(stockId, intervalId);
    
    // Initial load
    updatePrice();
  },
  
  stopPriceUpdates: (stockId) => {
    const intervalId = PriceUpdateService.intervals.get(stockId);
    if (intervalId) {
      clearInterval(intervalId);
      PriceUpdateService.intervals.delete(stockId);
    }
  },
  
  stopAllUpdates: () => {
    PriceUpdateService.intervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    PriceUpdateService.intervals.clear();
  }
};

// Usage in React component
const StockPriceDisplay = ({ stockId }) => {
  const [stock, setStock] = useState(null);

  useEffect(() => {
    PriceUpdateService.startPriceUpdates(stockId, setStock);
    
    return () => {
      PriceUpdateService.stopPriceUpdates(stockId);
    };
  }, [stockId]);

  if (!stock) return <div>Loading...</div>;

  return (
    <div className="stock-price">
      <span className="symbol">{stock.symbol}</span>
      <span className="price">${stock.current_price}</span>
      <span className={`change ${stock.price_change >= 0 ? 'positive' : 'negative'}`}>
        {stock.price_change >= 0 ? '+' : ''}{stock.price_change_percent}%
      </span>
    </div>
  );
};
```

---

## 🚨 **Error Handling**

```javascript
// Global error handler
const handleApiError = (error, context = '') => {
  console.error(`API Error ${context}:`, error);
  
  if (error.message.includes('401')) {
    // Unauthorized - redirect to login
    localStorage.clear();
    window.location.href = '/login';
    return;
  }
  
  if (error.message.includes('403')) {
    // Forbidden - show permission error
    showNotification('You do not have permission to perform this action', 'error');
    return;
  }
  
  if (error.message.includes('500')) {
    // Server error
    showNotification('Server error. Please try again later.', 'error');
    return;
  }
  
  // Generic error
  showNotification('An error occurred. Please try again.', 'error');
};

// Enhanced API call with error handling
const safeApiCall = async (url, options = {}, context = '') => {
  try {
    const response = await apiCall(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`${response.status}: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, context);
    throw error;
  }
};
```

---

## 📱 **React Hooks for API Integration**

```javascript
// Custom hook for stocks
const useStocks = (filters = {}) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        const data = await getStocks(filters);
        setStocks(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, [JSON.stringify(filters)]);

  return { stocks, loading, error, refetch: () => loadStocks() };
};

// Custom hook for user authentication
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return { user, isAuthenticated, login, logout };
};
```

---

## 🎯 **Complete Example: Stock Dashboard Component**

```javascript
import React, { useState, useEffect } from 'react';

const StockDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [priceHistory, setPriceHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sector: '',
    search: '',
    ordering: '-current_price'
  });

  // Load stocks on component mount
  useEffect(() => {
    loadStocks();
  }, [filters]);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const data = await getStocks(filters);
      setStocks(data.results);
    } catch (error) {
      console.error('Failed to load stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockSelect = async (stock) => {
    setSelectedStock(stock);
    
    // Load price history for selected stock
    try {
      const history = await getStockPriceHistory(stock.id, '1Y', '1d');
      setPriceHistory(history);
    } catch (error) {
      console.error('Failed to load price history:', error);
    }
  };

  const handleGenerateReport = async (stockId) => {
    try {
      const report = await generateReport({
        stockSymbol: selectedStock.symbol,
        includeCompanyOverview: true,
        includeSectorReview: true,
        includeValuationAnalysis: true,
        includeSentimentAnalysis: true,
        includeInvestmentThesis: true
      });
      
      console.log('Report generation started:', report);
      // Implement progress tracking UI here
    } catch (error) {
      console.error('Report generation failed:', error);
    }
  };

  return (
    <div className="stock-dashboard">
      {/* Filters */}
      <div className="filters">
        <select 
          value={filters.sector} 
          onChange={(e) => setFilters({...filters, sector: e.target.value})}
        >
          <option value="">All Sectors</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
        </select>
        
        <input
          type="text"
          placeholder="Search stocks..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
      </div>

      <div className="dashboard-content">
        {/* Stock List */}
        <div className="stock-list">
          {loading ? (
            <div>Loading stocks...</div>
          ) : (
            stocks.map(stock => (
              <div 
                key={stock.id} 
                className={`stock-item ${selectedStock?.id === stock.id ? 'selected' : ''}`}
                onClick={() => handleStockSelect(stock)}
              >
                <div className="stock-info">
                  <span className="symbol">{stock.symbol}</span>
                  <span className="name">{stock.name}</span>
                </div>
                <div className="stock-price">
                  <span className="price">${stock.current_price}</span>
                  <span className={`change ${stock.price_change_percent >= 0 ? 'positive' : 'negative'}`}>
                    {stock.price_change_percent >= 0 ? '+' : ''}{stock.price_change_percent}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stock Details */}
        {selectedStock && (
          <div className="stock-details">
            <div className="stock-header">
              <h2>{selectedStock.name} ({selectedStock.symbol})</h2>
              <button onClick={() => handleGenerateReport(selectedStock.id)}>
                Generate Report
              </button>
            </div>
            
            {/* Price Chart would go here */}
            {priceHistory && (
              <div className="price-chart">
                {/* Implement your preferred charting library */}
                <h3>Price History</h3>
                <p>Chart data loaded: {priceHistory.data.length} points</p>
              </div>
            )}
            
            <div className="stock-metrics">
              <div className="metric">
                <label>Market Cap:</label>
                <span>{selectedStock.market_cap}</span>
              </div>
              <div className="metric">
                <label>P/E Ratio:</label>
                <span>{selectedStock.pe_ratio || 'N/A'}</span>
              </div>
              <div className="metric">
                <label>Dividend Yield:</label>
                <span>{selectedStock.dividend_yield || 'N/A'}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDashboard;
```

---

## � **Dashboard APIs**

These new APIs provide data specifically for dashboard components and summary views.

### 1. Portfolio Statistics
Get user's portfolio summary statistics for dashboard display.

```javascript
const getPortfolioStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/stats/`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch portfolio stats');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching portfolio stats:', error);
    throw error;
  }
};

// Response format:
// {
//   "total_value": 125000.00,
//   "total_return_percent": 15.5,
//   "total_stocks": 12,
//   "generated_reports": 8,
//   "market_performance": "+12.5%"
// }

// Usage in React component:
const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const portfolioStats = await getPortfolioStats();
        setStats(portfolioStats);
      } catch (error) {
        console.error('Failed to load portfolio stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading portfolio stats...</div>;

  return (
    <div className="portfolio-stats">
      <div className="stat-card">
        <h3>Total Portfolio Value</h3>
        <p>${stats.total_value.toLocaleString()}</p>
      </div>
      <div className="stat-card">
        <h3>Total Return</h3>
        <p>{stats.total_return_percent}%</p>
      </div>
      <div className="stat-card">
        <h3>Stocks Tracked</h3>
        <p>{stats.total_stocks}</p>
      </div>
      <div className="stat-card">
        <h3>Reports Generated</h3>
        <p>{stats.generated_reports}</p>
      </div>
    </div>
  );
};
```

### 2. Sector Performance
Get market sector performance data for overview dashboard.

```javascript
const getSectorPerformance = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/market/sector-performance/`, {
      headers: getHeaders(false) // No auth required
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sector performance');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sector performance:', error);
    throw error;
  }
};

// Response format:
// {
//   "sectors": [
//     {
//       "sector": "Technology",
//       "performance": 2.5,
//       "trend": "up"
//     },
//     {
//       "sector": "Healthcare", 
//       "performance": -0.8,
//       "trend": "down"
//     }
//   ]
// }

// Usage in React component:
const SectorPerformance = () => {
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const data = await getSectorPerformance();
        setSectors(data.sectors);
      } catch (error) {
        console.error('Failed to load sector performance:', error);
      }
    };

    fetchSectorData();
  }, []);

  return (
    <div className="sector-performance">
      <h3>Market Sector Performance</h3>
      {sectors.map(sector => (
        <div key={sector.sector} className="sector-item">
          <span className="sector-name">{sector.sector}</span>
          <span className={`performance ${sector.trend}`}>
            {sector.performance > 0 ? '+' : ''}{sector.performance}%
          </span>
          <span className={`trend-icon ${sector.trend}`}>
            {sector.trend === 'up' ? '↗' : '↘'}
          </span>
        </div>
      ))}
    </div>
  );
};
```

### 3. Report Status Summary
Get summary of report generation status for dashboard monitoring.

```javascript
const getReportStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/status/`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch report status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching report status:', error);
    throw error;
  }
};

// Response format:
// {
//   "total_reports": 15,
//   "completed": 12,
//   "in_progress": 2,
//   "failed": 1,
//   "recent_reports": [
//     {
//       "id": 1,
//       "stock_symbol": "AAPL",
//       "status": "completed",
//       "created_at": "2024-01-15T10:30:00Z",
//       "progress": 100
//     }
//   ]
// }

// Usage in React component:
const ReportStatusWidget = () => {
  const [reportStatus, setReportStatus] = useState(null);

  useEffect(() => {
    const fetchReportStatus = async () => {
      try {
        const data = await getReportStatus();
        setReportStatus(data);
      } catch (error) {
        console.error('Failed to load report status:', error);
      }
    };

    fetchReportStatus();
  }, []);

  if (!reportStatus) return <div>Loading report status...</div>;

  return (
    <div className="report-status-widget">
      <h3>Report Generation Status</h3>
      <div className="status-summary">
        <div className="status-item">
          <span className="count">{reportStatus.completed}</span>
          <span className="label">Completed</span>
        </div>
        <div className="status-item">
          <span className="count">{reportStatus.in_progress}</span>
          <span className="label">In Progress</span>
        </div>
        <div className="status-item">
          <span className="count">{reportStatus.failed}</span>
          <span className="label">Failed</span>
        </div>
      </div>
      
      <div className="recent-reports">
        <h4>Recent Reports</h4>
        {reportStatus.recent_reports.map(report => (
          <div key={report.id} className="recent-report">
            <span className="stock">{report.stock_symbol}</span>
            <span className={`status ${report.status}`}>{report.status}</span>
            <span className="date">
              {new Date(report.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 4. Stock Ratings Summary
Get summary of user's stock ratings for dashboard display.

```javascript
const getStockRatingsSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/summary/`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ratings summary');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ratings summary:', error);
    throw error;
  }
};

// Response format:
// {
//   "total_ratings": 25,
//   "average_rating": 3.8,
//   "rating_distribution": {
//     "1": 2,
//     "2": 3,
//     "3": 8,
//     "4": 7,
//     "5": 5
//   },
//   "top_rated_stocks": [
//     {
//       "stock_symbol": "AAPL",
//       "stock_name": "Apple Inc.",
//       "rating": 5,
//       "notes": "Strong fundamentals"
//     }
//   ]
// }

// Usage in React component:
const RatingsSummary = () => {
  const [ratingsData, setRatingsData] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getStockRatingsSummary();
        setRatingsData(data);
      } catch (error) {
        console.error('Failed to load ratings summary:', error);
      }
    };

    fetchRatings();
  }, []);

  if (!ratingsData) return <div>Loading ratings...</div>;

  return (
    <div className="ratings-summary">
      <h3>Your Stock Ratings</h3>
      
      <div className="ratings-overview">
        <div className="rating-stat">
          <span className="value">{ratingsData.total_ratings}</span>
          <span className="label">Total Ratings</span>
        </div>
        <div className="rating-stat">
          <span className="value">{ratingsData.average_rating.toFixed(1)}</span>
          <span className="label">Average Rating</span>
        </div>
      </div>

      <div className="rating-distribution">
        <h4>Rating Distribution</h4>
        {Object.entries(ratingsData.rating_distribution).map(([rating, count]) => (
          <div key={rating} className="distribution-item">
            <span className="stars">{'★'.repeat(parseInt(rating))}</span>
            <span className="count">{count} stocks</span>
          </div>
        ))}
      </div>

      <div className="top-rated">
        <h4>Top Rated Stocks</h4>
        {ratingsData.top_rated_stocks.map(stock => (
          <div key={stock.stock_symbol} className="top-stock">
            <span className="symbol">{stock.stock_symbol}</span>
            <span className="name">{stock.stock_name}</span>
            <span className="rating">{'★'.repeat(stock.rating)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 5. Complete Dashboard Integration Example

Here's how to combine all these APIs in a comprehensive dashboard:

```javascript
const Dashboard = () => {
  const [portfolioStats, setPortfolioStats] = useState(null);
  const [sectorPerformance, setSectorPerformance] = useState([]);
  const [reportStatus, setReportStatus] = useState(null);
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load all dashboard data in parallel
        const [stats, sectors, reports, ratings] = await Promise.all([
          getPortfolioStats(),
          getSectorPerformance(),
          getReportStatus(),
          getStockRatingsSummary()
        ]);

        setPortfolioStats(stats);
        setSectorPerformance(sectors.sectors);
        setReportStatus(reports);
        setRatingsData(ratings);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Stock Analytica Dashboard</h1>
      
      <div className="dashboard-grid">
        {/* Portfolio Statistics */}
        <div className="dashboard-section">
          <DashboardStats stats={portfolioStats} />
        </div>

        {/* Sector Performance */}
        <div className="dashboard-section">
          <SectorPerformance sectors={sectorPerformance} />
        </div>

        {/* Report Status */}
        <div className="dashboard-section">
          <ReportStatusWidget reportStatus={reportStatus} />
        </div>

        {/* Ratings Summary */}
        <div className="dashboard-section">
          <RatingsSummary ratingsData={ratingsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

---

## �🔍 **API Documentation**

Access the interactive API documentation at:
- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **Raw Schema**: `http://localhost:8000/api/schema/`

---

## ✅ **Testing Checklist**

Before deploying your frontend:

### Authentication & Core Features
- [ ] User registration works
- [ ] User login works  
- [ ] Token refresh works automatically
- [ ] Stock list loads with filters
- [ ] Stock details display correctly
- [ ] Price history charts render
- [ ] Report generation starts
- [ ] Report progress polling works
- [ ] News feed loads
- [ ] Stock ratings work
- [ ] File upload processes

### Dashboard APIs (New)
- [ ] Portfolio stats load and display correctly
- [ ] Sector performance shows market data
- [ ] Report status widget updates properly
- [ ] Stock ratings summary displays user ratings
- [ ] Dashboard components load without errors
- [ ] All dashboard APIs handle authentication properly

### Error Handling & UX
- [ ] Error handling shows appropriate messages
- [ ] Loading states display correctly
- [ ] API timeouts are handled gracefully
- [ ] Offline states are managed properly

---

## 🚀 **Production Considerations**

1. **Environment Variables**:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
   ```

2. **Error Monitoring**: Integrate with Sentry or similar
3. **Performance**: Implement caching for frequently accessed data
4. **Security**: Validate all user inputs before sending to API
5. **Accessibility**: Ensure ARIA labels and keyboard navigation
6. **Mobile**: Test responsive design on various devices

---

Your Stock Analytica backend is fully ready for frontend integration! 🎉

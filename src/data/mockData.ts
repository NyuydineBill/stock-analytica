// Mock data for realistic demo experience

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  country: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  marketCap: string;
  peRatio: number;
  dividendYield: number;
  volume: string;
  hasReport: boolean;
  rating?: number;
  lastAnalysis?: string;
}

export interface AnalysisResult {
  symbol: string;
  companyName: string;
  sector: string;
  exchange: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  targetPrice: number;
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  riskLevel: 'Low' | 'Medium' | 'High';
  sections: ReportSection[];
  financialMetrics: FinancialMetrics;
  analystConsensus: AnalystConsensus;
  technicalIndicators: TechnicalIndicators;
  generatedAt: string;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  charts?: ChartData[];
  keyPoints?: string[];
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie';
  title: string;
  metric: string;
  change: string;
  data: { year: string; value: number }[];
  subtitle?: string;
}

export interface FinancialMetrics {
  revenue: { current: number; growth: number; trend: 'up' | 'down' | 'stable' };
  earnings: { current: number; growth: number; trend: 'up' | 'down' | 'stable' };
  profitMargin: { current: number; industry: number };
  debtToEquity: number;
  currentRatio: number;
  roe: number;
  roa: number;
}

export interface AnalystConsensus {
  buy: number;
  hold: number;
  sell: number;
  averageTarget: number;
  highTarget: number;
  lowTarget: number;
  priceTarget: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: string;
  movingAverages: {
    sma20: number;
    sma50: number;
    sma200: number;
  };
  support: number;
  resistance: number;
}

// Mock stock universe
export const mockStocks: StockData[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    exchange: "NASDAQ",
    country: "US",
    currentPrice: 245.67,
    priceChange: 2.34,
    priceChangePercent: 0.96,
    marketCap: "$3.85T",
    peRatio: 28.5,
    dividendYield: 0.52,
    volume: "45.2M",
    hasReport: true,
    rating: 4,
    lastAnalysis: "2024-01-15"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    exchange: "NASDAQ",
    country: "US",
    currentPrice: 378.85,
    priceChange: -1.23,
    priceChangePercent: -0.32,
    marketCap: "$2.81T",
    peRatio: 32.1,
    dividendYield: 0.78,
    volume: "28.7M",
    hasReport: true,
    rating: 5,
    lastAnalysis: "2024-01-14"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    exchange: "NASDAQ",
    country: "US",
    currentPrice: 142.56,
    priceChange: 3.21,
    priceChangePercent: 2.31,
    marketCap: "$1.79T",
    peRatio: 25.8,
    dividendYield: 0.00,
    volume: "32.1M",
    hasReport: false,
    rating: 3,
    lastAnalysis: "2024-01-10"
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    sector: "Automotive",
    exchange: "NASDAQ",
    country: "US",
    currentPrice: 185.43,
    priceChange: -5.67,
    priceChangePercent: -2.97,
    marketCap: "$589.2B",
    peRatio: 45.2,
    dividendYield: 0.00,
    volume: "89.3M",
    hasReport: true,
    rating: 2,
    lastAnalysis: "2024-01-12"
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    exchange: "NASDAQ",
    country: "US",
    currentPrice: 485.09,
    priceChange: 12.45,
    priceChangePercent: 2.64,
    marketCap: "$1.19T",
    peRatio: 65.3,
    dividendYield: 0.03,
    volume: "52.8M",
    hasReport: true,
    rating: 5,
    lastAnalysis: "2024-01-13"
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer Discretionary",
    exchange: "NASDAQ",
    country: "US",
    currentPrice: 151.94,
    priceChange: 1.87,
    priceChangePercent: 1.25,
    marketCap: "$1.58T",
    peRatio: 58.7,
    dividendYield: 0.00,
    volume: "41.6M",
    hasReport: true,
    rating: 4,
    lastAnalysis: "2024-01-11"
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    sector: "Technology",
    exchange: "NASDAQ",
    country: "US",
    currentPrice: 378.76,
    priceChange: 8.92,
    priceChangePercent: 2.41,
    marketCap: "$964.3B",
    peRatio: 24.6,
    dividendYield: 0.00,
    volume: "23.4M",
    hasReport: false,
    rating: 3,
    lastAnalysis: "2024-01-09"
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    sector: "Financial Services",
    exchange: "NYSE",
    country: "US",
    currentPrice: 172.34,
    priceChange: -0.45,
    priceChangePercent: -0.26,
    marketCap: "$497.8B",
    peRatio: 12.8,
    dividendYield: 2.45,
    volume: "12.7M",
    hasReport: true,
    rating: 4,
    lastAnalysis: "2024-01-08"
  }
];

// Mock analysis results
export const mockAnalysisResults: Record<string, AnalysisResult> = {
  AAPL: {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    sector: "Technology",
    exchange: "NASDAQ",
    currentPrice: 245.67,
    priceChange: 2.34,
    priceChangePercent: 0.96,
    targetPrice: 275.00,
    recommendation: "Buy",
    riskLevel: "Low",
    generatedAt: "2024-01-15T10:30:00Z",
    sections: [
      {
        id: "summary",
        title: "Executive Summary",
        content: "Apple Inc. continues to demonstrate exceptional execution across its product ecosystem, with iPhone 15 Pro sales exceeding expectations and Services revenue reaching new heights. The company's strong balance sheet, consistent cash flow generation, and strategic positioning in premium consumer electronics support our Buy recommendation with a $275 price target. Key catalysts include continued Services growth, iPhone upgrade cycle momentum, and potential AI integration across product lines.",
        keyPoints: [
          "Strong iPhone 15 Pro sales driving revenue growth",
          "Services segment reaching 25% of total revenue",
          "Robust free cash flow generation of $95B annually",
          "Strategic positioning in premium consumer electronics"
        ]
      },
      {
        id: "overview",
        title: "Company Overview",
        content: "Founded in 1976, Apple has evolved from a computer manufacturer to a global technology leader with a market cap exceeding $3.8 trillion. The company's success is built on its integrated ecosystem of hardware, software, and services, creating significant switching costs and brand loyalty. Apple's product portfolio includes iPhone (52% of revenue), Services (25%), Mac (8%), iPad (7%), and Wearables (8%). The company operates in over 175 countries with 520+ retail stores worldwide.",
        keyPoints: [
          "Global technology leader with $3.8T market cap",
          "Integrated ecosystem creates switching costs",
          "iPhone represents 52% of total revenue",
          "520+ retail stores across 175+ countries"
        ]
      },
      {
        id: "financial",
        title: "Financial Analysis",
        content: "Apple's financial performance remains exceptional with FY2023 revenue of $383.3B (+2% YoY) and net income of $97.0B (+1% YoY). The Services segment continues to be the growth engine, expanding 9% YoY to $85.2B. Gross margins improved to 44.1% (+0.3% YoY) driven by Services mix and operational efficiency. The company maintains a fortress balance sheet with $166B in cash and marketable securities, supporting continued share repurchases and dividend growth.",
        charts: [
          {
            type: 'line',
            title: "Revenue Growth",
            metric: "$383.3B",
            change: "+2% YoY",
            data: [
              { year: "2021", value: 365.8 },
              { year: "2022", value: 394.3 },
              { year: "2023", value: 383.3 }
            ]
          },
          {
            type: 'bar',
            title: "Services Revenue",
            metric: "$85.2B",
            change: "+9% YoY",
            data: [
              { year: "2021", value: 68.4 },
              { year: "2022", value: 78.1 },
              { year: "2023", value: 85.2 }
            ]
          }
        ]
      },
      {
        id: "valuation",
        title: "Valuation",
        content: "Our DCF analysis yields a fair value of $275 per share, representing 12% upside from current levels. The valuation incorporates revenue growth of 3-5% annually, expanding Services margins, and a 9% discount rate. Key value drivers include Services revenue growth, iPhone ASP expansion, and continued share repurchases. The stock trades at 28.5x forward P/E, in line with historical averages and justified by the company's quality metrics and growth prospects.",
        keyPoints: [
          "DCF fair value: $275 (12% upside)",
          "Forward P/E of 28.5x in line with history",
          "Services growth driving margin expansion",
          "Strong free cash flow supports buybacks"
        ]
      },
      {
        id: "recommendation",
        title: "Investment Recommendation",
        content: "We maintain our Buy rating on Apple with a $275 price target. The company's strong execution, Services momentum, and premium positioning support continued growth despite macroeconomic headwinds. Key risks include iPhone upgrade cycle deceleration, regulatory scrutiny, and supply chain disruptions. However, Apple's brand strength, ecosystem lock-in, and financial flexibility provide significant downside protection.",
        keyPoints: [
          "Buy rating with $275 price target",
          "Services growth driving long-term value",
          "Premium positioning supports margins",
          "Strong balance sheet provides flexibility"
        ]
      }
    ],
    financialMetrics: {
      revenue: { current: 383.3, growth: 2.0, trend: 'up' },
      earnings: { current: 97.0, growth: 1.0, trend: 'up' },
      profitMargin: { current: 25.3, industry: 15.2 },
      debtToEquity: 0.15,
      currentRatio: 1.08,
      roe: 147.2,
      roa: 28.5
    },
    analystConsensus: {
      buy: 28,
      hold: 8,
      sell: 2,
      averageTarget: 275.00,
      highTarget: 310.00,
      lowTarget: 240.00,
      priceTarget: 275.00
    },
    technicalIndicators: {
      rsi: 58,
      macd: "Bullish",
      movingAverages: {
        sma20: 242.50,
        sma50: 238.75,
        sma200: 225.30
      },
      support: 235.00,
      resistance: 250.00
    }
  },
  MSFT: {
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    sector: "Technology",
    exchange: "NASDAQ",
    currentPrice: 378.85,
    priceChange: -1.23,
    priceChangePercent: -0.32,
    targetPrice: 420.00,
    recommendation: "Strong Buy",
    riskLevel: "Low",
    generatedAt: "2024-01-14T14:15:00Z",
    sections: [
      {
        id: "summary",
        title: "Executive Summary",
        content: "Microsoft's cloud-first strategy continues to deliver exceptional results, with Azure revenue growing 29% YoY and Office 365 maintaining strong enterprise adoption. The company's AI leadership position, particularly with Copilot integration, creates significant competitive advantages. Our Strong Buy recommendation is supported by continued cloud migration trends, AI monetization opportunities, and strong execution across all business segments.",
        keyPoints: [
          "Azure revenue growth of 29% YoY",
          "AI leadership with Copilot integration",
          "Strong enterprise software adoption",
          "Robust cloud migration trends"
        ]
      },
      {
        id: "overview",
        title: "Company Overview",
        content: "Microsoft has successfully transformed from a traditional software company to a cloud and AI leader. The company's Intelligent Cloud segment (42% of revenue) includes Azure, Windows Server, and enterprise services. Productivity and Business Processes (32%) includes Office 365, Dynamics, and LinkedIn. More Personal Computing (26%) includes Windows, Xbox, and Surface devices. Microsoft's AI investments position it as a key beneficiary of the AI revolution.",
        keyPoints: [
          "Cloud and AI transformation complete",
          "Intelligent Cloud: 42% of revenue",
          "Office 365: 400M+ commercial users",
          "AI leadership with OpenAI partnership"
        ]
      },
      {
        id: "financial",
        title: "Financial Analysis",
        content: "Microsoft's FY2024 Q2 results exceeded expectations with revenue of $62.0B (+18% YoY) and net income of $21.9B (+33% YoY). Azure and other cloud services grew 30% YoY, while Office 365 Commercial revenue increased 15%. The company's operating margins expanded to 41.5% (+2.5% YoY) driven by cloud scale and operational efficiency. Microsoft generated $25.8B in free cash flow, supporting continued investments in AI and cloud infrastructure.",
        charts: [
          {
            type: 'line',
            title: "Cloud Revenue Growth",
            metric: "$62.0B",
            change: "+18% YoY",
            data: [
              { year: "2021", value: 168.1 },
              { year: "2022", value: 198.3 },
              { year: "2023", value: 211.9 }
            ]
          },
          {
            type: 'bar',
            title: "Operating Margins",
            metric: "41.5%",
            change: "+2.5% YoY",
            data: [
              { year: "2021", value: 37.0 },
              { year: "2022", value: 39.0 },
              { year: "2023", value: 41.5 }
            ]
          }
        ]
      },
      {
        id: "valuation",
        title: "Valuation",
        content: "Our DCF analysis indicates a fair value of $420 per share, representing 11% upside potential. The valuation reflects continued cloud growth, AI monetization opportunities, and expanding margins. Microsoft trades at 32.1x forward P/E, a premium to the market but justified by the company's growth profile, recurring revenue model, and AI leadership position. Key value drivers include Azure growth, Office 365 adoption, and AI service monetization.",
        keyPoints: [
          "DCF fair value: $420 (11% upside)",
          "Forward P/E of 32.1x justified by growth",
          "AI leadership creates premium valuation",
          "Recurring revenue model supports multiple"
        ]
      },
      {
        id: "recommendation",
        title: "Investment Recommendation",
        content: "We maintain our Strong Buy rating on Microsoft with a $420 price target. The company's cloud leadership, AI positioning, and strong execution make it a core holding for growth investors. Microsoft's diversified revenue streams, enterprise focus, and AI investments provide significant competitive advantages. While valuation multiples are elevated, the company's growth prospects and quality metrics justify the premium.",
        keyPoints: [
          "Strong Buy rating with $420 target",
          "Cloud and AI leadership position",
          "Enterprise focus provides stability",
          "AI investments drive long-term growth"
        ]
      }
    ],
    financialMetrics: {
      revenue: { current: 211.9, growth: 18.0, trend: 'up' },
      earnings: { current: 72.4, growth: 33.0, trend: 'up' },
      profitMargin: { current: 34.2, industry: 15.2 },
      debtToEquity: 0.35,
      currentRatio: 1.85,
      roe: 39.8,
      roa: 15.2
    },
    analystConsensus: {
      buy: 35,
      hold: 5,
      sell: 1,
      averageTarget: 420.00,
      highTarget: 450.00,
      lowTarget: 380.00,
      priceTarget: 420.00
    },
    technicalIndicators: {
      rsi: 52,
      macd: "Neutral",
      movingAverages: {
        sma20: 375.20,
        sma50: 372.80,
        sma200: 350.40
      },
      support: 365.00,
      resistance: 385.00
    }
  }
};

// Mock portfolio data
export const mockPortfolio = {
  totalValue: 125000,
  totalReturn: 8.5,
  totalReturnPercent: 6.8,
  positions: [
    { symbol: "AAPL", shares: 100, avgPrice: 180.50, currentPrice: 245.67, value: 24567, return: 36.1 },
    { symbol: "MSFT", shares: 50, avgPrice: 320.00, currentPrice: 378.85, value: 18942, return: 18.4 },
    { symbol: "NVDA", shares: 25, avgPrice: 400.00, currentPrice: 485.09, value: 12127, return: 21.3 },
    { symbol: "AMZN", shares: 80, avgPrice: 130.00, currentPrice: 151.94, value: 12155, return: 16.9 }
  ]
};

// Mock analysis progress steps
export const analysisSteps = [
  "Analyzing company fundamentals and financial statements...",
  "Conducting sector research and competitive analysis...",
  "Performing valuation analysis using multiple methodologies...",
  "Generating investment scenarios and risk assessment...",
  "Finalizing report structure and formatting..."
];

// Mock sector performance
export const sectorPerformance = [
  { sector: "Technology", performance: 12.5, trend: "up" },
  { sector: "Healthcare", performance: 8.2, trend: "up" },
  { sector: "Financial Services", performance: 5.1, trend: "up" },
  { sector: "Consumer Discretionary", performance: 3.8, trend: "up" },
  { sector: "Energy", performance: -2.1, trend: "down" }
]; 
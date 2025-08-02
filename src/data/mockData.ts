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
        id: "overview",
        title: "Company Overview",
        content: "Apple Inc. (AAPL) is a global technology leader founded in 1976, with a market cap exceeding $3.8 trillion. The company has evolved from a computer manufacturer to a comprehensive ecosystem provider of hardware, software, and services. Apple's integrated ecosystem creates significant switching costs and brand loyalty, with iPhone representing 52% of revenue, Services 25%, Mac 8%, iPad 7%, and Wearables 8%. The company operates in over 175 countries with 520+ retail stores worldwide. Recent management changes include Tim Cook's continued leadership as CEO since 2011, with Luca Maestri as CFO since 2014. Revenue by geography shows Americas 42%, Europe 25%, Greater China 19%, Japan 7%, and Rest of Asia Pacific 7%. SWOT Analysis: Strengths include brand loyalty and ecosystem lock-in; Weaknesses include dependency on iPhone; Opportunities include Services growth and AI integration; Threats include regulatory scrutiny and supply chain risks. Porter's 5 Forces analysis shows moderate threat of new entrants, low bargaining power of suppliers, moderate bargaining power of buyers, low threat of substitutes, and moderate competitive rivalry.",
        keyPoints: [
          "Global technology leader with $3.8T market cap",
          "Integrated ecosystem creates switching costs",
          "iPhone represents 52% of total revenue",
          "Services segment growing to 25% of revenue",
          "Strong brand loyalty and premium positioning"
        ]
      },
      {
        id: "sector",
        title: "Products & Sector Review",
        content: "The technology sector continues to experience strong tailwinds from AI adoption, cloud computing growth, and digital transformation. Regulatory environment remains favorable in most markets, though increased scrutiny on big tech companies in the US and EU could impact future operations. Political and economic factors include trade tensions with China affecting supply chains, while economic recovery supports consumer spending on premium devices. Industry trends show continued growth in Services revenue, AI integration across product lines, and expansion into new markets like healthcare and automotive. The smartphone market is mature but premium segment growth continues, while Services and Wearables represent significant growth opportunities.",
        keyPoints: [
          "AI adoption driving technology sector growth",
          "Regulatory scrutiny increasing on big tech",
          "Services revenue growing faster than hardware",
          "Premium smartphone segment maintaining growth",
          "Expansion into healthcare and automotive markets"
        ]
      },
      {
        id: "valuation",
        title: "Valuation Review",
        content: "Analyst price targets range from $240 to $320, with consensus at $275. Relative value analysis shows Apple trading at 28.5x forward P/E vs. peer average of 25x, justified by superior margins and Services growth. Key valuation drivers include Services revenue growth (currently 25% of revenue, growing 9% YoY), iPhone ASP expansion, and continued share repurchases. Our DCF analysis yields a fair value of $275 per share, representing 12% upside. The stock trades at a premium to peers due to strong free cash flow generation ($95B annually), fortress balance sheet ($166B cash), and consistent execution.",
        keyPoints: [
          "Consensus price target: $275 (12% upside)",
          "Trading at 28.5x forward P/E vs. peer average of 25x",
          "Services growth driving margin expansion",
          "Strong free cash flow supports valuation premium",
          "DCF fair value: $275 per share"
        ]
      },
      {
        id: "sentiment",
        title: "Sentiment Guidance",
        content: "Analyst sentiment remains positive with 28 Buy ratings, 8 Hold ratings, and 2 Sell ratings. Recent trend revisions show 5 upward revisions and 2 downward revisions in the last 30 days. Consensus estimates project FY2024 revenue of $395B (+3% YoY) and EPS of $6.85 (+8% YoY). Analyst sentiment is supported by strong Services growth, iPhone 15 Pro success, and continued share repurchases. Key concerns include iPhone upgrade cycle deceleration and regulatory risks. Market sentiment indicators show institutional ownership at 65% and insider buying activity in recent months.",
        keyPoints: [
          "28 Buy, 8 Hold, 2 Sell ratings",
          "5 upward revisions in last 30 days",
          "FY2024 consensus: $395B revenue (+3% YoY)",
          "Strong institutional ownership at 65%",
          "Positive insider buying activity"
        ]
      },
      {
        id: "thesis",
        title: "Investment Thesis",
        content: "Bull Case (60% probability): Services revenue continues strong growth, iPhone upgrade cycle remains robust, and AI integration drives new product categories. Price target: $320 (+30% upside). Key catalysts include Services reaching 30% of revenue, successful AI integration, and continued share repurchases. Bear Case (25% probability): iPhone sales decline, regulatory scrutiny intensifies, and supply chain disruptions persist. Price target: $200 (-19% downside). Key risks include smartphone market saturation, regulatory actions, and economic downturn. Base Case (15% probability): Steady execution with moderate growth. Price target: $275 (+12% upside).",
        keyPoints: [
          "Bull case: $320 target (60% probability)",
          "Bear case: $200 target (25% probability)",
          "Base case: $275 target (15% probability)",
          "Services growth key bull catalyst",
          "Regulatory risks main bear concern"
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
        id: "overview",
        title: "Company Overview",
        content: "Microsoft Corporation (MSFT) is a global technology leader founded in 1975, with a market cap exceeding $2.9 trillion. The company has evolved from a software company to a comprehensive provider of cloud services, productivity software, and enterprise solutions. Microsoft's integrated ecosystem creates significant switching costs and brand loyalty, with Intelligent Cloud representing 42% of revenue, Productivity & Business Processes 32%, and More Personal Computing 26%. The company operates in over 190 countries with a strong enterprise focus. Recent management changes include Satya Nadella's continued leadership as CEO since 2014, with Amy Hood as CFO since 2013. Revenue by geography shows Americas 50%, Europe 30%, Asia Pacific 15%, and Other 5%. Revenue by product line shows Azure 25%, Office 365 20%, Windows 15%, LinkedIn 8%, and Gaming 7%. SWOT Analysis: Strengths include cloud leadership and enterprise relationships; Weaknesses include dependency on Windows; Opportunities include AI integration and cloud expansion; Threats include competition from AWS and regulatory scrutiny. Porter's 5 Forces analysis shows high threat of new entrants, moderate bargaining power of suppliers, high bargaining power of enterprise buyers, moderate threat of substitutes, and high competitive rivalry.",
        keyPoints: [
          "Global technology leader with $2.9T market cap",
          "Intelligent Cloud represents 42% of total revenue",
          "Strong enterprise focus and relationships",
          "Azure growing 30% YoY to $87.9B",
          "Office 365 adoption reaching 400M+ users"
        ]
      },
      {
        id: "sector",
        title: "Products & Sector Review",
        content: "The technology sector continues to experience strong tailwinds from cloud computing adoption, AI integration, and digital transformation. Regulatory environment remains favorable for cloud services, though increased scrutiny on big tech companies in the US and EU could impact future operations. Political and economic factors include government cloud adoption accelerating, while economic recovery supports enterprise IT spending. Industry trends show continued migration to cloud services, AI integration across enterprise software, and expansion into new markets like healthcare and automotive. The cloud computing market is growing rapidly with Azure and AWS leading, while enterprise software continues to shift toward subscription models.",
        keyPoints: [
          "Cloud computing adoption driving sector growth",
          "AI integration across enterprise software",
          "Government cloud adoption accelerating",
          "Enterprise software shifting to subscriptions",
          "Strong demand for AI-powered solutions"
        ]
      },
      {
        id: "valuation",
        title: "Valuation Review",
        content: "Analyst price targets range from $380 to $450, with consensus at $420. Relative value analysis shows Microsoft trading at 32.1x forward P/E vs. peer average of 28x, justified by superior cloud growth and AI leadership. Key valuation drivers include Azure growth (currently 25% of revenue, growing 30% YoY), Office 365 adoption, and AI service monetization. Our DCF analysis yields a fair value of $420 per share, representing 11% upside. The stock trades at a premium to peers due to strong cloud growth, recurring revenue model, and AI leadership position.",
        keyPoints: [
          "Consensus price target: $420 (11% upside)",
          "Trading at 32.1x forward P/E vs. peer average of 28x",
          "Azure growth driving valuation premium",
          "AI leadership creating competitive moat",
          "DCF fair value: $420 per share"
        ]
      },
      {
        id: "sentiment",
        title: "Sentiment Guidance",
        content: "Analyst sentiment remains very positive with 35 Buy ratings, 5 Hold ratings, and 1 Sell rating. Recent trend revisions show 8 upward revisions and 1 downward revision in the last 30 days. Consensus estimates project FY2024 revenue of $245B (+16% YoY) and EPS of $11.85 (+20% YoY). Analyst sentiment is supported by strong Azure growth, AI integration success, and continued cloud adoption. Key concerns include competition from AWS and regulatory risks. Market sentiment indicators show institutional ownership at 70% and strong insider confidence.",
        keyPoints: [
          "35 Buy, 5 Hold, 1 Sell ratings",
          "8 upward revisions in last 30 days",
          "FY2024 consensus: $245B revenue (+16% YoY)",
          "Strong institutional ownership at 70%",
          "Very positive analyst sentiment"
        ]
      },
      {
        id: "thesis",
        title: "Investment Thesis",
        content: "Bull Case (65% probability): Azure continues strong growth, AI integration drives new revenue streams, and cloud adoption accelerates. Price target: $450 (+19% upside). Key catalysts include Azure reaching 30% of revenue, successful AI monetization, and continued enterprise cloud migration. Bear Case (20% probability): Cloud growth slows, competition intensifies, and regulatory scrutiny increases. Price target: $320 (-15% downside). Key risks include AWS competition, regulatory actions, and economic downturn. Base Case (15% probability): Steady execution with strong cloud growth. Price target: $420 (+11% upside).",
        keyPoints: [
          "Bull case: $450 target (65% probability)",
          "Bear case: $320 target (20% probability)",
          "Base case: $420 target (15% probability)",
          "Azure growth key bull catalyst",
          "AWS competition main bear concern"
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
  },
  GOOGL: {
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    sector: "Technology",
    exchange: "NASDAQ",
    currentPrice: 142.56,
    priceChange: 1.23,
    priceChangePercent: 0.87,
    targetPrice: 165.00,
    recommendation: "Buy",
    riskLevel: "Medium",
    generatedAt: "2024-01-15T10:30:00Z",
    sections: [
      {
        id: "overview",
        title: "Company Overview",
        content: "Alphabet Inc. (GOOGL) is a global technology leader founded in 1998, with a market cap exceeding $1.8 trillion. The company operates through Google and other subsidiaries, generating revenue primarily from digital advertising. Alphabet's core business includes Google Search (60% of revenue), YouTube (15%), Google Cloud (10%), and Other Bets (5%). The company operates in over 100 countries with a strong focus on AI and cloud services. Recent management changes include Sundar Pichai's continued leadership as CEO since 2015, with Ruth Porat as CFO since 2015. Revenue by geography shows Americas 50%, Europe 30%, Asia Pacific 15%, and Other 5%. Revenue by product line shows Google Search 60%, YouTube 15%, Google Cloud 10%, Google Play 8%, and Other 7%. SWOT Analysis: Strengths include dominant search position and YouTube leadership; Weaknesses include dependency on advertising; Opportunities include AI integration and cloud expansion; Threats include regulatory scrutiny and competition. Porter's 5 Forces analysis shows high threat of new entrants, moderate bargaining power of suppliers, high bargaining power of advertisers, moderate threat of substitutes, and high competitive rivalry.",
        keyPoints: [
          "Global technology leader with $1.8T market cap",
          "Google Search represents 60% of total revenue",
          "YouTube growing to 15% of revenue",
          "Strong AI and cloud investments",
          "Dominant position in digital advertising"
        ]
      },
      {
        id: "sector",
        title: "Products & Sector Review",
        content: "The technology sector continues to experience strong tailwinds from AI adoption, digital advertising growth, and cloud computing expansion. Regulatory environment remains challenging with increased scrutiny on big tech companies in the US and EU, particularly around antitrust and data privacy. Political and economic factors include advertising market recovery, while economic uncertainty affects ad spending. Industry trends show continued growth in digital advertising, AI integration across products, and expansion into new markets like healthcare and automotive. The search market is mature but AI integration creates new opportunities, while YouTube and Cloud services represent significant growth potential.",
        keyPoints: [
          "AI adoption driving technology sector growth",
          "Regulatory scrutiny increasing on big tech",
          "Digital advertising market recovery",
          "YouTube and Cloud services growing rapidly",
          "AI integration creating new opportunities"
        ]
      },
      {
        id: "valuation",
        title: "Valuation Review",
        content: "Analyst price targets range from $140 to $180, with consensus at $165. Relative value analysis shows Alphabet trading at 25x forward P/E vs. peer average of 28x, representing attractive valuation given growth prospects. Key valuation drivers include digital advertising growth (currently 75% of revenue, growing 9% YoY), YouTube monetization, and AI integration. Our DCF analysis yields a fair value of $165 per share, representing 16% upside. The stock trades at a discount to peers due to regulatory concerns, but strong fundamentals and AI leadership support valuation.",
        keyPoints: [
          "Consensus price target: $165 (16% upside)",
          "Trading at 25x forward P/E vs. peer average of 28x",
          "Digital advertising growth driving valuation",
          "AI leadership creating competitive advantages",
          "DCF fair value: $165 per share"
        ]
      },
      {
        id: "sentiment",
        title: "Sentiment Guidance",
        content: "Analyst sentiment remains positive with 32 Buy ratings, 8 Hold ratings, and 2 Sell ratings. Recent trend revisions show 6 upward revisions and 3 downward revisions in the last 30 days. Consensus estimates project FY2024 revenue of $335B (+9% YoY) and EPS of $6.45 (+12% YoY). Analyst sentiment is supported by strong advertising recovery, YouTube growth, and AI investments. Key concerns include regulatory scrutiny and advertising market volatility. Market sentiment indicators show institutional ownership at 65% and positive insider activity.",
        keyPoints: [
          "32 Buy, 8 Hold, 2 Sell ratings",
          "6 upward revisions in last 30 days",
          "FY2024 consensus: $335B revenue (+9% YoY)",
          "Strong institutional ownership at 65%",
          "Positive analyst sentiment"
        ]
      },
      {
        id: "thesis",
        title: "Investment Thesis",
        content: "Bull Case (55% probability): Digital advertising continues strong growth, AI integration drives new revenue streams, and YouTube monetization accelerates. Price target: $180 (+26% upside). Key catalysts include AI integration across products, YouTube reaching 20% of revenue, and cloud services expansion. Bear Case (30% probability): Regulatory scrutiny intensifies, advertising market slows, and competition increases. Price target: $130 (-5% downside). Key risks include regulatory actions, advertising market volatility, and economic downturn. Base Case (15% probability): Steady execution with moderate growth. Price target: $165 (+16% upside).",
        keyPoints: [
          "Bull case: $180 target (55% probability)",
          "Bear case: $130 target (30% probability)",
          "Base case: $165 target (15% probability)",
          "AI integration key bull catalyst",
          "Regulatory risks main bear concern"
        ]
      }
    ],
    financialMetrics: {
      revenue: { current: 307.4, growth: 9.0, trend: 'up' },
      earnings: { current: 73.8, growth: 15.0, trend: 'up' },
      profitMargin: { current: 24.0, industry: 15.2 },
      debtToEquity: 0.05,
      currentRatio: 2.1,
      roe: 25.2,
      roa: 18.5
    },
    analystConsensus: {
      buy: 32,
      hold: 8,
      sell: 2,
      averageTarget: 165.00,
      highTarget: 180.00,
      lowTarget: 140.00,
      priceTarget: 165.00
    },
    technicalIndicators: {
      rsi: 58,
      macd: "Bullish",
      movingAverages: {
        sma20: 140.20,
        sma50: 138.80,
        sma200: 135.40
      },
      support: 135.00,
      resistance: 150.00
    }
  },
  TSLA: {
    symbol: "TSLA",
    companyName: "Tesla Inc.",
    sector: "Automotive",
    exchange: "NASDAQ",
    currentPrice: 248.42,
    priceChange: -5.67,
    priceChangePercent: -2.23,
    targetPrice: 280.00,
    recommendation: "Hold",
    riskLevel: "High",
    generatedAt: "2024-01-15T10:30:00Z",
    sections: [
      {
        id: "overview",
        title: "Company Overview",
        content: "Tesla Inc. (TSLA) is a global electric vehicle and clean energy company founded in 2003, with a market cap exceeding $800 billion. The company designs, develops, manufactures, and sells electric vehicles, energy generation and storage systems, and related products. Tesla operates through Automotive (85% of revenue) and Energy Generation and Storage (15%) segments. The company operates in over 40 countries with a strong focus on innovation and sustainability. Recent management changes include Elon Musk's continued leadership as CEO since 2008, with Zachary Kirkhorn as CFO since 2019. Revenue by geography shows Americas 60%, Europe 25%, Asia Pacific 10%, and Other 5%. Revenue by product line shows Model Y/3 70%, Model S/X 10%, Energy Storage 10%, and Services 10%. SWOT Analysis: Strengths include EV market leadership and technology innovation; Weaknesses include dependency on Elon Musk and execution risks; Opportunities include global EV adoption and energy storage growth; Threats include competition and regulatory changes. Porter's 5 Forces analysis shows moderate threat of new entrants, moderate bargaining power of suppliers, high bargaining power of buyers, low threat of substitutes, and high competitive rivalry.",
        keyPoints: [
          "Global EV market leader with $800B market cap",
          "Automotive represents 85% of total revenue",
          "Energy storage business growing rapidly",
          "Strong brand and technology innovation",
          "Vertical integration strategy"
        ]
      },
      {
        id: "sector",
        title: "Products & Sector Review",
        content: "The automotive sector is experiencing strong tailwinds from EV adoption, government incentives, and environmental regulations. Regulatory environment remains favorable with increasing emissions standards and EV subsidies in major markets. Political and economic factors include government support for clean energy, while economic uncertainty affects consumer spending on premium vehicles. Industry trends show accelerating EV adoption, increasing competition from traditional automakers, and expansion into energy storage markets. The EV market is growing rapidly but competition is intensifying, while energy storage represents significant growth potential.",
        keyPoints: [
          "EV adoption accelerating globally",
          "Government incentives supporting growth",
          "Competition intensifying from traditional automakers",
          "Energy storage market expanding rapidly",
          "Regulatory support for clean energy"
        ]
      },
      {
        id: "valuation",
        title: "Valuation Review",
        content: "Analyst price targets range from $200 to $320, with consensus at $280. Relative value analysis shows Tesla trading at 45x forward P/E vs. peer average of 15x, reflecting high growth expectations and market leadership premium. Key valuation drivers include EV market growth (currently 15% of global auto sales, growing rapidly), energy storage expansion, and manufacturing efficiency improvements. Our DCF analysis yields a fair value of $280 per share, representing 13% upside. The stock trades at a significant premium to peers due to growth prospects and market leadership position.",
        keyPoints: [
          "Consensus price target: $280 (13% upside)",
          "Trading at 45x forward P/E vs. peer average of 15x",
          "EV market growth driving valuation",
          "Energy storage expansion opportunities",
          "DCF fair value: $280 per share"
        ]
      },
      {
        id: "sentiment",
        title: "Sentiment Guidance",
        content: "Analyst sentiment is mixed with 18 Buy ratings, 15 Hold ratings, and 8 Sell ratings. Recent trend revisions show 3 upward revisions and 5 downward revisions in the last 30 days. Consensus estimates project FY2024 revenue of $110B (+15% YoY) and EPS of $3.85 (+10% YoY). Analyst sentiment is supported by EV market leadership and energy storage growth, but concerns include pricing pressure and execution risks. Key concerns include competition, margin pressure, and execution volatility. Market sentiment indicators show institutional ownership at 45% and mixed insider activity.",
        keyPoints: [
          "18 Buy, 15 Hold, 8 Sell ratings",
          "3 upward revisions in last 30 days",
          "FY2024 consensus: $110B revenue (+15% YoY)",
          "Moderate institutional ownership at 45%",
          "Mixed analyst sentiment"
        ]
      },
      {
        id: "thesis",
        title: "Investment Thesis",
        content: "Bull Case (40% probability): EV adoption accelerates, Tesla maintains market leadership, and energy storage business expands rapidly. Price target: $320 (+30% upside). Key catalysts include new product launches, manufacturing efficiency improvements, and energy storage growth. Bear Case (35% probability): Competition intensifies, pricing pressure continues, and execution challenges persist. Price target: $200 (-7% downside). Key risks include competition from traditional automakers, regulatory changes, and economic downturn. Base Case (25% probability): Steady execution with moderate growth. Price target: $280 (+13% upside).",
        keyPoints: [
          "Bull case: $320 target (40% probability)",
          "Bear case: $200 target (35% probability)",
          "Base case: $280 target (25% probability)",
          "EV market growth key bull catalyst",
          "Competition main bear concern"
        ]
      }
    ],
    financialMetrics: {
      revenue: { current: 96.8, growth: 19.0, trend: 'up' },
      earnings: { current: 15.0, growth: 8.0, trend: 'up' },
      profitMargin: { current: 15.5, industry: 8.2 },
      debtToEquity: 0.12,
      currentRatio: 1.4,
      roe: 25.8,
      roa: 12.5
    },
    analystConsensus: {
      buy: 18,
      hold: 15,
      sell: 8,
      averageTarget: 280.00,
      highTarget: 320.00,
      lowTarget: 200.00,
      priceTarget: 280.00
    },
    technicalIndicators: {
      rsi: 45,
      macd: "Bearish",
      movingAverages: {
        sma20: 250.20,
        sma50: 245.80,
        sma200: 240.40
      },
      support: 220.00,
      resistance: 280.00
    }
  },
  AMZN: {
    symbol: "AMZN",
    companyName: "Amazon.com Inc.",
    sector: "Consumer Discretionary",
    exchange: "NASDAQ",
    currentPrice: 155.63,
    priceChange: 2.45,
    priceChangePercent: 1.60,
    targetPrice: 175.00,
    recommendation: "Buy",
    riskLevel: "Medium",
    generatedAt: "2024-01-15T10:30:00Z",
    sections: [
      {
        id: "overview",
        title: "Company Overview",
        content: "Amazon.com Inc. (AMZN) is a global e-commerce and technology company founded in 1994, with a market cap exceeding $1.6 trillion. The company operates through North America (60% of revenue), International (25%), and Amazon Web Services (AWS) (15%) segments. Amazon serves consumers, sellers, developers, enterprises, and content creators through its retail websites and AWS cloud services. The company operates in over 20 countries with a strong focus on innovation and customer experience. Recent management changes include Andy Jassy's leadership as CEO since 2021, with Brian Olsavsky as CFO since 2015. Revenue by geography shows North America 60%, International 25%, and AWS 15%. Revenue by product line shows Online Stores 40%, AWS 15%, Third-party Seller Services 20%, Subscription Services 8%, and Advertising 7%. SWOT Analysis: Strengths include e-commerce leadership and AWS cloud dominance; Weaknesses include thin retail margins and regulatory scrutiny; Opportunities include international expansion and advertising growth; Threats include competition and regulatory actions. Porter's 5 Forces analysis shows high threat of new entrants, moderate bargaining power of suppliers, high bargaining power of consumers, moderate threat of substitutes, and high competitive rivalry.",
        keyPoints: [
          "Global e-commerce leader with $1.6T market cap",
          "AWS represents 15% of total revenue",
          "Strong logistics and fulfillment network",
          "Diversified business model",
          "Innovation and customer focus"
        ]
      },
      {
        id: "sector",
        title: "Products & Sector Review",
        content: "The consumer discretionary sector is experiencing recovery from pandemic impacts, with e-commerce continuing to grow and cloud computing expanding rapidly. Regulatory environment remains challenging with increased scrutiny on big tech companies, particularly around antitrust and labor practices. Political and economic factors include consumer spending recovery, while economic uncertainty affects discretionary purchases. Industry trends show continued e-commerce growth, cloud computing adoption, and expansion into new markets like healthcare and advertising. The e-commerce market is mature but still growing, while cloud services and advertising represent significant growth potential.",
        keyPoints: [
          "E-commerce continuing strong growth",
          "Cloud computing adoption accelerating",
          "Regulatory scrutiny increasing on big tech",
          "Advertising business expanding rapidly",
          "International expansion opportunities"
        ]
      },
      {
        id: "valuation",
        title: "Valuation Review",
        content: "Analyst price targets range from $150 to $200, with consensus at $175. Relative value analysis shows Amazon trading at 35x forward P/E vs. peer average of 25x, justified by AWS growth and improving retail profitability. Key valuation drivers include AWS growth (currently 15% of revenue, growing 13% YoY), retail efficiency improvements, and advertising expansion. Our DCF analysis yields a fair value of $175 per share, representing 12% upside. The stock trades at a premium to peers due to AWS leadership and improving retail margins.",
        keyPoints: [
          "Consensus price target: $175 (12% upside)",
          "Trading at 35x forward P/E vs. peer average of 25x",
          "AWS growth driving valuation premium",
          "Retail efficiency improvements",
          "DCF fair value: $175 per share"
        ]
      },
      {
        id: "sentiment",
        title: "Sentiment Guidance",
        content: "Analyst sentiment remains positive with 42 Buy ratings, 6 Hold ratings, and 2 Sell ratings. Recent trend revisions show 7 upward revisions and 2 downward revisions in the last 30 days. Consensus estimates project FY2024 revenue of $650B (+12% YoY) and EPS of $4.25 (+25% YoY). Analyst sentiment is supported by AWS growth, retail efficiency improvements, and advertising expansion. Key concerns include regulatory scrutiny and competition. Market sentiment indicators show institutional ownership at 60% and positive insider activity.",
        keyPoints: [
          "42 Buy, 6 Hold, 2 Sell ratings",
          "7 upward revisions in last 30 days",
          "FY2024 consensus: $650B revenue (+12% YoY)",
          "Strong institutional ownership at 60%",
          "Very positive analyst sentiment"
        ]
      },
      {
        id: "thesis",
        title: "Investment Thesis",
        content: "Bull Case (60% probability): AWS continues strong growth, retail efficiency improves further, and advertising business expands rapidly. Price target: $200 (+28% upside). Key catalysts include AWS reaching 20% of revenue, successful international expansion, and advertising growth acceleration. Bear Case (25% probability): Regulatory scrutiny intensifies, competition increases, and economic slowdown affects retail. Price target: $140 (-10% downside). Key risks include regulatory actions, competition from Walmart and others, and economic downturn. Base Case (15% probability): Steady execution with moderate growth. Price target: $175 (+12% upside).",
        keyPoints: [
          "Bull case: $200 target (60% probability)",
          "Bear case: $140 target (25% probability)",
          "Base case: $175 target (15% probability)",
          "AWS growth key bull catalyst",
          "Regulatory risks main bear concern"
        ]
      }
    ],
    financialMetrics: {
      revenue: { current: 574.8, growth: 12.0, trend: 'up' },
      earnings: { current: 30.4, growth: 25.0, trend: 'up' },
      profitMargin: { current: 5.3, industry: 3.2 },
      debtToEquity: 0.45,
      currentRatio: 1.1,
      roe: 15.2,
      roa: 6.8
    },
    analystConsensus: {
      buy: 42,
      hold: 6,
      sell: 2,
      averageTarget: 175.00,
      highTarget: 200.00,
      lowTarget: 150.00,
      priceTarget: 175.00
    },
    technicalIndicators: {
      rsi: 62,
      macd: "Bullish",
      movingAverages: {
        sma20: 152.20,
        sma50: 150.80,
        sma200: 145.40
      },
      support: 140.00,
      resistance: 170.00
    }
  },
  NVDA: {
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    sector: "Technology",
    exchange: "NASDAQ",
    currentPrice: 485.09,
    priceChange: 12.34,
    priceChangePercent: 2.61,
    targetPrice: 550.00,
    recommendation: "Strong Buy",
    riskLevel: "Medium",
    generatedAt: "2024-01-15T10:30:00Z",
    sections: [
      {
        id: "overview",
        title: "Company Overview",
        content: "NVIDIA Corporation (NVDA) is a global technology company founded in 1993, with a market cap exceeding $1.2 trillion. The company operates through Graphics (40% of revenue) and Compute & Networking (60%) segments. NVIDIA designs and manufactures graphics processing units (GPUs) for gaming, professional visualization, data center, and automotive markets. The company operates in over 50 countries with a strong focus on AI and high-performance computing. Recent management changes include Jensen Huang's continued leadership as CEO since 1993, with Colette Kress as CFO since 2013. Revenue by geography shows Americas 45%, Asia Pacific 40%, Europe 10%, and Other 5%. Revenue by product line shows Data Center 60%, Gaming 25%, Professional Visualization 10%, and Automotive 5%. SWOT Analysis: Strengths include AI chip market leadership and technology innovation; Weaknesses include dependency on semiconductor cycles; Opportunities include AI adoption and automotive expansion; Threats include competition and supply chain risks. Porter's 5 Forces analysis shows moderate threat of new entrants, moderate bargaining power of suppliers, high bargaining power of large customers, low threat of substitutes, and moderate competitive rivalry.",
        keyPoints: [
          "Global technology leader with $1.2T market cap",
          "Data Center represents 60% of total revenue",
          "AI chip market leadership position",
          "Strong technology innovation and R&D",
          "Gaming GPU market dominance"
        ]
      },
      {
        id: "sector",
        title: "Products & Sector Review",
        content: "The technology sector is experiencing unprecedented tailwinds from AI adoption, with semiconductor demand surging and data center expansion accelerating. Regulatory environment remains favorable for semiconductor companies, though export controls on AI chips to certain countries could impact growth. Political and economic factors include government support for semiconductor manufacturing, while AI investment drives unprecedented demand. Industry trends show explosive growth in AI chip demand, data center expansion, and automotive AI adoption. The semiconductor market is experiencing a supercycle driven by AI, while gaming and automotive represent significant growth potential.",
        keyPoints: [
          "AI adoption driving semiconductor supercycle",
          "Data center expansion accelerating globally",
          "Government support for semiconductor manufacturing",
          "Automotive AI adoption growing rapidly",
          "Gaming market recovery and growth"
        ]
      },
      {
        id: "valuation",
        title: "Valuation Review",
        content: "Analyst price targets range from $450 to $600, with consensus at $550. Relative value analysis shows NVIDIA trading at 50x forward P/E vs. peer average of 25x, reflecting exceptional growth expectations and AI leadership premium. Key valuation drivers include AI chip demand (currently experiencing unprecedented growth), data center expansion, and automotive AI adoption. Our DCF analysis yields a fair value of $550 per share, representing 13% upside. The stock trades at a significant premium to peers due to AI leadership and exceptional growth prospects.",
        keyPoints: [
          "Consensus price target: $550 (13% upside)",
          "Trading at 50x forward P/E vs. peer average of 25x",
          "AI chip demand driving valuation premium",
          "Data center expansion opportunities",
          "DCF fair value: $550 per share"
        ]
      },
      {
        id: "sentiment",
        title: "Sentiment Guidance",
        content: "Analyst sentiment remains extremely positive with 38 Buy ratings, 4 Hold ratings, and 1 Sell rating. Recent trend revisions show 12 upward revisions and 1 downward revision in the last 30 days. Consensus estimates project FY2024 revenue of $85B (+126% YoY) and EPS of $18.50 (+586% YoY). Analyst sentiment is supported by exceptional AI chip demand, data center growth, and market leadership position. Key concerns include valuation multiples and supply chain risks. Market sentiment indicators show institutional ownership at 75% and very positive insider activity.",
        keyPoints: [
          "38 Buy, 4 Hold, 1 Sell ratings",
          "12 upward revisions in last 30 days",
          "FY2024 consensus: $85B revenue (+126% YoY)",
          "Strong institutional ownership at 75%",
          "Extremely positive analyst sentiment"
        ]
      },
      {
        id: "thesis",
        title: "Investment Thesis",
        content: "Bull Case (70% probability): AI adoption continues explosive growth, NVIDIA maintains market leadership, and data center expansion accelerates. Price target: $600 (+24% upside). Key catalysts include AI chip demand growth, data center expansion, and automotive AI adoption. Bear Case (20% probability): AI demand slows, competition intensifies, and semiconductor cycle turns. Price target: $400 (-17% downside). Key risks include AI demand slowdown, competition from AMD and others, and semiconductor cycle risks. Base Case (10% probability): Steady execution with strong growth. Price target: $550 (+13% upside).",
        keyPoints: [
          "Bull case: $600 target (70% probability)",
          "Bear case: $400 target (20% probability)",
          "Base case: $550 target (10% probability)",
          "AI chip demand key bull catalyst",
          "Semiconductor cycle main bear concern"
        ]
      }
    ],
    financialMetrics: {
      revenue: { current: 60.9, growth: 126.0, trend: 'up' },
      earnings: { current: 29.8, growth: 586.0, trend: 'up' },
      profitMargin: { current: 48.9, industry: 15.2 },
      debtToEquity: 0.25,
      currentRatio: 2.8,
      roe: 88.5,
      roa: 45.2
    },
    analystConsensus: {
      buy: 38,
      hold: 4,
      sell: 1,
      averageTarget: 550.00,
      highTarget: 600.00,
      lowTarget: 450.00,
      priceTarget: 550.00
    },
    technicalIndicators: {
      rsi: 68,
      macd: "Bullish",
      movingAverages: {
        sma20: 470.20,
        sma50: 460.80,
        sma200: 420.40
      },
      support: 450.00,
      resistance: 520.00
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
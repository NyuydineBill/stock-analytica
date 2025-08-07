import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Target, Calculator, BarChart3, DollarSign, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ValuationMetrics {
  peRatio: number;
  pbRatio: number;
  psRatio: number;
  evEbitda: number;
  dividendYield: number;
  roe: number;
  roa: number;
  debtToEquity: number;
  currentRatio: number;
  profitMargin: number;
}

interface PeerComparison {
  company: string;
  symbol: string;
  peRatio: number;
  pbRatio: number;
  psRatio: number;
  evEbitda: number;
  dividendYield: number;
}

interface DCFAssumptions {
  growthRate: number;
  terminalGrowth: number;
  discountRate: number;
  freeCashFlow: number;
  terminalValue: number;
  presentValue: number;
}

interface ValuationDrivers {
  revenueGrowth: number;
  marginExpansion: number;
  marketShare: number;
  newProducts: number;
  costEfficiency: number;
  regulatoryEnvironment: number;
}

interface ValuationAnalysisProps {
  symbol: string;
  name: string;
  currentPrice: number;
  targetPrice: number;
  className?: string;
}

const ValuationAnalysis: React.FC<ValuationAnalysisProps> = ({
  symbol,
  name,
  currentPrice,
  targetPrice,
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState('relative');

  // Mock valuation data
  const valuationMetrics: ValuationMetrics = {
    peRatio: 28.5,
    pbRatio: 15.2,
    psRatio: 6.8,
    evEbitda: 18.5,
    dividendYield: 0.52,
    roe: 147.2,
    roa: 28.5,
    debtToEquity: 0.15,
    currentRatio: 1.08,
    profitMargin: 25.3
  };

  const peerComparison: PeerComparison[] = [
    { company: "Microsoft", symbol: "MSFT", peRatio: 32.1, pbRatio: 12.8, psRatio: 8.2, evEbitda: 22.1, dividendYield: 0.78 },
    { company: "Alphabet", symbol: "GOOGL", peRatio: 25.8, pbRatio: 6.5, psRatio: 5.9, evEbitda: 15.8, dividendYield: 0.00 },
    { company: "Amazon", symbol: "AMZN", peRatio: 58.7, pbRatio: 8.9, psRatio: 2.8, evEbitda: 35.2, dividendYield: 0.00 },
    { company: "Meta", symbol: "META", peRatio: 24.6, pbRatio: 4.2, psRatio: 4.1, evEbitda: 12.5, dividendYield: 0.00 },
    { company: "NVIDIA", symbol: "NVDA", peRatio: 65.3, pbRatio: 45.8, psRatio: 18.9, evEbitda: 55.2, dividendYield: 0.03 }
  ];

  const dcfAssumptions: DCFAssumptions = {
    growthRate: 8.5,
    terminalGrowth: 3.0,
    discountRate: 10.0,
    freeCashFlow: 95.2,
    terminalValue: 2850.0,
    presentValue: 275.0
  };

  const valuationDrivers: ValuationDrivers = {
    revenueGrowth: 85,
    marginExpansion: 78,
    marketShare: 92,
    newProducts: 88,
    costEfficiency: 75,
    regulatoryEnvironment: 65
  };

  const getComparisonColor = (value: number, peerValue: number) => {
    const difference = ((value - peerValue) / peerValue) * 100;
    if (difference > 10) return 'text-green-600';
    if (difference < -10) return 'text-red-600';
    return 'text-gray-600';
  };

  const getComparisonIcon = (value: number, peerValue: number) => {
    const difference = ((value - peerValue) / peerValue) * 100;
    if (difference > 10) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (difference < -10) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return null;
  };

  const upside = ((targetPrice - currentPrice) / currentPrice) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Valuation Analysis</CardTitle>
            <p className="text-gray-600">Comprehensive valuation assessment for {symbol}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${targetPrice.toFixed(2)}</div>
            <div className={`text-sm ${upside >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {upside >= 0 ? '+' : ''}{upside.toFixed(1)}% upside
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="relative">Relative Value</TabsTrigger>
            <TabsTrigger value="dcf">DCF Analysis</TabsTrigger>
            <TabsTrigger value="drivers">Key Drivers</TabsTrigger>
          </TabsList>

          <TabsContent value="relative" className="space-y-6">
            {/* Current Valuation Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Valuation Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{valuationMetrics.peRatio}</div>
                  <div className="text-sm text-gray-600">P/E Ratio</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{valuationMetrics.pbRatio}</div>
                  <div className="text-sm text-gray-600">P/B Ratio</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{valuationMetrics.psRatio}</div>
                  <div className="text-sm text-gray-600">P/S Ratio</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{valuationMetrics.evEbitda}</div>
                  <div className="text-sm text-gray-600">EV/EBITDA</div>
                </div>
              </div>
            </div>

            {/* Peer Comparison */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Peer Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Company</th>
                      <th className="text-right py-2">P/E</th>
                      <th className="text-right py-2">P/B</th>
                      <th className="text-right py-2">P/S</th>
                      <th className="text-right py-2">EV/EBITDA</th>
                      <th className="text-right py-2">Div Yield</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 font-semibold">{name} ({symbol})</td>
                      <td className="text-right py-2 font-semibold">{valuationMetrics.peRatio}</td>
                      <td className="text-right py-2 font-semibold">{valuationMetrics.pbRatio}</td>
                      <td className="text-right py-2 font-semibold">{valuationMetrics.psRatio}</td>
                      <td className="text-right py-2 font-semibold">{valuationMetrics.evEbitda}</td>
                      <td className="text-right py-2 font-semibold">{valuationMetrics.dividendYield}%</td>
                    </tr>
                    {peerComparison.map((peer, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{peer.company} ({peer.symbol})</td>
                        <td className={`text-right py-2 ${getComparisonColor(valuationMetrics.peRatio, peer.peRatio)}`}>
                          <div className="flex items-center justify-end gap-1">
                            {peer.peRatio}
                            {getComparisonIcon(valuationMetrics.peRatio, peer.peRatio)}
                          </div>
                        </td>
                        <td className={`text-right py-2 ${getComparisonColor(valuationMetrics.pbRatio, peer.pbRatio)}`}>
                          <div className="flex items-center justify-end gap-1">
                            {peer.pbRatio}
                            {getComparisonIcon(valuationMetrics.pbRatio, peer.pbRatio)}
                          </div>
                        </td>
                        <td className={`text-right py-2 ${getComparisonColor(valuationMetrics.psRatio, peer.psRatio)}`}>
                          <div className="flex items-center justify-end gap-1">
                            {peer.psRatio}
                            {getComparisonIcon(valuationMetrics.psRatio, peer.psRatio)}
                          </div>
                        </td>
                        <td className={`text-right py-2 ${getComparisonColor(valuationMetrics.evEbitda, peer.evEbitda)}`}>
                          <div className="flex items-center justify-end gap-1">
                            {peer.evEbitda}
                            {getComparisonIcon(valuationMetrics.evEbitda, peer.evEbitda)}
                          </div>
                        </td>
                        <td className={`text-right py-2 ${getComparisonColor(valuationMetrics.dividendYield, peer.dividendYield)}`}>
                          <div className="flex items-center justify-end gap-1">
                            {peer.dividendYield}%
                            {getComparisonIcon(valuationMetrics.dividendYield, peer.dividendYield)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Valuation Summary */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Relative Valuation Summary</h4>
              <p className="text-sm text-gray-700">
                {symbol} trades at a {valuationMetrics.peRatio > peerComparison.reduce((sum, p) => sum + p.peRatio, 0) / peerComparison.length ? 'premium' : 'discount'} 
                to peer average P/E ratio. The company's strong {valuationMetrics.roe > 20 ? 'return on equity' : 'financial metrics'} 
                and {valuationMetrics.profitMargin > 20 ? 'profit margins' : 'operational efficiency'} support the current valuation multiple.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="dcf" className="space-y-6">
            {/* DCF Assumptions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DCF Assumptions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{dcfAssumptions.growthRate}%</div>
                  <div className="text-sm text-gray-600">Growth Rate</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{dcfAssumptions.terminalGrowth}%</div>
                  <div className="text-sm text-gray-600">Terminal Growth</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{dcfAssumptions.discountRate}%</div>
                  <div className="text-sm text-gray-600">Discount Rate</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">${dcfAssumptions.freeCashFlow}B</div>
                  <div className="text-sm text-gray-600">Free Cash Flow</div>
                </div>
              </div>
            </div>

            {/* DCF Calculation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DCF Calculation</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Present Value of FCF (5 years)</span>
                  <span className="font-semibold">${(dcfAssumptions.presentValue * 0.7).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Terminal Value</span>
                  <span className="font-semibold">${(dcfAssumptions.presentValue * 0.3).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-900 font-semibold">Fair Value</span>
                  <span className="text-xl font-bold text-gray-900">${dcfAssumptions.presentValue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Sensitivity Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensitivity Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Growth Rate</th>
                      <th className="text-right py-2">8%</th>
                      <th className="text-right py-2">8.5%</th>
                      <th className="text-right py-2">9%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Discount Rate 9%</td>
                      <td className="text-right py-2">$265.00</td>
                      <td className="text-right py-2 bg-blue-100 font-semibold">$275.00</td>
                      <td className="text-right py-2">$285.00</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Discount Rate 10%</td>
                      <td className="text-right py-2">$255.00</td>
                      <td className="text-right py-2">$265.00</td>
                      <td className="text-right py-2">$275.00</td>
                    </tr>
                    <tr>
                      <td className="py-2">Discount Rate 11%</td>
                      <td className="text-right py-2">$245.00</td>
                      <td className="text-right py-2">$255.00</td>
                      <td className="text-right py-2">$265.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-6">
            {/* Key Valuation Drivers */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Valuation Drivers</h3>
              <div className="space-y-4">
                {Object.entries(valuationDrivers).map(([driver, score]) => (
                  <div key={driver} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {driver.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          score >= 80 ? 'bg-green-500' : 
                          score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver Impact Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Impact Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Positive Drivers</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Strong market share gains in core segments</li>
                    <li>• New product pipeline driving growth</li>
                    <li>• Operational efficiency improvements</li>
                    <li>• Strong brand loyalty and pricing power</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Risk Factors</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Regulatory scrutiny increasing</li>
                    <li>• Competition intensifying in key markets</li>
                    <li>• Supply chain vulnerabilities</li>
                    <li>• Economic sensitivity in some segments</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Valuation Summary */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Valuation Driver Summary</h4>
              <p className="text-sm text-gray-700">
                {symbol} shows strong fundamentals across most valuation drivers, with particular strength in 
                market share and new product development. The company's ability to maintain pricing power and 
                expand margins supports the current valuation. However, regulatory risks and competitive pressures 
                should be monitored closely.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ValuationAnalysis; 
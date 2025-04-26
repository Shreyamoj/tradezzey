
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';

// Mock portfolio data
const portfolioData = {
  totalValue: 250000,
  dayChange: 3420.5,
  dayChangePercent: 1.42,
  monthChange: 12450.75,
  monthChangePercent: 5.23,
  allocation: [
    { category: 'Large Cap', value: 42 },
    { category: 'Mid Cap', value: 35 },
    { category: 'Small Cap', value: 23 },
  ],
  holdings: [
    { symbol: 'RELIANCE', qty: 25, avgPrice: 2450.50, ltp: 2543.60, pnl: 2327.50, pnlPercent: 3.8 },
    { symbol: 'HDFCBANK', qty: 40, avgPrice: 1520.75, ltp: 1567.90, pnl: 1886.00, pnlPercent: 3.1 },
    { symbol: 'TCS', qty: 10, avgPrice: 3920.25, ltp: 3854.25, pnl: -660.00, pnlPercent: -1.68 },
  ]
};

const PortfolioSummary: React.FC = () => {
  const isPositiveDay = portfolioData.dayChange >= 0;
  const isPositiveMonth = portfolioData.monthChange >= 0;
  
  return (
    <div className="trading-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Portfolio Summary</h2>
        <div className="text-xs text-muted-foreground">
          Last updated: 12 Apr, 15:30 IST
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-secondary border-none">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-2xl font-semibold mt-1">₹{portfolioData.totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary border-none">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Today's P&L</p>
            <div className={`flex items-center mt-1 ${isPositiveDay ? 'text-profit' : 'text-loss'}`}>
              <p className="text-2xl font-semibold">
                {isPositiveDay ? '+' : ''}₹{Math.abs(portfolioData.dayChange).toLocaleString()}
              </p>
              <div className="ml-2 flex items-center text-sm">
                {isPositiveDay ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{isPositiveDay ? '+' : ''}{portfolioData.dayChangePercent}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary border-none">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">30 Day P&L</p>
            <div className={`flex items-center mt-1 ${isPositiveMonth ? 'text-profit' : 'text-loss'}`}>
              <p className="text-2xl font-semibold">
                {isPositiveMonth ? '+' : ''}₹{Math.abs(portfolioData.monthChange).toLocaleString()}
              </p>
              <div className="ml-2 flex items-center text-sm">
                {isPositiveMonth ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{isPositiveMonth ? '+' : ''}{portfolioData.monthChangePercent}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-5">
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            Allocation
          </h3>
          <div className="space-y-3">
            {portfolioData.allocation.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{item.category}</span>
                  <span>{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-7">
          <h3 className="text-sm font-medium mb-3">Top Holdings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="text-left py-2">Symbol</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-right py-2">Avg Price</th>
                  <th className="text-right py-2">LTP</th>
                  <th className="text-right py-2">P&L</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.holdings.map((holding, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-2.5 font-medium">{holding.symbol}</td>
                    <td className="text-right py-2.5">{holding.qty}</td>
                    <td className="text-right py-2.5">₹{holding.avgPrice.toFixed(2)}</td>
                    <td className="text-right py-2.5">₹{holding.ltp.toFixed(2)}</td>
                    <td className={`text-right py-2.5 ${holding.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      <div>
                        {holding.pnl >= 0 ? '+' : ''}₹{holding.pnl.toFixed(2)}
                      </div>
                      <div className="text-xs">
                        {holding.pnl >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;


import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';
import { tradingService, PortfolioSummaryData } from '../services/tradingService';

const PortfolioSummary: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setIsLoading(true);
        const data = await tradingService.getPortfolioSummary();
        setPortfolioData(data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchPortfolioData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading || !portfolioData) {
    return (
      <div className="trading-card min-h-[400px] animate-pulse">
        <div className="h-6 w-48 bg-muted rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-secondary border-none">
              <CardContent className="p-4">
                <div className="h-3 w-24 bg-muted rounded mb-3"></div>
                <div className="h-6 w-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <div className="h-4 w-32 bg-muted rounded mb-4"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-2 w-full bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="h-4 w-32 bg-muted rounded mb-4"></div>
            <div className="h-40 w-full bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const { 
    totalValue, totalInvestment, dayChange, dayChangePercent, 
    monthChange, monthChangePercent, overallPnl, overallPnlPercent,
    allocation, holdings
  } = portfolioData;

  const isPositiveDay = dayChange >= 0;
  const isPositiveMonth = monthChange >= 0;
  const isPositiveOverall = overallPnl >= 0;
  
  const formattedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="trading-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Portfolio Summary</h2>
        <div className="text-xs text-muted-foreground">
          Last updated: {formattedDate} IST
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-secondary border-none">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Value</p>
            <div className="flex items-center mt-1">
              <p className="text-2xl font-semibold">₹{totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <div className={`ml-2 flex items-center text-xs ${isPositiveOverall ? 'text-profit' : 'text-loss'}`}>
                {isPositiveOverall ? (
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                )}
                <span>{isPositiveOverall ? '+' : ''}{overallPnlPercent.toFixed(2)}%</span>
              </div>
            </div>
            <p className="text-xs mt-1 text-muted-foreground">
              Invested: ₹{totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary border-none">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Today's P&L</p>
            <div className={`flex items-center mt-1 ${isPositiveDay ? 'text-profit' : 'text-loss'}`}>
              <p className="text-2xl font-semibold">
                {isPositiveDay ? '+' : ''}₹{Math.abs(dayChange).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <div className="ml-2 flex items-center text-sm">
                {isPositiveDay ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{isPositiveDay ? '+' : ''}{dayChangePercent.toFixed(2)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary border-none">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">30 Day P&L</p>
            <div className={`flex items-center mt-1 ${isPositiveMonth ? 'text-profit' : 'text-loss'}`}>
              <p className="text-2xl font-semibold">
                {isPositiveMonth ? '+' : ''}₹{Math.abs(monthChange).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <div className="ml-2 flex items-center text-sm">
                {isPositiveMonth ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{isPositiveMonth ? '+' : ''}{monthChangePercent.toFixed(2)}%</span>
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
            {allocation.map((item, index) => (
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
                {holdings.map((holding, index) => (
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


import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

// Mock data for market movers
const topGainers = [
  { symbol: 'TATAMOTORS', price: 853.75, change: 3.25, percentChange: 4.12 },
  { symbol: 'HDFCBANK', price: 1567.90, change: 42.50, percentChange: 2.78 },
  { symbol: 'ICICIBANK', price: 1023.45, change: 18.75, percentChange: 1.87 },
];

const topLosers = [
  { symbol: 'RELIANCE', price: 2543.60, change: -45.80, percentChange: -1.77 },
  { symbol: 'INFY', price: 1642.30, change: -28.65, percentChange: -1.72 },
  { symbol: 'TCS', price: 3854.25, change: -62.40, percentChange: -1.59 },
];

const marketIndices = [
  { name: 'NIFTY 50', value: 22564.30, change: 124.35, percentChange: 0.55 },
  { name: 'SENSEX', value: 74108.75, change: 412.55, percentChange: 0.56 },
  { name: 'NIFTY BANK', value: 48121.90, change: 235.45, percentChange: 0.49 },
  { name: 'NIFTY IT', value: 36789.25, change: -315.80, percentChange: -0.85 },
];

const MarketOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">Market Indices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {marketIndices.map((index) => (
            <Card key={index.name} className="overflow-hidden">
              <CardContent className="p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{index.name}</p>
                  <p className="text-lg font-semibold">₹{index.value.toLocaleString()}</p>
                </div>
                <div className={`flex flex-col items-end ${index.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                  <div className="flex items-center">
                    {index.change >= 0 ? 
                      <TrendingUp className="h-3.5 w-3.5 mr-1" /> : 
                      <TrendingDown className="h-3.5 w-3.5 mr-1" />
                    }
                    <span className="text-sm font-medium">{index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}</span>
                  </div>
                  <span className="text-xs">{index.change >= 0 ? '+' : ''}{index.percentChange.toFixed(2)}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Top Gainers</h2>
          <div className="space-y-2">
            {topGainers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center p-3 bg-card rounded-md border hover:border-profit/30 transition-colors">
                <div>
                  <p className="font-medium">{stock.symbol}</p>
                  <p className="text-sm text-muted-foreground">₹{stock.price}</p>
                </div>
                <div className="text-profit text-right">
                  <p className="flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-1" />
                    +{stock.change.toFixed(2)}
                  </p>
                  <p className="text-xs">+{stock.percentChange.toFixed(2)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Top Losers</h2>
          <div className="space-y-2">
            {topLosers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center p-3 bg-card rounded-md border hover:border-loss/30 transition-colors">
                <div>
                  <p className="font-medium">{stock.symbol}</p>
                  <p className="text-sm text-muted-foreground">₹{stock.price}</p>
                </div>
                <div className="text-loss text-right">
                  <p className="flex items-center">
                    <TrendingDown className="h-3.5 w-3.5 mr-1" />
                    {stock.change.toFixed(2)}
                  </p>
                  <p className="text-xs">{stock.percentChange.toFixed(2)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;

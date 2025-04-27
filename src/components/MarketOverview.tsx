
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { marketDataService, MarketIndex, StockData } from '../services/marketDataService';

const MarketOverview: React.FC = () => {
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [topGainers, setTopGainers] = useState<StockData[]>([]);
  const [topLosers, setTopLosers] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch market indices
        const indices = await marketDataService.fetchMarketIndices();
        setMarketIndices(indices);
        
        // Fetch top gainers and losers
        const { gainers, losers } = await marketDataService.fetchTopGainersLosers();
        setTopGainers(gainers);
        setTopLosers(losers);
      } catch (error) {
        console.error("Error fetching market overview data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
    
    // Refresh data every minute
    const intervalId = setInterval(fetchMarketData, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">Market Indices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isLoading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden animate-pulse">
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="w-20 h-5 bg-muted rounded"></div>
                  <div className="w-16 h-4 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            marketIndices.map((index) => (
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
            ))
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Top Gainers</h2>
          <div className="space-y-2">
            {isLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, index) => (
                <div key={`gainer-skeleton-${index}`} className="flex justify-between items-center p-3 bg-card rounded-md border animate-pulse">
                  <div className="w-20 h-5 bg-muted rounded"></div>
                  <div className="w-16 h-4 bg-muted rounded"></div>
                </div>
              ))
            ) : (
              topGainers.map((stock) => (
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
              ))
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Top Losers</h2>
          <div className="space-y-2">
            {isLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, index) => (
                <div key={`loser-skeleton-${index}`} className="flex justify-between items-center p-3 bg-card rounded-md border animate-pulse">
                  <div className="w-20 h-5 bg-muted rounded"></div>
                  <div className="w-16 h-4 bg-muted rounded"></div>
                </div>
              ))
            ) : (
              topLosers.map((stock) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;

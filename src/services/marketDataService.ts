
import { toast } from "sonner";

// Types for market data
export interface StockData {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  percentChange: number;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

// Free APIs for Indian stock market data
const NSE_PROXY_API = "https://nse-data-proxy.onrender.com/api";

class MarketDataService {
  private stockCache: Map<string, StockData> = new Map();
  private indicesCache: MarketIndex[] = [];
  private lastUpdated: number = 0;

  constructor() {
    // Initialize with some data
    this.fetchMarketIndices();
    this.setUpdateInterval();
  }

  private setUpdateInterval() {
    // Update market data every 60 seconds
    setInterval(() => {
      this.fetchMarketIndices();
    }, 60000);
  }

  async fetchStockData(symbol: string): Promise<StockData> {
    try {
      // Check cache first (if not older than 60 seconds)
      if (this.stockCache.has(symbol) && Date.now() - this.lastUpdated < 60000) {
        return this.stockCache.get(symbol)!;
      }

      // In a real app, we would fetch from NSE API
      // For now, simulate with a small delay and randomized data
      const stockData: StockData = await this.simulateStockDataFetch(symbol);
      
      // Update cache
      this.stockCache.set(symbol, stockData);
      this.lastUpdated = Date.now();
      
      return stockData;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      toast.error(`Failed to fetch data for ${symbol}`);
      
      // Return cached data if available, otherwise a default
      return this.stockCache.get(symbol) || this.getDefaultStockData(symbol);
    }
  }

  async fetchMarketIndices(): Promise<MarketIndex[]> {
    try {
      // In production, we would fetch real indices from NSE
      const indices = await this.simulateIndicesFetch();
      this.indicesCache = indices;
      this.lastUpdated = Date.now();
      return indices;
    } catch (error) {
      console.error("Error fetching market indices:", error);
      return this.indicesCache.length ? this.indicesCache : this.getDefaultIndices();
    }
  }

  async fetchHistoricalData(symbol: string, timeframe: string): Promise<HistoricalDataPoint[]> {
    try {
      // In production, we would fetch from a real API
      // For now, simulate historical data
      return await this.simulateHistoricalDataFetch(symbol, timeframe);
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      toast.error(`Failed to fetch historical data for ${symbol}`);
      return this.getDefaultHistoricalData();
    }
  }

  async fetchTopGainersLosers(): Promise<{ gainers: StockData[], losers: StockData[] }> {
    try {
      // In production, we would fetch from real API
      // For now, simulate data
      const gainers = await this.simulateTopGainersFetch();
      const losers = await this.simulateTopLosersFetch();
      
      return { gainers, losers };
    } catch (error) {
      console.error("Error fetching top gainers/losers:", error);
      return {
        gainers: this.getDefaultGainers(),
        losers: this.getDefaultLosers()
      };
    }
  }

  // Simulation methods (to be replaced with real API calls in production)
  private async simulateStockDataFetch(symbol: string): Promise<StockData> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const basePrice = this.getBasePrice(symbol);
    const change = parseFloat((Math.random() * 40 - 20).toFixed(2));
    const price = parseFloat((basePrice + change).toFixed(2));
    const percentChange = parseFloat((change / basePrice * 100).toFixed(2));
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    
    return {
      symbol,
      price,
      change,
      percentChange,
      open: parseFloat((price - Math.random() * 10).toFixed(2)),
      high: parseFloat((price + Math.random() * 15).toFixed(2)),
      low: parseFloat((price - Math.random() * 15).toFixed(2)),
      volume,
      previousClose: parseFloat((price - change).toFixed(2))
    };
  }

  private async simulateIndicesFetch(): Promise<MarketIndex[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      this.generateIndexData("NIFTY 50", 22500 + Math.random() * 200 - 100),
      this.generateIndexData("SENSEX", 74000 + Math.random() * 500 - 250),
      this.generateIndexData("NIFTY BANK", 48000 + Math.random() * 300 - 150),
      this.generateIndexData("NIFTY IT", 36700 + Math.random() * 250 - 125)
    ];
  }

  private async simulateHistoricalDataFetch(symbol: string, timeframe: string): Promise<HistoricalDataPoint[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const points: HistoricalDataPoint[] = [];
    const basePrice = this.getBasePrice(symbol);
    let currentPrice = basePrice;
    
    // Generate data based on timeframe
    const dataPoints = timeframe === "1D" ? 24 : 
                       timeframe === "1W" ? 7 : 
                       timeframe === "1M" ? 30 : 
                       timeframe === "3M" ? 90 : 
                       timeframe === "6M" ? 180 : 
                       timeframe === "1Y" ? 365 : 100;
    
    for (let i = 0; i < dataPoints; i++) {
      // Add some randomness to create realistic price movement
      const change = (Math.random() * 2 - 1) * (basePrice * 0.02);
      currentPrice = Math.max(currentPrice + change, basePrice * 0.5);
      
      const date = this.getDateForHistorical(i, dataPoints, timeframe);
      
      points.push({
        date,
        price: parseFloat(currentPrice.toFixed(2)),
        open: parseFloat((currentPrice - Math.random() * 10).toFixed(2)),
        high: parseFloat((currentPrice + Math.random() * 15).toFixed(2)),
        low: parseFloat((currentPrice - Math.random() * 15).toFixed(2)),
        close: parseFloat(currentPrice.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }
    
    return points;
  }

  private async simulateTopGainersFetch(): Promise<StockData[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      this.generateStockData("TATAMOTORS", 850, true),
      this.generateStockData("HDFCBANK", 1560, true),
      this.generateStockData("ICICIBANK", 1020, true)
    ];
  }

  private async simulateTopLosersFetch(): Promise<StockData[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      this.generateStockData("RELIANCE", 2540, false),
      this.generateStockData("INFY", 1640, false),
      this.generateStockData("TCS", 3850, false)
    ];
  }

  // Helper methods for generating mock data
  private getBasePrice(symbol: string): number {
    const basePrices: Record<string, number> = {
      "NIFTY": 22500,
      "SENSEX": 74000,
      "RELIANCE": 2540,
      "HDFCBANK": 1560,
      "TCS": 3850,
      "INFY": 1640,
      "TATAMOTORS": 850,
      "ICICIBANK": 1020,
    };
    
    return basePrices[symbol] || 1000 + Math.random() * 2000;
  }

  private generateStockData(symbol: string, basePrice: number, isGainer: boolean): StockData {
    const multiplier = isGainer ? 1 : -1;
    const changePercent = parseFloat((Math.random() * 3 * multiplier).toFixed(2));
    const change = parseFloat((basePrice * changePercent / 100).toFixed(2));
    const price = parseFloat((basePrice + change).toFixed(2));
    
    return {
      symbol,
      price,
      change,
      percentChange: changePercent,
      open: parseFloat((price - Math.random() * 10).toFixed(2)),
      high: parseFloat((price + Math.random() * 15).toFixed(2)),
      low: parseFloat((price - Math.random() * 15).toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
      previousClose: parseFloat((price - change).toFixed(2))
    };
  }

  private generateIndexData(name: string, baseValue: number): MarketIndex {
    const change = parseFloat((Math.random() * 200 - 100).toFixed(2));
    const value = parseFloat((baseValue + change).toFixed(2));
    const percentChange = parseFloat((change / baseValue * 100).toFixed(2));
    
    return {
      name,
      value,
      change,
      percentChange
    };
  }

  private getDateForHistorical(i: number, total: number, timeframe: string): string {
    const date = new Date();
    
    if (timeframe === "1D") {
      date.setHours(9 + Math.floor(i / (total / 7)));
      date.setMinutes((i % (total / 7)) * (60 / (total / 7)));
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      if (timeframe === "1W") date.setDate(date.getDate() - 7 + i);
      else if (timeframe === "1M") date.setDate(date.getDate() - 30 + i);
      else if (timeframe === "3M") date.setDate(date.getDate() - 90 + i);
      else if (timeframe === "6M") date.setDate(date.getDate() - 180 + i);
      else if (timeframe === "1Y") date.setDate(date.getDate() - 365 + i);
      
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }
  }

  // Default data methods (fallbacks)
  private getDefaultStockData(symbol: string): StockData {
    return {
      symbol,
      price: 1000,
      change: 0,
      percentChange: 0,
      open: 1000,
      high: 1000,
      low: 1000,
      volume: 100000,
      previousClose: 1000
    };
  }

  private getDefaultIndices(): MarketIndex[] {
    return [
      { name: "NIFTY 50", value: 22564.30, change: 124.35, percentChange: 0.55 },
      { name: "SENSEX", value: 74108.75, change: 412.55, percentChange: 0.56 },
      { name: "NIFTY BANK", value: 48121.90, change: 235.45, percentChange: 0.49 },
      { name: "NIFTY IT", value: 36789.25, change: -315.80, percentChange: -0.85 }
    ];
  }

  private getDefaultHistoricalData(): HistoricalDataPoint[] {
    const result: HistoricalDataPoint[] = [];
    for (let i = 0; i < 10; i++) {
      result.push({
        date: `10:${i}0`,
        price: 1000 + i * 10
      });
    }
    return result;
  }

  private getDefaultGainers(): StockData[] {
    return [
      this.generateStockData("TATAMOTORS", 850, true),
      this.generateStockData("HDFCBANK", 1560, true),
      this.generateStockData("ICICIBANK", 1020, true)
    ];
  }

  private getDefaultLosers(): StockData[] {
    return [
      this.generateStockData("RELIANCE", 2540, false),
      this.generateStockData("INFY", 1640, false),
      this.generateStockData("TCS", 3850, false)
    ];
  }
}

export const marketDataService = new MarketDataService();

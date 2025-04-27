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

// Define a cache storage duration (15 seconds)
const CACHE_DURATION = 15000;

class MarketDataService {
  private stockCache: Map<string, { data: StockData; timestamp: number }> = new Map();
  private indicesCache: { data: MarketIndex[]; timestamp: number } = { data: [], timestamp: 0 };
  
  constructor() {
    // Initialize with some data
    this.fetchMarketIndices();
  }

  async fetchStockData(symbol: string): Promise<StockData> {
    try {
      // Check cache first
      const cached = this.stockCache.get(symbol);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }

      // Try to fetch real data from API
      const data = await this.fetchRealStockData(symbol);
      
      // Cache the result
      this.stockCache.set(symbol, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      toast.error(`Failed to fetch data for ${symbol}`);
      
      // Return cached data if available, otherwise a default
      const cached = this.stockCache.get(symbol);
      return cached ? cached.data : this.getDefaultStockData(symbol);
    }
  }

  private async fetchRealStockData(symbol: string): Promise<StockData> {
    try {
      // Try to fetch from a public API
      const nseSymbol = this.getNSESymbol(symbol);
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${nseSymbol}.NSE&apikey=demo`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code === 400 || data.status === "error") {
        throw new Error(data.message || "API returned an error");
      }
      
      // If we got data back, transform it to our format
      if (data.symbol) {
        const price = parseFloat(data.close);
        const previousClose = parseFloat(data.previous_close);
        const change = price - previousClose;
        const percentChange = (change / previousClose) * 100;
        
        return {
          symbol,
          price,
          change,
          percentChange,
          open: parseFloat(data.open),
          high: parseFloat(data.high),
          low: parseFloat(data.low),
          volume: parseInt(data.volume),
          previousClose
        };
      }
      
      // If we couldn't get real data, fall back to simulation
      return this.simulateStockDataFetch(symbol);
    } catch (error) {
      console.warn(`Falling back to simulated data for ${symbol}:`, error);
      return this.simulateStockDataFetch(symbol);
    }
  }

  async fetchMarketIndices(): Promise<MarketIndex[]> {
    try {
      // Check cache first
      if (this.indicesCache.data.length > 0 && Date.now() - this.indicesCache.timestamp < CACHE_DURATION) {
        return this.indicesCache.data;
      }

      // Try to fetch real data
      const indices = await this.fetchRealIndices();
      
      // Cache the result
      this.indicesCache = { data: indices, timestamp: Date.now() };
      
      return indices;
    } catch (error) {
      console.error("Error fetching market indices:", error);
      return this.indicesCache.data.length ? this.indicesCache.data : this.getDefaultIndices();
    }
  }

  private async fetchRealIndices(): Promise<MarketIndex[]> {
    try {
      // Try to fetch from a public API
      const response = await fetch('https://api.twelvedata.com/time_series?symbol=NIFTY50.INDX,SENSEX.INDX&interval=1day&outputsize=1&apikey=demo');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code === 400 || data.status === "error") {
        throw new Error(data.message || "API returned an error");
      }
      
      // If we got data, transform it to our format
      const indices: MarketIndex[] = [];
      
      if (data["NIFTY50.INDX"] && data["NIFTY50.INDX"].values && data["NIFTY50.INDX"].values.length > 0) {
        const niftyData = data["NIFTY50.INDX"].values[0];
        const value = parseFloat(niftyData.close);
        const previousValue = parseFloat(niftyData.open);
        const change = value - previousValue;
        
        indices.push({
          name: "NIFTY 50",
          value,
          change,
          percentChange: (change / previousValue) * 100
        });
      }
      
      if (data["SENSEX.INDX"] && data["SENSEX.INDX"].values && data["SENSEX.INDX"].values.length > 0) {
        const sensexData = data["SENSEX.INDX"].values[0];
        const value = parseFloat(sensexData.close);
        const previousValue = parseFloat(sensexData.open);
        const change = value - previousValue;
        
        indices.push({
          name: "SENSEX",
          value,
          change,
          percentChange: (change / previousValue) * 100
        });
      }
      
      // If we got real data, add additional simulated indices
      if (indices.length > 0) {
        indices.push(this.generateIndexData("NIFTY BANK", 48000));
        indices.push(this.generateIndexData("NIFTY IT", 36700));
        return indices;
      }
      
      // If we couldn't get any real data, fall back to simulation
      return this.simulateIndicesFetch();
    } catch (error) {
      console.warn("Falling back to simulated indices:", error);
      return this.simulateIndicesFetch();
    }
  }

  async fetchHistoricalData(symbol: string, timeframe: string): Promise<HistoricalDataPoint[]> {
    try {
      // Try to fetch real historical data
      const data = await this.fetchRealHistoricalData(symbol, timeframe);
      if (data.length > 0) {
        return data;
      }
      
      // Fall back to simulation if no real data
      return this.simulateHistoricalDataFetch(symbol, timeframe);
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      toast.error(`Failed to fetch historical data for ${symbol}`);
      return this.getDefaultHistoricalData();
    }
  }

  private async fetchRealHistoricalData(symbol: string, timeframe: string): Promise<HistoricalDataPoint[]> {
    try {
      // Map timeframe to API interval
      const interval = 
        timeframe === "1D" ? "5min" : 
        timeframe === "1W" ? "1h" : 
        timeframe === "1M" ? "1day" : 
        timeframe === "3M" ? "1day" : 
        timeframe === "6M" ? "1day" : 
        timeframe === "1Y" ? "1day" : "1day";
      
      // Determine output size based on timeframe
      const outputsize = 
        timeframe === "1D" ? "24" : 
        timeframe === "1W" ? "42" : 
        timeframe === "1M" ? "30" : 
        timeframe === "3M" ? "90" : 
        timeframe === "6M" ? "180" : 
        timeframe === "1Y" ? "250" : "100";
      
      const nseSymbol = this.getNSESymbol(symbol);
      const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${nseSymbol}.NSE&interval=${interval}&outputsize=${outputsize}&apikey=demo`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code === 400 || data.status === "error") {
        throw new Error(data.message || "API returned an error");
      }
      
      if (data.values && data.values.length > 0) {
        // Transform API data to our format
        return data.values.map((item: any) => ({
          date: timeframe === "1D" ? item.datetime.split(' ')[1] : item.datetime.split(' ')[0],
          price: parseFloat(item.close),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
          volume: parseInt(item.volume)
        })).reverse();
      }
      
      return [];
    } catch (error) {
      console.warn(`Falling back to simulated historical data for ${symbol}:`, error);
      return [];
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

  // Helper method to convert our symbols to NSE format
  private getNSESymbol(symbol: string): string {
    // Map our internal symbols to NSE symbols if needed
    const symbolMap: Record<string, string> = {
      "NIFTY": "NIFTY50",
      "SENSEX": "SENSEX",
      "HDFCBANK": "HDFCBANK",
      "RELIANCE": "RELIANCE",
      "TCS": "TCS",
      "INFY": "INFY",
      "TATAMOTORS": "TATAMOTORS",
      "ICICIBANK": "ICICIBANK"
    };
    
    return symbolMap[symbol] || symbol;
  }

  // Simulation methods (to be used as fallbacks when API fails)
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

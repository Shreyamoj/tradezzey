
import { toast } from "sonner";
import { marketDataService, StockData } from "./marketDataService";

export interface PortfolioHolding {
  symbol: string;
  qty: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  pnlPercent: number;
  value: number;
}

export interface PortfolioSummaryData {
  totalValue: number;
  totalInvestment: number;
  dayChange: number;
  dayChangePercent: number;
  monthChange: number;
  monthChangePercent: number;
  overallPnl: number;
  overallPnlPercent: number;
  allocation: { category: string; value: number }[];
  holdings: PortfolioHolding[];
}

export interface Order {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  price: number;
  qty: number;
  status: "PENDING" | "EXECUTED" | "CANCELLED" | "REJECTED";
  timestamp: Date;
  stoploss?: number;
  target?: number;
}

export interface TradeSettings {
  defaultQuantity: number;
  stoplossPercentage: number;
  targetPercentage: number;
  defaultCapitalPerTrade: number;
}

class TradingService {
  private portfolio: PortfolioHolding[] = [];
  private orders: Order[] = [];
  private settings: TradeSettings = {
    defaultQuantity: 10,
    stoplossPercentage: 2,
    targetPercentage: 3,
    defaultCapitalPerTrade: 10000
  };
  
  constructor() {
    // Initialize with some mock holdings
    this.initMockPortfolio();
  }
  
  private initMockPortfolio() {
    // Add some sample holdings
    this.portfolio = [
      {
        symbol: "RELIANCE",
        qty: 25,
        avgPrice: 2450.50,
        ltp: 2543.60,
        pnl: 2327.50,
        pnlPercent: 3.8,
        value: 63590
      },
      {
        symbol: "HDFCBANK",
        qty: 40,
        avgPrice: 1520.75,
        ltp: 1567.90,
        pnl: 1886.00,
        pnlPercent: 3.1,
        value: 62716
      },
      {
        symbol: "TCS",
        qty: 10,
        avgPrice: 3920.25,
        ltp: 3854.25,
        pnl: -660.00,
        pnlPercent: -1.68,
        value: 38542.5
      }
    ];
  }
  
  async getPortfolioSummary(): Promise<PortfolioSummaryData> {
    try {
      // Update current prices
      await this.updatePortfolioPrices();
      
      // Calculate summary data
      const holdings = [...this.portfolio];
      
      const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
      const totalInvestment = holdings.reduce((sum, holding) => sum + holding.avgPrice * holding.qty, 0);
      const overallPnl = totalValue - totalInvestment;
      const overallPnlPercent = (overallPnl / totalInvestment) * 100;
      
      // Simulated day and month changes
      const dayChange = totalValue * (Math.random() * 0.04 - 0.02);
      const dayChangePercent = (dayChange / totalValue) * 100;
      
      const monthChange = totalValue * (Math.random() * 0.12 - 0.04);
      const monthChangePercent = (monthChange / totalValue) * 100;
      
      // Calculate allocation
      const allocation = this.calculateAllocation(holdings);
      
      return {
        totalValue,
        totalInvestment,
        dayChange,
        dayChangePercent,
        monthChange,
        monthChangePercent,
        overallPnl,
        overallPnlPercent,
        allocation,
        holdings
      };
    } catch (error) {
      console.error("Error getting portfolio summary:", error);
      toast.error("Failed to fetch portfolio data");
      
      // Return default data
      return this.getDefaultPortfolioSummary();
    }
  }
  
  async updatePortfolioPrices(): Promise<void> {
    try {
      // Update LTP for each holding
      for (const holding of this.portfolio) {
        const stockData = await marketDataService.fetchStockData(holding.symbol);
        holding.ltp = stockData.price;
        
        // Recalculate P&L
        holding.value = holding.ltp * holding.qty;
        holding.pnl = holding.value - (holding.avgPrice * holding.qty);
        holding.pnlPercent = (holding.pnl / (holding.avgPrice * holding.qty)) * 100;
      }
    } catch (error) {
      console.error("Error updating portfolio prices:", error);
    }
  }
  
  private calculateAllocation(holdings: PortfolioHolding[]): { category: string; value: number }[] {
    // In a real app, this would categorize stocks by sector/cap size
    // For now, we'll create a simple dummy allocation
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    
    const largeCap = holdings.filter(h => ["RELIANCE", "HDFCBANK", "TCS"].includes(h.symbol))
                            .reduce((sum, h) => sum + h.value, 0);
    
    const midCap = holdings.filter(h => ["TATAMOTORS"].includes(h.symbol))
                          .reduce((sum, h) => sum + h.value, 0);
    
    const smallCap = totalValue - largeCap - midCap;
    
    return [
      { category: "Large Cap", value: Math.round((largeCap / totalValue) * 100) },
      { category: "Mid Cap", value: Math.round((midCap / totalValue) * 100) },
      { category: "Small Cap", value: Math.round((smallCap / totalValue) * 100) }
    ];
  }
  
  async placeOrder(order: Omit<Order, "id" | "status" | "timestamp">): Promise<Order> {
    try {
      const id = `ORD${Date.now().toString().substring(6)}`;
      const newOrder: Order = {
        ...order,
        id,
        status: "PENDING",
        timestamp: new Date()
      };
      
      // Simulate order processing
      setTimeout(() => {
        this.processOrder(newOrder);
      }, 1500);
      
      this.orders.push(newOrder);
      toast.success(`Order placed: ${order.type} ${order.qty} ${order.symbol}`);
      return newOrder;
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
      throw error;
    }
  }
  
  private processOrder(order: Order): void {
    // In a real app, this would connect to a broker API
    // Simulate order execution with 90% success rate
    if (Math.random() < 0.9) {
      order.status = "EXECUTED";
      toast.success(`Order executed: ${order.type} ${order.qty} ${order.symbol}`);
      
      // Update portfolio
      this.updatePortfolio(order);
    } else {
      order.status = "REJECTED";
      toast.error(`Order rejected: ${order.type} ${order.qty} ${order.symbol}`);
    }
  }
  
  private updatePortfolio(order: Order): void {
    if (order.status !== "EXECUTED") return;
    
    const existingHolding = this.portfolio.find(h => h.symbol === order.symbol);
    
    if (order.type === "BUY") {
      if (existingHolding) {
        // Update existing holding
        const newQty = existingHolding.qty + order.qty;
        const newValue = existingHolding.value + (order.price * order.qty);
        existingHolding.qty = newQty;
        existingHolding.avgPrice = newValue / newQty;
        existingHolding.value = newValue;
      } else {
        // Add new holding
        this.portfolio.push({
          symbol: order.symbol,
          qty: order.qty,
          avgPrice: order.price,
          ltp: order.price,
          pnl: 0,
          pnlPercent: 0,
          value: order.price * order.qty
        });
      }
    } else if (order.type === "SELL") {
      if (existingHolding) {
        if (existingHolding.qty < order.qty) {
          toast.error(`Insufficient quantity to sell ${order.symbol}`);
          return;
        }
        
        existingHolding.qty -= order.qty;
        existingHolding.value = existingHolding.qty * existingHolding.ltp;
        
        // Remove holding if qty becomes 0
        if (existingHolding.qty === 0) {
          this.portfolio = this.portfolio.filter(h => h.symbol !== order.symbol);
        }
      } else {
        toast.error(`No holding found for ${order.symbol}`);
      }
    }
    
    // Recalculate P&L
    this.updatePortfolioPrices();
  }
  
  getTradeSettings(): TradeSettings {
    return { ...this.settings };
  }
  
  updateTradeSettings(settings: Partial<TradeSettings>): void {
    this.settings = { ...this.settings, ...settings };
    toast.success("Trade settings updated");
  }
  
  getRecentOrders(): Order[] {
    return [...this.orders].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  // Default data (fallback)
  private getDefaultPortfolioSummary(): PortfolioSummaryData {
    return {
      totalValue: 250000,
      totalInvestment: 240000,
      dayChange: 3420.5,
      dayChangePercent: 1.42,
      monthChange: 12450.75,
      monthChangePercent: 5.23,
      overallPnl: 10000,
      overallPnlPercent: 4.17,
      allocation: [
        { category: "Large Cap", value: 42 },
        { category: "Mid Cap", value: 35 },
        { category: "Small Cap", value: 23 }
      ],
      holdings: this.portfolio
    };
  }
}

export const tradingService = new TradingService();

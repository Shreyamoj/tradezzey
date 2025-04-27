
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, Play, CalendarDays } from 'lucide-react';
import { toast } from "sonner";
import { marketDataService } from '../services/marketDataService';
import { tradingService } from '../services/tradingService';

const LiveTrade: React.FC = () => {
  const [activeSymbol, setActiveSymbol] = useState("RELIANCE");
  const [quantity, setQuantity] = useState("10");
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [limitPrice, setLimitPrice] = useState("");
  const [isStopLoss, setIsStopLoss] = useState(false);
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [isTarget, setIsTarget] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch current price for the symbol
        const stockData = await marketDataService.fetchStockData(activeSymbol);
        setCurrentPrice(stockData.price);
        
        // Set default limit price if empty
        if (!limitPrice) {
          setLimitPrice(stockData.price.toFixed(2));
        }
        
        // Set default stop loss and target prices
        const settings = tradingService.getTradeSettings();
        if (!stopLossPrice) {
          setStopLossPrice((stockData.price * (1 - settings.stoplossPercentage / 100)).toFixed(2));
        }
        if (!targetPrice) {
          setTargetPrice((stockData.price * (1 + settings.targetPercentage / 100)).toFixed(2));
        }
        
        // Get recent orders
        setOrders(tradingService.getRecentOrders());
      } catch (error) {
        console.error("Error fetching trade data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh price every 10 seconds
    const intervalId = setInterval(async () => {
      try {
        const stockData = await marketDataService.fetchStockData(activeSymbol);
        setCurrentPrice(stockData.price);
      } catch (error) {
        console.error("Error updating price:", error);
      }
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [activeSymbol]);

  const handleBuy = async () => {
    try {
      const order = {
        symbol: activeSymbol,
        type: "BUY" as const,
        price: orderType === "LIMIT" ? parseFloat(limitPrice) : currentPrice,
        qty: parseInt(quantity),
        stoploss: isStopLoss ? parseFloat(stopLossPrice) : undefined,
        target: isTarget ? parseFloat(targetPrice) : undefined
      };
      
      await tradingService.placeOrder(order);
      
      // Refresh orders
      setOrders(tradingService.getRecentOrders());
    } catch (error) {
      console.error("Error placing buy order:", error);
    }
  };

  const handleSell = async () => {
    try {
      const order = {
        symbol: activeSymbol,
        type: "SELL" as const,
        price: orderType === "LIMIT" ? parseFloat(limitPrice) : currentPrice,
        qty: parseInt(quantity),
        stoploss: isStopLoss ? parseFloat(stopLossPrice) : undefined,
        target: isTarget ? parseFloat(targetPrice) : undefined
      };
      
      await tradingService.placeOrder(order);
      
      // Refresh orders
      setOrders(tradingService.getRecentOrders());
    } catch (error) {
      console.error("Error placing sell order:", error);
    }
  };

  return (
    <div className="trading-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Live Trading</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1">
            <CalendarDays className="h-4 w-4 mr-1" />
            Order Book
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <Activity className="h-4 w-4 mr-1" />
            Trade History
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="new-order">
        <TabsList className="mb-4">
          <TabsTrigger value="new-order">New Order</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-order">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol">Symbol</Label>
                  <Select 
                    value={activeSymbol}
                    onValueChange={setActiveSymbol}
                  >
                    <SelectTrigger id="symbol">
                      <SelectValue placeholder="Select Stock" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RELIANCE">RELIANCE</SelectItem>
                      <SelectItem value="HDFCBANK">HDFCBANK</SelectItem>
                      <SelectItem value="TCS">TCS</SelectItem>
                      <SelectItem value="INFY">INFOSYS</SelectItem>
                      <SelectItem value="TATAMOTORS">TATA MOTORS</SelectItem>
                      <SelectItem value="ICICIBANK">ICICI BANK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order-type">Order Type</Label>
                  <Select 
                    value={orderType}
                    onValueChange={(value) => setOrderType(value as any)}
                  >
                    <SelectTrigger id="order-type">
                      <SelectValue placeholder="Order Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKET">MARKET</SelectItem>
                      <SelectItem value="LIMIT">LIMIT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {orderType === "LIMIT" && (
                  <div>
                    <Label htmlFor="limit-price">Limit Price</Label>
                    <Input 
                      id="limit-price" 
                      type="number" 
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      step="0.05"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="stoploss" 
                      className="mr-2"
                      checked={isStopLoss}
                      onChange={(e) => setIsStopLoss(e.target.checked)}
                    />
                    <Label htmlFor="stoploss">Stop Loss</Label>
                  </div>
                  
                  {isStopLoss && (
                    <Input 
                      id="stoploss-price" 
                      type="number" 
                      value={stopLossPrice}
                      onChange={(e) => setStopLossPrice(e.target.value)}
                      step="0.05"
                      placeholder="Stop Loss Price"
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="target" 
                      className="mr-2"
                      checked={isTarget}
                      onChange={(e) => setIsTarget(e.target.checked)}
                    />
                    <Label htmlFor="target">Target</Label>
                  </div>
                  
                  {isTarget && (
                    <Input 
                      id="target-price" 
                      type="number" 
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      step="0.05"
                      placeholder="Target Price"
                    />
                  )}
                </div>
              </div>
              
              <div className="flex justify-between gap-4 pt-2">
                <Button 
                  className="flex-1 bg-profit hover:bg-profit/90"
                  onClick={handleBuy}
                >
                  <TrendingUp className="h-4 w-4 mr-2" /> BUY
                </Button>
                
                <Button 
                  className="flex-1 bg-loss hover:bg-loss/90"
                  onClick={handleSell}
                >
                  <TrendingDown className="h-4 w-4 mr-2" /> SELL
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Symbol:</span>
                      <span className="font-medium">{activeSymbol}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Price:</span>
                      <span className="font-medium">₹{isLoading ? '...' : currentPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Value:</span>
                      <span className="font-medium">₹{isLoading ? '...' : (currentPrice * parseInt(quantity || '0')).toFixed(2)}</span>
                    </div>
                    
                    <hr className="border-muted my-2" />
                    
                    {isStopLoss && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stop Loss:</span>
                        <span className="text-loss font-medium">₹{stopLossPrice}</span>
                      </div>
                    )}
                    
                    {isTarget && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Target:</span>
                        <span className="text-profit font-medium">₹{targetPrice}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      className="w-full gap-1"
                      onClick={() => {
                        toast.success("Strategy selected");
                      }}
                    >
                      <Play className="h-4 w-4 mr-1" /> 
                      Apply Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b">
                <tr>
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">Symbol</th>
                  <th className="text-center py-2">Type</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-center py-2">Status</th>
                  <th className="text-right py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted-foreground">
                      No recent orders
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-2">{order.id}</td>
                      <td className="py-2 font-medium">{order.symbol}</td>
                      <td className={`py-2 text-center ${order.type === "BUY" ? "text-profit" : "text-loss"}`}>
                        {order.type}
                      </td>
                      <td className="py-2 text-right">₹{order.price.toFixed(2)}</td>
                      <td className="py-2 text-right">{order.qty}</td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === "EXECUTED" ? "bg-profit/20 text-profit" : 
                          order.status === "REJECTED" ? "bg-loss/20 text-loss" : 
                          "bg-muted text-muted-foreground"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 text-right text-muted-foreground">
                        {order.timestamp.toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveTrade;

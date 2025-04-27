
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Calendar, ArrowRight, TrendingUp, BarChart2, Clock } from 'lucide-react';

const mockBacktestResults = {
  performanceData: [
    { date: '2023-01', value: 10000, benchmark: 10000 },
    { date: '2023-02', value: 10500, benchmark: 10200 },
    { date: '2023-03', value: 11200, benchmark: 10150 },
    { date: '2023-04', value: 11100, benchmark: 10300 },
    { date: '2023-05', value: 11800, benchmark: 10450 },
    { date: '2023-06', value: 12200, benchmark: 10650 },
    { date: '2023-07', value: 12700, benchmark: 10800 },
    { date: '2023-08', value: 12400, benchmark: 10700 },
    { date: '2023-09', value: 13100, benchmark: 10950 },
    { date: '2023-10', value: 13600, benchmark: 11200 },
    { date: '2023-11', value: 14200, benchmark: 11450 },
    { date: '2023-12', value: 14800, benchmark: 11600 },
  ],
  trades: [
    { date: '2023-01-15', symbol: 'RELIANCE', type: 'BUY', price: 2450.5, quantity: 10, pnl: 1500.0 },
    { date: '2023-02-22', symbol: 'HDFCBANK', type: 'BUY', price: 1520.75, quantity: 20, pnl: 980.0 },
    { date: '2023-03-10', symbol: 'RELIANCE', type: 'SELL', price: 2600.0, quantity: 10, pnl: 1500.0 },
    { date: '2023-04-05', symbol: 'TCS', type: 'BUY', price: 3450.0, quantity: 5, pnl: -325.0 },
    { date: '2023-05-18', symbol: 'HDFCBANK', type: 'SELL', price: 1570.0, quantity: 20, pnl: 980.0 },
    { date: '2023-06-30', symbol: 'INFY', type: 'BUY', price: 1450.0, quantity: 15, pnl: 1200.0 },
    { date: '2023-08-12', symbol: 'TCS', type: 'SELL', price: 3385.0, quantity: 5, pnl: -325.0 },
    { date: '2023-09-25', symbol: 'INFY', type: 'SELL', price: 1530.0, quantity: 15, pnl: 1200.0 },
  ],
  metrics: {
    totalReturn: 48.0,
    annualizedReturn: 32.5,
    sharpeRatio: 1.85,
    maxDrawdown: 12.3,
    winRate: 75.0,
    profitFactor: 2.1,
    averageWin: 1225.0,
    averageLoss: -325.0,
    totalTrades: 8,
    profitableTrades: 6,
    losingTrades: 2
  }
};

const Backtesting = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('moving-avg');
  const [timeframe, setTimeframe] = useState('1Y');
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleRunBacktest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Strategy Backtesting</h1>
            <p className="text-muted-foreground">
              Test your trading strategies against historical data to validate performance before deploying in live markets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Backtest Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Strategy</label>
                    <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moving-avg">Moving Average Crossover</SelectItem>
                        <SelectItem value="rsi-based">RSI Reversal Strategy</SelectItem>
                        <SelectItem value="breakout">Breakout Trading</SelectItem>
                        <SelectItem value="volume-profile">Volume Profile Analysis</SelectItem>
                        <SelectItem value="ichimoku">Ichimoku Cloud Strategy</SelectItem>
                        <SelectItem value="option-premium">Option Premium Decay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Stock/Index</label>
                    <Select defaultValue="NIFTY">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Symbol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NIFTY">NIFTY 50</SelectItem>
                        <SelectItem value="SENSEX">SENSEX</SelectItem>
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
                    <label className="text-sm font-medium mb-1 block">Time Period</label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1M">1 Month</SelectItem>
                        <SelectItem value="3M">3 Months</SelectItem>
                        <SelectItem value="6M">6 Months</SelectItem>
                        <SelectItem value="1Y">1 Year</SelectItem>
                        <SelectItem value="3Y">3 Years</SelectItem>
                        <SelectItem value="5Y">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Initial Capital</label>
                    <Input type="number" defaultValue="100000" />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full" 
                      onClick={handleRunBacktest}
                      disabled={isRunning}
                    >
                      {isRunning ? "Running..." : "Run Backtest"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {showResults && (
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Return</p>
                        <p className="text-xl font-semibold text-profit">+{mockBacktestResults.metrics.totalReturn}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annualized Return</p>
                        <p className="text-xl font-semibold text-profit">+{mockBacktestResults.metrics.annualizedReturn}%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                        <p className="font-medium">{mockBacktestResults.metrics.sharpeRatio}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max Drawdown</p>
                        <p className="font-medium text-loss">-{mockBacktestResults.metrics.maxDrawdown}%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="font-medium">{mockBacktestResults.metrics.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profit Factor</p>
                        <p className="font-medium">{mockBacktestResults.metrics.profitFactor}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Trades</p>
                        <p className="font-medium">{mockBacktestResults.metrics.totalTrades}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profitable/Losing</p>
                        <p className="font-medium">{mockBacktestResults.metrics.profitableTrades}/{mockBacktestResults.metrics.losingTrades}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="lg:col-span-8 space-y-6">
              {showResults && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={mockBacktestResults.performanceData}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                          >
                            <defs>
                              <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }} 
                              labelStyle={{ fontWeight: 'bold' }}
                              formatter={(value: number) => [`₹${value.toLocaleString()}`]}
                            />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              name="Strategy" 
                              stroke="#3b82f6" 
                              fillOpacity={1} 
                              fill="url(#colorStrategy)" 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="benchmark" 
                              name="Benchmark" 
                              stroke="#9ca3af" 
                              fillOpacity={1} 
                              fill="url(#colorBenchmark)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Trade History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Date</th>
                              <th className="text-left py-2">Symbol</th>
                              <th className="text-center py-2">Type</th>
                              <th className="text-right py-2">Price</th>
                              <th className="text-right py-2">Quantity</th>
                              <th className="text-right py-2">P&L</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockBacktestResults.trades.map((trade, i) => (
                              <tr key={i} className="border-b last:border-0">
                                <td className="py-2.5">{trade.date}</td>
                                <td className="py-2.5 font-medium">{trade.symbol}</td>
                                <td className={`text-center py-2.5 ${trade.type === 'BUY' ? 'text-profit' : 'text-loss'}`}>
                                  {trade.type}
                                </td>
                                <td className="text-right py-2.5">₹{trade.price.toFixed(2)}</td>
                                <td className="text-right py-2.5">{trade.quantity}</td>
                                <td className={`text-right py-2.5 ${trade.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                                  {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {!showResults && (
                <div className="h-full flex items-center justify-center p-12">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <BarChart2 className="h-16 w-16 text-muted-foreground opacity-70" />
                    </div>
                    <h3 className="text-xl font-medium">Run a backtest to see results</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Select your strategy, timeframe, and parameters, then click "Run Backtest" to analyze historical performance.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Backtesting;

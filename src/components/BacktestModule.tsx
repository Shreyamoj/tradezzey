
import React from 'react';
import { BarChart2, Calendar, ChevronDown, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const strategies = [
  {
    name: "Moving Average Crossover",
    description: "Buy when fast MA crosses above slow MA, sell when it crosses below",
    winRate: 68,
    returnPct: 12.4,
  },
  {
    name: "RSI Oversold/Overbought",
    description: "Buy when RSI < 30, sell when RSI > 70",
    winRate: 62,
    returnPct: 8.6,
  },
  {
    name: "MACD Signal Line",
    description: "Buy on MACD crossing above signal line, sell on crossing below",
    winRate: 59,
    returnPct: 10.2,
  }
];

const BacktestModule: React.FC = () => {
  return (
    <div className="trading-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Strategy Backtesting</h2>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4 mr-1" />
          New Strategy
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Select Strategy</label>
          <Select defaultValue="MA Crossover">
            <SelectTrigger>
              <SelectValue placeholder="Select a strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MA Crossover">Moving Average Crossover</SelectItem>
              <SelectItem value="RSI">RSI Strategy</SelectItem>
              <SelectItem value="MACD">MACD Strategy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Stock/Index</label>
          <Select defaultValue="NIFTY">
            <SelectTrigger>
              <SelectValue placeholder="Select stock or index" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NIFTY">NIFTY 50</SelectItem>
              <SelectItem value="SENSEX">SENSEX</SelectItem>
              <SelectItem value="RELIANCE">RELIANCE</SelectItem>
              <SelectItem value="HDFCBANK">HDFCBANK</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">From</label>
            <Button variant="outline" className="w-full justify-between">
              <span>01/01/2023</span>
              <Calendar className="h-4 w-4 opacity-50" />
            </Button>
          </div>
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">To</label>
            <Button variant="outline" className="w-full justify-between">
              <span>31/12/2023</span>
              <Calendar className="h-4 w-4 opacity-50" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="text-xl font-bold text-primary">68%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Total Return</p>
            <p className="text-xl font-bold text-profit">+12.4%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
            <p className="text-xl font-bold">1.32</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Max Drawdown</p>
            <p className="text-xl font-bold text-loss">-4.8%</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">Reset</Button>
        <Button size="sm" className="gap-1">
          <BarChart2 className="h-4 w-4 mr-1" />
          Run Backtest
        </Button>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3">Pre-built Strategies</h3>
        <div className="space-y-2">
          {strategies.map((strategy, index) => (
            <div key={index} className="p-3 bg-secondary rounded-md hover:bg-secondary/80 cursor-pointer">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{strategy.name}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded bg-card">Win: {strategy.winRate}%</span>
                  <span className={`text-xs px-2 py-1 rounded bg-card ${strategy.returnPct > 0 ? 'text-profit' : 'text-loss'}`}>
                    Return: {strategy.returnPct > 0 ? '+' : ''}{strategy.returnPct}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{strategy.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BacktestModule;

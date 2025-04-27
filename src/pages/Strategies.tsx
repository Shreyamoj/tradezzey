
import React from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, BarChart2, LineChart, TrendingUp, ArrowRight } from 'lucide-react';

const strategies = [
  {
    id: 'moving-avg',
    name: 'Moving Average Crossover',
    description: 'Uses SMA crossover to identify trend changes and generate buy/sell signals.',
    icon: LineChart,
    performance: '72% win rate',
    timeframe: 'Medium-term'
  },
  {
    id: 'rsi-based',
    name: 'RSI Reversal Strategy',
    description: 'Uses RSI indicator to identify overbought and oversold conditions for reversal trades.',
    icon: BarChart2, 
    performance: '65% win rate',
    timeframe: 'Short-term'
  },
  {
    id: 'breakout',
    name: 'Breakout Trading',
    description: 'Identifies key support/resistance levels and trades breakouts with volume confirmation.',
    icon: TrendingUp,
    performance: '68% win rate',
    timeframe: 'Medium-term'
  },
  {
    id: 'volume-profile',
    name: 'Volume Profile Analysis',
    description: 'Uses volume analysis to identify high volume nodes and value areas for precision entries.',
    icon: BarChart2,
    performance: '76% win rate',
    timeframe: 'All timeframes'
  },
  {
    id: 'ichimoku',
    name: 'Ichimoku Cloud Strategy',
    description: 'Multi-faceted indicator that provides support/resistance, trend direction and momentum signals.',
    icon: LineChart,
    performance: '70% win rate',
    timeframe: 'Long-term'
  },
  {
    id: 'option-premium',
    name: 'Option Premium Decay',
    description: 'Captures theta decay by selling options and managing positions as expiry approaches.',
    icon: Clock,
    performance: '82% win rate',
    timeframe: 'Short-term'
  }
];

const Strategies = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Trading Strategies</h1>
            <p className="text-muted-foreground">
              Discover and deploy professional-grade trading strategies optimized for the Indian markets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="trading-card trading-card-hover overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <strategy.icon className="h-8 w-8 text-primary" />
                    <Button variant="ghost" size="icon">
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl">{strategy.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {strategy.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <p className="font-medium">{strategy.performance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Timeframe</p>
                      <p className="font-medium">{strategy.timeframe}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button className="w-full" variant="outline">
                    View Strategy <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Strategies;

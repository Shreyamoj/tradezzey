
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for the chart
const mockData = [
  { date: '10:00', price: 1572 },
  { date: '10:30', price: 1580 },
  { date: '11:00', price: 1590 },
  { date: '11:30', price: 1587 },
  { date: '12:00', price: 1596 },
  { date: '12:30', price: 1610 },
  { date: '13:00', price: 1605 },
  { date: '13:30', price: 1615 },
  { date: '14:00', price: 1628 },
  { date: '14:30', price: 1622 },
  { date: '15:00', price: 1640 },
];

const timeFrames = ['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', '5Y'];
const chartTypes = ['Line', 'Candle', 'OHLC', 'Area'];

const StockChart: React.FC = () => {
  const [activeTimeFrame, setActiveTimeFrame] = React.useState('1D');
  const stockName = "NIFTY 50";
  const currentPrice = 1640;
  const previousClose = 1615;
  const change = currentPrice - previousClose;
  const percentChange = (change / previousClose * 100).toFixed(2);
  const isPositive = change >= 0;
  
  return (
    <div className="trading-card h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">{stockName}</h2>
            <div className="ml-3 flex items-center">
              <span className="text-xl font-bold">₹{currentPrice.toLocaleString()}</span>
              <span className={`ml-2 flex items-center text-sm ${isPositive ? 'text-profit' : 'text-loss'}`}>
                {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {isPositive ? '+' : ''}{change.toFixed(2)} ({percentChange}%)
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">NSE • INR • Real-time</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue="Line">
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              {chartTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select defaultValue="Indicators">
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue placeholder="Indicators" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MA">Moving Avg</SelectItem>
              <SelectItem value="RSI">RSI</SelectItem>
              <SelectItem value="MACD">MACD</SelectItem>
              <SelectItem value="BB">Bollinger</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-1 mb-4">
        {timeFrames.map((tf) => (
          <Button 
            key={tf}
            variant={activeTimeFrame === tf ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTimeFrame(tf)}
            className="px-3 py-1 h-7 text-xs"
          >
            {tf}
          </Button>
        ))}
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mockData}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#141B2D', 
                borderColor: '#2962FF',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
            <ReferenceLine y={previousClose} stroke="#888" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? "#0ECB81" : "#F6465D"} 
              dot={false} 
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;

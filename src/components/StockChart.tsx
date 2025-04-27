
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { marketDataService, HistoricalDataPoint } from '../services/marketDataService';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const timeFrames = ['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', '5Y'];
const chartTypes = ['Line', 'Candle', 'OHLC', 'Area'];

const StockChart: React.FC = () => {
  const [activeTimeFrame, setActiveTimeFrame] = useState('1D');
  const [stockSymbol, setStockSymbol] = useState("NIFTY");
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [previousClose, setPreviousClose] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch current price
        const stockData = await marketDataService.fetchStockData(stockSymbol);
        setCurrentPrice(stockData.price);
        setPreviousClose(stockData.previousClose);
        
        // Fetch historical data
        const history = await marketDataService.fetchHistoricalData(stockSymbol, activeTimeFrame);
        setChartData(history);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up refresh interval
    const intervalId = setInterval(() => {
      if (activeTimeFrame === '1D') {
        fetchData();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [stockSymbol, activeTimeFrame]);
  
  const change = currentPrice - previousClose;
  const percentChange = (change / previousClose * 100).toFixed(2);
  const isPositive = change >= 0;
  
  return (
    <div className="trading-card h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">{stockSymbol}</h2>
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
          <Select 
            defaultValue="NIFTY"
            value={stockSymbol}
            onValueChange={setStockSymbol}
          >
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Select Stock" />
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
      
      <div className="h-[280px] w-full relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10">
            <div className="loading-spinner w-8 h-8 border-2 border-r-transparent border-primary rounded-full animate-spin"></div>
          </div>
        )}
        
        <ChartContainer 
          className="h-full w-full"
          config={{
            line: {
              color: isPositive ? "#0ECB81" : "#F6465D"
            },
            grid: {
              color: "#1E2D3D"
            },
            reference: {
              color: "#888888"
            }
          }}
        >
          <LineChart
            data={chartData}
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
            <ChartTooltip 
              content={<ChartTooltipContent />}
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
        </ChartContainer>
      </div>
    </div>
  );
};

export default StockChart;

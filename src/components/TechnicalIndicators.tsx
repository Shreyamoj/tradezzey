
import React from 'react';
import { ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';

// Mock indicator data
const indicatorData = {
  rsi: {
    value: 62.4,
    signal: 'Neutral',
    color: 'text-foreground'
  },
  macd: {
    value: 12.6,
    signal: 'Buy',
    color: 'text-profit'
  },
  cci: {
    value: 142.5,
    signal: 'Overbought',
    color: 'text-loss'
  },
  adx: {
    value: 28.3,
    signal: 'Strong Trend',
    color: 'text-primary'
  },
  movingAverages: [
    { period: 20, value: 1610, signal: 'Above', color: 'text-profit' },
    { period: 50, value: 1585, signal: 'Above', color: 'text-profit' },
    { period: 100, value: 1520, signal: 'Above', color: 'text-profit' },
    { period: 200, value: 1650, signal: 'Below', color: 'text-loss' },
  ]
};

const TechnicalIndicators: React.FC = () => {
  return (
    <div className="trading-card">
      <h2 className="text-lg font-semibold mb-3">Technical Indicators</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-md border p-4">
          <h3 className="text-sm font-medium mb-3">Oscillators</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium">RSI (14)</span>
                <p className="text-xs text-muted-foreground">Relative Strength Index</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">{indicatorData.rsi.value}</span>
                <p className={`text-xs ${indicatorData.rsi.color}`}>{indicatorData.rsi.signal}</p>
              </div>
            </div>
            
            <div className="h-px bg-border w-full"></div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium">MACD (12,26,9)</span>
                <p className="text-xs text-muted-foreground">Moving Avg Conv/Div</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">{indicatorData.macd.value}</span>
                <p className={`text-xs ${indicatorData.macd.color}`}>
                  <span className="flex items-center justify-end">
                    <ArrowUp className="h-3 w-3 mr-0.5" />
                    {indicatorData.macd.signal}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="h-px bg-border w-full"></div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium">CCI</span>
                <p className="text-xs text-muted-foreground">Commodity Channel Index</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">{indicatorData.cci.value}</span>
                <p className={`text-xs ${indicatorData.cci.color}`}>
                  <span className="flex items-center justify-end">
                    <AlertCircle className="h-3 w-3 mr-0.5" />
                    {indicatorData.cci.signal}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="h-px bg-border w-full"></div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium">ADX (14)</span>
                <p className="text-xs text-muted-foreground">Avg Directional Index</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">{indicatorData.adx.value}</span>
                <p className={`text-xs ${indicatorData.adx.color}`}>{indicatorData.adx.signal}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border p-4">
          <h3 className="text-sm font-medium mb-3">Moving Averages</h3>
          <div className="space-y-3">
            {indicatorData.movingAverages.map((ma, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">SMA {ma.period}</span>
                <div className="text-right">
                  <span className="font-medium">₹{ma.value}</span>
                  <p className={`text-xs flex items-center justify-end ${ma.color}`}>
                    {ma.signal === 'Above' ? (
                      <ArrowUp className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-0.5" />
                    )}
                    Price {ma.signal} MA
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-xs font-medium mb-2">MA Summary</h4>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-profit"></span>
                <span className="text-xs">Buy: 8</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                <span className="text-xs">Neutral: 2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-loss"></span>
                <span className="text-xs">Sell: 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-md bg-secondary p-3 text-sm">
        <div className="flex gap-2 items-start">
          <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground">
            Technical indicators should be used alongside other analysis methods for more reliable trading decisions. Current analysis based on end-of-day data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicators;

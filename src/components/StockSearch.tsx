
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";

// Mock stock data
const stocksData = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', exchange: 'NSE' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', exchange: 'NSE' },
  { symbol: 'INFY', name: 'Infosys Ltd.', exchange: 'NSE' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', exchange: 'NSE' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', exchange: 'NSE' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', exchange: 'NSE' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', exchange: 'NSE' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', exchange: 'NSE' },
];

const StockSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const filteredStocks = searchQuery.length > 0 
    ? stocksData.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  
  return (
    <div className="trading-card relative">
      <h2 className="text-lg font-semibold mb-3">Search Stocks</h2>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by stock name or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className="pl-9 pr-8"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
      
      {isSearchFocused && searchQuery.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin">
          {filteredStocks.length > 0 ? (
            filteredStocks.map((stock) => (
              <div 
                key={stock.symbol}
                className="p-3 hover:bg-secondary cursor-pointer border-b last:border-0"
                onClick={() => {
                  console.log(`Selected: ${stock.symbol}`);
                  setSearchQuery('');
                }}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="text-xs text-muted-foreground">{stock.exchange}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-muted-foreground">No stocks found</div>
          )}
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Recently Viewed</h3>
        <div className="grid grid-cols-2 gap-2">
          {['RELIANCE', 'HDFCBANK', 'TATAMOTORS', 'INFY'].map((symbol) => (
            <div key={symbol} className="p-2 bg-secondary rounded border-l-4 border-l-primary text-sm cursor-pointer hover:bg-secondary/80">
              {symbol}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockSearch;

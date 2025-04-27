
import React from 'react';
import StockChart from './StockChart';
import MarketOverview from './MarketOverview';
import StockSearch from './StockSearch';
import BacktestModule from './BacktestModule';
import PortfolioSummary from './PortfolioSummary';
import LiveTrade from './LiveTrade';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockChart />
        </div>
        <div>
          <StockSearch />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <LiveTrade />
        </div>
        <div className="lg:col-span-4">
          <MarketOverview />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <BacktestModule />
        </div>
        <div>
          <PortfolioSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { Search, Bell, BarChart2, Settings, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-3 px-4 border-b border-border bg-card">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-primary mr-8">Tradezzey</Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/strategies" className="text-sm font-medium hover:text-primary transition-colors">Strategies</Link>
          <Link to="/backtesting" className="text-sm font-medium hover:text-primary transition-colors">Backtesting</Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex relative">
          <Input
            type="text"
            placeholder="Search stocks..."
            className="w-64 pl-9 rounded-full bg-secondary border-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <BarChart2 className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        
        <Button variant="outline" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;

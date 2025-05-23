
import React from 'react';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 p-4 overflow-hidden">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;

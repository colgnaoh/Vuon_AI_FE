import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)]">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

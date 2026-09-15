import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function AppLayout({ activePage, onNavigate, children }) {
  return (
    <div className="bg-surface text-on-surface min-h-screen font-body-md text-body-md antialiased overflow-x-hidden">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-4 md:p-lg max-w-container-max pb-20 md:pb-lg w-full">
          {children}
        </main>
      </div>
      <BottomNav activePage={activePage} onNavigate={onNavigate} />
    </div>
  );
}

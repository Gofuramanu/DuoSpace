import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ activePage, onNavigate, children }) {
  return (
    <div className="bg-surface text-on-surface min-h-screen font-body-md text-body-md antialiased overflow-x-hidden">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-lg max-w-container-max">
          {children}
        </main>
      </div>
    </div>
  );
}

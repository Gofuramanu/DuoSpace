import React, { useState } from 'react';
import { SpaceProvider } from './context/SpaceContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './features/dashboard/Dashboard';
import WeeklySchedule from './features/schedule/WeeklySchedule';
import TaskManager from './features/tasks/TaskManager';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  function renderPage() {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'schedule':
        return <WeeklySchedule />;
      case 'tasks':
        return <TaskManager />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <SpaceProvider>
      <AppLayout activePage={activePage} onNavigate={setActivePage}>
        {renderPage()}
      </AppLayout>
    </SpaceProvider>
  );
}

export default App;

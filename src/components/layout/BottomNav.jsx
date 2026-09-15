import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'dashboard', label: 'Home' },
  { id: 'schedule', icon: 'calendar_view_week', label: 'Schedule' },
  { id: 'tasks', icon: 'assignment', label: 'Tasks' },
];

export default function BottomNav({ activePage, onNavigate }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant z-50 flex justify-around items-center h-16 px-4">
      {NAV_ITEMS.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              isActive ? 'text-secondary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <div className={`px-4 py-1 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-secondary-container/50' : ''}`}>
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

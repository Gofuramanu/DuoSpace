import React from 'react';
import { useSpace } from '../../context/SpaceContext';

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'schedule', icon: 'calendar_view_week', label: 'Weekly Schedule' },
  { id: 'tasks', icon: 'assignment', label: 'Task Manager' },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { currentUser, isPartnerSpace, partnerUser } = useSpace();
  const displayUser = isPartnerSpace ? partnerUser : currentUser;

  return (
    <aside className="bg-surface border-r border-outline-variant h-screen w-64 fixed left-0 top-0 flex flex-col py-lg px-md z-50">
      {/* Logo */}
      <div className="mb-xl">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">DuoSpace</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Collaborative Academic Hub</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-sm px-sm py-2 rounded-lg transition-all duration-150 w-full text-left ${
                isActive
                  ? 'text-secondary font-bold border-r-4 border-secondary bg-surface-container opacity-90'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </button>
          );
        })}

        {/* Settings at bottom */}
        <button
          className="flex items-center gap-sm px-sm py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-150 mt-auto w-full text-left"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </button>
      </nav>

      {/* User Profile */}
      <div className="mt-lg pt-lg border-t border-outline-variant flex items-center gap-md">
        <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary font-bold text-sm border border-outline-variant">
          {displayUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-label-md text-label-md text-primary">{displayUser.name}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Active Session</p>
        </div>
      </div>
    </aside>
  );
}

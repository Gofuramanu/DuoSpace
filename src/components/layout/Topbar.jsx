import React, { useState, useEffect, useRef } from 'react';
import { useSpace } from '../../context/SpaceContext';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'class', message: 'Kelas Advanced Data Structures akan dimulai dalam 30 menit.', time: 'Just now' },
  { id: 2, type: 'task', message: 'Tugas "Implement Red-Black Tree" due besok.', time: '2 hours ago' },
];

const ALL_SEARCHABLE_ITEMS = [
  { id: 'c1', type: 'Class', title: 'Advanced Data Structures', detail: 'CS-301' },
  { id: 'c2', type: 'Class', title: 'Database Systems Lab', detail: 'CS-305L' },
  { id: 't1', type: 'Task', title: 'Implement Red-Black Tree Visualization', detail: 'Due tomorrow' },
  { id: 't2', type: 'Task', title: 'Midterm Review Notes', detail: 'Due Oct 20' },
];

export default function Topbar() {
  const { isPartnerSpace, toggleSpace } = useSpace();
  const [dateTime, setDateTime] = useState('');
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function updateDateTime() {
      const now = new Date();
      const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      const timeString = now.toLocaleDateString('en-US', options).replace(',', ' •');
      setDateTime(timeString);
    }
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
    } else {
      const results = ALL_SEARCHABLE_ITEMS.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.detail.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-40 flex justify-between items-center w-full h-16 px-lg">
      <div className="flex items-center gap-md">
        <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Semester 5 - Fall 2024</h2>
        <span className="text-on-surface-variant font-label-sm text-label-sm ml-4 hidden sm:inline">
          {dateTime}
        </span>
      </div>

      <div className="flex items-center gap-md">
        {/* Space Toggle */}
        <div className="flex items-center gap-xs bg-surface-container-lowest border border-outline-variant rounded-full px-sm py-1">
          <span className={`font-label-sm text-label-sm transition-colors ${!isPartnerSpace ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
            Ghafur Space
          </span>
          <button
            onClick={toggleSpace}
            className="relative inline-flex h-5 w-9 items-center rounded-full bg-surface-dim transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/30"
          >
            <span
              className={`${
                isPartnerSpace ? 'translate-x-[18px] bg-secondary' : 'translate-x-[3px] bg-on-surface-variant'
              } inline-block h-3.5 w-3.5 transform rounded-full transition-transform duration-200`}
            />
          </button>
          <span className={`font-label-sm text-label-sm transition-colors ${isPartnerSpace ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
            Mey Space
          </span>
        </div>

        {/* Search */}
        <div className="relative hidden lg:block" ref={searchRef}>
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            className="pl-xl pr-sm py-2 rounded-full border border-outline-variant bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 font-body-md text-body-md w-64 transition-all outline-none"
            placeholder="Search tasks, classes..."
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
          />
          
          {/* Search Dropdown */}
          {isSearchFocused && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden">
              {searchResults.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto">
                  {searchResults.map(item => (
                    <li key={item.id} className="p-3 hover:bg-surface-container-low cursor-pointer border-b border-outline-variant/50 last:border-b-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-body-md text-body-md text-primary font-medium">{item.title}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">{item.type}</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{item.detail}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-on-surface-variant font-body-md text-body-md">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="relative" ref={notifRef}>
          <button 
            className="text-on-surface-variant hover:bg-surface-container-low rounded-full p-2 transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-surface"></span>
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-outline-variant bg-surface-container flex justify-between items-center">
                <h3 className="font-headline-sm text-headline-sm text-primary">Notifications</h3>
                <span className="text-xs text-secondary cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map(notif => (
                  <li key={notif.id} className="p-3 hover:bg-surface-container-low cursor-pointer border-b border-outline-variant/50 last:border-b-0 flex gap-3 items-start">
                    <span className={`material-symbols-outlined text-[20px] mt-0.5 ${notif.type === 'class' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {notif.type === 'class' ? 'school' : 'assignment'}
                    </span>
                    <div>
                      <p className="font-body-md text-body-md text-primary">{notif.message}</p>
                      <span className="text-xs text-on-surface-variant">{notif.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-2 text-center border-t border-outline-variant bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
                <span className="text-xs font-bold text-secondary">View All Notifications</span>
              </div>
            </div>
          )}
        </div>

        <button className="text-on-surface-variant hover:bg-surface-container-low rounded-full p-2 transition-colors">
          <span className="material-symbols-outlined">help</span>
        </button>
      </div>
    </header>
  );
}

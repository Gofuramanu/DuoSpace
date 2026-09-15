import React, { useState, useEffect } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function WeeklySchedule() {
  const { isPartnerSpace, activeUserId } = useSpace();
  const [activeDay, setActiveDay] = useState('Monday');
  const [filter, setFilter] = useState('all');
  
  // State for Schedules
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', code: '', description: '', startTime: '08:00', endTime: '10:00', 
    type: 'Teori', location: '', lecturer: ''
  });

  const fetchSchedules = async () => {
    if (!activeUserId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', activeUserId)
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [activeUserId]);

  const getNextDateForDay = (dayName, timeString) => {
    const dayMap = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
    const targetDay = dayMap[dayName];
    const today = new Date();
    const currentDay = today.getDay();
    const distance = targetDay - currentDay;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + distance);
    const [hours, minutes] = timeString.split(':');
    targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return targetDate;
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '', code: '', description: '', startTime: '08:00', endTime: '10:00', 
      type: 'Teori', location: '', lecturer: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title, code: item.code || '', description: item.description || '', 
      startTime: item.startTime, 
      endTime: item.endTime, 
      type: item.type, location: item.location || '', lecturer: item.lecturer || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus kelas ini?')) {
      try {
        const { error } = await supabase.from('schedules').delete().eq('id', id);
        if (error) throw error;
        setSchedules(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('Error deleting schedule:', err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const start_time = getNextDateForDay(activeDay, formData.startTime);
    const end_time = getNextDateForDay(activeDay, formData.endTime);
    const color = formData.type === 'Praktik' ? 'amber' : 'secondary';
    
    const payload = {
      user_id: activeUserId,
      title: formData.title,
      code: formData.code,
      description: formData.description,
      type: formData.type,
      location: formData.location,
      lecturer: formData.lecturer,
      start_time: start_time.toISOString(),
      end_time: end_time.toISOString(),
      color
    };

    try {
      if (editingItem) {
        const { error } = await supabase.from('schedules').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('schedules').insert([payload]);
        if (error) throw error;
      }
      fetchSchedules(); // Refresh data from server
      setShowModal(false);
    } catch (err) {
      console.error('Error saving schedule:', err.message);
    }
  };

  const groupedSchedules = {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: []
  };

  schedules.forEach(s => {
    const d = new Date(s.start_time);
    const dayName = format(d, 'EEEE'); // e.g., 'Monday'
    if (groupedSchedules[dayName]) {
      groupedSchedules[dayName].push({
        ...s,
        startTime: format(d, 'HH:mm'),
        endTime: format(new Date(s.end_time), 'HH:mm')
      });
    }
  });

  const daySchedules = groupedSchedules[activeDay] || [];
  const filteredSchedules = daySchedules.filter((s) => {
    if (s.type === 'break') return true;
    if (filter === 'all') return true;
    if (filter === 'teori') return s.type === 'Teori';
    if (filter === 'praktik') return s.type === 'Praktik';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-container-max mx-auto relative">
        {/* Page Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-1">Weekly Schedule</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Manage your classes and practical sessions.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-sm items-start md:items-center w-full md:w-auto mt-4 md:mt-0">
            <div className="flex flex-wrap gap-sm w-full md:w-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-md py-2 rounded-full border border-outline-variant font-label-md text-label-md flex items-center gap-xs transition-colors ${filter === 'all' ? 'bg-surface-container-lowest text-on-surface' : 'bg-surface text-on-surface-variant hover:bg-surface-container'}`}
              >
                <span className="w-2 h-2 rounded-full bg-secondary"></span> All Types
              </button>
              <button
                onClick={() => setFilter('teori')}
                className={`px-md py-2 rounded-full border border-outline-variant font-label-md text-label-md flex items-center gap-xs transition-colors ${filter === 'teori' ? 'bg-surface-container-lowest text-on-surface' : 'bg-surface text-on-surface-variant hover:bg-surface-container'}`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Teori
              </button>
              <button
                onClick={() => setFilter('praktik')}
                className={`px-md py-2 rounded-full border border-outline-variant font-label-md text-label-md flex items-center gap-xs transition-colors ${filter === 'praktik' ? 'bg-surface-container-lowest text-on-surface' : 'bg-surface text-on-surface-variant hover:bg-surface-container'}`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Praktik
              </button>
            </div>
            
              <button 
                onClick={handleOpenAdd}
                className="px-md py-2 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md flex items-center gap-xs shadow-sm hover:bg-secondary/90 transition-colors ml-auto sm:ml-4"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Class
              </button>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="glass-panel rounded-xl mb-lg overflow-x-auto flex whitespace-nowrap scrollbar-hide">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-1 py-md text-center font-label-md text-label-md transition-colors ${
                activeDay === day
                  ? 'text-secondary border-b-2 border-secondary bg-secondary-fixed/20'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule Content - Vertical List */}
        <div className="space-y-md relative pl-8">
          {/* Vertical Timeline Line */}
          <div className="absolute left-3 top-4 bottom-4 w-px bg-outline-variant hidden md:block"></div>

          {loading ? (
            <div className="p-lg rounded-xl border border-dashed border-outline-variant bg-surface-container-low flex flex-col justify-center items-center py-16 text-center">
              <p className="font-body-lg text-body-lg text-on-surface-variant animate-pulse">Memuat jadwal...</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="p-lg rounded-xl border border-dashed border-outline-variant bg-surface-container-low flex flex-col justify-center items-center py-16 text-center">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">event_busy</span>
              <p className="font-body-lg text-body-lg text-on-surface-variant">No classes on {activeDay}.</p>
            </div>
          ) : (
            filteredSchedules.map((item) => {
              const nodeColor = item.color === 'amber' ? 'bg-amber-500' : 'bg-secondary';
              const badgeBg = item.type === 'Praktik' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
              const locationIcon = item.type === 'Praktik' ? 'computer' : 'location_on';

              return (
                <div key={item.id} className="glass-panel rounded-xl p-lg flex flex-col md:flex-row gap-lg items-start md:items-center relative group hover:shadow-md transition-shadow">
                  {/* Timeline Node */}
                  <div className={`absolute left-[-26px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${nodeColor} ring-4 ring-slate-50 hidden md:block group-hover:scale-125 transition-transform`}></div>
                  {/* Time Box */}
                  <div className="md:w-32 flex flex-col shrink-0">
                    <span className="font-headline-sm text-headline-sm text-on-surface">{item.startTime}</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">{item.endTime}</span>
                  </div>
                  {/* Info Area */}
                  <div className="flex-1 flex flex-col gap-xs">
                    <div className="flex items-center gap-sm">
                      <span className={`px-2 py-1 rounded font-label-sm text-label-sm uppercase tracking-wider ${badgeBg}`}>{item.type}</span>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h4>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">{item.code} {item.code && '•'} {item.description}</p>
                  </div>
                  {/* Meta Data & Actions */}
                  <div className="flex flex-row md:flex-col gap-md md:gap-sm shrink-0 items-start md:items-end w-full md:w-auto mt-4 md:mt-0">
                    <div className="flex flex-col gap-xs md:items-end w-full md:w-auto">
                      <div className="flex items-center gap-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">{locationIcon}</span>
                        <span className="font-label-md text-label-md">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        <span className="font-label-md text-label-md">{item.lecturer}</span>
                      </div>
                    </div>
                    
                      <div className="flex gap-2 ml-auto md:mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-surface-container rounded-md transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-md transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-[95vw] md:w-[500px] max-w-[500px] border border-outline-variant overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  {editingItem ? 'Edit Class Schedule' : 'Add New Class'} - {activeDay}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-on-surface-variant hover:text-primary rounded-full p-1"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto">
                <form id="schedule-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Class Title</label>
                      <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-secondary outline-none text-sm" placeholder="Data Structures" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Course Code</label>
                      <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-secondary outline-none text-sm" placeholder="CS-301" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Description</label>
                    <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-secondary outline-none text-sm" placeholder="Brief topic description..." />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Type</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-secondary outline-none text-sm">
                        <option value="Teori">Teori</option>
                        <option value="Praktik">Praktik</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Start Time</label>
                      <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-secondary outline-none text-sm" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">End Time</label>
                      <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-secondary outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Location</label>
                      <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-secondary outline-none text-sm" placeholder="Room 402" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Lecturer</label>
                      <input required type="text" value={formData.lecturer} onChange={e => setFormData({...formData, lecturer: e.target.value})} className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-secondary outline-none text-sm" placeholder="Dr. Alan Turing" />
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="p-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3 mt-auto">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="schedule-form"
                  className="px-4 py-2 font-label-md text-label-md bg-secondary text-on-secondary rounded-lg shadow-sm hover:bg-secondary/90 transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Add Class'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

export default function TaskManager() {
  const { isPartnerSpace, activeUserId } = useSpace();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Add State
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [quickAddDate, setQuickAddDate] = useState('');

  const fetchTasks = async () => {
    if (!activeUserId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', activeUserId)
        .order('due_date', { ascending: true });
        
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeUserId]);

  async function handleToggleTask(taskId, currentStatus) {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_completed: !currentStatus } : t));
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !currentStatus })
        .eq('id', taskId);
      if (error) throw error;
    } catch (error) {
      console.error('Error toggling task:', error.message);
      // Revert on error
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_completed: currentStatus } : t));
    }
  }

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickAddTitle || !quickAddDate) return;

    try {
      // Create a date object with time at 23:59
      const due = new Date(quickAddDate);
      due.setHours(23, 59, 0, 0);

      const newTask = {
        user_id: activeUserId,
        title: quickAddTitle,
        course: 'General',
        due_date: due.toISOString(),
        is_completed: false,
        due_severity: 'normal'
      };

      const { error } = await supabase.from('tasks').insert([newTask]);
      if (error) throw error;
      
      setQuickAddTitle('');
      setQuickAddDate('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  const taskGroups = {};
  tasks.forEach(task => {
    if (!taskGroups[task.course]) {
      taskGroups[task.course] = {
        code: task.course.substring(0, 6).toUpperCase(),
        color: 'bg-secondary-container',
        tasks: []
      };
    }
    taskGroups[task.course].tasks.push({
      ...task,
      dueDate: format(new Date(task.due_date), 'MMM dd, yyyy')
    });
  });

  const pendingCount = tasks.filter((t) => !t.is_completed).length;
  const completedCount = tasks.filter((t) => t.is_completed).length;
  const overdueCount = tasks.filter((t) => !t.is_completed && new Date(t.due_date) < new Date()).length;

  return (
    <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-gutter">
      {/* Page Header */}
      <div className="col-span-12 flex justify-between items-end mb-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-1">Task Manager</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Organize, track, and complete your academic assignments.</p>
        </div>
          <div className="flex gap-sm">
            <button className="px-md py-sm bg-surface-container-high text-primary font-label-md text-label-md rounded-lg flex items-center gap-xs hover:bg-surface-variant transition-colors border border-outline-variant">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
            <button className="px-md py-sm bg-secondary text-on-secondary font-label-md text-label-md rounded-lg flex items-center gap-xs hover:bg-secondary/90 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Task
            </button>
          </div>
      </div>

      {/* Tasks List (Left Column) */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-lg">
        {loading ? (
           <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm py-16 text-center">
             <p className="font-body-lg text-body-lg text-on-surface-variant animate-pulse">Memuat tugas...</p>
           </div>
        ) : Object.keys(taskGroups).length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm py-16 text-center">
             <p className="font-body-lg text-body-lg text-on-surface-variant">Belum ada tugas.</p>
           </div>
        ) : Object.entries(taskGroups).map(([groupName, group]) => (
          <div key={groupName} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex justify-between items-center mb-md pb-sm border-b border-outline-variant/50">
              <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-xs">
                <span className={`w-3 h-3 rounded-full ${group.color}`}></span>
                {groupName}
              </h3>
              <span className="px-sm py-1 bg-surface-container text-on-surface-variant rounded-full font-label-sm text-label-sm">{group.code}</span>
            </div>
            <div className="flex flex-col gap-sm">
              {group.tasks.map((task) => (
                <div key={task.id} className="group flex items-start gap-md p-md rounded-lg hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/30">
                  <div className="mt-1">
                    <input
                      className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary/50 cursor-pointer"
                      type="checkbox"
                      id={task.id}
                      checked={task.is_completed}
                      onChange={() => handleToggleTask(task.id, task.is_completed)}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      className={`font-body-md text-body-md text-primary font-medium cursor-pointer block ${task.is_completed ? 'line-through text-on-surface-variant' : ''}`}
                      htmlFor={task.id}
                    >
                      {task.title}
                    </label>
                    {task.description && (
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm line-clamp-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-md mt-2">
                      <div className={`flex items-center gap-1 text-xs font-medium ${task.due_severity === 'error' ? 'text-error' : 'text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {task.dueDate}
                      </div>
                      {task.attachments > 0 && (
                        <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                          <span className="material-symbols-outlined text-[14px]">attach_file</span>
                          {task.attachments} Attachments
                        </div>
                      )}
                    </div>
                  </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-xs">
                      <button className="p-1 text-on-surface-variant hover:text-primary rounded">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Sidebar (Right Column) */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-md">Summary</h3>
          <div className="space-y-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-sm">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="font-body-md text-body-md text-on-surface">Pending</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary">{pendingCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-sm">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="font-body-md text-body-md text-on-surface">Completed</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary">{completedCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-sm">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <span className="font-body-md text-body-md text-on-surface">Overdue</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary">{overdueCount}</span>
            </div>
          </div>
        </div>

        {/* Quick Add Panel */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-md">Quick Add</h3>
          <form onSubmit={handleQuickAdd} className="space-y-sm">
            <input
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              placeholder="Task title..."
              type="text"
              value={quickAddTitle}
              onChange={e => setQuickAddTitle(e.target.value)}
              required
            />
            <input
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              type="date"
              value={quickAddDate}
              onChange={e => setQuickAddDate(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="w-full px-md py-sm bg-secondary text-on-secondary font-label-md text-label-md rounded-lg flex items-center justify-center gap-xs hover:bg-secondary/90 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

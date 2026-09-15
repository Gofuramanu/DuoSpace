import React from 'react';
import { useSpace } from '../../context/SpaceContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import { format } from 'date-fns';

function getTimeLeft(dueDate) {
  const now = new Date();
  const diff = new Date(dueDate) - now;
  const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
  if (hours < 1) return '< 1h left';
  return `${hours}h left`;
}

export default function Dashboard({ onNavigate = () => {} }) {
  const { isPartnerSpace } = useSpace();
  const { schedules, tasks, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-body-md text-on-surface-variant animate-pulse">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-body-md text-error">Gagal memuat data: {error}</p>
      </div>
    );
  }

  const now = new Date();
  const urgentTasks = tasks.filter(t => {
    const diffHours = (new Date(t.due_date) - now) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
  });

  const totalActiveTasks = tasks.length;

  return (
    <>
      {/* Quick Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] flex items-center justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Total Pending Tasks</p>
            <p className="font-headline-lg text-headline-lg text-primary">{totalActiveTasks}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
          </div>
        </div>
        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] flex items-center justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Today's Classes</p>
            <p className="font-headline-lg text-headline-lg text-primary">{schedules.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
        </div>
        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] flex items-center justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Urgent Tasks (24h)</p>
            <p className="font-headline-lg text-headline-lg text-primary">{urgentTasks.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center text-on-error-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_late</span>
          </div>
        </div>
      </section>

      {/* Bento Layout for Classes and Tasks */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Left Column: Today's Classes (Spans 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-md">
          <div className="flex items-center justify-between mb-sm">
            <h3 className="font-headline-sm text-headline-sm text-primary">Today's Classes</h3>
            <button onClick={() => onNavigate('schedule')} className="text-secondary font-label-md text-label-md hover:bg-secondary/10 px-sm py-1 rounded transition-colors">View Schedule</button>
          </div>

          {schedules.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-lg border border-dashed border-outline-variant flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">event_available</span>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Tidak ada jadwal kuliah atau magang hari ini.</p>
            </div>
          ) : (
            schedules.map((schedule, index) => {
              const isCompleted = new Date(schedule.end_time) < new Date();
              const borderColor = schedule.type === 'Praktik' ? 'border-l-amber-500' : 'border-l-secondary';
              
              const badgeBg = schedule.type === 'Praktik'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                : schedule.type === 'Teori'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                : 'bg-secondary-fixed text-on-secondary-fixed dark:bg-secondary-container dark:text-on-secondary-container';

              return (
                <div
                  key={schedule.id}
                  className={`bg-surface-container-lowest rounded-xl p-lg border-l-4 ${borderColor} border-t border-r border-b border-outline-variant shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] hover:shadow-[0_10px_15px_-3px_rgba(15,23,42,0.1)] transition-shadow ${isCompleted ? 'opacity-60' : ''}`}
                >
                  <div className="flex justify-between items-start mb-md">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide mb-2 ${badgeBg}`}>
                        {schedule.type}
                      </span>
                      <h4 className={`font-headline-md text-headline-md text-primary ${isCompleted ? 'line-through' : ''}`}>
                        {schedule.title}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="font-headline-sm text-headline-sm text-primary">
                        {format(new Date(schedule.start_time), 'HH:mm')}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {isCompleted ? 'Completed' : `${format(new Date(schedule.end_time), 'HH:mm')}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-md text-on-surface-variant font-body-md text-body-md">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {schedule.location}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Urgent Tasks (Spans 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-md">
          <div className="flex items-center justify-between mb-sm">
            <h3 className="font-headline-sm text-headline-sm text-primary">Due in 24h</h3>
            {urgentTasks.length > 0 && <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>}
          </div>

          {urgentTasks.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-lg border border-dashed border-outline-variant flex flex-col items-center justify-center py-12 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">Tidak ada tugas yang mendesak.</p>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] overflow-hidden">
              <ul className="divide-y divide-outline-variant">
                {urgentTasks.map((task) => (
                  <li key={task.id} className="p-md hover:bg-surface-container-low transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-body-lg text-body-lg text-primary font-medium group-hover:text-secondary transition-colors">
                        {task.title}
                      </h4>
                      <span className="bg-error-container text-on-error-container px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap">
                        {getTimeLeft(task.due_date)}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                      {task.course}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="p-sm bg-surface-container border-t border-outline-variant text-center">
                <button onClick={() => onNavigate('tasks')} className="text-secondary font-label-md text-label-md hover:underline">View All Tasks</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

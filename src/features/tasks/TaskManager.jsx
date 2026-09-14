import React, { useState } from 'react';
import { useSpace } from '../../context/SpaceContext';

const MOCK_TASKS = {
  'Advanced Data Structures': {
    code: 'CS-301',
    color: 'bg-secondary-container',
    tasks: [
      { id: 'task1', title: 'Implement Red-Black Tree Visualization', description: 'Create a web-based interactive tool to visualize node insertions and rotations.', dueDate: 'Oct 15 (Tomorrow)', dueSeverity: 'error', attachments: 2, completed: false },
      { id: 'task2', title: 'Midterm Review Notes', description: '', dueDate: 'Oct 20', dueSeverity: 'normal', attachments: 0, completed: false },
    ],
  },
  'Quantum Physics': {
    code: 'PHY-401',
    color: 'bg-emerald-500',
    tasks: [
      { id: 'task3', title: 'Lab Report: Wave-Particle Duality', description: 'Analyze double-slit experiment data using provided Python scripts.', dueDate: 'Oct 18', dueSeverity: 'normal', attachments: 3, completed: false },
      { id: 'task4', title: 'Read Chapter 5: Quantum Entanglement', description: '', dueDate: 'Oct 22', dueSeverity: 'normal', attachments: 0, completed: true },
    ],
  },
};

const SUMMARY = {
  pending: 3,
  completed: 1,
  overdue: 0,
};

export default function TaskManager() {
  const { isPartnerSpace } = useSpace();
  const [taskGroups, setTaskGroups] = useState(MOCK_TASKS);

  function handleToggleTask(groupName, taskId) {
    if (isPartnerSpace) return;
    setTaskGroups((prev) => {
      const updated = { ...prev };
      const group = { ...updated[groupName] };
      group.tasks = group.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      updated[groupName] = group;
      return updated;
    });
  }

  const allTasks = Object.values(taskGroups).flatMap((g) => g.tasks);
  const pendingCount = allTasks.filter((t) => !t.completed).length;
  const completedCount = allTasks.filter((t) => t.completed).length;

  return (
    <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-gutter">
      {/* Page Header */}
      <div className="col-span-12 flex justify-between items-end mb-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-1">Task Manager</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Organize, track, and complete your academic assignments.</p>
        </div>
        {!isPartnerSpace && (
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
        )}
      </div>

      {/* Tasks List (Left Column) */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-lg">
        {Object.entries(taskGroups).map(([groupName, group]) => (
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
                      checked={task.completed}
                      onChange={() => handleToggleTask(groupName, task.id)}
                      disabled={isPartnerSpace}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      className={`font-body-md text-body-md text-primary font-medium cursor-pointer block ${task.completed ? 'line-through text-on-surface-variant' : ''}`}
                      htmlFor={task.id}
                    >
                      {task.title}
                    </label>
                    {task.description && (
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm line-clamp-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-md mt-2">
                      <div className={`flex items-center gap-1 text-xs font-medium ${task.dueSeverity === 'error' ? 'text-error' : 'text-on-surface-variant'}`}>
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
                  {!isPartnerSpace && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-xs">
                      <button className="p-1 text-on-surface-variant hover:text-primary rounded">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </div>
                  )}
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
              <span className="font-headline-sm text-headline-sm text-primary">0</span>
            </div>
          </div>
        </div>

        {/* Quick Add Panel */}
        {!isPartnerSpace && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-md">Quick Add</h3>
            <div className="space-y-sm">
              <input
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                placeholder="Task title..."
                type="text"
              />
              <input
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                placeholder="Due date..."
                type="date"
              />
              <button className="w-full px-md py-sm bg-secondary text-on-secondary font-label-md text-label-md rounded-lg flex items-center justify-center gap-xs hover:bg-secondary/90 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

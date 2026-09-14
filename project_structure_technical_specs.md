# University Schedule & Task Manager - Project Structure

This React application uses Vite, Tailwind CSS, and Lucide React. Data persistence is handled via a custom `useLocalStorage` hook.

## File Structure

```text
/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopHeader.jsx
│   │   │   └── AppLayout.jsx
│   │   ├── Dashboard/
│   │   │   ├── PriorityWidget.jsx
│   │   │   └── StatsOverview.jsx
│   │   ├── Schedule/
│   │   │   ├── DayTabs.jsx
│   │   │   └── ClassCard.jsx
│   │   └── Tasks/
│   │       ├── TaskList.jsx
│   │       ├── TaskItem.jsx
│   │       └── AddTaskForm.jsx
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── context/
│   │   └── AppContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
└── package.json
```

## Implementation Highlights

### 1. Persistence Hook (`useLocalStorage.js`)
Handles reactive updates to state while syncing with the browser's storage.

```javascript
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

### 2. Global Context (`AppContext.jsx`)
Centralizes tasks and schedule data for cross-screen accessibility.

### 3. Component Standards
- **ScheduleCard**: Displays class metadata with color-coded "Teori/Praktik" badges.
- **TaskItem**: Features an urgent badge for deadlines within 24 hours.
- **Responsive Layout**: Sidebar collapses on smaller viewports (handled via Tailwind `md:` utilities).

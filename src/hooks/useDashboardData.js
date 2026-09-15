import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSpace } from '../context/SpaceContext';

export function useDashboardData() {
  const { activeUserId } = useSpace();
  const [schedules, setSchedules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!activeUserId) return;
      setLoading(true);
      setError(null);

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 1. Fetch Today's Schedules
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('schedules')
          .select('*')
          .eq('user_id', activeUserId)
          .gte('start_time', today.toISOString())
          .lt('start_time', tomorrow.toISOString())
          .order('start_time', { ascending: true });

        if (scheduleError) throw scheduleError;

        // 2. Fetch Urgent Tasks (next 24 hours, incomplete)
        const now = new Date();
        const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', activeUserId)
          .eq('is_completed', false)
          .order('due_date', { ascending: true });

        if (taskError) throw taskError;

        setSchedules(scheduleData || []);
        setTasks(taskData || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeUserId]);

  return { schedules, tasks, loading, error };
}

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

        // Cek jika Supabase belum dikonfigurasi (menggunakan mock data sementara)
        if (!import.meta.env.VITE_SUPABASE_URL) {
          // Simulasi delay jaringan
          await new Promise(res => setTimeout(res, 500));
          
          setSchedules([
            {
              id: '1',
              title: 'Pemrograman Web Lanjut',
              type: 'Kuliah',
              start_time: new Date().setHours(8, 0, 0, 0),
              end_time: new Date().setHours(10, 30, 0, 0),
              location: 'Lab Komputer 1'
            },
            {
              id: '2',
              title: 'Rapat Magang Tim B',
              type: 'Magang',
              start_time: new Date().setHours(13, 0, 0, 0),
              end_time: new Date().setHours(14, 0, 0, 0),
              location: 'Google Meet'
            }
          ]);
          setTasks([
            {
              id: 't1',
              title: 'Selesaikan Desain UI Figma',
              course: 'Desain Antarmuka',
              due_date: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), // 4 jam dari sekarang
              is_completed: false,
              priority: 'High'
            },
            {
              id: 't2',
              title: 'Kumpulkan Laporan Magang',
              course: 'Magang',
              due_date: new Date(new Date().getTime() + 20 * 60 * 60 * 1000), // 20 jam dari sekarang
              is_completed: false,
              priority: 'Medium'
            }
          ]);
          setLoading(false);
          return;
        }

        // 1. Fetch Today's Schedules (Supabase Asli)
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
          .lte('due_date', next24h.toISOString())
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

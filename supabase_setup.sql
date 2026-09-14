-- ==========================================
-- 1. DROP EXISTING TABLES (IF ANY)
-- ==========================================
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS tasks;

-- ==========================================
-- 2. CREATE TABLES
-- ==========================================

-- Table: schedules
CREATE TABLE schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  code text,
  description text,
  type text NOT NULL, -- 'Teori', 'Praktik', 'break', 'Magang', 'Kuliah'
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  location text,
  lecturer text,
  color text
);

-- Table: tasks
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  course text NOT NULL,
  description text,
  due_date timestamp with time zone NOT NULL,
  due_severity text DEFAULT 'normal', -- 'normal', 'error'
  attachments int4 DEFAULT 0,
  is_completed boolean DEFAULT false,
  priority text DEFAULT 'Medium'
);

-- ==========================================
-- 3. INSERT SEED DATA
-- Note: Dates are generated around Sept 2026 to match current active week
-- ==========================================

-- Seed for Ghafur (user-1) - SCHEDULES
INSERT INTO schedules (user_id, title, code, description, type, start_time, end_time, location, lecturer, color) VALUES
('user-1', 'Advanced Data Structures', 'CS-301', 'Algorithm Analysis & Optimization', 'Teori', '2026-09-14 08:00:00+07', '2026-09-14 10:00:00+07', 'Room 402 - Eng Bldg', 'Dr. A. Turing', 'secondary'),
('user-1', 'Database Systems Lab', 'CS-305L', 'Practical SQL & NoSQL Implementation', 'Praktik', '2026-09-14 10:30:00+07', '2026-09-14 13:30:00+07', 'Lab A - Comp Center', 'Prof. E. Codd', 'amber'),
('user-1', 'Lunch Break', '', '13:30 - 14:30 • Lunch Break', 'break', '2026-09-14 13:30:00+07', '2026-09-14 14:30:00+07', '', '', ''),
('user-1', 'Human-Computer Interaction', 'UX-201', 'Design Systems & Usability', 'Teori', '2026-09-14 14:30:00+07', '2026-09-14 16:00:00+07', 'Auditorium B', 'Dr. D. Norman', 'secondary'),
('user-1', 'Operating Systems', 'CS-310', 'Process Management & Scheduling', 'Teori', '2026-09-15 09:00:00+07', '2026-09-15 11:00:00+07', 'Room 201 - Main Bldg', 'Prof. L. Torvalds', 'secondary'),
('user-1', 'Web Development Lab', 'CS-320L', 'Full-Stack JavaScript', 'Praktik', '2026-09-16 08:00:00+07', '2026-09-16 10:00:00+07', 'Lab B - Comp Center', 'Dr. B. Eich', 'amber'),
('user-1', 'Artificial Intelligence', 'CS-401', 'Machine Learning Fundamentals', 'Teori', '2026-09-18 10:00:00+07', '2026-09-18 12:00:00+07', 'Room 305 - Tech Wing', 'Dr. A. Ng', 'secondary');

-- Seed for Mey (user-2) - SCHEDULES
INSERT INTO schedules (user_id, title, code, description, type, start_time, end_time, location, lecturer, color) VALUES
('user-2', 'UI/UX Masterclass', 'DES-301', 'Prototyping in Figma', 'Praktik', '2026-09-14 09:00:00+07', '2026-09-14 12:00:00+07', 'Design Studio 1', 'Sarah Drasner', 'amber'),
('user-2', 'Magang Tim Produk', 'INT-400', 'Weekly Sync', 'Magang', '2026-09-14 13:00:00+07', '2026-09-14 15:00:00+07', 'Google Meet', 'Product Manager', 'emerald');

-- Seed for Ghafur (user-1) - TASKS
INSERT INTO tasks (user_id, title, course, description, due_date, due_severity, attachments, is_completed) VALUES
('user-1', 'Implement Red-Black Tree Visualization', 'Advanced Data Structures', 'Create a web-based interactive tool to visualize node insertions and rotations.', '2026-09-15 10:00:00+07', 'error', 2, false),
('user-1', 'Midterm Review Notes', 'Advanced Data Structures', 'Review all chapters for the upcoming midterm.', '2026-09-20 23:59:00+07', 'normal', 0, false),
('user-1', 'Lab Report: Wave-Particle Duality', 'Quantum Physics', 'Analyze double-slit experiment data using provided Python scripts.', '2026-09-18 17:00:00+07', 'normal', 3, false),
('user-1', 'Read Chapter 5: Quantum Entanglement', 'Quantum Physics', 'Reading assignment before Friday.', '2026-09-14 23:59:00+07', 'error', 0, false);

-- Seed for Mey (user-2) - TASKS
INSERT INTO tasks (user_id, title, course, description, due_date, due_severity, attachments, is_completed) VALUES
('user-2', 'Selesaikan Desain UI Figma', 'Desain Antarmuka', 'Finalisasi wireframe dan high fidelity mockup.', '2026-09-14 18:00:00+07', 'error', 1, false),
('user-2', 'Kumpulkan Laporan Magang Mingguan', 'Magang', 'Laporan progress untuk mentor di kantor.', '2026-09-15 10:00:00+07', 'normal', 1, false);

-- ==========================================
-- 4. ENABLE RLS (Row Level Security) (OPTIONAL)
-- ==========================================
-- Jika Anda ingin RLS, Anda dapat mengatur policy. Untuk kemudahan tahap awal (karena Anon Key):
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon (karena kita melakukan filter manual via kode untuk sementara)
CREATE POLICY "Enable all operations for anon on schedules" ON schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for anon on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

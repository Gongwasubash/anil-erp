-- Drop existing table if it exists
DROP TABLE IF EXISTS subject_assignments;

-- Create subject_assignments table
CREATE TABLE subject_assignments (
  id SERIAL PRIMARY KEY,
  school_id TEXT,
  batch_id TEXT,
  class_id TEXT,
  section_id TEXT,
  subject_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subject_assignments_school_id ON subject_assignments(school_id);
CREATE INDEX IF NOT EXISTS idx_subject_assignments_batch_id ON subject_assignments(batch_id);
CREATE INDEX IF NOT EXISTS idx_subject_assignments_class_id ON subject_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_subject_assignments_section_id ON subject_assignments(section_id);

-- Insert sample data for classes 1-10, sections A,B,C with all subjects
-- Note: Replace the IDs below with actual IDs from your database
INSERT INTO subject_assignments (school_id, batch_id, class_id, section_id, subject_ids) VALUES
-- Class 1, Section A
('1', '1', '1', '1', '{"1","2","3","4","5","6","7","8"}'),
-- Class 1, Section B
('1', '1', '1', '2', '{"1","2","3","4","5","6","7","8"}'),
-- Class 1, Section C
('1', '1', '1', '3', '{"1","2","3","4","5","6","7","8"}'),
-- Class 2, Section A
('1', '1', '2', '1', '{"1","2","3","4","5","6","7","8"}'),
-- Class 2, Section B
('1', '1', '2', '2', '{"1","2","3","4","5","6","7","8"}'),
-- Class 2, Section C
('1', '1', '2', '3', '{"1","2","3","4","5","6","7","8"}'),
-- Class 3, Section A
('1', '1', '3', '1', '{"1","2","3","4","5","6","7","8"}'),
-- Class 3, Section B
('1', '1', '3', '2', '{"1","2","3","4","5","6","7","8"}'),
-- Class 3, Section C
('1', '1', '3', '3', '{"1","2","3","4","5","6","7","8"}'),
-- Class 4, Section A
('1', '1', '4', '1', '{"1","2","3","4","5","6","7","8"}'),
-- Class 4, Section B
('1', '1', '4', '2', '{"1","2","3","4","5","6","7","8"}'),
-- Class 4, Section C
('1', '1', '4', '3', '{"1","2","3","4","5","6","7","8"}'),
-- Class 5, Section A
('1', '1', '5', '1', '{"1","2","3","4","5","6","7","8"}'),
-- Class 5, Section B
('1', '1', '5', '2', '{"1","2","3","4","5","6","7","8"}'),
-- Class 5, Section C
('1', '1', '5', '3', '{"1","2","3","4","5","6","7","8"}'),
-- Class 6, Section A
('1', '1', '6', '1', '{"1","2","3","4","5","6","7","8"}'),
-- Class 6, Section B
('1', '1', '6', '2', '{"1","2","3","4","5","6","7","8"}'),
-- Class 6, Section C
('1', '1', '6', '3', '{"1","2","3","4","5","6","7","8"}'),
-- Class 7, Section A
('1', '1', '7', '1', '{"1","2","3","4","5","6","7","8"}'),
-- Class 7, Section B
('1', '1', '7', '2', '{"1","2","3","4","5","6","7","8"}'),
-- Class 7, Section C
('1', '1', '7', '3', '{"1","2","3","4","5","6","7","8"}'),
-- Class 8, Section A
('1', '1', '8', '1', '{"1","2","3","4","5","6","7","8"}'),
-- Class 8, Section B
('1', '1', '8', '2', '{"1","2","3","4","5","6","7","8"}'),
-- Class 8, Section C
('1', '1', '8', '3', '{"1","2","3","4","5","6","7","8"}'),
-- Class 9, Section A
('1', '1', '9', '1', '{"1","2","3","4","5","6","7","8"}'),
-- Class 9, Section B
('1', '1', '9', '2', '{"1","2","3","4","5","6","7","8"}'),
-- Class 9, Section C
('1', '1', '9', '3', '{"1","2","3","4","5","6","7","8"}'),
-- Class 10, Section A
('1', '1', '10', '1', '{"1","2","3","4","5","6","7","8"}'),
-- Class 10, Section B
('1', '1', '10', '2', '{"1","2","3","4","5","6","7","8"}'),
-- Class 10, Section C
('1', '1', '10', '3', '{"1","2","3","4","5","6","7","8"}');
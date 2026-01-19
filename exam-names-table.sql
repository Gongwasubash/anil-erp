-- Drop existing table if it exists
DROP TABLE IF EXISTS exam_names;

-- Create exam_names table
CREATE TABLE exam_names (
  id SERIAL PRIMARY KEY,
  school_id TEXT NOT NULL,
  batch_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  section_id TEXT NOT NULL,
  exam_type_id TEXT NOT NULL,
  exam_name VARCHAR(255) NOT NULL,
  is_current_exam BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exam_names_school_id ON exam_names(school_id);
CREATE INDEX IF NOT EXISTS idx_exam_names_batch_id ON exam_names(batch_id);
CREATE INDEX IF NOT EXISTS idx_exam_names_class_id ON exam_names(class_id);
CREATE INDEX IF NOT EXISTS idx_exam_names_section_id ON exam_names(section_id);
CREATE INDEX IF NOT EXISTS idx_exam_names_exam_type_id ON exam_names(exam_type_id);

-- Insert sample exam names
INSERT INTO exam_names (school_id, batch_id, class_id, section_id, exam_type_id, exam_name, is_current_exam) VALUES
('1', '1', '1', '1', '1', 'First Terminal Exam', true),
('1', '1', '2', '1', '2', 'Second Terminal Exam', false),
('1', '1', '3', '2', '3', 'Mid Term Assessment', false);
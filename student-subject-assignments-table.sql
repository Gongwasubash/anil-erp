-- Create student_subject_assignments table
CREATE TABLE IF NOT EXISTS student_subject_assignments (
  id SERIAL PRIMARY KEY,
  student_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  school_id TEXT,
  batch_id TEXT,
  class_id TEXT,
  section_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, subject_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_subject_assignments_student_id ON student_subject_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_subject_assignments_subject_id ON student_subject_assignments(subject_id);
CREATE INDEX IF NOT EXISTS idx_student_subject_assignments_school_id ON student_subject_assignments(school_id);
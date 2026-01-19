-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  subject_code VARCHAR(10) NOT NULL UNIQUE,
  subject_name VARCHAR(100) NOT NULL,
  sort_name VARCHAR(20) NOT NULL,
  order_no INTEGER NOT NULL DEFAULT 1,
  class_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_order_no ON subjects(order_no);
CREATE INDEX IF NOT EXISTS idx_subjects_subject_code ON subjects(subject_code);

-- Insert default subjects
INSERT INTO subjects (subject_code, subject_name, sort_name, order_no) VALUES
('01', 'English', 'eng', 1),
('02', 'Nepali', 'nep', 2),
('03', 'Mathematics', 'math', 3),
('04', 'Science', 'sci', 4),
('05', 'Social Studies', 'soc', 5),
('06', 'Environment', 'envmt', 6),
('07', 'Health&population', 'hepl', 7),
('08', 'Moral', 'm', 8)
ON CONFLICT (subject_code) DO NOTHING;
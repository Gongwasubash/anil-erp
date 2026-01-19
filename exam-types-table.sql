-- Drop existing table if it exists
DROP TABLE IF EXISTS exam_types;

-- Create exam_types table
CREATE TABLE exam_types (
  id SERIAL PRIMARY KEY,
  exam_type VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_exam_types_exam_type ON exam_types(exam_type);

-- Insert sample exam types
INSERT INTO exam_types (exam_type) VALUES
('Unit Test 1'),
('Unit Test 2'),
('Mid Term Exam'),
('Final Exam'),
('Annual Exam'),
('Quarterly Exam'),
('Half Yearly Exam'),
('Pre-Board Exam');
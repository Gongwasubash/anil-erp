-- Create grades table for examination management
CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  grade_name VARCHAR(10) NOT NULL,
  min_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  max_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  grade_point DECIMAL(3,2) NOT NULL DEFAULT 0,
  min_g_point DECIMAL(3,2) NOT NULL DEFAULT 0,
  max_g_point DECIMAL(3,2) NOT NULL DEFAULT 0,
  description VARCHAR(255),
  teacher_remarks TEXT,
  show_in_result BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_grades_name ON grades(grade_name);
CREATE INDEX IF NOT EXISTS idx_grades_percent_range ON grades(min_percent, max_percent);

-- Insert default grades if table is empty
INSERT INTO grades (grade_name, min_percent, max_percent, grade_point, min_g_point, max_g_point, description, teacher_remarks)
SELECT * FROM (VALUES
  ('E', 0, 19.99, 0.8, 0, 0.8, 'Very Insufficient', ''),
  ('D', 20, 29.99, 1.2, 0.81, 1.2, 'Insufficient', ''),
  ('D+', 30, 39.99, 1.6, 1.21, 1.6, 'Partially Acceptable', ''),
  ('C', 40, 49.99, 2, 1.61, 2, 'Acceptable', ''),
  ('C+', 50, 59.99, 2.4, 2.01, 2.4, 'Satisfactory', ''),
  ('B', 60, 69.99, 2.8, 2.41, 2.8, 'Good', ''),
  ('B+', 70, 79.99, 3.2, 2.81, 3.2, 'Very Good', ''),
  ('A', 80, 89.99, 3.6, 3.21, 3.6, 'Excellent', ''),
  ('A+', 90, 100, 4, 3.61, 4, 'Outstanding', '')
) AS default_grades(grade_name, min_percent, max_percent, grade_point, min_g_point, max_g_point, description, teacher_remarks)
WHERE NOT EXISTS (SELECT 1 FROM grades);
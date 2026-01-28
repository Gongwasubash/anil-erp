-- Add school_id column to student_variable_fees table
ALTER TABLE student_variable_fees ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_student_variable_fees_school_id ON student_variable_fees(school_id);
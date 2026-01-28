-- Add school_id column to grades table
ALTER TABLE grades ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_grades_school_id ON grades(school_id);
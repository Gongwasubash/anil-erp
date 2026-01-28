-- Add school_id column to exam_types table
ALTER TABLE exam_types ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_exam_types_school_id ON exam_types(school_id);
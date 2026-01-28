-- Add school_id column to subjects table
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON subjects(school_id);

-- Update existing subjects to have a school_id (set to first available school if null)
UPDATE subjects 
SET school_id = (SELECT id FROM schools LIMIT 1) 
WHERE school_id IS NULL;
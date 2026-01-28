-- Add school_id column to all relevant tables for data isolation

-- Students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Employees table  
ALTER TABLE employees ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Departments table
ALTER TABLE departments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Designations table
ALTER TABLE designations ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Classes table
ALTER TABLE classes ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Sections table
ALTER TABLE sections ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Subjects table
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Batches table
ALTER TABLE batches ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Branches table
ALTER TABLE branches ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Fee related tables
ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE fee_heads ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Exam related tables
ALTER TABLE exam_types ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE exam_names ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE exam_marks ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Update existing records to assign them to first school (for demo purposes)
-- In production, you would need to properly assign records to their respective schools
UPDATE students SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
UPDATE employees SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
UPDATE departments SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
UPDATE designations SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
UPDATE classes SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
UPDATE sections SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
UPDATE subjects SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
UPDATE batches SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
UPDATE branches SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
-- Fix school_id data type in student_marks table
-- First, update any existing records to use proper UUID format
UPDATE public.student_marks 
SET school_id = (SELECT id FROM schools WHERE school_name LIKE '%' LIMIT 1)::text
WHERE school_id = '2' OR LENGTH(school_id) < 10;

-- Then alter the column type to UUID
ALTER TABLE public.student_marks 
ALTER COLUMN school_id TYPE uuid USING school_id::uuid;

-- Add foreign key constraint
ALTER TABLE public.student_marks 
ADD CONSTRAINT fk_student_marks_school 
FOREIGN KEY (school_id) REFERENCES schools(id);
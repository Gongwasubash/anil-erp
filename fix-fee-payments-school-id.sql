-- Fix school_id null issue in fee_payments table
-- Add school_id column if it doesn't exist and update existing records

-- Add school_id column if it doesn't exist
ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Update existing records to set school_id based on student's school
UPDATE fee_payments 
SET school_id = (
    SELECT s.school_id 
    FROM students s 
    WHERE s.id = fee_payments.student_id
)
WHERE school_id IS NULL;
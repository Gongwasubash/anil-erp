-- Add status column to employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active';

-- Update existing records to have Active status
UPDATE employees SET status = 'Active' WHERE status IS NULL;
-- Add assigned_modules column to employees table
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS assigned_modules TEXT[];

-- Create index for assigned_modules
CREATE INDEX IF NOT EXISTS idx_employees_assigned_modules ON employees USING GIN (assigned_modules);

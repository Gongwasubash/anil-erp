-- Add employee_type_id column to employees table
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS employee_type_id INTEGER NULL;

-- Add foreign key constraint
ALTER TABLE public.employees 
ADD CONSTRAINT employees_employee_type_id_fkey 
FOREIGN KEY (employee_type_id) 
REFERENCES employee_types(id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_employees_employee_type_id 
ON public.employees USING btree (employee_type_id) 
TABLESPACE pg_default;

-- Create index for school_id if not exists
CREATE INDEX IF NOT EXISTS idx_employees_school_id 
ON public.employees USING btree (school_id) 
TABLESPACE pg_default;

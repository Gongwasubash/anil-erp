-- Add username, password and role columns to employees table
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS username VARCHAR(100),
ADD COLUMN IF NOT EXISTS password VARCHAR(255),
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Teacher';

-- Create unique constraint on username
ALTER TABLE public.employees 
ADD CONSTRAINT employees_username_key UNIQUE (username);

-- Create index for username
CREATE INDEX IF NOT EXISTS idx_employees_username ON public.employees(username);

-- Update existing employees to have username (firstname.lastname)
UPDATE public.employees 
SET username = LOWER(REPLACE(first_name, ' ', '') || '.' || REPLACE(last_name, ' ', ''))
WHERE username IS NULL;

-- Set default password for existing employees (password123)
UPDATE public.employees 
SET password = 'password123'
WHERE password IS NULL;

-- Add login credentials columns to schools table if they don't exist
ALTER TABLE schools ADD COLUMN IF NOT EXISTS username VARCHAR(255);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Update existing schools with login credentials
UPDATE schools 
SET 
  username = LOWER(REPLACE(REPLACE(school_name, ' ', ''), '.', '')),
  password = COALESCE(phone, '123456')
WHERE username IS NULL OR username = '';

-- Create a unique index on username to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_schools_username ON schools(username);

-- Show current schools with their login credentials
SELECT id, school_name, username, password FROM schools;
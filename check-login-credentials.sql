-- Check current schools table structure and data
SELECT id, school_name, username, password, phone FROM schools;

-- If username and password columns don't exist, add them
ALTER TABLE schools ADD COLUMN IF NOT EXISTS username VARCHAR(255);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Update schools with login credentials if they're empty
UPDATE schools 
SET 
  username = LOWER(REPLACE(REPLACE(school_name, ' ', ''), '.', '')),
  password = COALESCE(phone, '123456')
WHERE username IS NULL OR username = '';

-- Show the updated data
SELECT id, school_name, username, password FROM schools;
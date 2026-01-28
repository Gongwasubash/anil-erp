-- Add login credentials columns to schools table
ALTER TABLE schools ADD COLUMN IF NOT EXISTS username VARCHAR(255);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Update existing schools with login credentials (username = school_name, password = phone_no)
UPDATE schools 
SET 
  username = LOWER(REPLACE(school_name, ' ', '')),
  password = '9841234567'
WHERE username IS NULL;

-- Insert sample schools with login credentials
INSERT INTO schools (
  school_name, director, pan_no, prefix_id, starting_point, short_name, 
  accountant_no, fee_due_note, fee_receipt_note, username, password
) VALUES
('Everest High School', 'Ram Sharma', 'PAN123456', 'EHS', '001', 'EHS', '9841234567', 'Please pay fees on time', 'Thank you for payment', 'everesthighschool', '9841234567'),
('Himalaya Secondary School', 'Sita Poudel', 'PAN123457', 'HSS', '001', 'HSS', '9851234568', 'Fees due reminder', 'Payment received', 'himalayasecondaryschool', '9851234568'),
('Mount View Academy', 'Hari Thapa', 'PAN123458', 'MVA', '001', 'MVA', '9861234569', 'Fee payment notice', 'Receipt issued', 'mountviewacademy', '9861234569'),
('Sunrise English School', 'Gita Adhikari', 'PAN123459', 'SES', '001', 'SES', '9871234570', 'Payment reminder', 'Fee collected', 'sunriseenglishschool', '9871234570'),
('Valley International School', 'Krishna Basnet', 'PAN123460', 'VIS', '001', 'VIS', '9881234571', 'Due amount notice', 'Payment confirmation', 'valleyinternationalschool', '9881234571')
ON CONFLICT (id) DO NOTHING;
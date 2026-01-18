-- Students table for comprehensive admission form data
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- School Information
  school VARCHAR,
  branch_name VARCHAR,
  batch_no VARCHAR,
  class VARCHAR,
  section VARCHAR,
  house VARCHAR,
  roll_no VARCHAR,
  
  -- Student Registration Details
  srn VARCHAR, -- Student Registration Number
  enrollment_no VARCHAR, -- Enrollment Number
  form_no VARCHAR, -- Form Number
  
  -- Personal Information
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  name VARCHAR GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  dob_ad DATE, -- Date of Birth (AD)
  dob_bs VARCHAR, -- Date of Birth (BS - Nepali)
  landline_no VARCHAR,
  gender VARCHAR CHECK (gender IN ('Male', 'Female', 'Other')),
  mobile1 VARCHAR,
  mobile2 VARCHAR,
  personal_email_id VARCHAR,
  school_email_id VARCHAR,
  height DECIMAL(5,2), -- Height in cm
  weight DECIMAL(5,2), -- Weight in kg
  blood_group VARCHAR,
  status VARCHAR DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  
  -- Parent/Guardian Information
  father_name VARCHAR NOT NULL,
  mother_name VARCHAR NOT NULL,
  father_mobile1 VARCHAR,
  father_mobile2 VARCHAR,
  father_landline_no VARCHAR,
  guardian_name VARCHAR GENERATED ALWAYS AS (COALESCE(father_name, mother_name)) STORED,
  
  -- Permanent Address
  p_country VARCHAR DEFAULT 'Nepal',
  p_state VARCHAR, -- Province
  p_district VARCHAR,
  p_city VARCHAR,
  p_address1 VARCHAR, -- Permanent Address Line 1
  p_address2 VARCHAR, -- Permanent Address Line 2
  p_pin VARCHAR, -- Permanent Pin No
  
  -- Local Guardian Information
  local_guardian_name VARCHAR,
  relation VARCHAR CHECK (relation IN ('Father', 'Mother', 'Uncle', 'Aunt', 'Grandfather', 'Grandmother', 'Brother', 'Sister', 'Other')),
  local_guardian_mobile VARCHAR,
  local_landline_no VARCHAR,
  local_email VARCHAR,
  l_address1 VARCHAR, -- Local Address Line 1
  l_address2 VARCHAR, -- Local Address Line 2
  l_pin VARCHAR, -- Local Address Pin No
  
  -- System Fields
  academic_year VARCHAR DEFAULT '2080',
  fee_category VARCHAR DEFAULT 'General',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school);
CREATE INDEX IF NOT EXISTS idx_students_batch_class ON students(batch_no, class);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);
CREATE INDEX IF NOT EXISTS idx_students_srn ON students(srn);
CREATE INDEX IF NOT EXISTS idx_students_enrollment_no ON students(enrollment_no);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON students
    FOR ALL USING (auth.role() = 'authenticated');
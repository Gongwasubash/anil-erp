-- Complete Supabase setup for Everest School ERP

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_name VARCHAR NOT NULL,
  country VARCHAR DEFAULT 'Nepal',
  state VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  phone_no VARCHAR,
  address TEXT,
  email VARCHAR,
  website_url VARCHAR,
  short_name VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name VARCHAR NOT NULL,
  director VARCHAR,
  pan_no VARCHAR,
  prefix_id VARCHAR,
  starting_point VARCHAR,
  short_name VARCHAR,
  logo_url VARCHAR,
  signature_url VARCHAR,
  accountant_no VARCHAR,
  branch_ids TEXT[], -- Array of branch IDs
  fee_due_note TEXT,
  fee_receipt_note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create batches table
CREATE TABLE IF NOT EXISTS batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_no VARCHAR NOT NULL,
  short_name VARCHAR,
  based_on_batch UUID REFERENCES batches(id),
  is_current_batch BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_name VARCHAR NOT NULL,
  short_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name VARCHAR NOT NULL,
  short_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create batch_classes table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS batch_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  class_ids TEXT[], -- Array of class IDs
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create batch_class_sections table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS batch_class_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  section_ids TEXT[], -- Array of section IDs
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create manage_section table (replaces batch_class_sections)
CREATE TABLE IF NOT EXISTS manage_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  section_ids TEXT[], -- Array of section IDs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data for branches
INSERT INTO branches (branch_name, country, state, city, phone_no, address, email, website_url, short_name) VALUES
('Main Campus', 'Nepal', 'Bagmati Province', 'Kathmandu', '+977-1-4444444', 'Thamel, Kathmandu', 'main@everest.edu.np', 'https://everest.edu.np', 'MAIN'),
('Secondary Campus', 'Nepal', 'Gandaki Province', 'Pokhara', '+977-61-555555', 'Lakeside, Pokhara', 'pokhara@everest.edu.np', 'https://pokhara.everest.edu.np', 'SEC')
ON CONFLICT DO NOTHING;

-- Insert sample data for classes
INSERT INTO classes (class_name, short_name) VALUES
('Nursery', 'NUR'),
('LKG', 'LKG'),
('UKG', 'UKG'),
('Class 1', '1'),
('Class 2', '2'),
('Class 3', '3'),
('Class 4', '4'),
('Class 5', '5'),
('Class 6', '6'),
('Class 7', '7'),
('Class 8', '8'),
('Class 9', '9'),
('Class 10', '10')
ON CONFLICT DO NOTHING;

-- Insert sample data for sections
INSERT INTO sections (section_name, short_name) VALUES
('Section A', 'A'),
('Section B', 'B'),
('Section C', 'C'),
('Section D', 'D')
ON CONFLICT DO NOTHING;

-- Insert sample data for batches
INSERT INTO batches (batch_no, short_name, is_current_batch) VALUES
('2024-2025', '2024', true),
('2023-2024', '2023', false),
('2022-2023', '2022', false)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_manage_section_batch_id ON manage_section(batch_id);
CREATE INDEX IF NOT EXISTS idx_manage_section_class_id ON manage_section(class_id);

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

-- Create indexes for students table
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school);
CREATE INDEX IF NOT EXISTS idx_students_batch_class ON students(batch_no, class);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);
CREATE INDEX IF NOT EXISTS idx_students_srn ON students(srn);
CREATE INDEX IF NOT EXISTS idx_students_enrollment_no ON students(enrollment_no);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for students table
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for students table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policy for students table
CREATE POLICY "Allow all operations for authenticated users" ON students
    FOR ALL USING (auth.role() = 'authenticated');
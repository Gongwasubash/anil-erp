-- Complete School ERP Database Setup
-- This script creates all necessary tables and relationships for a school management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schools table (main entity)
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_name VARCHAR NOT NULL,
  director VARCHAR,
  pan_no VARCHAR,
  prefix_id VARCHAR,
  starting_point VARCHAR DEFAULT '1',
  short_name VARCHAR,
  logo_url VARCHAR,
  signature_url VARCHAR,
  accountant_no VARCHAR,
  fee_due_note TEXT,
  fee_receipt_note TEXT,
  country VARCHAR DEFAULT 'Nepal',
  state VARCHAR DEFAULT 'Bagmati Province',
  city VARCHAR DEFAULT 'Kathmandu',
  phone VARCHAR,
  address TEXT,
  email VARCHAR,
  website_url VARCHAR,
  username VARCHAR UNIQUE,
  password VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create batches table
CREATE TABLE IF NOT EXISTS batches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  batch_no VARCHAR NOT NULL,
  short_name VARCHAR,
  based_on_batch UUID REFERENCES batches(id),
  is_current_batch BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_name VARCHAR NOT NULL,
  short_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  section_name VARCHAR NOT NULL,
  short_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create manage_section table (batch-class-section relationships)
CREATE TABLE IF NOT EXISTS manage_section (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  section_ids TEXT[], -- Array of section IDs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  subject_code VARCHAR NOT NULL,
  subject_name VARCHAR NOT NULL,
  sort_name VARCHAR,
  order_no INTEGER DEFAULT 1,
  class_ids TEXT[], -- Array of class IDs this subject is for
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  order_no INTEGER DEFAULT 1,
  department_name VARCHAR NOT NULL,
  short_name VARCHAR,
  about_department TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create designations table
CREATE TABLE IF NOT EXISTS designations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  designation_name VARCHAR NOT NULL,
  short_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id),
  class_id UUID REFERENCES classes(id),
  section_id UUID REFERENCES sections(id),
  
  -- Student Registration Details
  srn VARCHAR, -- Student Registration Number
  enrollment_no VARCHAR, -- Enrollment Number
  form_no VARCHAR, -- Form Number
  roll_no VARCHAR,
  
  -- Personal Information
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  name VARCHAR GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  dob_ad DATE, -- Date of Birth (AD)
  dob_bs VARCHAR, -- Date of Birth (BS - Nepali)
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
  
  -- Address Information
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
  academic_year VARCHAR DEFAULT '2024-2025',
  fee_category VARCHAR DEFAULT 'General',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id),
  designation_id UUID REFERENCES designations(id),
  
  -- Employee Details
  employee_code VARCHAR UNIQUE,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  name VARCHAR GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  email VARCHAR,
  phone VARCHAR,
  mobile VARCHAR,
  address TEXT,
  
  -- Employment Details
  joining_date DATE,
  salary DECIMAL(10,2),
  status VARCHAR DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Terminated')),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create fee_heads table
CREATE TABLE IF NOT EXISTS fee_heads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  fee_head_name VARCHAR NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create users table for system access
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  username VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'Admin' CHECK (role IN ('Super Admin', 'Admin', 'Accountant', 'Teacher', 'Student')),
  status VARCHAR DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schools_username ON schools(username);
CREATE INDEX IF NOT EXISTS idx_branches_school_id ON branches(school_id);
CREATE INDEX IF NOT EXISTS idx_batches_school_id ON batches(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_sections_school_id ON sections(school_id);
CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON subjects(school_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_batch_class ON students(batch_id, class_id);
CREATE INDEX IF NOT EXISTS idx_employees_school_id ON employees(school_id);
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE manage_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_heads ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Schools: Super Admin can see all, others see only their school
CREATE POLICY "Schools access policy" ON schools
  FOR ALL USING (
    auth.role() = 'authenticated' AND (
      current_setting('app.current_user_role', true) = 'Super Admin' OR
      id::text = current_setting('app.current_school_id', true)
    )
  );

-- Generic policy for school-isolated tables
CREATE POLICY "School isolation policy" ON branches
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON batches
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON classes
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON sections
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON manage_section
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON subjects
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON departments
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON designations
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON students
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON employees
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON fee_heads
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON users
  FOR ALL USING (
    auth.role() = 'authenticated' AND (
      current_setting('app.current_user_role', true) = 'Super Admin' OR
      school_id::text = current_setting('app.current_school_id', true)
    )
  );

-- Create function to set configuration
CREATE OR REPLACE FUNCTION set_config(setting_name text, setting_value text, is_local boolean DEFAULT false)
RETURNS text AS $$
BEGIN
  PERFORM set_config(setting_name, setting_value, is_local);
  RETURN setting_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default Super Admin user
INSERT INTO users (username, password, role, status) VALUES 
('superadmin', 'admin123', 'Super Admin', 'Active')
ON CONFLICT (username) DO NOTHING;

-- Insert sample default classes (common across schools)
INSERT INTO classes (school_id, class_name, short_name) 
SELECT 
  NULL as school_id, -- Will be set when school is created
  class_name,
  short_name
FROM (VALUES
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
  ('Class 10', '10'),
  ('Class 11', '11'),
  ('Class 12', '12')
) AS default_classes(class_name, short_name)
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE school_id IS NULL);

-- Insert sample default sections
INSERT INTO sections (school_id, section_name, short_name)
SELECT 
  NULL as school_id, -- Will be set when school is created
  section_name,
  short_name
FROM (VALUES
  ('Section A', 'A'),
  ('Section B', 'B'),
  ('Section C', 'C'),
  ('Section D', 'D'),
  ('Section E', 'E')
) AS default_sections(section_name, short_name)
WHERE NOT EXISTS (SELECT 1 FROM sections WHERE school_id IS NULL);

-- Insert sample subjects
INSERT INTO subjects (school_id, subject_code, subject_name, sort_name, order_no, class_ids)
SELECT 
  NULL as school_id, -- Will be set when school is created
  subject_code,
  subject_name,
  sort_name,
  order_no,
  class_ids
FROM (VALUES
  ('ENG', 'English', 'ENG', 1, ARRAY['1','2','3','4','5','6','7','8','9','10']),
  ('NEP', 'Nepali', 'NEP', 2, ARRAY['1','2','3','4','5','6','7','8','9','10']),
  ('MATH', 'Mathematics', 'MATH', 3, ARRAY['1','2','3','4','5','6','7','8','9','10']),
  ('SCI', 'Science', 'SCI', 4, ARRAY['3','4','5','6','7','8','9','10']),
  ('SS', 'Social Studies', 'SS', 5, ARRAY['3','4','5','6','7','8','9','10']),
  ('HPE', 'Health & Physical Education', 'HPE', 6, ARRAY['1','2','3','4','5','6','7','8','9','10']),
  ('ART', 'Art & Craft', 'ART', 7, ARRAY['1','2','3','4','5','6','7','8','9','10']),
  ('COMP', 'Computer Science', 'COMP', 8, ARRAY['6','7','8','9','10'])
) AS default_subjects(subject_code, subject_name, sort_name, order_no, class_ids)
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE school_id IS NULL);

-- Insert sample departments
INSERT INTO departments (school_id, order_no, department_name, short_name, about_department)
SELECT 
  NULL as school_id, -- Will be set when school is created
  order_no,
  department_name,
  short_name,
  about_department
FROM (VALUES
  (1, 'Administration', 'ADMIN', 'Administrative Department'),
  (2, 'Academic', 'ACAD', 'Academic Department'),
  (3, 'Finance', 'FIN', 'Finance Department'),
  (4, 'IT Support', 'IT', 'Information Technology Support'),
  (5, 'Maintenance', 'MAINT', 'Maintenance Department')
) AS default_departments(order_no, department_name, short_name, about_department)
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE school_id IS NULL);

-- Insert sample fee heads
INSERT INTO fee_heads (school_id, fee_head_name, amount, is_active)
SELECT 
  NULL as school_id, -- Will be set when school is created
  fee_head_name,
  amount,
  is_active
FROM (VALUES
  ('Tuition Fee', 5000.00, true),
  ('Admission Fee', 2000.00, true),
  ('Exam Fee', 500.00, true),
  ('Library Fee', 300.00, true),
  ('Sports Fee', 200.00, true),
  ('Computer Fee', 800.00, true),
  ('Transport Fee', 1500.00, true),
  ('Uniform Fee', 1000.00, true)
) AS default_fee_heads(fee_head_name, amount, is_active)
WHERE NOT EXISTS (SELECT 1 FROM fee_heads WHERE school_id IS NULL);

COMMENT ON TABLE schools IS 'Main schools table containing school information';
COMMENT ON TABLE branches IS 'School branches/campuses';
COMMENT ON TABLE batches IS 'Academic batches/years';
COMMENT ON TABLE classes IS 'Class/Grade levels';
COMMENT ON TABLE sections IS 'Class sections (A, B, C, etc.)';
COMMENT ON TABLE manage_section IS 'Batch-Class-Section relationships';
COMMENT ON TABLE subjects IS 'Academic subjects';
COMMENT ON TABLE departments IS 'School departments';
COMMENT ON TABLE designations IS 'Job designations within departments';
COMMENT ON TABLE students IS 'Student records';
COMMENT ON TABLE employees IS 'Employee records';
COMMENT ON TABLE fee_heads IS 'Fee categories and amounts';
COMMENT ON TABLE users IS 'System users and authentication';
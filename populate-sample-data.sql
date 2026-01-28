-- Sample Data Population Script
-- Run this after creating a school to add sample students and employees

-- Function to populate sample data for a school
CREATE OR REPLACE FUNCTION populate_sample_data(p_school_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_batch_id UUID;
  v_class_ids UUID[];
  v_section_ids UUID[];
  v_dept_ids UUID[];
  v_designation_ids UUID[];
BEGIN
  -- Get the current batch
  SELECT id INTO v_batch_id FROM batches WHERE school_id = p_school_id AND is_current_batch = true LIMIT 1;
  
  -- Get class IDs
  SELECT array_agg(id) INTO v_class_ids FROM classes WHERE school_id = p_school_id;
  
  -- Get section IDs  
  SELECT array_agg(id) INTO v_section_ids FROM sections WHERE school_id = p_school_id;
  
  -- Get department IDs
  SELECT array_agg(id) INTO v_dept_ids FROM departments WHERE school_id = p_school_id;

  -- Create some designations first
  INSERT INTO designations (school_id, department_id, designation_name, short_name)
  SELECT 
    p_school_id,
    v_dept_ids[1], -- Administration
    designation_name,
    short_name
  FROM (VALUES
    ('Principal', 'PRIN'),
    ('Vice Principal', 'VP'),
    ('Head Teacher', 'HT'),
    ('Teacher', 'TCH'),
    ('Accountant', 'ACC'),
    ('Office Assistant', 'OA')
  ) AS designations(designation_name, short_name);

  -- Get designation IDs
  SELECT array_agg(id) INTO v_designation_ids FROM designations WHERE school_id = p_school_id;

  -- Create sample employees
  INSERT INTO employees (
    school_id, department_id, designation_id, employee_code, 
    first_name, last_name, email, phone, mobile, address,
    joining_date, salary, status
  )
  SELECT 
    p_school_id,
    v_dept_ids[((row_number() OVER()) % array_length(v_dept_ids, 1)) + 1],
    v_designation_ids[((row_number() OVER()) % array_length(v_designation_ids, 1)) + 1],
    'EMP' || LPAD((row_number() OVER())::text, 3, '0'),
    first_name,
    last_name,
    lower(first_name || '.' || last_name || '@school.edu.np'),
    phone,
    mobile,
    address,
    joining_date,
    salary,
    'Active'
  FROM (VALUES
    ('John', 'Doe', '01-4444001', '9841000001', 'Kathmandu', '2023-04-01', 45000.00),
    ('Jane', 'Smith', '01-4444002', '9841000002', 'Lalitpur', '2023-04-15', 40000.00),
    ('Ram', 'Sharma', '01-4444003', '9841000003', 'Bhaktapur', '2023-05-01', 35000.00),
    ('Sita', 'Gurung', '01-4444004', '9841000004', 'Kathmandu', '2023-05-15', 38000.00),
    ('Hari', 'Thapa', '01-4444005', '9841000005', 'Lalitpur', '2023-06-01', 32000.00),
    ('Maya', 'Rai', '01-4444006', '9841000006', 'Kathmandu', '2023-06-15', 30000.00),
    ('Gopal', 'Shrestha', '01-4444007', '9841000007', 'Bhaktapur', '2023-07-01', 28000.00),
    ('Kamala', 'Tamang', '01-4444008', '9841000008', 'Lalitpur', '2023-07-15', 25000.00)
  ) AS emp_data(first_name, last_name, phone, mobile, address, joining_date, salary);

  -- Create sample students
  INSERT INTO students (
    school_id, batch_id, class_id, section_id,
    roll_no, first_name, last_name, 
    dob_ad, gender, father_name, mother_name,
    father_mobile1, p_address1, p_city, p_state, p_country,
    status, academic_year
  )
  SELECT 
    p_school_id,
    v_batch_id,
    v_class_ids[((row_number() OVER()) % array_length(v_class_ids, 1)) + 1],
    v_section_ids[((row_number() OVER()) % array_length(v_section_ids, 1)) + 1],
    LPAD((row_number() OVER())::text, 3, '0'),
    first_name,
    last_name,
    dob_ad,
    gender,
    father_name,
    mother_name,
    father_mobile,
    address,
    city,
    'Bagmati Province',
    'Nepal',
    'Active',
    '2024-2025'
  FROM (VALUES
    ('Arun', 'Sharma', '2010-03-15', 'Male', 'Raj Sharma', 'Sita Sharma', '9841111001', 'Thamel', 'Kathmandu'),
    ('Anita', 'Gurung', '2010-05-20', 'Female', 'Bir Gurung', 'Maya Gurung', '9841111002', 'Patan', 'Lalitpur'),
    ('Bikash', 'Thapa', '2010-07-10', 'Male', 'Hari Thapa', 'Gita Thapa', '9841111003', 'Bhaktapur', 'Bhaktapur'),
    ('Sunita', 'Rai', '2010-09-05', 'Female', 'Ram Rai', 'Kamala Rai', '9841111004', 'Baneshwor', 'Kathmandu'),
    ('Deepak', 'Shrestha', '2010-11-12', 'Male', 'Gopal Shrestha', 'Laxmi Shrestha', '9841111005', 'Jawalakhel', 'Lalitpur'),
    ('Pooja', 'Tamang', '2010-01-25', 'Female', 'Pemba Tamang', 'Dolma Tamang', '9841111006', 'Boudha', 'Kathmandu'),
    ('Rajesh', 'Magar', '2010-04-18', 'Male', 'Dhan Magar', 'Sanu Magar', '9841111007', 'Kirtipur', 'Kathmandu'),
    ('Sapana', 'Limbu', '2010-06-30', 'Female', 'Kiran Limbu', 'Purnima Limbu', '9841111008', 'Sankhu', 'Kathmandu'),
    ('Nabin', 'Karki', '2010-08-14', 'Male', 'Shyam Karki', 'Radha Karki', '9841111009', 'Dhulikhel', 'Kavre'),
    ('Ritu', 'Adhikari', '2010-10-22', 'Female', 'Mohan Adhikari', 'Sarita Adhikari', '9841111010', 'Godawari', 'Lalitpur'),
    ('Suresh', 'Pandey', '2011-02-08', 'Male', 'Krishna Pandey', 'Mina Pandey', '9841111011', 'Chabahil', 'Kathmandu'),
    ('Nisha', 'Joshi', '2011-04-16', 'Female', 'Ramesh Joshi', 'Sunita Joshi', '9841111012', 'Imadol', 'Lalitpur'),
    ('Prabin', 'Basnet', '2011-06-03', 'Male', 'Tilak Basnet', 'Geeta Basnet', '9841111013', 'Madhyapur', 'Bhaktapur'),
    ('Sabina', 'Khadka', '2011-08-19', 'Female', 'Dipak Khadka', 'Bina Khadka', '9841111014', 'Balaju', 'Kathmandu'),
    ('Umesh', 'Ghimire', '2011-10-07', 'Male', 'Narayan Ghimire', 'Kamala Ghimire', '9841111015', 'Gwarko', 'Lalitpur'),
    ('Rashmi', 'Poudel', '2011-12-24', 'Female', 'Bishnu Poudel', 'Shanti Poudel', '9841111016', 'Suryabinayak', 'Bhaktapur'),
    ('Santosh', 'Maharjan', '2012-01-11', 'Male', 'Ratna Maharjan', 'Indira Maharjan', '9841111017', 'Kirtipur', 'Kathmandu'),
    ('Pramila', 'Neupane', '2012-03-28', 'Female', 'Govinda Neupane', 'Saraswoti Neupane', '9841111018', 'Tokha', 'Kathmandu'),
    ('Dinesh', 'Koirala', '2012-05-15', 'Male', 'Surya Koirala', 'Lila Koirala', '9841111019', 'Lubhu', 'Lalitpur'),
    ('Kavita', 'Dahal', '2012-07-02', 'Female', 'Prakash Dahal', 'Urmila Dahal', '9841111020', 'Changunarayan', 'Bhaktapur')
  ) AS student_data(first_name, last_name, dob_ad, gender, father_name, mother_name, father_mobile, address, city);

  -- Create some manage_section entries (batch-class-section relationships)
  INSERT INTO manage_section (school_id, batch_id, class_id, section_ids)
  SELECT 
    p_school_id,
    v_batch_id,
    class_id,
    ARRAY[v_section_ids[1], v_section_ids[2]] -- Assign first two sections to each class
  FROM unnest(v_class_ids[1:5]) AS class_id; -- Only for first 5 classes

  RETURN 'Sample data populated successfully! Added employees, students, and batch-class-section relationships.';
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT populate_sample_data('your-school-id-here');

-- Quick function to get school ID by name
CREATE OR REPLACE FUNCTION get_school_id(p_school_name VARCHAR)
RETURNS UUID AS $$
DECLARE
  v_school_id UUID;
BEGIN
  SELECT id INTO v_school_id FROM schools WHERE school_name ILIKE p_school_name LIMIT 1;
  RETURN v_school_id;
END;
$$ LANGUAGE plpgsql;

-- Combined function to populate data by school name
CREATE OR REPLACE FUNCTION populate_sample_data_by_name(p_school_name VARCHAR)
RETURNS TEXT AS $$
DECLARE
  v_school_id UUID;
BEGIN
  SELECT get_school_id(p_school_name) INTO v_school_id;
  
  IF v_school_id IS NULL THEN
    RETURN 'School not found: ' || p_school_name;
  END IF;
  
  RETURN populate_sample_data(v_school_id);
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT populate_sample_data_by_name('Your School Name');
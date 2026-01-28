-- Simple School Setup Script
-- This script creates a new school with basic master data

-- Function to create a new school with all master data
CREATE OR REPLACE FUNCTION create_new_school(
  p_school_name VARCHAR,
  p_director VARCHAR,
  p_phone VARCHAR,
  p_email VARCHAR,
  p_address TEXT DEFAULT '',
  p_short_name VARCHAR DEFAULT '',
  p_prefix_id VARCHAR DEFAULT ''
) RETURNS JSON AS $$
DECLARE
  v_school_id UUID;
  v_batch_id UUID;
  v_class_ids UUID[];
  v_section_ids UUID[];
  v_result JSON;
BEGIN
  -- Create the school
  INSERT INTO schools (
    school_name, director, phone, email, address, short_name, prefix_id,
    username, password, country, state, city
  ) VALUES (
    p_school_name, p_director, p_phone, p_email, p_address, p_short_name, p_prefix_id,
    lower(replace(p_school_name, ' ', '')), p_phone, 'Nepal', 'Bagmati Province', 'Kathmandu'
  ) RETURNING id INTO v_school_id;

  -- Create current batch
  INSERT INTO batches (school_id, batch_no, short_name, is_current_batch)
  VALUES (v_school_id, '2024-2025', '2024', true)
  RETURNING id INTO v_batch_id;

  -- Create classes
  INSERT INTO classes (school_id, class_name, short_name)
  SELECT v_school_id, class_name, short_name
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
    ('Class 10', '10')
  ) AS default_classes(class_name, short_name)
  RETURNING array_agg(id) INTO v_class_ids;

  -- Create sections
  INSERT INTO sections (school_id, section_name, short_name)
  SELECT v_school_id, section_name, short_name
  FROM (VALUES
    ('Section A', 'A'),
    ('Section B', 'B'),
    ('Section C', 'C'),
    ('Section D', 'D')
  ) AS default_sections(section_name, short_name)
  RETURNING array_agg(id) INTO v_section_ids;

  -- Create subjects
  INSERT INTO subjects (school_id, subject_code, subject_name, sort_name, order_no)
  SELECT v_school_id, subject_code, subject_name, sort_name, order_no
  FROM (VALUES
    ('ENG', 'English', 'ENG', 1),
    ('NEP', 'Nepali', 'NEP', 2),
    ('MATH', 'Mathematics', 'MATH', 3),
    ('SCI', 'Science', 'SCI', 4),
    ('SS', 'Social Studies', 'SS', 5),
    ('HPE', 'Health & Physical Education', 'HPE', 6),
    ('ART', 'Art & Craft', 'ART', 7),
    ('COMP', 'Computer Science', 'COMP', 8)
  ) AS default_subjects(subject_code, subject_name, sort_name, order_no);

  -- Create departments
  INSERT INTO departments (school_id, order_no, department_name, short_name, about_department)
  SELECT v_school_id, order_no, department_name, short_name, about_department
  FROM (VALUES
    (1, 'Administration', 'ADMIN', 'Administrative Department'),
    (2, 'Academic', 'ACAD', 'Academic Department'),
    (3, 'Finance', 'FIN', 'Finance Department'),
    (4, 'IT Support', 'IT', 'Information Technology Support')
  ) AS default_departments(order_no, department_name, short_name, about_department);

  -- Create fee heads
  INSERT INTO fee_heads (school_id, fee_head_name, amount, is_active)
  SELECT v_school_id, fee_head_name, amount, is_active
  FROM (VALUES
    ('Tuition Fee', 5000.00, true),
    ('Admission Fee', 2000.00, true),
    ('Exam Fee', 500.00, true),
    ('Library Fee', 300.00, true),
    ('Sports Fee', 200.00, true)
  ) AS default_fee_heads(fee_head_name, amount, is_active);

  -- Create admin user
  INSERT INTO users (school_id, username, password, role, status)
  VALUES (v_school_id, lower(replace(p_school_name, ' ', '')), p_phone, 'Admin', 'Active');

  -- Return result
  SELECT json_build_object(
    'school_id', v_school_id,
    'school_name', p_school_name,
    'username', lower(replace(p_school_name, ' ', '')),
    'password', p_phone,
    'batch_id', v_batch_id,
    'message', 'School created successfully!'
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT create_new_school('Everest School', 'John Doe', '9841234567', 'admin@everest.edu.np', 'Kathmandu, Nepal', 'EVR', 'EVR');
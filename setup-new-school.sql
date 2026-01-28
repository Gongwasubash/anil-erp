-- Simple school creation that works with existing structure
CREATE OR REPLACE FUNCTION setup_new_school(
  p_school_name VARCHAR,
  p_director VARCHAR,
  p_phone VARCHAR,
  p_email VARCHAR
) RETURNS JSON AS $$
DECLARE
  v_school_id UUID;
  v_batch_id UUID;
  v_result JSON;
BEGIN
  -- Create the school
  INSERT INTO schools (school_name, director, phone, email, username, password)
  VALUES (p_school_name, p_director, p_phone, p_email, 
          lower(replace(p_school_name, ' ', '')), p_phone)
  RETURNING id INTO v_school_id;

  -- Create current batch
  INSERT INTO batches (batch_no, short_name, is_current_batch, school_id)
  VALUES ('2024-2025', '2024', true, v_school_id)
  RETURNING id INTO v_batch_id;

  -- Create basic classes
  INSERT INTO classes (class_name, short_name, school_id)
  VALUES 
    ('Class 1', '1', v_school_id),
    ('Class 2', '2', v_school_id),
    ('Class 3', '3', v_school_id),
    ('Class 4', '4', v_school_id),
    ('Class 5', '5', v_school_id);

  -- Create basic sections
  INSERT INTO sections (section_name, short_name, school_id)
  VALUES 
    ('Section A', 'A', v_school_id),
    ('Section B', 'B', v_school_id),
    ('Section C', 'C', v_school_id);

  -- Create basic subjects
  INSERT INTO subjects (subject_code, subject_name, sort_name, order_no, school_id)
  VALUES 
    ('ENG', 'English', 'ENG', 1, v_school_id),
    ('NEP', 'Nepali', 'NEP', 2, v_school_id),
    ('MATH', 'Mathematics', 'MATH', 3, v_school_id),
    ('SCI', 'Science', 'SCI', 4, v_school_id);

  -- Create basic departments
  INSERT INTO departments (department_name, short_name, order_no, school_id)
  VALUES 
    ('Administration', 'ADMIN', 1, v_school_id),
    ('Academic', 'ACAD', 2, v_school_id);

  -- Create 12 Nepali months for the school
  INSERT INTO fee_months (month_name, month_order, school_id)
  VALUES 
    ('Baisakh', 1, v_school_id),
    ('Jestha', 2, v_school_id),
    ('Ashadh', 3, v_school_id),
    ('Shrawan', 4, v_school_id),
    ('Bhadra', 5, v_school_id),
    ('Ashoj', 6, v_school_id),
    ('Kartik', 7, v_school_id),
    ('Mangsir', 8, v_school_id),
    ('Poush', 9, v_school_id),
    ('Magh', 10, v_school_id),
    ('Falgun', 11, v_school_id),
    ('Chaitra', 12, v_school_id);

  -- Create admin user for the school
  INSERT INTO users (school_id, username, password, role, status)
  VALUES (v_school_id, lower(replace(p_school_name, ' ', '')), p_phone, 'Admin', 'Active');

  -- Create sample financial data for dashboard
  INSERT INTO fee_payments (school_id, student_name, amount, payment_date, status, created_at)
  VALUES 
    (v_school_id, 'Sample Student 1', 5000, CURRENT_DATE - INTERVAL '30 days', 'Paid', CURRENT_DATE - INTERVAL '30 days'),
    (v_school_id, 'Sample Student 2', 4500, CURRENT_DATE - INTERVAL '25 days', 'Paid', CURRENT_DATE - INTERVAL '25 days'),
    (v_school_id, 'Sample Student 3', 5200, CURRENT_DATE - INTERVAL '20 days', 'Paid', CURRENT_DATE - INTERVAL '20 days'),
    (v_school_id, 'Sample Student 4', 4800, CURRENT_DATE - INTERVAL '15 days', 'Paid', CURRENT_DATE - INTERVAL '15 days'),
    (v_school_id, 'Sample Student 5', 5100, CURRENT_DATE - INTERVAL '10 days', 'Paid', CURRENT_DATE - INTERVAL '10 days'),
    (v_school_id, 'Sample Student 6', 4700, CURRENT_DATE - INTERVAL '5 days', 'Paid', CURRENT_DATE - INTERVAL '5 days');

  -- Create sample expenses
  INSERT INTO expenses (school_id, category, description, amount, expense_date, created_at)
  VALUES 
    (v_school_id, 'Utilities', 'Electricity Bill', 2500, CURRENT_DATE - INTERVAL '28 days', CURRENT_DATE - INTERVAL '28 days'),
    (v_school_id, 'Maintenance', 'Classroom Repair', 3000, CURRENT_DATE - INTERVAL '22 days', CURRENT_DATE - INTERVAL '22 days'),
    (v_school_id, 'Supplies', 'Stationery Purchase', 1500, CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '18 days'),
    (v_school_id, 'Utilities', 'Water Bill', 800, CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE - INTERVAL '12 days'),
    (v_school_id, 'Staff', 'Teacher Salary', 15000, CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE - INTERVAL '8 days'),
    (v_school_id, 'Transport', 'Bus Maintenance', 2200, CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days');

  -- Return result
  SELECT json_build_object(
    'school_id', v_school_id,
    'school_name', p_school_name,
    'username', lower(replace(p_school_name, ' ', '')),
    'password', p_phone,
    'message', 'School setup completed successfully!'
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
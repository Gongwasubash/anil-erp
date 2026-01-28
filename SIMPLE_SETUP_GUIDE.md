# Quick Setup Guide for New Schools

## Step 1: Fix Database Structure (if needed)

If you get "column school_id does not exist" error, run this SQL:

```sql
-- Add missing school_id columns
ALTER TABLE batches ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE sections ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE designations ADD COLUMN IF NOT EXISTS school_id UUID;
ALTER TABLE manage_section ADD COLUMN IF NOT EXISTS school_id UUID;
```

## Step 2: Create Setup Function

Run this SQL to create the setup function:

```sql
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
```

## Step 3: Create Your School

### Option A: Using SQL
```sql
SELECT setup_new_school(
  'Your School Name',
  'Director Name',
  '9841234567',
  'admin@yourschool.edu.np'
);
```

### Option B: Using the React Component
1. Use the `NewSchoolSetup` component
2. Fill in the form with your school details
3. Click "Create School"

## Step 4: Login

Use the generated credentials:
- **Username**: schoolname (lowercase, no spaces)
- **Password**: your phone number

## What Gets Created

✅ **School Profile**
- Basic school information
- Login credentials

✅ **Academic Structure**
- Current batch: 2024-2025
- Classes: 1, 2, 3, 4, 5
- Sections: A, B, C

✅ **Subjects**
- English (ENG)
- Nepali (NEP)
- Mathematics (MATH)
- Science (SCI)

✅ **Departments**
- Administration
- Academic

## Next Steps

After setup, you can:
1. Add more classes and sections
2. Add more subjects
3. Set up batch-class-section relationships
4. Add students and employees
5. Configure fee structure

## Troubleshooting

**Error: "column school_id does not exist"**
- Run the Step 1 SQL commands

**Error: "function setup_new_school does not exist"**
- Run the Step 2 SQL commands

**Login issues**
- Username is school name in lowercase with no spaces
- Password is the phone number you provided

That's it! Your school management system is ready to use.
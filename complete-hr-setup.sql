-- Complete setup script for HR module
-- Run this script in order to create all tables and sample data

-- 1. Create departments table first
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    order_no INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample departments
INSERT INTO departments (department_name, short_name, order_no) 
SELECT 'Administrative', 'ADMIN', 1 WHERE NOT EXISTS (SELECT 1 FROM departments WHERE department_name = 'Administrative')
UNION ALL
SELECT 'Academic', 'ACAD', 2 WHERE NOT EXISTS (SELECT 1 FROM departments WHERE department_name = 'Academic')
UNION ALL
SELECT 'Finance', 'FIN', 3 WHERE NOT EXISTS (SELECT 1 FROM departments WHERE department_name = 'Finance')
UNION ALL
SELECT 'Human Resources', 'HR', 4 WHERE NOT EXISTS (SELECT 1 FROM departments WHERE department_name = 'Human Resources')
UNION ALL
SELECT 'IT Support', 'IT', 5 WHERE NOT EXISTS (SELECT 1 FROM departments WHERE department_name = 'IT Support');

-- 2. Create designations table
CREATE TABLE IF NOT EXISTS designations (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    designation_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample designations
INSERT INTO designations (department_id, designation_name, short_name) 
SELECT d.id, v.designation_name, v.short_name
FROM departments d
CROSS JOIN (
    VALUES 
    ('Administrative', 'Principal', 'PRIN'),
    ('Administrative', 'Vice Principal', 'VP'),
    ('Administrative', 'Administrative Officer', 'AO'),
    ('Administrative', 'Office Manager', 'OM'),
    ('Administrative', 'ERP Support', 'ERP'),
    ('Academic', 'Head Teacher', 'HT'),
    ('Academic', 'Senior Teacher', 'ST'),
    ('Academic', 'Subject Teacher', 'SUBJ'),
    ('Academic', 'Class Teacher', 'CT'),
    ('Academic', 'Lab Assistant', 'LA'),
    ('Finance', 'Accountant', 'ACC'),
    ('Finance', 'Finance Manager', 'FM'),
    ('Finance', 'Cashier', 'CASH'),
    ('Finance', 'Auditor', 'AUD'),
    ('Finance', 'Fee Collector', 'FC'),
    ('Human Resources', 'HR Manager', 'HRM'),
    ('Human Resources', 'HR Assistant', 'HRA'),
    ('Human Resources', 'Recruitment Officer', 'RO'),
    ('Human Resources', 'Training Coordinator', 'TC'),
    ('Human Resources', 'Payroll Officer', 'PO')
) AS v(dept_name, designation_name, short_name)
WHERE d.department_name = v.dept_name
AND NOT EXISTS (
    SELECT 1 FROM designations 
    WHERE department_id = d.id AND designation_name = v.designation_name
);

-- 3. Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    designation_id INTEGER REFERENCES designations(id),
    mobile_no VARCHAR(20) NOT NULL,
    home_phone VARCHAR(20),
    office_email VARCHAR(255) NOT NULL,
    personal_email VARCHAR(255) NOT NULL,
    mail_address TEXT,
    country VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    local_address TEXT,
    local_pin_code VARCHAR(20),
    permanent_address TEXT,
    permanent_pin_code VARCHAR(20),
    is_authorise_signatory BOOLEAN DEFAULT FALSE,
    is_waiver BOOLEAN DEFAULT FALSE,
    date_of_joining DATE,
    date_of_birth DATE,
    date_of_anniversary DATE,
    blood_group VARCHAR(10),
    pan_no VARCHAR(50),
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_designation_id ON employees(designation_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(office_email);

-- 4. Insert sample employees (only if they don't exist)
INSERT INTO employees (
    first_name, last_name, department_id, designation_id, mobile_no, home_phone, 
    office_email, personal_email, mail_address, country, state, city, 
    local_address, local_pin_code, permanent_address, permanent_pin_code,
    is_authorise_signatory, is_waiver, date_of_joining, date_of_birth, 
    date_of_anniversary, blood_group, pan_no, gender
)
SELECT 
    v.first_name, v.last_name, d.id, des.id, v.mobile_no, v.home_phone,
    v.office_email, v.personal_email, v.mail_address, v.country, v.state, v.city,
    v.local_address, v.local_pin_code, v.permanent_address, v.permanent_pin_code,
    v.is_authorise_signatory, v.is_waiver, v.date_of_joining::DATE, v.date_of_birth::DATE,
    v.date_of_anniversary::DATE, v.blood_group, v.pan_no, v.gender
FROM (
    VALUES 
    ('Ram', 'Sharma', 'Administrative', 'Principal', '9841234567', '014567890', 'ram.sharma@school.edu.np', 'ram.sharma@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Thamel, Kathmandu', '44600', 'Bhaktapur', '44800', true, false, '2020-01-15', '1975-05-20', '2005-12-10', 'A+', 'PAN123456', 'Male'),
    ('Sita', 'Poudel', 'Administrative', 'Vice Principal', '9851234568', '014567891', 'sita.poudel@school.edu.np', 'sita.poudel@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Patan, Lalitpur', '44700', 'Kathmandu', '44600', false, false, '2019-03-20', '1980-08-15', '2010-06-25', 'B+', 'PAN123457', 'Female'),
    ('Hari', 'Thapa', 'Administrative', 'Administrative Officer', '9861234569', '014567892', 'hari.thapa@school.edu.np', 'hari.thapa@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Durbar Square, Bhaktapur', '44800', 'Lalitpur', '44700', false, true, '2021-07-10', '1985-12-03', '2015-04-18', 'O+', 'PAN123458', 'Male'),
    ('Gita', 'Adhikari', 'Administrative', 'Office Manager', '9871234570', '014567893', 'gita.adhikari@school.edu.np', 'gita.adhikari@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'New Road, Kathmandu', '44600', 'Bhaktapur', '44800', false, false, '2018-09-05', '1982-03-28', '2012-11-14', 'AB+', 'PAN123459', 'Female'),
    ('Krishna', 'Basnet', 'Administrative', 'ERP Support', '9881234571', '014567894', 'krishna.basnet@school.edu.np', 'krishna.basnet@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Jawalakhel, Lalitpur', '44700', 'Kathmandu', '44600', false, false, '2022-02-28', '1990-07-12', '2018-09-22', 'A-', 'PAN123460', 'Male'),
    ('Shyam', 'Regmi', 'Academic', 'Head Teacher', '9891234572', '014567895', 'shyam.regmi@school.edu.np', 'shyam.regmi@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Baneshwor, Kathmandu', '44600', 'Lalitpur', '44700', true, false, '2017-06-12', '1978-11-08', '2008-05-30', 'B-', 'PAN123461', 'Male'),
    ('Kamala', 'Shrestha', 'Academic', 'Senior Teacher', '9801234573', '014567896', 'kamala.shrestha@school.edu.np', 'kamala.shrestha@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Changunarayan, Bhaktapur', '44800', 'Kathmandu', '44600', false, false, '2016-04-18', '1983-02-14', '2011-08-07', 'O-', 'PAN123462', 'Female'),
    ('Mohan', 'Karki', 'Academic', 'Subject Teacher', '9811234574', '014567897', 'mohan.karki@school.edu.np', 'mohan.karki@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Godawari, Lalitpur', '44700', 'Bhaktapur', '44800', false, true, '2019-08-25', '1987-06-19', '2016-03-12', 'AB-', 'PAN123463', 'Male'),
    ('Radha', 'Gurung', 'Academic', 'Class Teacher', '9821234575', '014567898', 'radha.gurung@school.edu.np', 'radha.gurung@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Kirtipur, Kathmandu', '44600', 'Lalitpur', '44700', false, false, '2020-11-30', '1989-09-25', '2017-12-05', 'A+', 'PAN123464', 'Female'),
    ('Bishnu', 'Magar', 'Academic', 'Lab Assistant', '9831234576', '014567899', 'bishnu.magar@school.edu.np', 'bishnu.magar@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Madhyapur, Bhaktapur', '44800', 'Kathmandu', '44600', false, false, '2021-01-20', '1991-04-10', '2019-07-28', 'B+', 'PAN123465', 'Male')
) AS v(first_name, last_name, dept_name, desig_name, mobile_no, home_phone, office_email, personal_email, mail_address, country, state, city, local_address, local_pin_code, permanent_address, permanent_pin_code, is_authorise_signatory, is_waiver, date_of_joining, date_of_birth, date_of_anniversary, blood_group, pan_no, gender)
JOIN departments d ON d.department_name = v.dept_name
JOIN designations des ON des.department_id = d.id AND des.designation_name = v.desig_name
WHERE NOT EXISTS (
    SELECT 1 FROM employees WHERE office_email = v.office_email
);
-- Create designations table
CREATE TABLE IF NOT EXISTS designations (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    designation_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_designations_department_id ON designations(department_id);
CREATE INDEX IF NOT EXISTS idx_designations_name ON designations(designation_name);

-- Insert 20 sample designations across different departments
INSERT INTO designations (department_id, designation_name, short_name) 
SELECT 
    (SELECT id FROM departments WHERE department_name = 'Administrative'),
    designation_name,
    short_name
FROM (VALUES 
    ('Principal', 'PRIN'),
    ('Vice Principal', 'VP'),
    ('Administrative Officer', 'AO'),
    ('Office Manager', 'OM'),
    ('ERP Support', 'ERP')
) AS admin_designations(designation_name, short_name)
UNION ALL
SELECT 
    (SELECT id FROM departments WHERE department_name = 'Academic'),
    designation_name,
    short_name
FROM (VALUES 
    ('Head Teacher', 'HT'),
    ('Senior Teacher', 'ST'),
    ('Subject Teacher', 'SUBJ'),
    ('Class Teacher', 'CT'),
    ('Lab Assistant', 'LA')
) AS academic_designations(designation_name, short_name)
UNION ALL
SELECT 
    (SELECT id FROM departments WHERE department_name = 'Finance'),
    designation_name,
    short_name
FROM (VALUES 
    ('Accountant', 'ACC'),
    ('Finance Manager', 'FM'),
    ('Cashier', 'CASH'),
    ('Auditor', 'AUD'),
    ('Fee Collector', 'FC')
) AS finance_designations(designation_name, short_name)
UNION ALL
SELECT 
    (SELECT id FROM departments WHERE department_name = 'Human Resources'),
    designation_name,
    short_name
FROM (VALUES 
    ('HR Manager', 'HRM'),
    ('HR Assistant', 'HRA'),
    ('Recruitment Officer', 'RO'),
    ('Training Coordinator', 'TC'),
    ('Payroll Officer', 'PO')
) AS hr_designations(designation_name, short_name);
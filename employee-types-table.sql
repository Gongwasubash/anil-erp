-- Create employee_types table
CREATE TABLE IF NOT EXISTS employee_types (
    id SERIAL PRIMARY KEY,
    order_no INTEGER NOT NULL,
    employee_type_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    description TEXT,
    school_id UUID REFERENCES schools(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_employee_types_order_no ON employee_types(order_no);
CREATE INDEX IF NOT EXISTS idx_employee_types_name ON employee_types(employee_type_name);
CREATE INDEX IF NOT EXISTS idx_employee_types_school_id ON employee_types(school_id);

-- Insert sample employee types
INSERT INTO employee_types (order_no, employee_type_name, short_name, description) VALUES
(1, 'Full Time', 'FT', 'Full-time permanent employees'),
(2, 'Part Time', 'PT', 'Part-time employees'),
(3, 'Contract', 'CT', 'Contract-based employees'),
(4, 'Temporary', 'TEMP', 'Temporary employees'),
(5, 'Intern', 'INT', 'Internship positions');
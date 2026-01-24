-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    order_no INTEGER NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    about_department TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_departments_order_no ON departments(order_no);
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(department_name);

-- Insert sample departments
INSERT INTO departments (order_no, department_name, short_name, about_department) VALUES
(1, 'Administrative', 'Admin', 'Handles administrative tasks and management'),
(2, 'Academic', 'Acad', 'Manages academic programs and curriculum'),
(3, 'Finance', 'Fin', 'Handles financial operations and accounting'),
(4, 'Human Resources', 'HR', 'Manages staff recruitment and employee relations'),
(5, 'Information Technology', 'IT', 'Manages technology infrastructure and systems');
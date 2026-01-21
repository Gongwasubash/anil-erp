-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create batches table  
CREATE TABLE IF NOT EXISTS batches (
    id SERIAL PRIMARY KEY,
    batch_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO schools (school_name) VALUES
('NORMAL MAX TEST ADMIN')
ON CONFLICT DO NOTHING;

INSERT INTO batches (batch_name) VALUES
('2080'),
('2081'),
('2082')
ON CONFLICT DO NOTHING;

INSERT INTO classes (class_name) VALUES
('Class 1'),
('Class 2'),
('Class 3'),
('Class 4'),
('Class 5'),
('Class 6'),
('Class 7'),
('Class 8'),
('Class 9'),
('Class 10')
ON CONFLICT DO NOTHING;

INSERT INTO sections (section_name) VALUES
('A'),
('B'),
('C')
ON CONFLICT DO NOTHING;
-- Create branches table for school ERP
CREATE TABLE branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_name VARCHAR NOT NULL,
  country VARCHAR DEFAULT 'Nepal',
  state VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  phone_no VARCHAR,
  address TEXT,
  email VARCHAR,
  website_url VARCHAR,
  short_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO branches (branch_name, country, state, city, phone_no, address, email, website_url, short_name) VALUES
('Main Campus', 'Nepal', 'Bagmati Province', 'Kathmandu', '+977-1-4444444', 'Thamel, Kathmandu', 'main@everest.edu.np', 'https://everest.edu.np', 'MAIN'),
('Secondary Campus', 'Nepal', 'Gandaki Province', 'Pokhara', '+977-61-555555', 'Lakeside, Pokhara', 'pokhara@everest.edu.np', 'https://pokhara.everest.edu.np', 'SEC');
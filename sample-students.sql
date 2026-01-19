-- Insert sample students for testing
INSERT INTO students (
  school_id, batch_id, class_id, section_id, roll_no, first_name, last_name, 
  father_name, mother_name, mobile1, status, academic_year
) VALUES
-- Class 1 students
('1', '1', '1', '1', '1', 'Ram', 'Sharma', 'Krishna Sharma', 'Sita Sharma', '9841234567', 'Active', '2080'),
('1', '1', '1', '1', '2', 'Shyam', 'Thapa', 'Hari Thapa', 'Gita Thapa', '9841234568', 'Active', '2080'),
('1', '1', '1', '2', '1', 'Gita', 'Poudel', 'Mohan Poudel', 'Rita Poudel', '9841234569', 'Active', '2080'),
('1', '1', '1', '2', '2', 'Rita', 'Gurung', 'Bahadur Gurung', 'Maya Gurung', '9841234570', 'Active', '2080'),
('1', '1', '1', '3', '1', 'Hari', 'Magar', 'Dhan Magar', 'Kamala Magar', '9841234571', 'Active', '2080'),

-- Class 2 students  
('1', '1', '2', '1', '1', 'Sita', 'Rai', 'Kumar Rai', 'Sunita Rai', '9841234572', 'Active', '2080'),
('1', '1', '2', '1', '2', 'Maya', 'Limbu', 'Pemba Limbu', 'Dolma Limbu', '9841234573', 'Active', '2080'),
('1', '1', '2', '2', '1', 'Raju', 'Tamang', 'Laxman Tamang', 'Purnima Tamang', '9841234574', 'Active', '2080'),
('1', '1', '2', '2', '2', 'Kamala', 'Shrestha', 'Gopal Shrestha', 'Radha Shrestha', '9841234575', 'Active', '2080'),
('1', '1', '2', '3', '1', 'Bikash', 'Adhikari', 'Ram Adhikari', 'Laxmi Adhikari', '9841234576', 'Active', '2080');
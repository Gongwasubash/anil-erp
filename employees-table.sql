-- Create employees table
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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_designation_id ON employees(designation_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(office_email);

-- Insert 30 sample employees
INSERT INTO employees (
    first_name, last_name, department_id, designation_id, mobile_no, home_phone, 
    office_email, personal_email, mail_address, country, state, city, 
    local_address, local_pin_code, permanent_address, permanent_pin_code,
    is_authorise_signatory, is_waiver, date_of_joining, date_of_birth, 
    date_of_anniversary, blood_group, pan_no, gender
) VALUES
-- Administrative Department Staff
('Ram', 'Sharma', 1, 1, '9841234567', '014567890', 'ram.sharma@school.edu.np', 'ram.sharma@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Thamel, Kathmandu', '44600', 'Bhaktapur', '44800', true, false, '2020-01-15', '1975-05-20', '2005-12-10', 'A+', 'PAN123456', 'Male'),
('Sita', 'Poudel', 1, 2, '9851234568', '014567891', 'sita.poudel@school.edu.np', 'sita.poudel@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Patan, Lalitpur', '44700', 'Kathmandu', '44600', false, false, '2019-03-20', '1980-08-15', '2010-06-25', 'B+', 'PAN123457', 'Female'),
('Hari', 'Thapa', 1, 3, '9861234569', '014567892', 'hari.thapa@school.edu.np', 'hari.thapa@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Durbar Square, Bhaktapur', '44800', 'Lalitpur', '44700', false, true, '2021-07-10', '1985-12-03', '2015-04-18', 'O+', 'PAN123458', 'Male'),
('Gita', 'Adhikari', 1, 4, '9871234570', '014567893', 'gita.adhikari@school.edu.np', 'gita.adhikari@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'New Road, Kathmandu', '44600', 'Bhaktapur', '44800', false, false, '2018-09-05', '1982-03-28', '2012-11-14', 'AB+', 'PAN123459', 'Female'),
('Krishna', 'Basnet', 1, 5, '9881234571', '014567894', 'krishna.basnet@school.edu.np', 'krishna.basnet@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Jawalakhel, Lalitpur', '44700', 'Kathmandu', '44600', false, false, '2022-02-28', '1990-07-12', '2018-09-22', 'A-', 'PAN123460', 'Male'),

-- Academic Department Staff
('Shyam', 'Regmi', 2, 6, '9891234572', '014567895', 'shyam.regmi@school.edu.np', 'shyam.regmi@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Baneshwor, Kathmandu', '44600', 'Lalitpur', '44700', true, false, '2017-06-12', '1978-11-08', '2008-05-30', 'B-', 'PAN123461', 'Male'),
('Kamala', 'Shrestha', 2, 7, '9801234573', '014567896', 'kamala.shrestha@school.edu.np', 'kamala.shrestha@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Changunarayan, Bhaktapur', '44800', 'Kathmandu', '44600', false, false, '2016-04-18', '1983-02-14', '2011-08-07', 'O-', 'PAN123462', 'Female'),
('Mohan', 'Karki', 2, 8, '9811234574', '014567897', 'mohan.karki@school.edu.np', 'mohan.karki@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Godawari, Lalitpur', '44700', 'Bhaktapur', '44800', false, true, '2019-08-25', '1987-06-19', '2016-03-12', 'AB-', 'PAN123463', 'Male'),
('Radha', 'Gurung', 2, 9, '9821234575', '014567898', 'radha.gurung@school.edu.np', 'radha.gurung@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Kirtipur, Kathmandu', '44600', 'Lalitpur', '44700', false, false, '2020-11-30', '1989-09-25', '2017-12-05', 'A+', 'PAN123464', 'Female'),
('Bishnu', 'Magar', 2, 10, '9831234576', '014567899', 'bishnu.magar@school.edu.np', 'bishnu.magar@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Madhyapur, Bhaktapur', '44800', 'Kathmandu', '44600', false, false, '2021-01-20', '1991-04-10', '2019-07-28', 'B+', 'PAN123465', 'Male'),

-- Finance Department Staff
('Laxmi', 'Tamang', 3, 11, '9841234577', '014567800', 'laxmi.tamang@school.edu.np', 'laxmi.tamang@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Imadol, Lalitpur', '44700', 'Bhaktapur', '44800', true, false, '2018-05-14', '1984-01-22', '2013-10-16', 'O+', 'PAN123466', 'Female'),
('Ganesh', 'Rai', 3, 12, '9851234578', '014567801', 'ganesh.rai@school.edu.np', 'ganesh.rai@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Balaju, Kathmandu', '44600', 'Lalitpur', '44700', false, false, '2019-12-08', '1986-10-05', '2015-02-20', 'A-', 'PAN123467', 'Male'),
('Sarita', 'Limbu', 3, 13, '9861234579', '014567802', 'sarita.limbu@school.edu.np', 'sarita.limbu@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Suryabinayak, Bhaktapur', '44800', 'Kathmandu', '44600', false, true, '2020-03-22', '1988-12-18', '2016-09-11', 'B-', 'PAN123468', 'Female'),
('Raju', 'Sherpa', 3, 14, '9871234580', '014567803', 'raju.sherpa@school.edu.np', 'raju.sherpa@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Lubhu, Lalitpur', '44700', 'Bhaktapur', '44800', false, false, '2017-10-15', '1981-07-30', '2009-04-25', 'AB+', 'PAN123469', 'Male'),
('Sunita', 'Thakuri', 3, 15, '9881234581', '014567804', 'sunita.thakuri@school.edu.np', 'sunita.thakuri@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Chabahil, Kathmandu', '44600', 'Lalitpur', '44700', false, false, '2021-06-18', '1992-05-08', '2020-01-30', 'O-', 'PAN123470', 'Female'),

-- HR Department Staff
('Prakash', 'Neupane', 4, 16, '9891234582', '014567805', 'prakash.neupane@school.edu.np', 'prakash.neupane@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Thimi, Bhaktapur', '44800', 'Kathmandu', '44600', true, false, '2016-08-12', '1979-03-15', '2007-11-28', 'A+', 'PAN123471', 'Male'),
('Mina', 'Khadka', 4, 17, '9801234583', '014567806', 'mina.khadka@school.edu.np', 'mina.khadka@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Satdobato, Lalitpur', '44700', 'Bhaktapur', '44800', false, false, '2018-12-05', '1985-08-20', '2014-06-15', 'B+', 'PAN123472', 'Female'),
('Dipak', 'Chhetri', 4, 18, '9811234584', '014567807', 'dipak.chhetri@school.edu.np', 'dipak.chhetri@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Gongabu, Kathmandu', '44600', 'Lalitpur', '44700', false, true, '2019-04-28', '1987-11-12', '2016-08-03', 'O+', 'PAN123473', 'Male'),
('Anita', 'Bhandari', 4, 19, '9821234585', '014567808', 'anita.bhandari@school.edu.np', 'anita.bhandari@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Nagarkot, Bhaktapur', '44800', 'Kathmandu', '44600', false, false, '2020-09-10', '1990-01-28', '2018-12-20', 'A-', 'PAN123474', 'Female'),
('Suresh', 'Dahal', 4, 20, '9831234586', '014567809', 'suresh.dahal@school.edu.np', 'suresh.dahal@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Khokana, Lalitpur', '44700', 'Bhaktapur', '44800', false, false, '2021-11-25', '1993-06-14', '2021-03-08', 'B-', 'PAN123475', 'Male'),

-- Additional Academic Staff
('Maya', 'Joshi', 2, 8, '9841234587', '014567810', 'maya.joshi@school.edu.np', 'maya.joshi@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Maharajgunj, Kathmandu', '44600', 'Lalitpur', '44700', false, false, '2017-02-14', '1982-09-18', '2010-05-12', 'AB+', 'PAN123476', 'Female'),
('Rajesh', 'Pandey', 2, 9, '9851234588', '014567811', 'rajesh.pandey@school.edu.np', 'rajesh.pandey@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Katunje, Bhaktapur', '44800', 'Kathmandu', '44600', false, true, '2018-07-20', '1984-12-25', '2012-09-30', 'O-', 'PAN123477', 'Male'),
('Puja', 'Acharya', 2, 10, '9861234589', '014567812', 'puja.acharya@school.edu.np', 'puja.acharya@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Bungamati, Lalitpur', '44700', 'Bhaktapur', '44800', false, false, '2019-01-18', '1986-04-07', '2014-11-22', 'A+', 'PAN123478', 'Female'),
('Nabin', 'Koirala', 2, 8, '9871234590', '014567813', 'nabin.koirala@school.edu.np', 'nabin.koirala@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Dillibazar, Kathmandu', '44600', 'Lalitpur', '44700', false, false, '2020-05-30', '1988-08-11', '2017-01-15', 'B+', 'PAN123479', 'Male'),
('Rekha', 'Ghimire', 2, 9, '9881234591', '014567814', 'rekha.ghimire@school.edu.np', 'rekha.ghimire@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Balkot, Bhaktapur', '44800', 'Kathmandu', '44600', false, true, '2021-03-12', '1991-02-20', '2019-08-05', 'O+', 'PAN123480', 'Female'),

-- Additional Administrative Staff
('Binod', 'Upreti', 1, 4, '9891234592', '014567815', 'binod.upreti@school.edu.np', 'binod.upreti@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Chapagaun, Lalitpur', '44700', 'Bhaktapur', '44800', false, false, '2018-10-08', '1983-05-16', '2011-12-18', 'A-', 'PAN123481', 'Male'),
('Sabita', 'Bhatta', 1, 5, '9801234593', '014567816', 'sabita.bhatta@school.edu.np', 'sabita.bhatta@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Tokha, Kathmandu', '44600', 'Lalitpur', '44700', false, false, '2019-06-22', '1985-10-30', '2013-07-14', 'B-', 'PAN123482', 'Female'),
('Ramesh', 'Silwal', 1, 3, '9811234594', '014567817', 'ramesh.silwal@school.edu.np', 'ramesh.silwal@gmail.com', 'Bhaktapur', 'Nepal', 'Bagmati', 'Bhaktapur', 'Sipadol, Bhaktapur', '44800', 'Kathmandu', '44600', true, false, '2020-08-15', '1987-01-05', '2015-04-28', 'AB-', 'PAN123483', 'Male'),
('Nirmala', 'Devkota', 3, 13, '9821234595', '014567818', 'nirmala.devkota@school.edu.np', 'nirmala.devkota@gmail.com', 'Lalitpur', 'Nepal', 'Bagmati', 'Lalitpur', 'Tikathali, Lalitpur', '44700', 'Bhaktapur', '44800', false, true, '2021-12-10', '1989-07-22', '2018-02-10', 'A+', 'PAN123484', 'Female'),
('Kiran', 'Maharjan', 3, 15, '9831234596', '014567819', 'kiran.maharjan@school.edu.np', 'kiran.maharjan@gmail.com', 'Kathmandu', 'Nepal', 'Bagmati', 'Kathmandu', 'Swayambhu, Kathmandu', '44600', 'Lalitpur', '44700', false, false, '2017-09-28', '1980-12-08', '2008-10-25', 'B+', 'PAN123485', 'Male');
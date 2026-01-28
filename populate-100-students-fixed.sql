-- Insert 100 sample students with required fields
INSERT INTO students (
    first_name, last_name, class, section, roll_no, father_name, mother_name, father_mobile1, 
    academic_year, status, dob_ad, gender, p_address1
) VALUES
-- Class 1 Students (10 students)
('Aarav', 'Sharma', '1', 'A', '001', 'Rajesh Sharma', 'Sita Sharma', '9841234567', '2024-25', 'Active', '2017-05-15', 'Male', 'Kathmandu'),
('Aadhya', 'Poudel', '1', 'A', '002', 'Ram Poudel', 'Sita Poudel', '9851234568', '2024-25', 'Active', '2017-08-20', 'Female', 'Lalitpur'),
('Arjun', 'Thapa', '1', 'A', '003', 'Hari Thapa', 'Maya Thapa', '9861234569', '2024-25', 'Active', '2017-03-10', 'Male', 'Bhaktapur'),
('Ananya', 'Adhikari', '1', 'A', '004', 'Krishna Adhikari', 'Gita Adhikari', '9871234570', '2024-25', 'Active', '2017-12-05', 'Female', 'Kathmandu'),
('Ayush', 'Basnet', '1', 'A', '005', 'Shyam Basnet', 'Kamala Basnet', '9881234571', '2024-25', 'Active', '2017-07-18', 'Male', 'Lalitpur'),
('Aisha', 'Regmi', '1', 'B', '006', 'Mohan Regmi', 'Radha Regmi', '9891234572', '2024-25', 'Active', '2017-09-22', 'Female', 'Bhaktapur'),
('Aditya', 'Shrestha', '1', 'B', '007', 'Bishnu Shrestha', 'Laxmi Shrestha', '9801234573', '2024-25', 'Active', '2017-04-14', 'Male', 'Kathmandu'),
('Avni', 'Karki', '1', 'B', '008', 'Ganesh Karki', 'Sarita Karki', '9811234574', '2024-25', 'Active', '2017-11-30', 'Female', 'Lalitpur'),
('Arnav', 'Gurung', '1', 'B', '009', 'Raju Gurung', 'Sunita Gurung', '9821234575', '2024-25', 'Active', '2017-06-08', 'Male', 'Bhaktapur'),
('Aria', 'Magar', '1', 'B', '010', 'Prakash Magar', 'Mina Magar', '9831234576', '2024-25', 'Active', '2017-10-12', 'Female', 'Kathmandu'),

-- Class 2 Students (10 students)
('Bikash', 'Tamang', '2', 'A', '011', 'Dipak Tamang', 'Anita Tamang', '9841234577', '2024-25', 'Active', '2016-05-25', 'Male', 'Lalitpur'),
('Bina', 'Rai', '2', 'A', '012', 'Suresh Rai', 'Maya Rai', '9851234578', '2024-25', 'Active', '2016-08-15', 'Female', 'Bhaktapur'),
('Binod', 'Limbu', '2', 'A', '013', 'Rajesh Limbu', 'Sabita Limbu', '9861234579', '2024-25', 'Active', '2016-03-20', 'Male', 'Kathmandu'),
('Binita', 'Sherpa', '2', 'A', '014', 'Ramesh Sherpa', 'Nirmala Sherpa', '9871234580', '2024-25', 'Active', '2016-12-10', 'Female', 'Lalitpur'),
('Bishal', 'Thakuri', '2', 'A', '015', 'Kiran Thakuri', 'Rekha Thakuri', '9881234581', '2024-25', 'Active', '2016-07-28', 'Male', 'Bhaktapur'),
('Bishika', 'Neupane', '2', 'B', '016', 'Binod Neupane', 'Puja Neupane', '9891234582', '2024-25', 'Active', '2016-09-18', 'Female', 'Kathmandu'),
('Bipin', 'Khadka', '2', 'B', '017', 'Nabin Khadka', 'Chhaya Khadka', '9801234583', '2024-25', 'Active', '2016-04-05', 'Male', 'Lalitpur'),
('Bipana', 'Chhetri', '2', 'B', '018', 'Chetan Chhetri', 'Chhavi Chhetri', '9811234584', '2024-25', 'Active', '2016-11-22', 'Female', 'Bhaktapur'),
('Biraj', 'Bhandari', '2', 'B', '019', 'Chintan Bhandari', 'Chinu Bhandari', '9821234585', '2024-25', 'Active', '2016-06-14', 'Male', 'Kathmandu'),
('Bisha', 'Dahal', '2', 'B', '020', 'Deepak Dahal', 'Deepika Dahal', '9831234586', '2024-25', 'Active', '2016-10-08', 'Female', 'Lalitpur'),

-- Class 3 Students (10 students)
('Chandan', 'Joshi', '3', 'A', '021', 'Dipesh Joshi', 'Dipika Joshi', '9841234587', '2024-25', 'Active', '2015-05-12', 'Male', 'Bhaktapur'),
('Chandani', 'Pandey', '3', 'A', '022', 'Dipen Pandey', 'Disha Pandey', '9851234588', '2024-25', 'Active', '2015-08-30', 'Female', 'Kathmandu'),
('Chirag', 'Acharya', '3', 'A', '023', 'Dishan Acharya', 'Divya Acharya', '9861234589', '2024-25', 'Active', '2015-03-18', 'Male', 'Lalitpur'),
('Chitra', 'Koirala', '3', 'A', '024', 'Diwakar Koirala', 'Dixya Koirala', '9871234590', '2024-25', 'Active', '2015-12-25', 'Female', 'Bhaktapur'),
('Chiran', 'Ghimire', '3', 'A', '025', 'Elina Ghimire', 'Eshan Ghimire', '9881234591', '2024-25', 'Active', '2015-07-08', 'Male', 'Kathmandu'),
('Chhaya', 'Upreti', '3', 'B', '026', 'Eva Upreti', 'Evan Upreti', '9891234592', '2024-25', 'Active', '2015-09-15', 'Female', 'Lalitpur'),
('Chetan', 'Bhatta', '3', 'B', '027', 'Evana Bhatta', 'Ewan Bhatta', '9801234593', '2024-25', 'Active', '2015-04-22', 'Male', 'Bhaktapur'),
('Chhavi', 'Silwal', '3', 'B', '028', 'Ewana Silwal', 'Eyush Silwal', '9811234594', '2024-25', 'Active', '2015-11-10', 'Female', 'Kathmandu'),
('Chintan', 'Devkota', '3', 'B', '029', 'Eyusha Devkota', 'Ezra Devkota', '9821234595', '2024-25', 'Active', '2015-06-28', 'Male', 'Lalitpur'),
('Chinu', 'Maharjan', '3', 'B', '030', 'Fabian Maharjan', 'Falguni Maharjan', '9831234596', '2024-25', 'Active', '2015-10-16', 'Female', 'Bhaktapur'),

-- Class 4 Students (10 students)
('Deepak', 'Shrestha', '4', 'A', '031', 'Farhan Shrestha', 'Farhana Shrestha', '9841234597', '2024-25', 'Active', '2014-05-20', 'Male', 'Kathmandu'),
('Deepika', 'Pradhan', '4', 'A', '032', 'Felix Pradhan', 'Fiona Pradhan', '9851234598', '2024-25', 'Active', '2014-08-12', 'Female', 'Lalitpur'),
('Dipesh', 'Manandhar', '4', 'A', '033', 'Francis Manandhar', 'Freya Manandhar', '9861234599', '2024-25', 'Active', '2014-03-28', 'Male', 'Bhaktapur'),
('Dipika', 'Bajracharya', '4', 'A', '034', 'Gabriel Bajracharya', 'Garima Bajracharya', '9871234600', '2024-25', 'Active', '2014-12-15', 'Female', 'Kathmandu'),
('Dipen', 'Shakya', '4', 'A', '035', 'Gaurav Shakya', 'Gauravi Shakya', '9881234601', '2024-25', 'Active', '2014-07-05', 'Male', 'Lalitpur'),
('Disha', 'Tuladhar', '4', 'B', '036', 'Giriraj Tuladhar', 'Gita Tuladhar', '9891234602', '2024-25', 'Active', '2014-09-22', 'Female', 'Bhaktapur'),
('Dishan', 'Joshi', '4', 'B', '037', 'Gopal Joshi', 'Grishma Joshi', '9801234603', '2024-25', 'Active', '2014-04-18', 'Male', 'Kathmandu'),
('Divya', 'Karmacharya', '4', 'B', '038', 'Gunjan Karmacharya', 'Gunjana Karmacharya', '9811234604', '2024-25', 'Active', '2014-11-08', 'Female', 'Lalitpur'),
('Diwakar', 'Maharjan', '4', 'B', '039', 'Guru Maharjan', 'Gyanu Maharjan', '9821234605', '2024-25', 'Active', '2014-06-25', 'Male', 'Bhaktapur'),
('Dixya', 'Dangol', '4', 'B', '040', 'Hari Dangol', 'Harini Dangol', '9831234606', '2024-25', 'Active', '2014-10-12', 'Female', 'Kathmandu'),

-- Class 5 Students (10 students)
('Elina', 'Thapa', '5', 'A', '041', 'Hemant Thapa', 'Hema Thapa', '9841234607', '2024-25', 'Active', '2013-05-15', 'Female', 'Lalitpur'),
('Eshan', 'Rai', '5', 'A', '042', 'Himal Rai', 'Himani Rai', '9851234608', '2024-25', 'Active', '2013-08-28', 'Male', 'Bhaktapur'),
('Eva', 'Limbu', '5', 'A', '043', 'Hitesh Limbu', 'Hritika Limbu', '9861234609', '2024-25', 'Active', '2013-03-10', 'Female', 'Kathmandu'),
('Evan', 'Sherpa', '5', 'A', '044', 'Hrithik Sherpa', 'Hritisha Sherpa', '9871234610', '2024-25', 'Active', '2013-12-22', 'Male', 'Lalitpur'),
('Evana', 'Thakuri', '5', 'A', '045', 'Ishan Thakuri', 'Ishani Thakuri', '9881234611', '2024-25', 'Active', '2013-07-18', 'Female', 'Bhaktapur'),
('Ewan', 'Neupane', '5', 'B', '046', 'Ishwar Neupane', 'Ishwari Neupane', '9891234612', '2024-25', 'Active', '2013-09-05', 'Male', 'Kathmandu'),
('Ewana', 'Khadka', '5', 'B', '047', 'Ivan Khadka', 'Ivana Khadka', '9801234613', '2024-25', 'Active', '2013-04-25', 'Female', 'Lalitpur'),
('Eyush', 'Chhetri', '5', 'B', '048', 'Jagan Chhetri', 'Jagdish Chhetri', '9811234614', '2024-25', 'Active', '2013-11-12', 'Male', 'Bhaktapur'),
('Eyusha', 'Bhandari', '5', 'B', '049', 'Janaki Bhandari', 'Janak Bhandari', '9821234615', '2024-25', 'Active', '2013-06-08', 'Female', 'Kathmandu'),
('Ezra', 'Dahal', '5', 'B', '050', 'Kabir Dahal', 'Kabita Dahal', '9831234616', '2024-25', 'Active', '2013-10-30', 'Male', 'Lalitpur'),

-- Class 6 Students (10 students)
('Fabian', 'Joshi', '6', 'A', '051', 'Kailash Joshi', 'Kalpana Joshi', '9841234617', '2024-25', 'Active', '2012-05-08', 'Male', 'Bhaktapur'),
('Falguni', 'Pandey', '6', 'A', '052', 'Kamal Pandey', 'Kamana Pandey', '9851234618', '2024-25', 'Active', '2012-08-20', 'Female', 'Kathmandu'),
('Farhan', 'Acharya', '6', 'A', '053', 'Kiran Acharya', 'Kirana Acharya', '9861234619', '2024-25', 'Active', '2012-03-15', 'Male', 'Lalitpur'),
('Farhana', 'Koirala', '6', 'A', '054', 'Krishna Koirala', 'Kriti Koirala', '9871234620', '2024-25', 'Active', '2012-12-18', 'Female', 'Bhaktapur'),
('Felix', 'Ghimire', '6', 'A', '055', 'Laxman Ghimire', 'Laxmi Ghimire', '9881234621', '2024-25', 'Active', '2012-07-25', 'Male', 'Kathmandu'),
('Fiona', 'Upreti', '6', 'B', '056', 'Mahesh Upreti', 'Manju Upreti', '9891234622', '2024-25', 'Active', '2012-09-12', 'Female', 'Lalitpur'),
('Francis', 'Bhatta', '6', 'B', '057', 'Manoj Bhatta', 'Meera Bhatta', '9801234623', '2024-25', 'Active', '2012-04-28', 'Male', 'Bhaktapur'),
('Freya', 'Silwal', '6', 'B', '058', 'Milan Silwal', 'Mina Silwal', '9811234624', '2024-25', 'Active', '2012-11-05', 'Female', 'Kathmandu'),
('Gabriel', 'Devkota', '6', 'B', '059', 'Nabin Devkota', 'Nirmala Devkota', '9821234625', '2024-25', 'Active', '2012-06-22', 'Male', 'Lalitpur'),
('Garima', 'Maharjan', '6', 'B', '060', 'Padam Maharjan', 'Parvati Maharjan', '9831234626', '2024-25', 'Active', '2012-10-15', 'Female', 'Bhaktapur'),

-- Class 7 Students (10 students)
('Gaurav', 'Shrestha', '7', 'A', '061', 'Pradip Shrestha', 'Pramila Shrestha', '9841234627', '2024-25', 'Active', '2011-05-12', 'Male', 'Kathmandu'),
('Gauravi', 'Pradhan', '7', 'A', '062', 'Prashant Pradhan', 'Preeti Pradhan', '9851234628', '2024-25', 'Active', '2011-08-25', 'Female', 'Lalitpur'),
('Giriraj', 'Manandhar', '7', 'A', '063', 'Rabindra Manandhar', 'Radha Manandhar', '9861234629', '2024-25', 'Active', '2011-03-18', 'Male', 'Bhaktapur'),
('Gita', 'Bajracharya', '7', 'A', '064', 'Rajesh Bajracharya', 'Rama Bajracharya', '9871234630', '2024-25', 'Active', '2011-12-08', 'Female', 'Kathmandu'),
('Gopal', 'Shakya', '7', 'A', '065', 'Ramesh Shakya', 'Renu Shakya', '9881234631', '2024-25', 'Active', '2011-07-15', 'Male', 'Lalitpur'),
('Grishma', 'Tuladhar', '7', 'B', '066', 'Rishi Tuladhar', 'Rita Tuladhar', '9891234632', '2024-25', 'Active', '2011-09-28', 'Female', 'Bhaktapur'),
('Gunjan', 'Joshi', '7', 'B', '067', 'Roshan Joshi', 'Roshani Joshi', '9801234633', '2024-25', 'Active', '2011-04-10', 'Male', 'Kathmandu'),
('Gunjana', 'Karmacharya', '7', 'B', '068', 'Sagar Karmacharya', 'Sagun Karmacharya', '9811234634', '2024-25', 'Active', '2011-11-22', 'Female', 'Lalitpur'),
('Guru', 'Maharjan', '7', 'B', '069', 'Sandip Maharjan', 'Sangita Maharjan', '9821234635', '2024-25', 'Active', '2011-06-05', 'Male', 'Bhaktapur'),
('Gyanu', 'Dangol', '7', 'B', '070', 'Santosh Dangol', 'Saraswati Dangol', '9831234636', '2024-25', 'Active', '2011-10-18', 'Female', 'Kathmandu'),

-- Class 8 Students (10 students)
('Hari', 'Thapa', '8', 'A', '071', 'Shiva Thapa', 'Shanti Thapa', '9841234637', '2024-25', 'Active', '2010-05-20', 'Male', 'Lalitpur'),
('Harini', 'Rai', '8', 'A', '072', 'Subash Rai', 'Sujata Rai', '9851234638', '2024-25', 'Active', '2010-08-15', 'Female', 'Bhaktapur'),
('Hemant', 'Limbu', '8', 'A', '073', 'Sujan Limbu', 'Suman Limbu', '9861234639', '2024-25', 'Active', '2010-03-28', 'Male', 'Kathmandu'),
('Hema', 'Sherpa', '8', 'A', '074', 'Surya Sherpa', 'Susma Sherpa', '9871234640', '2024-25', 'Active', '2010-12-12', 'Female', 'Lalitpur'),
('Himal', 'Thakuri', '8', 'A', '075', 'Tilak Thakuri', 'Tika Thakuri', '9881234641', '2024-25', 'Active', '2010-07-08', 'Male', 'Bhaktapur'),
('Himani', 'Neupane', '8', 'B', '076', 'Umesh Neupane', 'Uma Neupane', '9891234642', '2024-25', 'Active', '2010-09-25', 'Female', 'Kathmandu'),
('Hitesh', 'Khadka', '8', 'B', '077', 'Vijay Khadka', 'Vinita Khadka', '9801234643', '2024-25', 'Active', '2010-04-18', 'Male', 'Lalitpur'),
('Hritika', 'Chhetri', '8', 'B', '078', 'Yam Chhetri', 'Yamuna Chhetri', '9811234644', '2024-25', 'Active', '2010-11-30', 'Female', 'Bhaktapur'),
('Hrithik', 'Bhandari', '8', 'B', '079', 'Yash Bhandari', 'Yasoda Bhandari', '9821234645', '2024-25', 'Active', '2010-06-15', 'Male', 'Kathmandu'),
('Hritisha', 'Dahal', '8', 'B', '080', 'Yubraj Dahal', 'Yuna Dahal', '9831234646', '2024-25', 'Active', '2010-10-22', 'Female', 'Lalitpur'),

-- Class 9 Students (10 students)
('Ishan', 'Joshi', '9', 'A', '081', 'Aakash Joshi', 'Aarati Joshi', '9841234647', '2024-25', 'Active', '2009-05-18', 'Male', 'Bhaktapur'),
('Ishani', 'Pandey', '9', 'A', '082', 'Abhishek Pandey', 'Anita Pandey', '9851234648', '2024-25', 'Active', '2009-08-10', 'Female', 'Kathmandu'),
('Ishwar', 'Acharya', '9', 'A', '083', 'Ajay Acharya', 'Anjana Acharya', '9861234649', '2024-25', 'Active', '2009-03-25', 'Male', 'Lalitpur'),
('Ishwari', 'Koirala', '9', 'A', '084', 'Anil Koirala', 'Anuja Koirala', '9871234650', '2024-25', 'Active', '2009-12-05', 'Female', 'Bhaktapur'),
('Ivan', 'Ghimire', '9', 'A', '085', 'Arjun Ghimire', 'Asha Ghimire', '9881234651', '2024-25', 'Active', '2009-07-22', 'Male', 'Kathmandu'),
('Ivana', 'Upreti', '9', 'B', '086', 'Ashok Upreti', 'Bina Upreti', '9891234652', '2024-25', 'Active', '2009-09-15', 'Female', 'Lalitpur'),
('Jagan', 'Bhatta', '9', 'B', '087', 'Bikram Bhatta', 'Bindu Bhatta', '9801234653', '2024-25', 'Active', '2009-04-12', 'Male', 'Bhaktapur'),
('Jagdish', 'Silwal', '9', 'B', '088', 'Chandra Silwal', 'Chitra Silwal', '9811234654', '2024-25', 'Active', '2009-11-28', 'Male', 'Kathmandu'),
('Janaki', 'Devkota', '9', 'B', '089', 'Dhan Devkota', 'Devi Devkota', '9821234655', '2024-25', 'Active', '2009-06-08', 'Female', 'Lalitpur'),
('Janak', 'Maharjan', '9', 'B', '090', 'Gagan Maharjan', 'Ganga Maharjan', '9831234656', '2024-25', 'Active', '2009-10-20', 'Male', 'Bhaktapur'),

-- Class 10 Students (10 students)
('Kabir', 'Shrestha', '10', 'A', '091', 'Gopal Shrestha', 'Goma Shrestha', '9841234657', '2024-25', 'Active', '2008-05-15', 'Male', 'Kathmandu'),
('Kabita', 'Pradhan', '10', 'A', '092', 'Hari Pradhan', 'Hira Pradhan', '9851234658', '2024-25', 'Active', '2008-08-22', 'Female', 'Lalitpur'),
('Kailash', 'Manandhar', '10', 'A', '093', 'Indra Manandhar', 'Indira Manandhar', '9861234659', '2024-25', 'Active', '2008-03-18', 'Male', 'Bhaktapur'),
('Kalpana', 'Bajracharya', '10', 'A', '094', 'Jeevan Bajracharya', 'Jyoti Bajracharya', '9871234660', '2024-25', 'Active', '2008-12-10', 'Female', 'Kathmandu'),
('Kamal', 'Shakya', '10', 'A', '095', 'Keshav Shakya', 'Kamala Shakya', '9881234661', '2024-25', 'Active', '2008-07-28', 'Male', 'Lalitpur'),
('Kamana', 'Tuladhar', '10', 'B', '096', 'Lal Tuladhar', 'Lila Tuladhar', '9891234662', '2024-25', 'Active', '2008-09-12', 'Female', 'Bhaktapur'),
('Kiran', 'Joshi', '10', 'B', '097', 'Madan Joshi', 'Mala Joshi', '9801234663', '2024-25', 'Active', '2008-04-25', 'Male', 'Kathmandu'),
('Kirana', 'Karmacharya', '10', 'B', '098', 'Narayan Karmacharya', 'Nanda Karmacharya', '9811234664', '2024-25', 'Active', '2008-11-18', 'Female', 'Lalitpur'),
('Krishna', 'Maharjan', '10', 'B', '099', 'Om Maharjan', 'Omika Maharjan', '9821234665', '2024-25', 'Active', '2008-06-05', 'Male', 'Bhaktapur'),
('Kriti', 'Dangol', '10', 'B', '100', 'Paras Dangol', 'Parbati Dangol', '9831234666', '2024-25', 'Active', '2008-10-30', 'Female', 'Kathmandu');
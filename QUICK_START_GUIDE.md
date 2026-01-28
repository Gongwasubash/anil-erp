# School ERP Quick Start Guide

## For New Users - Complete Setup from Scratch

This guide will help you set up your school management system with all essential master data in just a few minutes.

### Prerequisites
1. Database access (Supabase or PostgreSQL)
2. Node.js installed
3. Project dependencies installed (`npm install`)

### Step 1: Database Setup

#### Option A: Run Migration Script (If you have existing tables)
```sql
-- Run this script in your database to add missing school_id columns
-- File: add-school-id-migration.sql
```

#### Option B: Complete Fresh Setup
```sql
-- Run this script for a completely fresh database
-- File: complete-school-setup.sql
```

#### Option C: Use Simple Setup Function
```sql
-- Run this script to create the simple setup function
-- File: simple-school-setup.sql
```

### Step 2: Environment Setup

Make sure your `.env.local` file has the correct database credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Start the Application

```bash
npm run dev
```

### Step 4: Create Your First School

#### Method 1: Using the Simple Masters Component
1. Navigate to the Masters page
2. Use the SimpleMasters component
3. Fill in basic school information:
   - School Name (required)
   - Director Name (required)
   - Phone Number (required)
   - Email Address (required)
   - Address (optional)
   - Short Name (optional)
   - Student Prefix ID (optional)

#### Method 2: Using SQL Function Directly
```sql
SELECT create_new_school(
  'Your School Name',
  'Director Name', 
  '9841234567',
  'admin@yourschool.edu.np',
  'School Address',
  'SHORT',
  'PREFIX'
);
```

### What Gets Created Automatically

When you create a new school, the system automatically sets up:

#### 1. School Profile
- Basic school information
- Contact details
- Login credentials

#### 2. Academic Structure
- **Current Batch**: 2024-2025
- **Classes**: Nursery, LKG, UKG, Class 1-10
- **Sections**: A, B, C, D

#### 3. Subjects
- English (ENG)
- Nepali (NEP)
- Mathematics (MATH)
- Science (SCI)
- Social Studies (SS)
- Health & Physical Education (HPE)
- Art & Craft (ART)
- Computer Science (COMP)

#### 4. Departments
- Administration (ADMIN)
- Academic (ACAD)
- Finance (FIN)
- IT Support (IT)

#### 5. Fee Structure
- Tuition Fee: Rs. 5,000
- Admission Fee: Rs. 2,000
- Exam Fee: Rs. 500
- Library Fee: Rs. 300
- Sports Fee: Rs. 200

#### 6. User Account
- Admin user with school access
- Username: schoolname (lowercase, no spaces)
- Password: phone number

### Step 5: Login and Customize

1. **Login** with the generated credentials
2. **Customize** the master data as needed:
   - Add/remove classes and sections
   - Modify subjects for different classes
   - Update fee amounts
   - Add more departments and designations
   - Set up batch-class-section relationships

### Step 6: Add Students and Staff

After basic setup:
1. **Manage Sections**: Assign sections to batch-class combinations
2. **Add Students**: Use the student admission form
3. **Add Employees**: Set up teaching and non-teaching staff
4. **Subject Assignments**: Assign subjects to classes and students

### Common Next Steps

#### Batch-Class-Section Management
1. Go to Masters → Manage Class
2. Select a batch and assign classes
3. Go to Masters → Manage Section  
4. Select batch, class, and assign sections

#### Student Admission
1. Go to Students → Add Student
2. Fill in student details
3. Assign to appropriate batch, class, and section

#### Fee Management
1. Go to Fees → Manage Fee Heads
2. Update fee amounts as needed
3. Set up fee categories for different student types

#### Employee Management
1. Go to Masters → Manage Department (add more if needed)
2. Go to Masters → Manage Designation (add positions)
3. Add employees with proper department/designation assignment

### Troubleshooting

#### Database Issues
- If you get "column does not exist" errors, run the migration script
- Ensure all tables have proper school_id columns
- Check RLS policies are properly set

#### Login Issues
- Verify the username is lowercase with no spaces
- Default password is the phone number you provided
- Check the users table for the created account

#### Missing Data
- Run the appropriate setup script for your situation
- Check if school_id is properly set in all related tables
- Verify foreign key relationships

### Support

If you encounter issues:
1. Check the browser console for errors
2. Verify database connection
3. Ensure all required tables exist
4. Check that sample data was inserted properly

### Security Notes

- Change default passwords after first login
- Set up proper user roles and permissions
- Enable RLS policies for data isolation
- Regular database backups recommended

---

## Quick Commands Reference

### Create School via SQL
```sql
SELECT create_new_school('School Name', 'Director', 'Phone', 'Email');
```

### Check Setup Status
```sql
-- Check if school was created
SELECT * FROM schools WHERE school_name = 'Your School Name';

-- Check related data
SELECT 
  (SELECT count(*) FROM batches WHERE school_id = 'your-school-id') as batches,
  (SELECT count(*) FROM classes WHERE school_id = 'your-school-id') as classes,
  (SELECT count(*) FROM sections WHERE school_id = 'your-school-id') as sections,
  (SELECT count(*) FROM subjects WHERE school_id = 'your-school-id') as subjects;
```

### Reset School Data
```sql
-- WARNING: This will delete all data for a school
DELETE FROM schools WHERE id = 'your-school-id';
-- All related data will be cascade deleted
```

This guide should get you up and running with a fully functional school management system in under 10 minutes!
-- Enforce complete school data isolation with Row Level Security (RLS)

-- Enable RLS on all tables with school_id
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for batches
CREATE POLICY "School isolation for batches" ON batches
    FOR ALL USING (
        school_id = (current_setting('app.current_school_id', true))::uuid
        OR current_setting('app.current_school_id', true) = 'all'
    );

-- Create RLS policies for classes
CREATE POLICY "School isolation for classes" ON classes
    FOR ALL USING (
        school_id = (current_setting('app.current_school_id', true))::uuid
        OR current_setting('app.current_school_id', true) = 'all'
    );

-- Create RLS policies for sections
CREATE POLICY "School isolation for sections" ON sections
    FOR ALL USING (
        school_id = (current_setting('app.current_school_id', true))::uuid
        OR current_setting('app.current_school_id', true) = 'all'
    );

-- Create RLS policies for subjects
CREATE POLICY "School isolation for subjects" ON subjects
    FOR ALL USING (
        school_id = (current_setting('app.current_school_id', true))::uuid
        OR current_setting('app.current_school_id', true) = 'all'
    );

-- Create RLS policies for departments
CREATE POLICY "School isolation for departments" ON departments
    FOR ALL USING (
        school_id = (current_setting('app.current_school_id', true))::uuid
        OR current_setting('app.current_school_id', true) = 'all'
    );

-- Create RLS policies for designations
CREATE POLICY "School isolation for designations" ON designations
    FOR ALL USING (
        school_id = (current_setting('app.current_school_id', true))::uuid
        OR current_setting('app.current_school_id', true) = 'all'
    );

-- Create RLS policies for employees
CREATE POLICY "School isolation for employees" ON employees
    FOR ALL USING (
        school_id = (current_setting('app.current_school_id', true))::uuid
        OR current_setting('app.current_school_id', true) = 'all'
    );

-- Create RLS policies for students
CREATE POLICY "School isolation for students" ON students
    FOR ALL USING (
        school_id = (current_setting('app.current_school_id', true))::uuid
        OR current_setting('app.current_school_id', true) = 'all'
    );
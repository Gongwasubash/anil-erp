-- Migration script to add school_id columns to existing tables
-- Run this script to update your existing database structure

-- Add school_id column to batches table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'batches' AND column_name = 'school_id') THEN
        ALTER TABLE batches ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
        
        -- Update existing batches with a default school_id if schools exist
        UPDATE batches SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
    END IF;
END $$;

-- Add school_id column to classes table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'school_id') THEN
        ALTER TABLE classes ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
        
        -- Update existing classes with a default school_id if schools exist
        UPDATE classes SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
    END IF;
END $$;

-- Add school_id column to sections table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sections' AND column_name = 'school_id') THEN
        ALTER TABLE sections ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
        
        -- Update existing sections with a default school_id if schools exist
        UPDATE sections SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
    END IF;
END $$;

-- Add school_id column to subjects table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'school_id') THEN
        ALTER TABLE subjects ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
        
        -- Update existing subjects with a default school_id if schools exist
        UPDATE subjects SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
    END IF;
END $$;

-- Add school_id column to departments table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'school_id') THEN
        ALTER TABLE departments ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
        
        -- Update existing departments with a default school_id if schools exist
        UPDATE departments SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
    END IF;
END $$;

-- Add school_id column to designations table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'designations' AND column_name = 'school_id') THEN
        ALTER TABLE designations ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
        
        -- Update existing designations with a default school_id if schools exist
        UPDATE designations SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
    END IF;
END $$;

-- Add school_id column to manage_section table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'manage_section' AND column_name = 'school_id') THEN
        ALTER TABLE manage_section ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
        
        -- Update existing manage_section records with a default school_id if schools exist
        UPDATE manage_section SET school_id = (SELECT id FROM schools LIMIT 1) WHERE school_id IS NULL;
    END IF;
END $$;

-- Create indexes for the new school_id columns
CREATE INDEX IF NOT EXISTS idx_batches_school_id ON batches(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_sections_school_id ON sections(school_id);
CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON subjects(school_id);
CREATE INDEX IF NOT EXISTS idx_departments_school_id ON departments(school_id);
CREATE INDEX IF NOT EXISTS idx_designations_school_id ON designations(school_id);
CREATE INDEX IF NOT EXISTS idx_manage_section_school_id ON manage_section(school_id);

-- Update RLS policies for the tables
DROP POLICY IF EXISTS "School isolation policy" ON batches;
CREATE POLICY "School isolation policy" ON batches
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

DROP POLICY IF EXISTS "School isolation policy" ON classes;
CREATE POLICY "School isolation policy" ON classes
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

DROP POLICY IF EXISTS "School isolation policy" ON sections;
CREATE POLICY "School isolation policy" ON sections
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

DROP POLICY IF EXISTS "School isolation policy" ON subjects;
CREATE POLICY "School isolation policy" ON subjects
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

DROP POLICY IF EXISTS "School isolation policy" ON departments;
CREATE POLICY "School isolation policy" ON departments
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

DROP POLICY IF EXISTS "School isolation policy" ON designations;
CREATE POLICY "School isolation policy" ON designations
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

DROP POLICY IF EXISTS "School isolation policy" ON manage_section;
CREATE POLICY "School isolation policy" ON manage_section
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );
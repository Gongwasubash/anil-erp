-- Minimal fix for missing school_id columns
-- Run this script to add school_id to existing tables

-- Add school_id to batches table
ALTER TABLE batches ADD COLUMN IF NOT EXISTS school_id UUID;

-- Add school_id to classes table  
ALTER TABLE classes ADD COLUMN IF NOT EXISTS school_id UUID;

-- Add school_id to sections table
ALTER TABLE sections ADD COLUMN IF NOT EXISTS school_id UUID;

-- Add school_id to subjects table
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS school_id UUID;

-- Add school_id to departments table
ALTER TABLE departments ADD COLUMN IF NOT EXISTS school_id UUID;

-- Add school_id to designations table
ALTER TABLE designations ADD COLUMN IF NOT EXISTS school_id UUID;

-- Add school_id to manage_section table
ALTER TABLE manage_section ADD COLUMN IF NOT EXISTS school_id UUID;

-- Update existing records with first available school_id (if schools exist)
DO $$
DECLARE
    first_school_id UUID;
BEGIN
    SELECT id INTO first_school_id FROM schools LIMIT 1;
    
    IF first_school_id IS NOT NULL THEN
        UPDATE batches SET school_id = first_school_id WHERE school_id IS NULL;
        UPDATE classes SET school_id = first_school_id WHERE school_id IS NULL;
        UPDATE sections SET school_id = first_school_id WHERE school_id IS NULL;
        UPDATE subjects SET school_id = first_school_id WHERE school_id IS NULL;
        UPDATE departments SET school_id = first_school_id WHERE school_id IS NULL;
        UPDATE designations SET school_id = first_school_id WHERE school_id IS NULL;
        UPDATE manage_section SET school_id = first_school_id WHERE school_id IS NULL;
    END IF;
END $$;
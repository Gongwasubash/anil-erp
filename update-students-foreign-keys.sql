-- Update students table to use foreign key references instead of text values
-- This ensures when school/batch/class/section names are updated, students automatically use the new values

-- Add foreign key columns
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id),
ADD COLUMN IF NOT EXISTS batch_id BIGINT REFERENCES batches(id),
ADD COLUMN IF NOT EXISTS class_id BIGINT REFERENCES classes(id),
ADD COLUMN IF NOT EXISTS section_id BIGINT REFERENCES sections(id);

-- Update existing records to use IDs (you'll need to run this after adding the columns)
-- UPDATE students SET school_id = (SELECT id FROM schools WHERE school_name = students.school LIMIT 1);
-- UPDATE students SET batch_id = (SELECT id FROM batches WHERE batch_no = students.batch_no LIMIT 1);
-- UPDATE students SET class_id = (SELECT id FROM classes WHERE class_name = students.class LIMIT 1);
-- UPDATE students SET section_id = (SELECT id FROM sections WHERE section_name = students.section LIMIT 1);

-- After updating all records, you can drop the old text columns if needed
-- ALTER TABLE students DROP COLUMN school, DROP COLUMN batch_no, DROP COLUMN class, DROP COLUMN section;
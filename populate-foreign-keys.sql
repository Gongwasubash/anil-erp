-- Populate the foreign key columns with actual data
UPDATE students SET school_id = (SELECT id FROM schools WHERE school_name = students.school LIMIT 1);
UPDATE students SET batch_id = (SELECT id FROM batches WHERE batch_no = students.batch_no LIMIT 1);
UPDATE students SET class_id = (SELECT id FROM classes WHERE class_name = students.class LIMIT 1);
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_name = students.section LIMIT 1);
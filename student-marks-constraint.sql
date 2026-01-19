-- Add unique constraint to student_marks table for proper upsert
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_student_exam_subject'
    ) THEN
        ALTER TABLE public.student_marks 
        ADD CONSTRAINT unique_student_exam_subject 
        UNIQUE (student_id, school_id, batch_id, class_id, section_id, exam_type_id, exam_name_id, subject_id);
    END IF;
END $$;
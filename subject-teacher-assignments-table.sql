-- Drop existing table if it has wrong data types
DROP TABLE IF EXISTS public.subject_teacher_assignments CASCADE;

-- Create subject_teacher_assignments table
CREATE TABLE public.subject_teacher_assignments (
    id SERIAL PRIMARY KEY,
    school_id UUID NOT NULL,
    batch_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    section_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subject_teacher_school_id ON public.subject_teacher_assignments(school_id);
CREATE INDEX IF NOT EXISTS idx_subject_teacher_employee_id ON public.subject_teacher_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_subject_teacher_subject_id ON public.subject_teacher_assignments(subject_id);

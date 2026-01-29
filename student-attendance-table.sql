-- Drop existing table if it has wrong data types
DROP TABLE IF EXISTS public.student_attendance;

-- Create student_attendance table for working/present days
CREATE TABLE public.student_attendance (
    id SERIAL PRIMARY KEY,
    school_id UUID NOT NULL,
    batch_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    section_id INTEGER NOT NULL,
    student_id UUID NOT NULL,
    exam_type_id INTEGER NOT NULL,
    exam_name_id INTEGER NOT NULL,
    working_days INTEGER DEFAULT 0,
    present_days INTEGER DEFAULT 0,
    teacher_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, school_id, batch_id, class_id, section_id, exam_type_id, exam_name_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_attendance_school_id ON public.student_attendance(school_id);
CREATE INDEX IF NOT EXISTS idx_student_attendance_student_id ON public.student_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_student_attendance_exam ON public.student_attendance(exam_type_id, exam_name_id);

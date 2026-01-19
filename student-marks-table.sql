-- Create student_marks table
CREATE TABLE IF NOT EXISTS public.student_marks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL,
    school_id TEXT NOT NULL,
    batch_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    section_id TEXT NOT NULL,
    exam_type_id TEXT NOT NULL,
    exam_name_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    theory_marks_obtained DECIMAL(5,2) DEFAULT 0,
    theory_percentage DECIMAL(5,2) DEFAULT 0,
    practical_marks_obtained DECIMAL(5,2) DEFAULT 0,
    practical_percentage DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.student_marks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on student_marks" ON public.student_marks
    FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_marks_student ON public.student_marks(student_id);
CREATE INDEX IF NOT EXISTS idx_student_marks_exam ON public.student_marks(exam_type_id, exam_name_id);
CREATE INDEX IF NOT EXISTS idx_student_marks_subject ON public.student_marks(subject_id);
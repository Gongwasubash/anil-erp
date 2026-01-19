-- Create exam_marks table
CREATE TABLE IF NOT EXISTS public.exam_marks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id TEXT NOT NULL,
    batch_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    section_id TEXT NOT NULL,
    exam_type_id TEXT NOT NULL,
    exam_name_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    th_marks DECIMAL(5,2) DEFAULT 0,
    pass_marks_th DECIMAL(5,2) DEFAULT 0,
    credit_hour_th DECIMAL(5,2) DEFAULT 0,
    pr_in_marks DECIMAL(5,2) DEFAULT 0,
    pass_marks_pr_in DECIMAL(5,2) DEFAULT 0,
    credit_hour_pr_in DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.exam_marks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on exam_marks" ON public.exam_marks
    FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exam_marks_school_batch ON public.exam_marks(school_id, batch_id);
CREATE INDEX IF NOT EXISTS idx_exam_marks_class_section ON public.exam_marks(class_id, section_id);
CREATE INDEX IF NOT EXISTS idx_exam_marks_exam ON public.exam_marks(exam_type_id, exam_name_id);
CREATE INDEX IF NOT EXISTS idx_exam_marks_subject ON public.exam_marks(subject_id);
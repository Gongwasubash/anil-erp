-- Create final_exam_names table
CREATE TABLE IF NOT EXISTS final_exam_names (
    id BIGSERIAL PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    batch_id BIGINT REFERENCES batches(id) ON DELETE CASCADE,
    class_id BIGINT REFERENCES classes(id) ON DELETE CASCADE,
    section_id BIGINT REFERENCES sections(id) ON DELETE CASCADE,
    exam_type_id BIGINT REFERENCES exam_types(id) ON DELETE CASCADE,
    exam_name TEXT NOT NULL,
    is_current_exam BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_final_exam_names_school ON final_exam_names(school_id);
CREATE INDEX IF NOT EXISTS idx_final_exam_names_batch ON final_exam_names(batch_id);
CREATE INDEX IF NOT EXISTS idx_final_exam_names_class ON final_exam_names(class_id);
CREATE INDEX IF NOT EXISTS idx_final_exam_names_section ON final_exam_names(section_id);
CREATE INDEX IF NOT EXISTS idx_final_exam_names_exam_type ON final_exam_names(exam_type_id);

-- Enable Row Level Security
ALTER TABLE final_exam_names ENABLE ROW LEVEL SECURITY;

-- Create policies for final_exam_names
CREATE POLICY "Enable read access for all users" ON final_exam_names
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON final_exam_names
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON final_exam_names
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON final_exam_names
    FOR DELETE USING (true);

-- Drop existing table and recreate with new structure
DROP TABLE IF EXISTS exam_percentages CASCADE;

-- Create exam_percentages table
CREATE TABLE IF NOT EXISTS exam_percentages (
    id BIGSERIAL PRIMARY KEY,
    final_exam_name_id BIGINT REFERENCES final_exam_names(id) ON DELETE CASCADE,
    exam_type_id BIGINT REFERENCES exam_types(id) ON DELETE CASCADE,
    exam_name_id TEXT NOT NULL,
    exam_percentage DECIMAL(5,2) NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(final_exam_name_id, exam_name_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_exam_percentages_final_exam ON exam_percentages(final_exam_name_id);
CREATE INDEX IF NOT EXISTS idx_exam_percentages_exam_type ON exam_percentages(exam_type_id);
CREATE INDEX IF NOT EXISTS idx_exam_percentages_exam_name ON exam_percentages(exam_name_id);

-- Enable Row Level Security
ALTER TABLE exam_percentages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON exam_percentages;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON exam_percentages;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON exam_percentages;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON exam_percentages;

-- Create policies for exam_percentages
CREATE POLICY "Enable read access for all users" ON exam_percentages
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON exam_percentages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON exam_percentages
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON exam_percentages
    FOR DELETE USING (true);

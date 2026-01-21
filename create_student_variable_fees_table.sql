-- Create student_variable_fees table in Supabase
CREATE TABLE IF NOT EXISTS student_variable_fees (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL,
    fee_head_id UUID NOT NULL,
    month_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    school VARCHAR(100),
    batch VARCHAR(20),
    class VARCHAR(20),
    section VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_student_variable_fees_student ON student_variable_fees(student_id);
CREATE INDEX IF NOT EXISTS idx_student_variable_fees_month ON student_variable_fees(month_id);
CREATE INDEX IF NOT EXISTS idx_student_variable_fees_fee_head ON student_variable_fees(fee_head_id);
-- Drop existing table and recreate with correct types
DROP TABLE IF EXISTS student_variable_fees;

CREATE TABLE student_variable_fees (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL,
    fee_head_id INTEGER NOT NULL,
    month_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    school VARCHAR(100),
    batch VARCHAR(20),
    class VARCHAR(20),
    section VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, fee_head_id, month_id)
);

-- Create indexes for faster searches
CREATE INDEX idx_student_variable_fees_student ON student_variable_fees(student_id);
CREATE INDEX idx_student_variable_fees_month ON student_variable_fees(month_id);
CREATE INDEX idx_student_variable_fees_fee_head ON student_variable_fees(fee_head_id);
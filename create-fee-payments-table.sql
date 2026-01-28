-- Create fee_payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS fee_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID,
    receipt_no VARCHAR(255),
    receipt_date DATE,
    month_name VARCHAR(50),
    fee_head VARCHAR(255),
    amount DECIMAL(10,2),
    remaining_amount DECIMAL(10,2) DEFAULT 0,
    fine_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    other_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2),
    payment_mode VARCHAR(50) DEFAULT 'Cash',
    school VARCHAR(255),
    batch VARCHAR(50),
    class VARCHAR(50),
    section VARCHAR(50),
    school_id UUID REFERENCES schools(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_school_id ON fee_payments(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_receipt_no ON fee_payments(receipt_no);
-- Create fee_payments table to store payment records
CREATE TABLE IF NOT EXISTS fee_payments (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    receipt_no VARCHAR(100) NOT NULL,
    receipt_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    other_amount DECIMAL(10,2) DEFAULT 0,
    fine_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    net_payable_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    remaining_amount DECIMAL(10,2) DEFAULT 0,
    payment_mode VARCHAR(50) DEFAULT 'Cash',
    school VARCHAR(255),
    batch VARCHAR(50),
    class VARCHAR(50),
    section VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_receipt_no ON fee_payments(receipt_no);
CREATE INDEX IF NOT EXISTS idx_fee_payments_receipt_date ON fee_payments(receipt_date);
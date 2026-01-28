-- Add school_id column to fee_payments table
ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_fee_payments_school_id ON fee_payments(school_id);
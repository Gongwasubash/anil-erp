-- Add remaining_amount column to existing fee_payments table
ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS remaining_amount DECIMAL(10,2) DEFAULT 0;
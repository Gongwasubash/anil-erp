-- Fix student_id column type in fee_payments table
-- Convert from VARCHAR to UUID to match the data being inserted
ALTER TABLE fee_payments ALTER COLUMN student_id TYPE UUID USING student_id::UUID;
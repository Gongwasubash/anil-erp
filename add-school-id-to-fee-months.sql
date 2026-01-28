-- Add school_id column to fee_months table
ALTER TABLE fee_months ADD COLUMN IF NOT EXISTS school_id UUID;

-- Add foreign key constraint
ALTER TABLE fee_months ADD CONSTRAINT fk_fee_months_school_id 
FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_fee_months_school_id ON fee_months(school_id);
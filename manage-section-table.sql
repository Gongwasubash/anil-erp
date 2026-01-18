-- Create manage_section table for Everest School ERP
-- This table manages the relationship between batches, classes, and sections

CREATE TABLE IF NOT EXISTS manage_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  section_ids TEXT[], -- Array of section IDs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_manage_section_batch_id ON manage_section(batch_id);
CREATE INDEX IF NOT EXISTS idx_manage_section_class_id ON manage_section(class_id);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE manage_section ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON manage_section
  FOR ALL USING (auth.role() = 'authenticated');
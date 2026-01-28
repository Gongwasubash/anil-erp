-- Add unique constraint to prevent duplicate subject assignments
-- This ensures that the same school, batch, class, section combination can only exist once

-- First, remove any existing duplicates (keep the most recent one)
WITH duplicates AS (
  SELECT id, 
         ROW_NUMBER() OVER (
           PARTITION BY school_id, batch_id, class_id, section_id 
           ORDER BY updated_at DESC, created_at DESC
         ) as rn
  FROM subject_assignments
)
DELETE FROM subject_assignments 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Add unique constraint
ALTER TABLE subject_assignments 
ADD CONSTRAINT unique_subject_assignment 
UNIQUE (school_id, batch_id, class_id, section_id);

-- Add comment to explain the constraint
COMMENT ON CONSTRAINT unique_subject_assignment ON subject_assignments IS 
'Ensures only one subject assignment per school-batch-class-section combination';
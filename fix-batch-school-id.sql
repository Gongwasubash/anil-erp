-- Fix the missing column name (appears to be batch_no or Name)
ALTER TABLE public.batches ADD COLUMN IF NOT EXISTS batch_no text;

-- Update the NULL school_id for batch ID 6 (use the same school_id as other batches)
UPDATE public.batches 
SET school_id = (SELECT school_id FROM public.batches WHERE school_id IS NOT NULL LIMIT 1)
WHERE id = 6 AND school_id IS NULL;

-- Add NOT NULL constraint to prevent future NULL school_id
ALTER TABLE public.batches ALTER COLUMN school_id SET NOT NULL;
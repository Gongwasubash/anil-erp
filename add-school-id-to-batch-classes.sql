-- Add school_id column to batch_classes table
ALTER TABLE public.batch_classes 
ADD COLUMN school_id text;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_batch_classes_school_id ON public.batch_classes(school_id);
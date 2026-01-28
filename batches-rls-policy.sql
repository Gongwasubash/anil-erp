-- Enable RLS on batches table
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for batches table
CREATE POLICY "School isolation for batches" ON public.batches
  USING (school_id::text = current_setting('app.current_school_id', true));
-- Add missing columns to student_marks table
ALTER TABLE public.student_marks 
ADD COLUMN IF NOT EXISTS theory_marks_total numeric(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS practical_marks_total numeric(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS credit_hour_th_total numeric(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS credit_hour_th_obtained numeric(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS credit_hour_pr_total numeric(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS credit_hour_pr_obtained numeric(5, 2) DEFAULT 0;
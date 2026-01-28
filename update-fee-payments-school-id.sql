-- Update existing fee_payments records to set school_id
UPDATE fee_payments 
SET school_id = (
    SELECT s.school_id 
    FROM students s 
    WHERE s.id = fee_payments.student_id
)
WHERE school_id IS NULL;
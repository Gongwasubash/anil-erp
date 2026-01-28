-- Function to auto-populate 12 Nepali months when school is created
CREATE OR REPLACE FUNCTION auto_populate_fee_months()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert 12 Nepali months for the new school
  INSERT INTO fee_months (month_name, month_order, school_id)
  VALUES 
    ('Baisakh', 1, NEW.id),
    ('Jestha', 2, NEW.id),
    ('Ashadh', 3, NEW.id),
    ('Shrawan', 4, NEW.id),
    ('Bhadra', 5, NEW.id),
    ('Ashoj', 6, NEW.id),
    ('Kartik', 7, NEW.id),
    ('Mangsir', 8, NEW.id),
    ('Poush', 9, NEW.id),
    ('Magh', 10, NEW.id),
    ('Falgun', 11, NEW.id),
    ('Chaitra', 12, NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires after school insert
CREATE TRIGGER trigger_auto_populate_fee_months
  AFTER INSERT ON schools
  FOR EACH ROW
  EXECUTE FUNCTION auto_populate_fee_months();
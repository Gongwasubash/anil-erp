-- Create fee_months table in Supabase
CREATE TABLE IF NOT EXISTS fee_months (
    id SERIAL PRIMARY KEY,
    month_name VARCHAR(50) NOT NULL,
    month_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on month_order for faster searches
CREATE INDEX IF NOT EXISTS idx_fee_months_order ON fee_months(month_order);

-- Insert sample months data
INSERT INTO fee_months (month_name, month_order) VALUES
('Baisakh', 1),
('Jestha', 2),
('Ashadh', 3),
('Shrawan', 4),
('Bhadra', 5),
('Ashoj', 6),
('Kartik', 7),
('Mangsir', 8),
('Poush', 9),
('Magh', 10),
('Falgun', 11),
('Chaitra', 12)
ON CONFLICT DO NOTHING;
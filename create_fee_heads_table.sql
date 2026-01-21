-- Create fee_heads table in Supabase
CREATE TABLE IF NOT EXISTS fee_heads (
    id SERIAL PRIMARY KEY,
    fee_head VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    type VARCHAR(50) CHECK (type IN ('variable', 'general', 'occasionally')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on fee_head for faster searches
CREATE INDEX IF NOT EXISTS idx_fee_heads_fee_head ON fee_heads(fee_head);

-- Insert fee heads data
INSERT INTO fee_heads (fee_head, short_name, type) VALUES
('Monthly Fee', 'MF', 'general'),
('Exam Fee', 'EF', 'general'),
('House Dress', 'HD', 'occasionally'),
('Diary', 'DY', 'occasionally'),
('Tie', 'TI', 'occasionally'),
('Belt', 'BT', 'occasionally'),
('App & Id Card', 'AIC', 'occasionally'),
('Transportation Fee', 'TF', 'variable'),
('Annual Fee', 'AF', 'general'),
('Admission Fee', 'ADM', 'occasionally'),
('Extra Class Fee', 'ECF', 'variable'),
('Educational Tour', 'ET', 'occasionally'),
('Picnic Fee', 'PF', 'occasionally'),
('Breakfast', 'BF', 'variable'),
('E learning', 'EL', 'general')
ON CONFLICT DO NOTHING;
-- Create financial tables for dashboard data

-- Fee payments table
CREATE TABLE IF NOT EXISTS fee_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_name VARCHAR,
  amount DECIMAL(10,2) DEFAULT 0,
  payment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR DEFAULT 'Paid',
  remaining_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  category VARCHAR NOT NULL,
  description VARCHAR,
  amount DECIMAL(10,2) DEFAULT 0,
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fee_payments_school_id ON fee_payments(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_date ON fee_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_expenses_school_id ON expenses(school_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);

-- Enable RLS
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "School isolation policy" ON fee_payments
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );

CREATE POLICY "School isolation policy" ON expenses
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    school_id::text = current_setting('app.current_school_id', true)
  );
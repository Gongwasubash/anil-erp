# Dashboard Data Isolation Setup

## Step 1: Create Financial Tables

Run this SQL to create the required financial tables:

```sql
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
CREATE INDEX IF NOT EXISTS idx_expenses_school_id ON expenses(school_id);

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
```

## Step 2: Update School Setup Function

The `setup_new_school` function has been updated to create sample financial data for new schools.

## What's Fixed:

### ✅ **Dashboard Data Isolation**
- Income vs Expenses chart now shows only data for the logged-in user's school
- All financial data is filtered by `school_id`
- No cross-school data leakage

### ✅ **Real Financial Data**
- Replaced hardcoded chart data with real database queries
- Fetches last 6 months of payments and expenses
- Groups data by month for chart display

### ✅ **Sample Data for New Schools**
When a new school is created, it gets:
- 6 sample fee payments over the last 30 days
- 6 sample expenses over the last 30 days
- Realistic amounts for demonstration

### ✅ **School-Specific Stats**
- Total Students: Only students from user's school
- Monthly Collection: Only payments from user's school
- Pending Fees: Only pending amounts from user's school
- Total Expenses: Only expenses from user's school

## How It Works:

1. **User logs in** → Dashboard loads with user's school_id
2. **Data queries** → All queries filter by school_id
3. **Chart displays** → Shows only that school's financial data
4. **Stats show** → Only that school's metrics

## Testing:

1. Create a new school using the setup function
2. Login with the new school credentials
3. Check dashboard shows sample financial data
4. Verify no other school's data is visible

The dashboard now provides complete data isolation between schools while showing meaningful financial insights for each individual school.
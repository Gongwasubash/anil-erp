-- Create fee_payment_items table to store individual fee items within each payment
CREATE TABLE IF NOT EXISTS fee_payment_items (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL,
    month_name VARCHAR(50),
    fee_head VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    remaining_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES fee_payments(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_fee_payment_items_payment_id ON fee_payment_items(payment_id);
CREATE INDEX IF NOT EXISTS idx_fee_payment_items_month_fee ON fee_payment_items(month_name, fee_head);
-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert sample admin user
INSERT INTO users (username, password, role) 
SELECT 'admin', 'admin123', 'admin' 
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Insert sample developer user
INSERT INTO users (username, password, role) 
SELECT 'developer', 'dev123', 'developer' 
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'developer');
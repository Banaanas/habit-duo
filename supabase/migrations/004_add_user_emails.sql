-- Add email column to users table for magic link validation
-- This ensures only the 2 authorized users can sign in

-- Add email column
ALTER TABLE users ADD COLUMN email TEXT UNIQUE;

-- Add emails for the 2 users (UPDATE WITH YOUR ACTUAL EMAILS)
-- IMPORTANT: Replace these with the actual email addresses
UPDATE users SET email = 'cyril@example.com' WHERE name = 'Cyril';
UPDATE users SET email = 'andrea@example.com' WHERE name = 'Andrea';

-- Make email required for future inserts
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Add index for email lookups
CREATE INDEX idx_users_email ON users(email);

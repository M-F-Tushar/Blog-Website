-- Create contact_messages table for the contact form
-- NOTE: This table uses table-level grants instead of RLS for simplicity
-- (Public contact forms work better without RLS complexity)

-- Drop existing table if it exists
DROP TABLE IF EXISTS contact_messages;

-- Create the table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Grant schema access
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table access (NO RLS - using table-level grants instead)
-- Anon can only INSERT (submit contact form)
GRANT INSERT ON contact_messages TO anon;
-- Authenticated users have full access (admin panel)
GRANT ALL ON contact_messages TO authenticated;
GRANT ALL ON contact_messages TO service_role;


-- Create a specific table for contact messages to avoid naming conflicts
-- (The previous 'messages' table might have conflicted or had permission issues)

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can insert contact_messages" 
ON contact_messages FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view contact_messages" 
ON contact_messages FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update contact_messages" 
ON contact_messages FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete contact_messages" 
ON contact_messages FOR DELETE 
USING (auth.role() = 'authenticated');

-- Explicit Grants (to ensure anon can insert)
GRANT ALL ON TABLE contact_messages TO anon;
GRANT ALL ON TABLE contact_messages TO authenticated;
GRANT ALL ON TABLE contact_messages TO service_role;

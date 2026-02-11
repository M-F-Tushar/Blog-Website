-- Create messages table for contact form submissions
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policies for Messages
-- Anyone can insert (send a message)
CREATE POLICY "Anyone can send a message" 
ON messages FOR INSERT 
WITH CHECK (true);

-- Only authenticated users (admins) can view messages
CREATE POLICY "Admins can view messages" 
ON messages FOR SELECT 
USING (auth.role() = 'authenticated');

-- Only authenticated users (admins) can update messages (mark as read)
CREATE POLICY "Admins can update messages" 
ON messages FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Only authenticated users (admins) can delete messages
CREATE POLICY "Admins can delete messages" 
ON messages FOR DELETE 
USING (auth.role() = 'authenticated');

-- Policies for Newsletter Subscribers
-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe" 
ON newsletter_subscribers FOR INSERT 
WITH CHECK (true);

-- Only authenticated users (admins) can view subscribers
CREATE POLICY "Admins can view subscribers" 
ON newsletter_subscribers FOR SELECT 
USING (auth.role() = 'authenticated');

-- Only authenticated users (admins) can delete subscribers
CREATE POLICY "Admins can delete subscribers" 
ON newsletter_subscribers FOR DELETE 
USING (auth.role() = 'authenticated');

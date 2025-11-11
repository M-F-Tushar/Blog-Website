-- Blog Website Database Schema
-- Execute this in your Supabase SQL Editor

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'draft',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'My Blog',
  site_description TEXT,
  author_name TEXT,
  author_tagline TEXT,
  author_bio TEXT,
  photo_url TEXT,
  social_github TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  social_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON site_settings FOR SELECT USING (true);

-- Authenticated write access policies for posts
CREATE POLICY "Allow authenticated users to insert" ON posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete" ON posts FOR DELETE TO authenticated USING (true);

-- Authenticated write access policies for recommendations
CREATE POLICY "Allow authenticated users to insert" ON recommendations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON recommendations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete" ON recommendations FOR DELETE TO authenticated USING (true);

-- Authenticated write access policies for site_settings
CREATE POLICY "Allow authenticated users to update" ON site_settings FOR UPDATE TO authenticated USING (true);

-- Indexes for better performance
CREATE INDEX idx_posts_date ON posts(date DESC);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_recommendations_category ON recommendations(category);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to update updated_at timestamp
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default site settings
INSERT INTO site_settings (
  site_name,
  site_description,
  author_name,
  author_tagline,
  author_bio
) VALUES (
  'My Blog',
  'Welcome to my personal blog',
  'Your Name',
  'Developer & Writer',
  'I write about technology, programming, and life.'
);

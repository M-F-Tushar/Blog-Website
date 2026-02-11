-- Migration: Create custom_pages and custom_page_sections tables
-- Execute this in your Supabase SQL Editor

-- ===================================
-- CUSTOM PAGES TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS custom_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  layout TEXT DEFAULT 'default',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER DEFAULT 0,
  show_in_navigation BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_custom_pages_slug ON custom_pages(slug);
CREATE INDEX IF NOT EXISTS idx_custom_pages_status ON custom_pages(status);
CREATE INDEX IF NOT EXISTS idx_custom_pages_sort_order ON custom_pages(sort_order);

-- Enable RLS
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;

-- Public can read published pages
CREATE POLICY "Allow public to read published custom pages"
  ON custom_pages FOR SELECT
  USING (status = 'published');

-- Authenticated users have full access
CREATE POLICY "Allow authenticated full access to custom pages"
  ON custom_pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ===================================
-- CUSTOM PAGE SECTIONS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS custom_page_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES custom_pages(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL DEFAULT 'text-block',
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_custom_page_sections_page_id ON custom_page_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_custom_page_sections_sort_order ON custom_page_sections(page_id, sort_order);

-- Enable RLS
ALTER TABLE custom_page_sections ENABLE ROW LEVEL SECURITY;

-- Public can read sections of published pages
CREATE POLICY "Allow public to read sections of published custom pages"
  ON custom_page_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custom_pages
      WHERE custom_pages.id = custom_page_sections.page_id
      AND custom_pages.status = 'published'
    )
  );

-- Authenticated users have full access
CREATE POLICY "Allow authenticated full access to custom page sections"
  ON custom_page_sections FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ===================================
-- AUTO-UPDATE updated_at TRIGGER
-- ===================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_pages_updated_at
  BEFORE UPDATE ON custom_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_page_sections_updated_at
  BEFORE UPDATE ON custom_page_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

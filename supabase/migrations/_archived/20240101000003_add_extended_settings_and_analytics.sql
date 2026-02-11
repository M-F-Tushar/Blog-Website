-- Migration: Add extended settings columns and post_views table
-- Execute this in your Supabase SQL Editor

-- Add JSONB columns to site_settings for extended settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT ARRAY['Technology', 'Life', 'Development'];
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS timeline JSONB DEFAULT '[]'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS ui_text JSONB DEFAULT '{}'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS appearance JSONB DEFAULT '{"primaryColor": "#6366f1", "accentColor": "#8b5cf6", "fontFamily": "Inter", "logoUrl": "", "faviconUrl": "", "defaultTheme": "system"}'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS navigation JSONB DEFAULT '{"menuItems": []}'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS seo JSONB DEFAULT '{"defaultMetaTitle": "", "defaultMetaDescription": "", "ogImage": "", "twitterHandle": "", "pageMeta": {}}'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS homepage_layout JSONB DEFAULT '{"showHero": true, "showFeaturedPost": true, "showTrendingTopics": true, "showLatestArticles": true, "showNewsletter": true}'::jsonb;

-- Add category column to posts if missing
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Technology';

-- ===================================
-- POST VIEWS TABLE FOR REAL ANALYTICS
-- ===================================

-- Create post_views table to track real page views
CREATE TABLE IF NOT EXISTS post_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  viewer_id TEXT, -- Anonymous hash or user ID
  ip_hash TEXT, -- Hashed IP for deduplication (privacy-friendly)
  user_agent TEXT,
  referrer TEXT,
  country_code TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT -- To track unique sessions
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON post_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_views_post_date ON post_views(post_id, viewed_at);

-- Enable RLS
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- Public can insert views (for tracking)
CREATE POLICY "Allow public to insert views" ON post_views FOR INSERT WITH CHECK (true);

-- Only authenticated users can read views (for admin dashboard)
CREATE POLICY "Allow authenticated to read views" ON post_views FOR SELECT TO authenticated USING (true);

-- ===================================
-- MATERIALIZED VIEW FOR FAST STATS
-- ===================================

-- Create a view for aggregated post statistics
CREATE OR REPLACE VIEW post_statistics AS
SELECT 
  p.id AS post_id,
  p.title,
  p.category,
  p.status,
  p.date AS published_date,
  COUNT(pv.id) AS total_views,
  COUNT(DISTINCT pv.ip_hash) AS unique_views,
  COUNT(CASE WHEN pv.viewed_at > NOW() - INTERVAL '7 days' THEN 1 END) AS views_last_7_days,
  COUNT(CASE WHEN pv.viewed_at > NOW() - INTERVAL '30 days' THEN 1 END) AS views_last_30_days
FROM posts p
LEFT JOIN post_views pv ON p.id = pv.post_id
GROUP BY p.id, p.title, p.category, p.status, p.date;

-- ===================================
-- FUNCTION TO RECORD PAGE VIEW
-- ===================================

-- Function to record a page view (can be called from Edge function or client)
CREATE OR REPLACE FUNCTION record_page_view(
  p_post_id UUID,
  p_ip_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO post_views (post_id, ip_hash, user_agent, referrer, session_id)
  VALUES (p_post_id, p_ip_hash, p_user_agent, p_referrer, p_session_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION record_page_view TO anon;
GRANT EXECUTE ON FUNCTION record_page_view TO authenticated;

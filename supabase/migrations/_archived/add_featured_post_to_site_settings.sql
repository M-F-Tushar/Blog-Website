-- Add featured_post_id column to site_settings table
-- This column will store the ID of the featured post

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS featured_post_id UUID REFERENCES posts(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_site_settings_featured_post ON site_settings(featured_post_id);

-- Comment on the column
COMMENT ON COLUMN site_settings.featured_post_id IS 'ID of the post to feature on the homepage';

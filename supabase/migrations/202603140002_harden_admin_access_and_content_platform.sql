CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  );
END;
$$;

DROP POLICY IF EXISTS "admin_users_self_read" ON admin_users;
DROP POLICY IF EXISTS "admin_users_admin_manage" ON admin_users;

CREATE POLICY "admin_users_self_read"
  ON admin_users FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_users_admin_manage"
  ON admin_users FOR ALL TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

ALTER TABLE cv_education
ADD COLUMN IF NOT EXISTS gpa TEXT,
ADD COLUMN IF NOT EXISTS location TEXT;

ALTER TABLE cv_experience
ADD COLUMN IF NOT EXISTS location TEXT;

ALTER TABLE cv_certifications
ADD COLUMN IF NOT EXISTS credential_id TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'contact_messages' AND column_name = 'read'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'contact_messages' AND column_name = 'is_read'
  ) THEN
    ALTER TABLE public.contact_messages RENAME COLUMN read TO is_read;
  END IF;
END $$;

ALTER TABLE contact_messages
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'post_views' AND column_name = 'ip_hash'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'post_views' AND column_name = 'viewer_ip'
  ) THEN
    ALTER TABLE public.post_views RENAME COLUMN ip_hash TO viewer_ip;
  END IF;
END $$;

ALTER TABLE post_views
ADD COLUMN IF NOT EXISTS viewer_ip TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT,
ADD COLUMN IF NOT EXISTS session_id TEXT;

CREATE TABLE IF NOT EXISTS custom_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  layout TEXT DEFAULT 'default',
  status TEXT DEFAULT 'draft',
  sort_order INT DEFAULT 0,
  show_in_navigation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_custom_pages_updated_at ON custom_pages;
CREATE TRIGGER update_custom_pages_updated_at BEFORE UPDATE ON custom_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS custom_page_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES custom_pages(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  metadata JSONB,
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE custom_page_sections ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_custom_page_sections_updated_at ON custom_page_sections;
CREATE TRIGGER update_custom_page_sections_updated_at BEFORE UPDATE ON custom_page_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS navigation_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  is_external BOOLEAN DEFAULT FALSE,
  visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_navigation_items_updated_at ON navigation_items;
CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON navigation_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS page_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  section_type TEXT NOT NULL DEFAULT 'content',
  preset_key TEXT,
  eyebrow TEXT,
  title TEXT,
  subtitle TEXT,
  body TEXT,
  primary_cta_label TEXT,
  primary_cta_url TEXT,
  secondary_cta_label TEXT,
  secondary_cta_url TEXT,
  layout_variant TEXT DEFAULT 'feature-left',
  visual_tone TEXT DEFAULT 'default',
  density TEXT DEFAULT 'balanced',
  background_treatment TEXT DEFAULT 'panel',
  content_alignment TEXT DEFAULT 'left',
  media_mode TEXT DEFAULT 'none',
  content_collection TEXT DEFAULT 'none',
  content_source TEXT DEFAULT 'static',
  kicker_style TEXT DEFAULT 'default',
  section_role TEXT DEFAULT 'guide',
  animation_preset TEXT DEFAULT 'quiet-fade',
  content_grouping TEXT DEFAULT 'none',
  content_emphasis TEXT DEFAULT 'supporting',
  max_items INT DEFAULT 3,
  show_divider BOOLEAN DEFAULT FALSE,
  featured_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  featured_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  featured_bookshelf_entry_id UUID,
  manual_item_ids TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb,
  visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_key, section_key)
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_page_sections_updated_at ON page_sections;
CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON page_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS story_chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  body TEXT NOT NULL,
  period_label TEXT,
  featured_media TEXT,
  visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE story_chapters ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_story_chapters_updated_at ON story_chapters;
CREATE TRIGGER update_story_chapters_updated_at BEFORE UPDATE ON story_chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS story_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES story_chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  period_label TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE story_milestones ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_story_milestones_updated_at ON story_milestones;
CREATE TRIGGER update_story_milestones_updated_at BEFORE UPDATE ON story_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS bookshelf_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  entry_type TEXT NOT NULL DEFAULT 'reflection',
  book_title TEXT NOT NULL,
  author TEXT,
  cover_image TEXT,
  summary TEXT,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  rating NUMERIC(3,1),
  status TEXT NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookshelf_entries ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_bookshelf_entries_updated_at ON bookshelf_entries;
CREATE TRIGGER update_bookshelf_entries_updated_at BEFORE UPDATE ON bookshelf_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS contact_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'external',
  description TEXT,
  visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS update_contact_links_updated_at ON contact_links;
CREATE TRIGGER update_contact_links_updated_at BEFORE UPDATE ON contact_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP VIEW IF EXISTS post_statistics;

CREATE VIEW post_statistics AS
SELECT
  p.id AS post_id,
  p.title AS title,
  p.category AS category,
  p.status AS status,
  COUNT(v.id) AS total_views,
  COUNT(DISTINCT COALESCE(v.session_id, v.viewer_ip, v.id::text)) AS unique_views,
  COUNT(v.id) FILTER (WHERE v.viewed_at >= NOW() - INTERVAL '7 days') AS views_last_7_days,
  COUNT(v.id) FILTER (WHERE v.viewed_at >= NOW() - INTERVAL '30 days') AS views_last_30_days
FROM posts p
LEFT JOIN post_views v ON v.post_id = p.id
GROUP BY p.id, p.title, p.category, p.status;

CREATE OR REPLACE FUNCTION record_page_view(
  p_post_id TEXT,
  p_session_id TEXT,
  p_referrer TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM post_views
    WHERE post_id = p_post_id
      AND session_id = p_session_id
      AND p_session_id IS NOT NULL
      AND viewed_at > NOW() - INTERVAL '1 hour'
  ) THEN
    RETURN;
  END IF;

  INSERT INTO post_views (post_id, user_agent, referrer, session_id)
  VALUES (p_post_id, p_user_agent, p_referrer, p_session_id);
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION record_page_view(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

DROP POLICY IF EXISTS "posts_public_read" ON posts;
DROP POLICY IF EXISTS "posts_admin_insert" ON posts;
DROP POLICY IF EXISTS "posts_admin_update" ON posts;
DROP POLICY IF EXISTS "posts_admin_delete" ON posts;
CREATE POLICY "posts_public_read" ON posts FOR SELECT USING (status = 'Published' OR is_admin_user());
CREATE POLICY "posts_admin_insert" ON posts FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "posts_admin_update" ON posts FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "posts_admin_delete" ON posts FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "rec_admin_insert" ON recommendations;
DROP POLICY IF EXISTS "rec_admin_update" ON recommendations;
DROP POLICY IF EXISTS "rec_admin_delete" ON recommendations;
CREATE POLICY "rec_admin_insert" ON recommendations FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "rec_admin_update" ON recommendations FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "rec_admin_delete" ON recommendations FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "settings_admin_insert" ON site_settings;
DROP POLICY IF EXISTS "settings_admin_update" ON site_settings;
CREATE POLICY "settings_admin_insert" ON site_settings FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "settings_admin_update" ON site_settings FOR UPDATE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "projects_admin_insert" ON projects;
DROP POLICY IF EXISTS "projects_admin_update" ON projects;
DROP POLICY IF EXISTS "projects_admin_delete" ON projects;
CREATE POLICY "projects_admin_insert" ON projects FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "projects_admin_update" ON projects FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "projects_admin_delete" ON projects FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "pubs_admin_insert" ON publications;
DROP POLICY IF EXISTS "pubs_admin_update" ON publications;
DROP POLICY IF EXISTS "pubs_admin_delete" ON publications;
CREATE POLICY "pubs_admin_insert" ON publications FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "pubs_admin_update" ON publications FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "pubs_admin_delete" ON publications FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "cv_edu_admin_insert" ON cv_education;
DROP POLICY IF EXISTS "cv_edu_admin_update" ON cv_education;
DROP POLICY IF EXISTS "cv_edu_admin_delete" ON cv_education;
CREATE POLICY "cv_edu_admin_insert" ON cv_education FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "cv_edu_admin_update" ON cv_education FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "cv_edu_admin_delete" ON cv_education FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "cv_exp_admin_insert" ON cv_experience;
DROP POLICY IF EXISTS "cv_exp_admin_update" ON cv_experience;
DROP POLICY IF EXISTS "cv_exp_admin_delete" ON cv_experience;
CREATE POLICY "cv_exp_admin_insert" ON cv_experience FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "cv_exp_admin_update" ON cv_experience FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "cv_exp_admin_delete" ON cv_experience FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "cv_cert_admin_insert" ON cv_certifications;
DROP POLICY IF EXISTS "cv_cert_admin_update" ON cv_certifications;
DROP POLICY IF EXISTS "cv_cert_admin_delete" ON cv_certifications;
CREATE POLICY "cv_cert_admin_insert" ON cv_certifications FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "cv_cert_admin_update" ON cv_certifications FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "cv_cert_admin_delete" ON cv_certifications FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "pc_admin_insert" ON page_content;
DROP POLICY IF EXISTS "pc_admin_update" ON page_content;
DROP POLICY IF EXISTS "pc_admin_delete" ON page_content;
CREATE POLICY "pc_admin_insert" ON page_content FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "pc_admin_update" ON page_content FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "pc_admin_delete" ON page_content FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "cp_public_read" ON custom_pages;
DROP POLICY IF EXISTS "cp_admin_all" ON custom_pages;
CREATE POLICY "cp_public_read" ON custom_pages FOR SELECT USING (status = 'published' OR is_admin_user());
CREATE POLICY "cp_admin_all" ON custom_pages FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "cps_public_read" ON custom_page_sections;
DROP POLICY IF EXISTS "cps_admin_all" ON custom_page_sections;
CREATE POLICY "cps_public_read" ON custom_page_sections FOR SELECT USING (visible = TRUE OR is_admin_user());
CREATE POLICY "cps_admin_all" ON custom_page_sections FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "nav_public_read" ON navigation_items;
DROP POLICY IF EXISTS "nav_admin_insert" ON navigation_items;
DROP POLICY IF EXISTS "nav_admin_update" ON navigation_items;
DROP POLICY IF EXISTS "nav_admin_delete" ON navigation_items;
CREATE POLICY "nav_public_read" ON navigation_items FOR SELECT USING (visible = true);
CREATE POLICY "nav_admin_insert" ON navigation_items FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "nav_admin_update" ON navigation_items FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "nav_admin_delete" ON navigation_items FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "page_sections_public_read" ON page_sections;
DROP POLICY IF EXISTS "page_sections_admin_insert" ON page_sections;
DROP POLICY IF EXISTS "page_sections_admin_update" ON page_sections;
DROP POLICY IF EXISTS "page_sections_admin_delete" ON page_sections;
CREATE POLICY "page_sections_public_read" ON page_sections FOR SELECT USING (visible = true);
CREATE POLICY "page_sections_admin_insert" ON page_sections FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "page_sections_admin_update" ON page_sections FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "page_sections_admin_delete" ON page_sections FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "story_chapters_public_read" ON story_chapters;
DROP POLICY IF EXISTS "story_chapters_admin_insert" ON story_chapters;
DROP POLICY IF EXISTS "story_chapters_admin_update" ON story_chapters;
DROP POLICY IF EXISTS "story_chapters_admin_delete" ON story_chapters;
CREATE POLICY "story_chapters_public_read" ON story_chapters FOR SELECT USING (visible = true);
CREATE POLICY "story_chapters_admin_insert" ON story_chapters FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "story_chapters_admin_update" ON story_chapters FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "story_chapters_admin_delete" ON story_chapters FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "story_milestones_public_read" ON story_milestones;
DROP POLICY IF EXISTS "story_milestones_admin_insert" ON story_milestones;
DROP POLICY IF EXISTS "story_milestones_admin_update" ON story_milestones;
DROP POLICY IF EXISTS "story_milestones_admin_delete" ON story_milestones;
CREATE POLICY "story_milestones_public_read" ON story_milestones FOR SELECT USING (true);
CREATE POLICY "story_milestones_admin_insert" ON story_milestones FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "story_milestones_admin_update" ON story_milestones FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "story_milestones_admin_delete" ON story_milestones FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "bookshelf_public_read" ON bookshelf_entries;
DROP POLICY IF EXISTS "bookshelf_admin_insert" ON bookshelf_entries;
DROP POLICY IF EXISTS "bookshelf_admin_update" ON bookshelf_entries;
DROP POLICY IF EXISTS "bookshelf_admin_delete" ON bookshelf_entries;
CREATE POLICY "bookshelf_public_read" ON bookshelf_entries FOR SELECT USING (status = 'published' OR is_admin_user());
CREATE POLICY "bookshelf_admin_insert" ON bookshelf_entries FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "bookshelf_admin_update" ON bookshelf_entries FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "bookshelf_admin_delete" ON bookshelf_entries FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "contact_links_public_read" ON contact_links;
DROP POLICY IF EXISTS "contact_links_admin_insert" ON contact_links;
DROP POLICY IF EXISTS "contact_links_admin_update" ON contact_links;
DROP POLICY IF EXISTS "contact_links_admin_delete" ON contact_links;
CREATE POLICY "contact_links_public_read" ON contact_links FOR SELECT USING (visible = true);
CREATE POLICY "contact_links_admin_insert" ON contact_links FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "contact_links_admin_update" ON contact_links FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "contact_links_admin_delete" ON contact_links FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "msg_anon_insert" ON contact_messages;
DROP POLICY IF EXISTS "msg_admin_select" ON contact_messages;
DROP POLICY IF EXISTS "msg_admin_update" ON contact_messages;
DROP POLICY IF EXISTS "msg_admin_delete" ON contact_messages;
CREATE POLICY "msg_anon_insert" ON contact_messages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "msg_admin_select" ON contact_messages FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY "msg_admin_update" ON contact_messages FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "msg_admin_delete" ON contact_messages FOR DELETE TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "newsletter_anon_insert" ON newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_admin_select" ON newsletter_subscribers;
CREATE POLICY "newsletter_anon_insert" ON newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "newsletter_admin_select" ON newsletter_subscribers FOR SELECT TO authenticated USING (is_admin_user());

DROP POLICY IF EXISTS "views_anon_insert" ON post_views;
DROP POLICY IF EXISTS "views_auth_insert" ON post_views;
DROP POLICY IF EXISTS "views_admin_select" ON post_views;
CREATE POLICY "views_anon_insert" ON post_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "views_auth_insert" ON post_views FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "views_admin_select" ON post_views FOR SELECT TO authenticated USING (is_admin_user());

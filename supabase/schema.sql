-- ============================================================================
-- Blog Website — Complete Database Schema
-- ============================================================================
-- Execute this in your Supabase SQL Editor to set up or reset the database.
--
-- SECURITY: All write policies (INSERT/UPDATE/DELETE) on content tables are
-- locked to a single admin user. After creating your admin account in
-- Supabase Auth, replace every occurrence of:
--   '0010291f-acd6-4594-87aa-9c13f5acfccf'
-- with your actual auth.users UUID. You can find it in the Supabase
-- dashboard under Authentication → Users.
-- ============================================================================

-- ─── Cleanup existing objects ───────────────────────────────────────

DROP VIEW IF EXISTS post_statistics CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT proname, oidvectortypes(proargtypes) as args
           FROM pg_proc INNER JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid)
           WHERE ns.nspname = 'public' AND proname IN ('record_page_view', 'handle_new_user', 'update_updated_at_column')
  LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS ' || r.proname || '(' || r.args || ') CASCADE';
  END LOOP;
END $$;

-- ─── Utility function ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Posts ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  excerpt     TEXT,
  cover_image TEXT,
  category    TEXT DEFAULT 'General',
  date        TEXT DEFAULT to_char(NOW(), 'Month DD, YYYY'),
  status      TEXT DEFAULT 'Draft',
  tags        TEXT[] DEFAULT '{}',
  is_initial  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_public_read"   ON posts FOR SELECT USING (true);
CREATE POLICY "posts_admin_insert"  ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "posts_admin_update"  ON posts FOR UPDATE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "posts_admin_delete"  ON posts FOR DELETE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE INDEX IF NOT EXISTS idx_posts_date   ON posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_tags   ON posts USING GIN(tags);

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Recommendations ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recommendations (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT NOT NULL,
  url            TEXT NOT NULL,
  description    TEXT NOT NULL,
  type           TEXT NOT NULL DEFAULT 'Article',
  thumbnail      TEXT,
  difficulty     TEXT,
  estimated_time TEXT,
  author_note    TEXT,
  tags           TEXT[],
  is_featured    BOOLEAN DEFAULT FALSE,
  is_initial     BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rec_public_read"   ON recommendations FOR SELECT USING (true);
CREATE POLICY "rec_admin_insert"  ON recommendations FOR INSERT TO authenticated WITH CHECK (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "rec_admin_update"  ON recommendations FOR UPDATE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "rec_admin_delete"  ON recommendations FOR DELETE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Site Settings ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_settings (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  featured_post_id  UUID REFERENCES posts(id) ON DELETE SET NULL,
  site_title        TEXT DEFAULT 'My Blog',
  site_name         TEXT DEFAULT 'My Blog',
  site_description  TEXT,
  author_name       TEXT,
  author_tagline    TEXT,
  author_bio        TEXT,
  social_github     TEXT,
  social_linkedin   TEXT,
  social_email      TEXT,
  social_twitter    TEXT,
  social_instagram  TEXT,
  social_youtube    TEXT,
  social_discord    TEXT,
  categories        JSONB DEFAULT '[]',
  skills            JSONB DEFAULT '[]',
  timeline          JSONB DEFAULT '[]',
  achievements      JSONB DEFAULT '[]',
  ui_text           JSONB,
  appearance        JSONB DEFAULT '{"primaryColor":"#6366f1","accentColor":"#f59e0b","fontFamily":"Inter","logoUrl":"","faviconUrl":"","defaultTheme":"dark"}',
  navigation        JSONB,
  seo               JSONB,
  homepage_layout   JSONB DEFAULT '{"showHero":true,"showFeaturedPost":true,"showTrendingTopics":true,"showLatestArticles":true,"showNewsletter":true}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_public_read"   ON site_settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_insert"  ON site_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "settings_admin_update"  ON site_settings FOR UPDATE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE INDEX IF NOT EXISTS idx_site_settings_featured ON site_settings(featured_post_id);

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Projects ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  long_description TEXT,
  tech_stack       TEXT[] DEFAULT '{}',
  image_url        TEXT,
  live_url         TEXT,
  github_url       TEXT,
  sort_order       INT DEFAULT 0,
  is_featured      BOOLEAN DEFAULT FALSE,
  status           TEXT DEFAULT 'active',
  is_initial       BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_public_read"   ON projects FOR SELECT USING (true);
CREATE POLICY "projects_admin_insert"  ON projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "projects_admin_update"  ON projects FOR UPDATE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "projects_admin_delete"  ON projects FOR DELETE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Publications ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS publications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  authors     TEXT[] NOT NULL DEFAULT '{}',
  venue       TEXT NOT NULL,
  year        INT NOT NULL,
  abstract    TEXT,
  doi_url     TEXT,
  arxiv_url   TEXT,
  pdf_url     TEXT,
  code_url    TEXT,
  slides_url  TEXT,
  bibtex      TEXT,
  type        TEXT DEFAULT 'preprint',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order  INT DEFAULT 0,
  is_initial  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pubs_public_read"   ON publications FOR SELECT USING (true);
CREATE POLICY "pubs_admin_insert"  ON publications FOR INSERT TO authenticated WITH CHECK (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "pubs_admin_update"  ON publications FOR UPDATE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "pubs_admin_delete"  ON publications FOR DELETE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON publications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── CV: Education ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cv_education (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree      TEXT NOT NULL,
  field       TEXT,
  start_date  TEXT NOT NULL,
  end_date    TEXT,
  description TEXT,
  sort_order  INT DEFAULT 0,
  is_initial  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cv_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cv_edu_public_read"   ON cv_education FOR SELECT USING (true);
CREATE POLICY "cv_edu_admin_insert"  ON cv_education FOR INSERT TO authenticated WITH CHECK (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "cv_edu_admin_update"  ON cv_education FOR UPDATE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "cv_edu_admin_delete"  ON cv_education FOR DELETE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE TRIGGER update_cv_education_updated_at BEFORE UPDATE ON cv_education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── CV: Experience ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cv_experience (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company          TEXT NOT NULL,
  position         TEXT NOT NULL,
  start_date       TEXT NOT NULL,
  end_date         TEXT,
  description      TEXT,
  responsibilities TEXT[] DEFAULT '{}',
  sort_order       INT DEFAULT 0,
  is_initial       BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cv_experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cv_exp_public_read"   ON cv_experience FOR SELECT USING (true);
CREATE POLICY "cv_exp_admin_insert"  ON cv_experience FOR INSERT TO authenticated WITH CHECK (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "cv_exp_admin_update"  ON cv_experience FOR UPDATE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "cv_exp_admin_delete"  ON cv_experience FOR DELETE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE TRIGGER update_cv_experience_updated_at BEFORE UPDATE ON cv_experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── CV: Certifications ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cv_certifications (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT NOT NULL,
  issuer         TEXT NOT NULL,
  issue_date     TEXT NOT NULL,
  expiry_date    TEXT,
  credential_url TEXT,
  sort_order     INT DEFAULT 0,
  is_initial     BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cv_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cv_cert_public_read"   ON cv_certifications FOR SELECT USING (true);
CREATE POLICY "cv_cert_admin_insert"  ON cv_certifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "cv_cert_admin_update"  ON cv_certifications FOR UPDATE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "cv_cert_admin_delete"  ON cv_certifications FOR DELETE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE TRIGGER update_cv_certifications_updated_at BEFORE UPDATE ON cv_certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Page Content ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS page_content (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name   TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title       TEXT,
  content     JSONB,
  metadata    JSONB,
  sort_order  INT DEFAULT 0,
  is_initial  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_name, section_key)
);

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pc_public_read"   ON page_content FOR SELECT USING (true);
CREATE POLICY "pc_admin_insert"  ON page_content FOR INSERT TO authenticated WITH CHECK (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "pc_admin_update"  ON page_content FOR UPDATE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "pc_admin_delete"  ON page_content FOR DELETE TO authenticated USING  (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Custom Pages ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS custom_pages (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title               TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  description         TEXT,
  meta_title          TEXT,
  meta_description    TEXT,
  og_image            TEXT,
  layout              TEXT DEFAULT 'default',
  status              TEXT DEFAULT 'draft',
  sort_order          INT DEFAULT 0,
  show_in_navigation  BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cp_public_read"   ON custom_pages FOR SELECT USING (status = 'published');
CREATE POLICY "cp_admin_all"     ON custom_pages FOR ALL TO authenticated USING (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid) WITH CHECK (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE TRIGGER update_custom_pages_updated_at BEFORE UPDATE ON custom_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Custom Page Sections ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS custom_page_sections (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id      UUID NOT NULL REFERENCES custom_pages(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  title        TEXT,
  subtitle     TEXT,
  content      TEXT,
  image_url    TEXT,
  metadata     JSONB,
  sort_order   INT DEFAULT 0,
  visible      BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE custom_page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cps_public_read"  ON custom_page_sections FOR SELECT USING (visible = TRUE);
CREATE POLICY "cps_admin_all"    ON custom_page_sections FOR ALL TO authenticated USING (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid) WITH CHECK (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE TRIGGER update_custom_page_sections_updated_at BEFORE UPDATE ON custom_page_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Bookmarks (per-user) ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS bookmarks (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarks_own" ON bookmarks FOR ALL TO authenticated
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Comments (per-user) ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS comments (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    TEXT NOT NULL,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  parent_id  UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_public_read"  ON comments FOR SELECT USING (true);
CREATE POLICY "comments_user_insert"  ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_user_update"  ON comments FOR UPDATE TO authenticated USING  (auth.uid() = user_id);
CREATE POLICY "comments_user_delete"  ON comments FOR DELETE TO authenticated USING  (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_comments_post   ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user   ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- ─── Contact Messages (public insert, admin read) ──────────────────

CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "msg_anon_insert"   ON contact_messages FOR INSERT TO anon      WITH CHECK (true);
CREATE POLICY "msg_admin_select"  ON contact_messages FOR SELECT TO authenticated USING (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "msg_admin_update"  ON contact_messages FOR UPDATE TO authenticated USING (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
CREATE POLICY "msg_admin_delete"  ON contact_messages FOR DELETE TO authenticated USING (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

-- ─── Newsletter Subscribers (public insert, admin read) ─────────────

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_anon_insert"   ON newsletter_subscribers FOR INSERT TO anon      WITH CHECK (true);
CREATE POLICY "newsletter_admin_select"  ON newsletter_subscribers FOR SELECT TO authenticated USING (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

-- ─── Post Views (analytics) ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS post_views (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id      TEXT NOT NULL,
  viewer_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash      TEXT NOT NULL,
  user_agent   TEXT,
  referrer     TEXT,
  country_code TEXT,
  session_id   TEXT,
  viewed_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "views_anon_insert"  ON post_views FOR INSERT TO anon         WITH CHECK (true);
CREATE POLICY "views_auth_insert"  ON post_views FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "views_admin_select" ON post_views FOR SELECT TO authenticated USING (auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

CREATE INDEX IF NOT EXISTS idx_post_views_post ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_time ON post_views(viewed_at);

-- Aggregated analytics view
CREATE VIEW post_statistics AS
SELECT
  post_id,
  COUNT(*)                                                          AS total_views,
  COUNT(DISTINCT ip_hash)                                           AS unique_views,
  COUNT(*) FILTER (WHERE viewed_at >= NOW() - INTERVAL '7 days')    AS views_last_7_days,
  COUNT(*) FILTER (WHERE viewed_at >= NOW() - INTERVAL '30 days')   AS views_last_30_days,
  MAX(viewed_at)                                                    AS last_viewed_at
FROM post_views
GROUP BY post_id;

-- Function to record a page view (callable by anon and authenticated)
CREATE FUNCTION record_page_view(
  p_post_id      TEXT,
  p_ip_hash      TEXT,
  p_user_agent   TEXT DEFAULT NULL,
  p_referrer     TEXT DEFAULT NULL,
  p_country_code TEXT DEFAULT NULL,
  p_session_id   TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO post_views (post_id, viewer_id, ip_hash, user_agent, referrer, country_code, session_id)
  VALUES (p_post_id, auth.uid(), p_ip_hash, p_user_agent, p_referrer, p_country_code, p_session_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION record_page_view TO anon, authenticated;

-- ─── Profiles (auto-created on signup) ──────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name  TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_read"  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_insert"   ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_own_update"   ON profiles FOR UPDATE TO authenticated USING  (auth.uid() = id);

-- Auto-create profile on new user signup
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Default seed data ──────────────────────────────────────────────

INSERT INTO site_settings (site_name, site_title, site_description, author_name, author_tagline, author_bio)
SELECT 'My Blog', 'My Blog', 'Welcome to my blog', 'Your Name', 'Developer & Writer', 'I write about technology.'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- ─── Storage bucket ─────────────────────────────────────────────────
-- Run this separately in the Supabase dashboard or via the API:
--
--   INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', TRUE);
--
--   CREATE POLICY "media_public_read"  ON storage.objects FOR SELECT USING (bucket_id = 'media');
--   CREATE POLICY "media_admin_upload" ON storage.objects FOR INSERT TO authenticated
--     WITH CHECK (bucket_id = 'media' AND auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);
--   CREATE POLICY "media_admin_delete" ON storage.objects FOR DELETE TO authenticated
--     USING (bucket_id = 'media' AND auth.uid() = '0010291f-acd6-4594-87aa-9c13f5acfccf'::uuid);

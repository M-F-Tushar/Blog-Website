-- ============================================================================
-- Blog Website — Complete Database Schema
-- ============================================================================
-- Execute this in your Supabase SQL Editor to set up or reset the database.
--
-- SECURITY: Admin write access is controlled through public.admin_users.
-- After creating your admin account in Supabase Auth, insert its UUID into
-- public.admin_users and optionally store the email for easier setup.
-- Example:
--   INSERT INTO public.admin_users (user_id, email) VALUES ('your-auth-user-uuid', 'admin@example.com');
-- You can find the UUID in Supabase Authentication > Users.
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
           WHERE ns.nspname = 'public' AND proname IN ('record_page_view', 'handle_new_user', 'update_updated_at_column', 'is_admin_user')
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

CREATE TABLE IF NOT EXISTS admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
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

CREATE POLICY "admin_users_self_read"
  ON admin_users FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_users_admin_manage"
  ON admin_users FOR ALL TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

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

CREATE POLICY "posts_public_read"   ON posts FOR SELECT USING (status = 'Published' OR is_admin_user());
CREATE POLICY "posts_admin_insert"  ON posts FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "posts_admin_update"  ON posts FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "posts_admin_delete"  ON posts FOR DELETE TO authenticated USING  (is_admin_user());

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
CREATE POLICY "rec_admin_insert"  ON recommendations FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "rec_admin_update"  ON recommendations FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "rec_admin_delete"  ON recommendations FOR DELETE TO authenticated USING  (is_admin_user());

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
  author_image      TEXT,
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
CREATE POLICY "settings_admin_insert"  ON site_settings FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "settings_admin_update"  ON site_settings FOR UPDATE TO authenticated USING  (is_admin_user());

CREATE INDEX IF NOT EXISTS idx_site_settings_featured ON site_settings(featured_post_id);

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Projects ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE,
  description      TEXT NOT NULL,
  long_description TEXT,
  tags             TEXT[] DEFAULT '{}',
  tech_stack       TEXT[] DEFAULT '{}',
  image_url        TEXT,
  live_url         TEXT,
  github_url       TEXT,
  problem          TEXT,
  motivation       TEXT,
  approach         TEXT,
  architecture     TEXT,
  implementation   TEXT,
  challenges       TEXT,
  lessons_learned  TEXT,
  future_improvements TEXT,
  sort_order       INT DEFAULT 0,
  is_featured      BOOLEAN DEFAULT FALSE,
  status           TEXT DEFAULT 'active',
  is_initial       BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_public_read"   ON projects FOR SELECT USING (true);
CREATE POLICY "projects_admin_insert"  ON projects FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "projects_admin_update"  ON projects FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "projects_admin_delete"  ON projects FOR DELETE TO authenticated USING  (is_admin_user());

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

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
CREATE POLICY "pubs_admin_insert"  ON publications FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "pubs_admin_update"  ON publications FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "pubs_admin_delete"  ON publications FOR DELETE TO authenticated USING  (is_admin_user());

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
  gpa         TEXT,
  location    TEXT,
  sort_order  INT DEFAULT 0,
  is_initial  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cv_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cv_edu_public_read"   ON cv_education FOR SELECT USING (true);
CREATE POLICY "cv_edu_admin_insert"  ON cv_education FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "cv_edu_admin_update"  ON cv_education FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "cv_edu_admin_delete"  ON cv_education FOR DELETE TO authenticated USING  (is_admin_user());

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
  location         TEXT,
  responsibilities TEXT[] DEFAULT '{}',
  sort_order       INT DEFAULT 0,
  is_initial       BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cv_experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cv_exp_public_read"   ON cv_experience FOR SELECT USING (true);
CREATE POLICY "cv_exp_admin_insert"  ON cv_experience FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "cv_exp_admin_update"  ON cv_experience FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "cv_exp_admin_delete"  ON cv_experience FOR DELETE TO authenticated USING  (is_admin_user());

CREATE TRIGGER update_cv_experience_updated_at BEFORE UPDATE ON cv_experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── CV: Certifications ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cv_certifications (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT NOT NULL,
  issuer         TEXT NOT NULL,
  issue_date     TEXT NOT NULL,
  expiry_date    TEXT,
  credential_id  TEXT,
  credential_url TEXT,
  description    TEXT,
  sort_order     INT DEFAULT 0,
  is_initial     BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cv_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cv_cert_public_read"   ON cv_certifications FOR SELECT USING (true);
CREATE POLICY "cv_cert_admin_insert"  ON cv_certifications FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "cv_cert_admin_update"  ON cv_certifications FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "cv_cert_admin_delete"  ON cv_certifications FOR DELETE TO authenticated USING  (is_admin_user());

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
CREATE POLICY "pc_admin_insert"  ON page_content FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "pc_admin_update"  ON page_content FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "pc_admin_delete"  ON page_content FOR DELETE TO authenticated USING  (is_admin_user());

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

CREATE POLICY "cp_public_read"   ON custom_pages FOR SELECT USING (status = 'published' OR is_admin_user());
CREATE POLICY "cp_admin_all"     ON custom_pages FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

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

CREATE POLICY "cps_public_read"  ON custom_page_sections FOR SELECT USING (visible = TRUE OR is_admin_user());
CREATE POLICY "cps_admin_all"    ON custom_page_sections FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE TRIGGER update_custom_page_sections_updated_at BEFORE UPDATE ON custom_page_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ——— Navigation Items ————————————————————————————————————————————————————————————

CREATE TABLE IF NOT EXISTS navigation_items (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label        TEXT NOT NULL,
  path         TEXT NOT NULL,
  is_external  BOOLEAN DEFAULT FALSE,
  visible      BOOLEAN DEFAULT TRUE,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nav_public_read"    ON navigation_items FOR SELECT USING (visible = true);
CREATE POLICY "nav_admin_insert"   ON navigation_items FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "nav_admin_update"   ON navigation_items FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "nav_admin_delete"   ON navigation_items FOR DELETE TO authenticated USING  (is_admin_user());

CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON navigation_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ——— Page Sections ——————————————————————————————————————————————————————————————

CREATE TABLE IF NOT EXISTS page_sections (
  id                         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key                   TEXT NOT NULL,
  section_key                TEXT NOT NULL,
  section_type               TEXT NOT NULL DEFAULT 'content',
  preset_key                 TEXT,
  eyebrow                    TEXT,
  title                      TEXT,
  subtitle                   TEXT,
  body                       TEXT,
  primary_cta_label          TEXT,
  primary_cta_url            TEXT,
  secondary_cta_label        TEXT,
  secondary_cta_url          TEXT,
  layout_variant             TEXT DEFAULT 'feature-left',
  visual_tone                TEXT DEFAULT 'default',
  density                    TEXT DEFAULT 'balanced',
  background_treatment       TEXT DEFAULT 'panel',
  content_alignment          TEXT DEFAULT 'left',
  media_mode                 TEXT DEFAULT 'none',
  content_collection         TEXT DEFAULT 'none',
  content_source             TEXT DEFAULT 'static',
  kicker_style               TEXT DEFAULT 'default',
  section_role               TEXT DEFAULT 'guide',
  animation_preset           TEXT DEFAULT 'quiet-fade',
  content_grouping           TEXT DEFAULT 'none',
  content_emphasis           TEXT DEFAULT 'supporting',
  max_items                  INT DEFAULT 3,
  show_divider               BOOLEAN DEFAULT FALSE,
  featured_project_id        UUID REFERENCES projects(id) ON DELETE SET NULL,
  featured_post_id           UUID REFERENCES posts(id) ON DELETE SET NULL,
  featured_bookshelf_entry_id UUID,
  manual_item_ids            TEXT[] DEFAULT '{}',
  metadata                   JSONB DEFAULT '{}'::jsonb,
  visible                    BOOLEAN DEFAULT TRUE,
  sort_order                 INT DEFAULT 0,
  created_at                 TIMESTAMPTZ DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_key, section_key)
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_sections_public_read"  ON page_sections FOR SELECT USING (visible = true);
CREATE POLICY "page_sections_admin_insert" ON page_sections FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "page_sections_admin_update" ON page_sections FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "page_sections_admin_delete" ON page_sections FOR DELETE TO authenticated USING  (is_admin_user());

CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON page_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ——— Story Chapters & Milestones ——————————————————————————————————————————————

CREATE TABLE IF NOT EXISTS story_chapters (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT NOT NULL,
  subtitle       TEXT,
  body           TEXT NOT NULL,
  period_label   TEXT,
  featured_media TEXT,
  visible        BOOLEAN DEFAULT TRUE,
  sort_order     INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE story_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "story_chapters_public_read"  ON story_chapters FOR SELECT USING (visible = true);
CREATE POLICY "story_chapters_admin_insert" ON story_chapters FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "story_chapters_admin_update" ON story_chapters FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "story_chapters_admin_delete" ON story_chapters FOR DELETE TO authenticated USING  (is_admin_user());

CREATE TRIGGER update_story_chapters_updated_at BEFORE UPDATE ON story_chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS story_milestones (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id   UUID REFERENCES story_chapters(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  period_label TEXT,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE story_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "story_milestones_public_read"  ON story_milestones FOR SELECT USING (true);
CREATE POLICY "story_milestones_admin_insert" ON story_milestones FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "story_milestones_admin_update" ON story_milestones FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "story_milestones_admin_delete" ON story_milestones FOR DELETE TO authenticated USING  (is_admin_user());

CREATE TRIGGER update_story_milestones_updated_at BEFORE UPDATE ON story_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ——— Bookshelf Entries ——————————————————————————————————————————————————————————

CREATE TABLE IF NOT EXISTS bookshelf_entries (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  entry_type      TEXT NOT NULL DEFAULT 'reflection',
  book_title      TEXT NOT NULL,
  author          TEXT,
  cover_image     TEXT,
  summary         TEXT,
  body            TEXT NOT NULL,
  tags            TEXT[] DEFAULT '{}',
  rating          NUMERIC(3,1),
  status          TEXT NOT NULL DEFAULT 'draft',
  is_featured     BOOLEAN DEFAULT FALSE,
  is_pinned       BOOLEAN DEFAULT FALSE,
  sort_order      INT DEFAULT 0,
  seo_title       TEXT,
  seo_description TEXT,
  published_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookshelf_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookshelf_public_read"  ON bookshelf_entries FOR SELECT USING (status = 'published' OR is_admin_user());
CREATE POLICY "bookshelf_admin_insert" ON bookshelf_entries FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "bookshelf_admin_update" ON bookshelf_entries FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "bookshelf_admin_delete" ON bookshelf_entries FOR DELETE TO authenticated USING  (is_admin_user());

CREATE TRIGGER update_bookshelf_entries_updated_at BEFORE UPDATE ON bookshelf_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ——— Contact Links ————————————————————————————————————————————————————————————

CREATE TABLE IF NOT EXISTS contact_links (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label        TEXT NOT NULL,
  url          TEXT NOT NULL,
  link_type    TEXT NOT NULL DEFAULT 'external',
  description  TEXT,
  visible      BOOLEAN DEFAULT TRUE,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_links_public_read"  ON contact_links FOR SELECT USING (visible = true);
CREATE POLICY "contact_links_admin_insert" ON contact_links FOR INSERT TO authenticated WITH CHECK (is_admin_user());
CREATE POLICY "contact_links_admin_update" ON contact_links FOR UPDATE TO authenticated USING  (is_admin_user());
CREATE POLICY "contact_links_admin_delete" ON contact_links FOR DELETE TO authenticated USING  (is_admin_user());

CREATE TRIGGER update_contact_links_updated_at BEFORE UPDATE ON contact_links
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
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "msg_anon_insert"   ON contact_messages FOR INSERT TO anon      WITH CHECK (true);
CREATE POLICY "msg_admin_select"  ON contact_messages FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY "msg_admin_update"  ON contact_messages FOR UPDATE TO authenticated USING (is_admin_user());
CREATE POLICY "msg_admin_delete"  ON contact_messages FOR DELETE TO authenticated USING (is_admin_user());

-- ─── Newsletter Subscribers (public insert, admin read) ─────────────

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active     BOOLEAN DEFAULT TRUE
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_anon_insert"   ON newsletter_subscribers FOR INSERT TO anon      WITH CHECK (true);
CREATE POLICY "newsletter_admin_select"  ON newsletter_subscribers FOR SELECT TO authenticated USING (is_admin_user());

-- ─── Post Views (analytics) ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS post_views (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id      TEXT NOT NULL,
  viewer_ip    TEXT,
  user_agent   TEXT,
  referrer     TEXT,
  session_id   TEXT,
  viewed_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "views_anon_insert"  ON post_views FOR INSERT TO anon         WITH CHECK (true);
CREATE POLICY "views_auth_insert"  ON post_views FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "views_admin_select" ON post_views FOR SELECT TO authenticated USING (is_admin_user());

CREATE INDEX IF NOT EXISTS idx_post_views_post ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_time ON post_views(viewed_at);

-- Aggregated analytics view
CREATE VIEW post_statistics AS
SELECT
  p.id                                                                AS post_id,
  p.title                                                             AS title,
  p.category                                                          AS category,
  p.status                                                            AS status,
  COUNT(v.id)                                                         AS total_views,
  COUNT(DISTINCT COALESCE(v.session_id, v.viewer_ip, v.id::text))     AS unique_views,
  COUNT(v.id) FILTER (WHERE v.viewed_at >= NOW() - INTERVAL '7 days') AS views_last_7_days,
  COUNT(v.id) FILTER (WHERE v.viewed_at >= NOW() - INTERVAL '30 days') AS views_last_30_days
FROM posts p
LEFT JOIN post_views v ON v.post_id = p.id
GROUP BY p.id, p.title, p.category, p.status;

-- Function to record a page view (callable by anon and authenticated)
CREATE FUNCTION record_page_view(
  p_post_id      TEXT,
  p_session_id   TEXT,
  p_referrer     TEXT DEFAULT NULL,
  p_user_agent   TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Rate limit: skip if same session already viewed this post in the last hour
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

INSERT INTO navigation_items (label, path, sort_order)
SELECT * FROM (
  VALUES
    ('Home', '/', 0),
    ('My Story', '/story', 1),
    ('The Lab', '/lab', 2),
    ('The Garden', '/garden', 3),
    ('Bookshelf', '/bookshelf', 4),
    ('Connect', '/connect', 5)
) AS seed(label, path, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM navigation_items LIMIT 1);

INSERT INTO contact_links (label, url, link_type, description, sort_order)
SELECT * FROM (
  VALUES
    ('Email', 'mailto:your.email@example.com', 'email', 'The best place to reach out.', 0),
    ('GitHub', 'https://github.com/your-handle', 'github', 'Projects, experiments, and source code.', 1),
    ('LinkedIn', 'https://linkedin.com/in/your-handle', 'linkedin', 'Optional professional profile.', 2)
 ) AS seed(label, url, link_type, description, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM contact_links LIMIT 1);

INSERT INTO page_sections (
  page_key,
  section_key,
  section_type,
  eyebrow,
  title,
  subtitle,
  body,
  primary_cta_label,
  primary_cta_url,
  secondary_cta_label,
  secondary_cta_url,
  sort_order
)
SELECT * FROM (
  VALUES
    ('home', 'hero', 'hero', 'Computer Science Student', 'Exploring AI, ML, and systems by learning and building in public.', 'A personal platform for projects, study notes, and long-term growth.', 'I am a CSE student documenting what I learn, what I build, and the engineer I am becoming.', 'Enter the garden', '/garden', 'See the lab', '/lab', 0),
    ('home', 'current-focus', 'content', 'Current focus', 'What I am studying right now', NULL, 'Large language models, machine learning fundamentals, and building practical AI projects.', NULL, NULL, NULL, NULL, 1),
    ('home', 'featured-project', 'featured-project', 'Featured build', 'A project I am actively shaping', NULL, 'Use this section to point visitors toward the most representative thing you are building.', NULL, NULL, NULL, NULL, 2),
    ('home', 'latest-notes', 'featured-garden', 'Latest learning notes', 'Recent notes from the garden', NULL, 'A quick view into what you are currently learning and explaining.', NULL, NULL, NULL, NULL, 3),
    ('home', 'story-preview', 'content', 'My story', 'How I ended up here', NULL, 'A narrative page about how curiosity, computer science, and AI started fitting together for me.', 'Read my story', '/story', NULL, NULL, 4),
    ('home', 'bookshelf-preview', 'featured-bookshelf', 'Bookshelf', 'The reading life behind the work', NULL, 'Reflections on books, fiction, and ideas that shape how I think beyond code.', 'Visit the bookshelf', '/bookshelf', NULL, NULL, 5),
    ('home', 'connect', 'content', 'Connect', 'Let’s stay in touch', NULL, 'Reach out for thoughtful conversation, collaboration, or project feedback.', 'Contact me', '/connect', NULL, NULL, 6)
) AS seed(page_key, section_key, section_type, eyebrow, title, subtitle, body, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM page_sections LIMIT 1);

UPDATE page_sections
SET
  preset_key = CASE section_key
    WHEN 'hero' THEN 'editorial-hero'
    WHEN 'current-focus' THEN 'split-feature'
    WHEN 'featured-project' THEN 'technical-highlight'
    WHEN 'latest-notes' THEN 'archive-grid'
    WHEN 'story-preview' THEN 'quiet-reflection'
    WHEN 'bookshelf-preview' THEN 'quiet-reflection'
    WHEN 'connect' THEN 'cta-band'
    ELSE preset_key
  END,
  layout_variant = CASE section_key
    WHEN 'hero' THEN 'hero-split'
    WHEN 'story-preview' THEN 'feature-right'
    WHEN 'bookshelf-preview' THEN 'feature-right'
    WHEN 'connect' THEN 'cta-band'
    ELSE COALESCE(layout_variant, 'feature-left')
  END,
  visual_tone = CASE section_key
    WHEN 'featured-project' THEN 'technical'
    WHEN 'bookshelf-preview' THEN 'warm'
    WHEN 'story-preview' THEN 'quiet'
    WHEN 'latest-notes' THEN 'quiet'
    WHEN 'connect' THEN 'warm'
    ELSE COALESCE(visual_tone, 'editorial')
  END,
  density = CASE section_key
    WHEN 'hero' THEN 'airy'
    WHEN 'latest-notes' THEN 'compact'
    ELSE COALESCE(density, 'balanced')
  END,
  background_treatment = CASE section_key
    WHEN 'hero' THEN 'gradient-soft'
    WHEN 'featured-project' THEN 'panel-strong'
    WHEN 'latest-notes' THEN 'none'
    WHEN 'story-preview' THEN 'paper'
    WHEN 'bookshelf-preview' THEN 'paper'
    WHEN 'connect' THEN 'panel'
    ELSE COALESCE(background_treatment, 'panel')
  END,
  content_alignment = CASE section_key
    WHEN 'hero' THEN 'split'
    WHEN 'featured-project' THEN 'split'
    WHEN 'story-preview' THEN 'split'
    WHEN 'bookshelf-preview' THEN 'split'
    WHEN 'connect' THEN 'split'
    ELSE COALESCE(content_alignment, 'left')
  END,
  media_mode = CASE section_key
    WHEN 'hero' THEN 'portrait'
    WHEN 'featured-project' THEN 'icon'
    ELSE COALESCE(media_mode, 'none')
  END,
  content_collection = CASE section_key
    WHEN 'featured-project' THEN 'projects'
    WHEN 'latest-notes' THEN 'posts'
    WHEN 'bookshelf-preview' THEN 'bookshelf'
    WHEN 'connect' THEN 'contact-links'
    ELSE COALESCE(content_collection, 'none')
  END,
  content_source = CASE section_key
    WHEN 'featured-project' THEN 'featured'
    WHEN 'latest-notes' THEN 'latest'
    WHEN 'bookshelf-preview' THEN 'featured'
    WHEN 'connect' THEN 'latest'
    ELSE COALESCE(content_source, 'static')
  END,
  kicker_style = CASE section_key
    WHEN 'hero' THEN 'strong'
    WHEN 'featured-project' THEN 'strong'
    WHEN 'story-preview' THEN 'soft'
    WHEN 'bookshelf-preview' THEN 'soft'
    WHEN 'connect' THEN 'strong'
    ELSE COALESCE(kicker_style, 'default')
  END,
  max_items = CASE section_key
    WHEN 'latest-notes' THEN 3
    WHEN 'connect' THEN 3
    ELSE COALESCE(max_items, 1)
  END,
  show_divider = CASE section_key
    WHEN 'current-focus' THEN TRUE
    WHEN 'featured-project' THEN TRUE
    WHEN 'story-preview' THEN TRUE
    ELSE COALESCE(show_divider, FALSE)
  END,
  metadata = CASE section_key
    WHEN 'story-preview' THEN '{"panelKicker":"Chapter preview","panelBody":"Use this space to tease the earliest turning point in your story."}'::jsonb
    ELSE COALESCE(metadata, '{}'::jsonb)
  END
WHERE page_key = 'home';

INSERT INTO page_sections (
  page_key,
  section_key,
  section_type,
  preset_key,
  eyebrow,
  title,
  subtitle,
  body,
  layout_variant,
  visual_tone,
  density,
  background_treatment,
  content_alignment,
  media_mode,
  content_collection,
  content_source,
  kicker_style,
  max_items,
  show_divider,
  metadata,
  sort_order
)
VALUES
  ('story', 'hero', 'hero', 'editorial-hero', 'My Story', 'A personal timeline of curiosity, computer science, and gradually finding direction in AI.', 'This is not a resume. It is a chapter-based narrative about how technology became meaningful to me and what kind of engineer I am trying to become.', NULL, 'hero-split', 'editorial', 'airy', 'gradient-soft', 'split', 'none', 'none', 'static', 'strong', 1, FALSE, '{"panelKicker":"Current ambition","panelBody":"Build strong technical foundations, document the learning process honestly, and grow into someone who can shape useful AI systems with care."}'::jsonb, 0),
  ('story', 'chapters', 'story-stream', 'split-feature', 'Chapters', 'The journey in chapters', NULL, 'A quieter stream of chapters and milestones instead of a list of credentials.', 'stacked-story', 'editorial', 'airy', 'none', 'left', 'none', 'none', 'latest', 'default', 8, FALSE, '{}'::jsonb, 1),
  ('lab', 'hero', 'hero', 'editorial-hero', 'The Lab', 'Projects that turn study into systems, experiments, and working software.', 'Each project is treated as a case study: what problem it tackled, how it was built, what went wrong, and what it taught me.', NULL, 'hero-split', 'technical', 'airy', 'gradient-soft', 'split', 'none', 'none', 'static', 'strong', 1, FALSE, '{"panelKicker":"Project signals","panelItems":["Featured case studies come first.","Archive projects stay lighter and faster to scan.","Statuses reflect where the work stands now."]}'::jsonb, 0),
  ('lab', 'featured', 'featured-project', 'technical-highlight', 'Featured builds', 'Selected case studies', NULL, NULL, 'feature-left', 'technical', 'balanced', 'panel-strong', 'split', 'icon', 'projects', 'featured', 'strong', 2, TRUE, '{}'::jsonb, 1),
  ('lab', 'archive', 'archive-grid', 'archive-grid', 'Archive', 'More experiments', NULL, 'Smaller builds, side explorations, and things that still matter even if they are not the headline project.', 'cards-3', 'quiet', 'compact', 'none', 'left', 'none', 'projects', 'latest', 'default', 9, FALSE, '{}'::jsonb, 2),
  ('garden', 'hero', 'hero', 'editorial-hero', 'The Garden', 'The central space for documenting what I learn, understand, and think through in public.', 'This is not a traditional blog. It is where active study, clearer synthesis, and broader technical reflection live together.', NULL, 'hero-split', 'editorial', 'airy', 'gradient-soft', 'split', 'none', 'none', 'static', 'strong', 1, FALSE, '{"panelKicker":"Channels","panelItems":["Active Learning","Knowledge Synthesized","Thinking Notes"]}'::jsonb, 0),
  ('garden', 'channels', 'channels', 'archive-grid', 'Browse by mode', 'Three ways the garden grows', NULL, 'Move between raw study, clearer synthesis, and broader thinking depending on what you want to read.', 'cards-3', 'editorial', 'balanced', 'none', 'left', 'icon', 'none', 'static', 'default', 3, TRUE, '{}'::jsonb, 1),
  ('garden', 'featured', 'featured-garden', 'split-feature', 'Lead note', 'A note worth starting with', NULL, 'Use this slot for the note that best represents what you are currently learning or explaining.', 'feature-left', 'editorial', 'balanced', 'panel', 'split', 'cover', 'posts', 'featured', 'strong', 1, TRUE, '{}'::jsonb, 2),
  ('garden', 'latest', 'archive-grid', 'archive-grid', 'Latest entries', 'Recent notes from the garden', NULL, NULL, 'cards-3', 'quiet', 'compact', 'none', 'left', 'none', 'posts', 'latest', 'default', 6, FALSE, '{}'::jsonb, 3),
  ('bookshelf', 'hero', 'hero', 'quiet-reflection', 'Bookshelf', 'A reading life that belongs inside the platform, not outside it.', 'This section gathers the novels, reflections, and reading traces that shape how I think about imagination, discipline, identity, and narrative.', NULL, 'hero-split', 'warm', 'airy', 'paper', 'split', 'none', 'none', 'static', 'soft', 1, FALSE, '{"panelKicker":"What lives here","panelItems":["Reflections","Reading logs","Reviews and essays"]}'::jsonb, 0),
  ('bookshelf', 'featured', 'featured-bookshelf', 'quiet-reflection', 'Featured reflections', 'A few entries to begin with', NULL, NULL, 'cards-2', 'warm', 'balanced', 'panel', 'left', 'none', 'bookshelf', 'featured', 'soft', 2, TRUE, '{}'::jsonb, 1),
  ('bookshelf', 'archive', 'archive-grid', 'archive-grid', 'Shelf', 'More from the bookshelf', NULL, NULL, 'cards-3', 'quiet', 'compact', 'none', 'left', 'none', 'bookshelf', 'latest', 'soft', 9, FALSE, '{}'::jsonb, 2),
  ('connect', 'hero', 'hero', 'editorial-hero', 'Connect', 'A simple place to reach me and follow what I''m building.', 'If you want to talk about AI, learning, building projects, or books worth thinking about, start here.', NULL, 'hero-split', 'editorial', 'airy', 'gradient-soft', 'split', 'none', 'none', 'static', 'strong', 1, FALSE, '{"panelKicker":"Preferred contact","panelBody":"Email is the best default. GitHub is the best place to see my work in motion."}'::jsonb, 0),
  ('connect', 'links', 'contact-grid', 'archive-grid', 'Find me', 'Ways to reach out', NULL, 'Direct links to conversation, code, and the platforms where this work continues.', 'cards-2', 'editorial', 'balanced', 'none', 'left', 'icon', 'contact-links', 'latest', 'default', 4, FALSE, '{}'::jsonb, 1)
ON CONFLICT (page_key, section_key) DO NOTHING;

INSERT INTO story_chapters (title, subtitle, body, period_label, sort_order)
SELECT * FROM (
  VALUES
    ('Curiosity Before Computer Science', 'Technology showed up first as fascination, not career planning.', 'This chapter can describe the early spark: software, the internet, computers, and the sense that technology was both creative and powerful.', 'Early years', 0),
    ('Choosing CSE', 'Computer science became the place where curiosity and discipline could meet.', 'Use this section to explain why CSE felt like the right path and what you hoped it would unlock.', 'University', 1),
    ('Finding AI and ML', 'AI became compelling because it mixed theory, tools, and the possibility of building useful systems.', 'This chapter should connect your first encounters with machine learning and language models to your larger goals.', 'AI era', 2),
    ('Building in Public', 'Projects and notes became the way to turn learning into something real.', 'Document how writing, building, and sharing your progress started shaping your identity as an engineer.', 'Now', 3)
) AS seed(title, subtitle, body, period_label, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM story_chapters LIMIT 1);

-- ─── Storage bucket ─────────────────────────────────────────────────
-- Run this separately in the Supabase dashboard or via the API:
--
--   INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', TRUE);
--
--   CREATE POLICY "media_public_read"  ON storage.objects FOR SELECT USING (bucket_id = 'media');
--   CREATE POLICY "media_admin_upload" ON storage.objects FOR INSERT TO authenticated
--     WITH CHECK (bucket_id = 'media' AND is_admin_user());
--   CREATE POLICY "media_admin_delete" ON storage.objects FOR DELETE TO authenticated
--     USING (bucket_id = 'media' AND is_admin_user());

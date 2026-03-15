ALTER TABLE page_sections
ADD COLUMN IF NOT EXISTS preset_key TEXT,
ADD COLUMN IF NOT EXISTS layout_variant TEXT DEFAULT 'feature-left',
ADD COLUMN IF NOT EXISTS visual_tone TEXT DEFAULT 'default',
ADD COLUMN IF NOT EXISTS density TEXT DEFAULT 'balanced',
ADD COLUMN IF NOT EXISTS background_treatment TEXT DEFAULT 'panel',
ADD COLUMN IF NOT EXISTS content_alignment TEXT DEFAULT 'left',
ADD COLUMN IF NOT EXISTS media_mode TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS content_collection TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS content_source TEXT DEFAULT 'static',
ADD COLUMN IF NOT EXISTS kicker_style TEXT DEFAULT 'default',
ADD COLUMN IF NOT EXISTS max_items INT DEFAULT 3,
ADD COLUMN IF NOT EXISTS show_divider BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS manual_item_ids TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

UPDATE page_sections
SET
  preset_key = COALESCE(preset_key, CASE section_key
    WHEN 'hero' THEN 'editorial-hero'
    WHEN 'current-focus' THEN 'split-feature'
    WHEN 'featured-project' THEN 'technical-highlight'
    WHEN 'latest-notes' THEN 'archive-grid'
    WHEN 'story-preview' THEN 'quiet-reflection'
    WHEN 'bookshelf-preview' THEN 'quiet-reflection'
    WHEN 'connect' THEN 'cta-band'
    ELSE 'split-feature'
  END),
  layout_variant = COALESCE(layout_variant, CASE section_key
    WHEN 'hero' THEN 'hero-split'
    WHEN 'story-preview' THEN 'feature-right'
    WHEN 'bookshelf-preview' THEN 'feature-right'
    WHEN 'connect' THEN 'cta-band'
    ELSE 'feature-left'
  END),
  visual_tone = COALESCE(visual_tone, CASE section_key
    WHEN 'featured-project' THEN 'technical'
    WHEN 'bookshelf-preview' THEN 'warm'
    WHEN 'story-preview' THEN 'quiet'
    WHEN 'latest-notes' THEN 'quiet'
    WHEN 'connect' THEN 'warm'
    ELSE 'editorial'
  END),
  density = COALESCE(density, CASE section_key
    WHEN 'hero' THEN 'airy'
    WHEN 'latest-notes' THEN 'compact'
    ELSE 'balanced'
  END),
  background_treatment = COALESCE(background_treatment, CASE section_key
    WHEN 'hero' THEN 'gradient-soft'
    WHEN 'featured-project' THEN 'panel-strong'
    WHEN 'latest-notes' THEN 'none'
    WHEN 'story-preview' THEN 'paper'
    WHEN 'bookshelf-preview' THEN 'paper'
    WHEN 'connect' THEN 'panel'
    ELSE 'panel'
  END),
  content_alignment = COALESCE(content_alignment, CASE section_key
    WHEN 'hero' THEN 'split'
    WHEN 'featured-project' THEN 'split'
    WHEN 'story-preview' THEN 'split'
    WHEN 'bookshelf-preview' THEN 'split'
    WHEN 'connect' THEN 'split'
    ELSE 'left'
  END),
  media_mode = COALESCE(media_mode, CASE section_key
    WHEN 'hero' THEN 'portrait'
    WHEN 'featured-project' THEN 'icon'
    ELSE 'none'
  END),
  content_collection = COALESCE(content_collection, CASE section_key
    WHEN 'featured-project' THEN 'projects'
    WHEN 'latest-notes' THEN 'posts'
    WHEN 'bookshelf-preview' THEN 'bookshelf'
    WHEN 'connect' THEN 'contact-links'
    ELSE 'none'
  END),
  content_source = COALESCE(content_source, CASE section_key
    WHEN 'featured-project' THEN 'featured'
    WHEN 'latest-notes' THEN 'latest'
    WHEN 'bookshelf-preview' THEN 'featured'
    WHEN 'connect' THEN 'latest'
    ELSE 'static'
  END),
  kicker_style = COALESCE(kicker_style, CASE section_key
    WHEN 'hero' THEN 'strong'
    WHEN 'featured-project' THEN 'strong'
    WHEN 'story-preview' THEN 'soft'
    WHEN 'bookshelf-preview' THEN 'soft'
    WHEN 'connect' THEN 'strong'
    ELSE 'default'
  END),
  max_items = COALESCE(max_items, CASE section_key
    WHEN 'latest-notes' THEN 3
    WHEN 'connect' THEN 3
    ELSE 1
  END),
  show_divider = COALESCE(show_divider, FALSE),
  metadata = COALESCE(metadata, '{}'::jsonb);

UPDATE page_sections
SET metadata = metadata || '{"panelKicker":"Chapter preview","panelBody":"Use this space to tease the earliest turning point in your story."}'::jsonb
WHERE page_key = 'home' AND section_key = 'story-preview';

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

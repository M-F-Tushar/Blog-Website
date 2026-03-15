ALTER TABLE page_sections
ADD COLUMN IF NOT EXISTS section_role TEXT DEFAULT 'guide',
ADD COLUMN IF NOT EXISTS animation_preset TEXT DEFAULT 'quiet-fade',
ADD COLUMN IF NOT EXISTS content_grouping TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS content_emphasis TEXT DEFAULT 'supporting';

UPDATE page_sections
SET
  section_role = COALESCE(section_role, CASE page_key
    WHEN 'home' THEN CASE section_key
      WHEN 'hero' THEN 'entry'
      WHEN 'featured-project' THEN 'proof'
      WHEN 'latest-notes' THEN 'proof'
      WHEN 'story-preview' THEN 'guide'
      WHEN 'bookshelf-preview' THEN 'reflection'
      WHEN 'connect' THEN 'cta'
      ELSE 'guide'
    END
    WHEN 'story' THEN CASE section_key
      WHEN 'hero' THEN 'entry'
      WHEN 'chapters' THEN 'archive'
      ELSE 'guide'
    END
    WHEN 'lab' THEN CASE section_key
      WHEN 'hero' THEN 'entry'
      WHEN 'featured' THEN 'proof'
      WHEN 'archive' THEN 'archive'
      ELSE 'guide'
    END
    WHEN 'garden' THEN CASE section_key
      WHEN 'hero' THEN 'entry'
      WHEN 'channels' THEN 'guide'
      WHEN 'featured' THEN 'proof'
      WHEN 'latest' THEN 'archive'
      ELSE 'guide'
    END
    WHEN 'bookshelf' THEN CASE section_key
      WHEN 'hero' THEN 'entry'
      WHEN 'featured' THEN 'reflection'
      WHEN 'archive' THEN 'archive'
      ELSE 'guide'
    END
    WHEN 'connect' THEN CASE section_key
      WHEN 'hero' THEN 'entry'
      WHEN 'links' THEN 'guide'
      ELSE 'cta'
    END
    ELSE 'guide'
  END),
  animation_preset = COALESCE(animation_preset, CASE section_key
    WHEN 'hero' THEN 'hero-rise'
    WHEN 'chapters' THEN 'chapter-reveal'
    WHEN 'featured' THEN 'rail-slide'
    WHEN 'featured-project' THEN 'rail-slide'
    WHEN 'latest' THEN 'stagger-cards'
    WHEN 'latest-notes' THEN 'stagger-cards'
    WHEN 'archive' THEN 'stagger-cards'
    ELSE 'quiet-fade'
  END),
  content_grouping = COALESCE(content_grouping, CASE page_key
    WHEN 'lab' THEN CASE WHEN section_key = 'archive' THEN 'status' ELSE 'none' END
    WHEN 'garden' THEN CASE WHEN section_key = 'latest' THEN 'channel' ELSE 'none' END
    WHEN 'bookshelf' THEN CASE WHEN section_key = 'archive' THEN 'type' ELSE 'none' END
    ELSE 'none'
  END),
  content_emphasis = COALESCE(content_emphasis, CASE section_key
    WHEN 'hero' THEN 'lead'
    WHEN 'featured' THEN 'lead'
    WHEN 'featured-project' THEN 'lead'
    WHEN 'latest-notes' THEN 'supporting'
    WHEN 'latest' THEN 'dense'
    WHEN 'archive' THEN 'dense'
    ELSE 'supporting'
  END);

import type {
  PageSectionRecord,
  PageSectionLayoutVariant,
  PageSectionVisualTone,
  PageSectionDensity,
  PageSectionBackgroundTreatment,
  PageSectionContentAlignment,
  PageSectionMediaMode,
  PageSectionContentCollection,
  PageSectionContentSource,
  PageSectionKickerStyle,
  PageSectionRole,
  PageSectionAnimationPreset,
  PageSectionContentGrouping,
  PageSectionContentEmphasis,
  Project,
  Post,
  BookshelfEntry,
} from '../types/types';

export const PAGE_KEYS = ['home', 'story', 'lab', 'garden', 'bookshelf', 'connect'] as const;

export const PAGE_BLUEPRINTS: Record<(typeof PAGE_KEYS)[number], string> = {
  home: 'entry -> proof -> guide -> connect',
  story: 'entry -> chapter-stream -> direction',
  lab: 'entry -> featured -> grouped-archive',
  garden: 'entry -> channels -> lead-note -> archive',
  bookshelf: 'entry -> featured-reflection -> themed-shelves -> archive',
  connect: 'entry -> contact-grid -> cta',
};

export const PAGE_SECTION_TYPE_OPTIONS = [
  { value: 'hero', label: 'Hero' },
  { value: 'content', label: 'Content block' },
  { value: 'featured-project', label: 'Featured project' },
  { value: 'featured-garden', label: 'Garden rail' },
  { value: 'featured-bookshelf', label: 'Bookshelf spotlight' },
  { value: 'channels', label: 'Channel grid' },
  { value: 'archive-grid', label: 'Archive grid' },
  { value: 'contact-grid', label: 'Contact grid' },
  { value: 'story-stream', label: 'Story stream' },
];

export const PAGE_SECTION_LAYOUT_OPTIONS: Array<{
  value: PageSectionLayoutVariant;
  label: string;
}> = [
  { value: 'hero-split', label: 'Hero Split' },
  { value: 'hero-narrative', label: 'Hero Narrative' },
  { value: 'feature-left', label: 'Feature Left' },
  { value: 'feature-right', label: 'Feature Right' },
  { value: 'cards-3', label: 'Cards 3-Up' },
  { value: 'cards-2', label: 'Cards 2-Up' },
  { value: 'stacked-story', label: 'Stacked Story' },
  { value: 'quote-band', label: 'Quote Band' },
  { value: 'cta-band', label: 'CTA Band' },
];

export const PAGE_SECTION_TONE_OPTIONS: Array<{ value: PageSectionVisualTone; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'quiet', label: 'Quiet' },
  { value: 'technical', label: 'Technical' },
  { value: 'warm', label: 'Warm' },
];

export const PAGE_SECTION_DENSITY_OPTIONS: Array<{ value: PageSectionDensity; label: string }> = [
  { value: 'airy', label: 'Airy' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'compact', label: 'Compact' },
];

export const PAGE_SECTION_BACKGROUND_OPTIONS: Array<{
  value: PageSectionBackgroundTreatment;
  label: string;
}> = [
  { value: 'none', label: 'No Frame' },
  { value: 'gradient-soft', label: 'Soft Gradient' },
  { value: 'panel', label: 'Panel' },
  { value: 'panel-strong', label: 'Strong Panel' },
  { value: 'paper', label: 'Paper' },
];

export const PAGE_SECTION_ALIGNMENT_OPTIONS: Array<{
  value: PageSectionContentAlignment;
  label: string;
}> = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'split', label: 'Split' },
];

export const PAGE_SECTION_MEDIA_OPTIONS: Array<{ value: PageSectionMediaMode; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'cover', label: 'Cover' },
  { value: 'icon', label: 'Icon' },
];

export const PAGE_SECTION_COLLECTION_OPTIONS: Array<{
  value: PageSectionContentCollection;
  label: string;
}> = [
  { value: 'none', label: 'None' },
  { value: 'projects', label: 'Projects' },
  { value: 'posts', label: 'Garden Entries' },
  { value: 'bookshelf', label: 'Bookshelf Entries' },
  { value: 'contact-links', label: 'Contact Links' },
];

export const PAGE_SECTION_SOURCE_OPTIONS: Array<{
  value: PageSectionContentSource;
  label: string;
}> = [
  { value: 'static', label: 'Static content' },
  { value: 'featured', label: 'Featured item' },
  { value: 'latest', label: 'Latest items' },
  { value: 'pinned', label: 'Pinned items' },
  { value: 'manual', label: 'Manual selection' },
];

export const PAGE_SECTION_KICKER_OPTIONS: Array<{ value: PageSectionKickerStyle; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'soft', label: 'Soft' },
  { value: 'strong', label: 'Strong' },
];

export const PAGE_SECTION_ROLE_OPTIONS: Array<{ value: PageSectionRole; label: string }> = [
  { value: 'entry', label: 'Entry' },
  { value: 'proof', label: 'Proof' },
  { value: 'guide', label: 'Guide' },
  { value: 'archive', label: 'Archive' },
  { value: 'reflection', label: 'Reflection' },
  { value: 'cta', label: 'CTA' },
];

export const PAGE_SECTION_ANIMATION_OPTIONS: Array<{
  value: PageSectionAnimationPreset;
  label: string;
}> = [
  { value: 'hero-rise', label: 'Hero Rise' },
  { value: 'stagger-cards', label: 'Stagger Cards' },
  { value: 'chapter-reveal', label: 'Chapter Reveal' },
  { value: 'rail-slide', label: 'Rail Slide' },
  { value: 'quiet-fade', label: 'Quiet Fade' },
];

export const PAGE_SECTION_GROUPING_OPTIONS: Array<{
  value: PageSectionContentGrouping;
  label: string;
}> = [
  { value: 'none', label: 'None' },
  { value: 'status', label: 'By status' },
  { value: 'channel', label: 'By channel' },
  { value: 'type', label: 'By type' },
  { value: 'theme', label: 'By theme' },
];

export const PAGE_SECTION_EMPHASIS_OPTIONS: Array<{
  value: PageSectionContentEmphasis;
  label: string;
}> = [
  { value: 'lead', label: 'Lead' },
  { value: 'supporting', label: 'Supporting' },
  { value: 'dense', label: 'Dense' },
];

export const PAGE_SECTION_PRESETS = [
  {
    key: 'editorial-hero',
    label: 'Editorial Hero',
    sectionType: 'hero',
    layoutVariant: 'hero-split' as PageSectionLayoutVariant,
    visualTone: 'editorial' as PageSectionVisualTone,
    density: 'airy' as PageSectionDensity,
    backgroundTreatment: 'gradient-soft' as PageSectionBackgroundTreatment,
    contentAlignment: 'split' as PageSectionContentAlignment,
    mediaMode: 'none' as PageSectionMediaMode,
    contentCollection: 'none' as PageSectionContentCollection,
    contentSource: 'static' as PageSectionContentSource,
    kickerStyle: 'strong' as PageSectionKickerStyle,
    sectionRole: 'entry' as PageSectionRole,
    animationPreset: 'hero-rise' as PageSectionAnimationPreset,
    contentGrouping: 'none' as PageSectionContentGrouping,
    contentEmphasis: 'lead' as PageSectionContentEmphasis,
    maxItems: 3,
    showDivider: false,
  },
  {
    key: 'split-feature',
    label: 'Split Feature',
    sectionType: 'content',
    layoutVariant: 'feature-left' as PageSectionLayoutVariant,
    visualTone: 'editorial' as PageSectionVisualTone,
    density: 'balanced' as PageSectionDensity,
    backgroundTreatment: 'panel' as PageSectionBackgroundTreatment,
    contentAlignment: 'split' as PageSectionContentAlignment,
    mediaMode: 'cover' as PageSectionMediaMode,
    contentCollection: 'none' as PageSectionContentCollection,
    contentSource: 'static' as PageSectionContentSource,
    kickerStyle: 'default' as PageSectionKickerStyle,
    sectionRole: 'proof' as PageSectionRole,
    animationPreset: 'rail-slide' as PageSectionAnimationPreset,
    contentGrouping: 'none' as PageSectionContentGrouping,
    contentEmphasis: 'lead' as PageSectionContentEmphasis,
    maxItems: 3,
    showDivider: true,
  },
  {
    key: 'quiet-reflection',
    label: 'Quiet Reflection',
    sectionType: 'content',
    layoutVariant: 'feature-right' as PageSectionLayoutVariant,
    visualTone: 'quiet' as PageSectionVisualTone,
    density: 'airy' as PageSectionDensity,
    backgroundTreatment: 'paper' as PageSectionBackgroundTreatment,
    contentAlignment: 'left' as PageSectionContentAlignment,
    mediaMode: 'none' as PageSectionMediaMode,
    contentCollection: 'none' as PageSectionContentCollection,
    contentSource: 'static' as PageSectionContentSource,
    kickerStyle: 'soft' as PageSectionKickerStyle,
    sectionRole: 'reflection' as PageSectionRole,
    animationPreset: 'quiet-fade' as PageSectionAnimationPreset,
    contentGrouping: 'none' as PageSectionContentGrouping,
    contentEmphasis: 'supporting' as PageSectionContentEmphasis,
    maxItems: 2,
    showDivider: true,
  },
  {
    key: 'technical-highlight',
    label: 'Technical Highlight',
    sectionType: 'featured-project',
    layoutVariant: 'feature-left' as PageSectionLayoutVariant,
    visualTone: 'technical' as PageSectionVisualTone,
    density: 'balanced' as PageSectionDensity,
    backgroundTreatment: 'panel-strong' as PageSectionBackgroundTreatment,
    contentAlignment: 'split' as PageSectionContentAlignment,
    mediaMode: 'icon' as PageSectionMediaMode,
    contentCollection: 'projects' as PageSectionContentCollection,
    contentSource: 'featured' as PageSectionContentSource,
    kickerStyle: 'strong' as PageSectionKickerStyle,
    sectionRole: 'proof' as PageSectionRole,
    animationPreset: 'rail-slide' as PageSectionAnimationPreset,
    contentGrouping: 'none' as PageSectionContentGrouping,
    contentEmphasis: 'lead' as PageSectionContentEmphasis,
    maxItems: 1,
    showDivider: true,
  },
  {
    key: 'archive-grid',
    label: 'Archive Grid',
    sectionType: 'archive-grid',
    layoutVariant: 'cards-3' as PageSectionLayoutVariant,
    visualTone: 'quiet' as PageSectionVisualTone,
    density: 'compact' as PageSectionDensity,
    backgroundTreatment: 'none' as PageSectionBackgroundTreatment,
    contentAlignment: 'left' as PageSectionContentAlignment,
    mediaMode: 'none' as PageSectionMediaMode,
    contentCollection: 'posts' as PageSectionContentCollection,
    contentSource: 'latest' as PageSectionContentSource,
    kickerStyle: 'default' as PageSectionKickerStyle,
    sectionRole: 'archive' as PageSectionRole,
    animationPreset: 'stagger-cards' as PageSectionAnimationPreset,
    contentGrouping: 'none' as PageSectionContentGrouping,
    contentEmphasis: 'dense' as PageSectionContentEmphasis,
    maxItems: 6,
    showDivider: false,
  },
  {
    key: 'cta-band',
    label: 'CTA Band',
    sectionType: 'content',
    layoutVariant: 'cta-band' as PageSectionLayoutVariant,
    visualTone: 'warm' as PageSectionVisualTone,
    density: 'balanced' as PageSectionDensity,
    backgroundTreatment: 'panel' as PageSectionBackgroundTreatment,
    contentAlignment: 'center' as PageSectionContentAlignment,
    mediaMode: 'none' as PageSectionMediaMode,
    contentCollection: 'none' as PageSectionContentCollection,
    contentSource: 'static' as PageSectionContentSource,
    kickerStyle: 'strong' as PageSectionKickerStyle,
    sectionRole: 'cta' as PageSectionRole,
    animationPreset: 'quiet-fade' as PageSectionAnimationPreset,
    contentGrouping: 'none' as PageSectionContentGrouping,
    contentEmphasis: 'supporting' as PageSectionContentEmphasis,
    maxItems: 1,
    showDivider: false,
  },
];

export function getDefaultPageSection(
  overrides: Partial<Omit<PageSectionRecord, 'id' | 'createdAt' | 'updatedAt'>> = {}
): Omit<PageSectionRecord, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    pageKey: 'home',
    sectionKey: '',
    sectionType: 'content',
    presetKey: 'split-feature',
    eyebrow: '',
    title: '',
    subtitle: '',
    body: '',
    primaryCtaLabel: '',
    primaryCtaUrl: '',
    secondaryCtaLabel: '',
    secondaryCtaUrl: '',
    layoutVariant: 'feature-left',
    visualTone: 'default',
    density: 'balanced',
    backgroundTreatment: 'panel',
    contentAlignment: 'left',
    mediaMode: 'none',
    contentCollection: 'none',
    contentSource: 'static',
    kickerStyle: 'default',
    sectionRole: 'guide',
    animationPreset: 'quiet-fade',
    contentGrouping: 'none',
    contentEmphasis: 'supporting',
    maxItems: 3,
    showDivider: false,
    featuredProjectId: '',
    featuredPostId: '',
    featuredBookshelfEntryId: '',
    manualItemIds: [],
    metadata: {},
    visible: true,
    sortOrder: 0,
    ...overrides,
  };
}

export function applyPresetToSection(
  section: Omit<PageSectionRecord, 'id' | 'createdAt' | 'updatedAt'>,
  presetKey: string
): Omit<PageSectionRecord, 'id' | 'createdAt' | 'updatedAt'> {
  const preset = PAGE_SECTION_PRESETS.find((item) => item.key === presetKey);
  if (!preset) return section;

  return {
    ...section,
    presetKey: preset.key,
    sectionType: preset.sectionType,
    layoutVariant: preset.layoutVariant,
    visualTone: preset.visualTone,
    density: preset.density,
    backgroundTreatment: preset.backgroundTreatment,
    contentAlignment: preset.contentAlignment,
    mediaMode: preset.mediaMode,
    contentCollection: preset.contentCollection,
    contentSource: preset.contentSource,
    kickerStyle: preset.kickerStyle,
    sectionRole: preset.sectionRole,
    animationPreset: preset.animationPreset,
    contentGrouping: preset.contentGrouping,
    contentEmphasis: preset.contentEmphasis,
    maxItems: preset.maxItems,
    showDivider: preset.showDivider,
  };
}

export function describePageSection(section: Partial<PageSectionRecord>): string {
  const preset =
    PAGE_SECTION_PRESETS.find((item) => item.key === section.presetKey)?.label || 'Custom';
  const role =
    PAGE_SECTION_ROLE_OPTIONS.find((item) => item.value === section.sectionRole)?.label || 'Guide';
  return `${preset} / ${role}`;
}

export function getSectionFrameClasses(section: Partial<PageSectionRecord>): string {
  const background = section.backgroundTreatment || 'panel';
  const tone = section.visualTone || 'default';
  const density = section.density || 'balanced';

  const frameClass =
    background === 'none'
      ? ''
      : background === 'panel-strong'
        ? 'section-frame section-frame-strong'
        : background === 'gradient-soft'
          ? 'section-frame section-frame-gradient'
          : background === 'paper'
            ? 'section-frame section-frame-paper'
            : 'section-frame section-frame-panel';

  return [frameClass, `section-tone-${tone}`, `section-density-${density}`]
    .filter(Boolean)
    .join(' ');
}

export function getSectionRoleClass(section: Partial<PageSectionRecord>): string {
  const role = section.sectionRole || 'guide';
  const emphasis = section.contentEmphasis || 'supporting';
  return [`section-role-${role}`, `section-emphasis-${emphasis}`].join(' ');
}

export function getSectionGridClasses(
  section: Partial<PageSectionRecord>,
  defaultSplit: string
): string {
  if (section.layoutVariant === 'cards-2') return 'grid gap-5 md:grid-cols-2';
  if (section.layoutVariant === 'cards-3') return 'grid gap-5 md:grid-cols-2 xl:grid-cols-3';
  if (section.layoutVariant === 'hero-narrative') return 'grid gap-10';
  if (section.contentAlignment === 'center') return 'grid gap-8 justify-items-center';
  if (section.contentAlignment === 'split') return defaultSplit;
  return 'grid gap-8';
}

export function getKickerClass(section: Partial<PageSectionRecord>): string {
  const kicker = section.kickerStyle || 'default';
  if (kicker === 'soft') return 'editorial-kicker editorial-kicker-soft';
  if (kicker === 'strong') return 'editorial-kicker editorial-kicker-strong';
  return 'editorial-kicker';
}

export function getMetadataText(
  section: Partial<PageSectionRecord>,
  key: string
): string | undefined {
  const value = section.metadata?.[key];
  return typeof value === 'string' ? value : undefined;
}

export function getMetadataItems(section: Partial<PageSectionRecord>, key: string): string[] {
  const value = section.metadata?.[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function getPageBlueprint(pageKey: (typeof PAGE_KEYS)[number]): string {
  return PAGE_BLUEPRINTS[pageKey];
}

export function getChannelLabel(category?: string): string {
  const normalized = (category || '').toLowerCase();
  if (normalized.includes('active')) return 'Active Learning';
  if (normalized.includes('synth')) return 'Knowledge Synthesized';
  if (normalized.includes('thinking')) return 'Thinking Notes';
  return category || 'General';
}

export function groupProjectsByStatus(projects: Project[]) {
  const order = ['active', 'shipped', 'tinkering'];
  const labels: Record<string, string> = {
    active: 'Active',
    shipped: 'Shipped',
    tinkering: 'Tinkering',
  };

  return order
    .map((key) => ({
      key,
      label: labels[key] || key,
      items: projects.filter((project) => (project.status || '').toLowerCase() === key),
    }))
    .filter((group) => group.items.length > 0);
}

export function groupPostsByChannel(posts: Post[]) {
  const order = ['Active Learning', 'Knowledge Synthesized', 'Thinking Notes'];
  const groups = order
    .map((label) => ({
      key: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      items: posts.filter((post) => getChannelLabel(post.category) === label),
    }))
    .filter((group) => group.items.length > 0);

  if (groups.length > 0) return groups;

  return posts.length > 0 ? [{ key: 'general', label: 'Latest Notes', items: posts }] : [];
}

export function groupBookshelfByType(entries: BookshelfEntry[]) {
  const labels: Record<string, string> = {
    reflection: 'Reflections',
    review: 'Reviews',
    'reading-log': 'Reading Logs',
    favorite: 'Favorites',
    essay: 'Essays',
  };
  const order = ['reflection', 'review', 'reading-log', 'favorite', 'essay'];

  const groups = order
    .map((key) => ({
      key,
      label: labels[key] || key,
      items: entries.filter((entry) => entry.entryType === key),
    }))
    .filter((group) => group.items.length > 0);

  if (groups.length > 0) return groups;

  return entries.length > 0 ? [{ key: 'all', label: 'Shelf', items: entries }] : [];
}

interface SectionSelectOptions<T extends { id: string }> {
  fallbackFeaturedId?: string | null;
  isFeatured?: (item: T) => boolean;
  isPinned?: (item: T) => boolean;
}

export function selectSectionItems<T extends { id: string }>(
  items: T[],
  section: Partial<PageSectionRecord>,
  options: SectionSelectOptions<T> = {}
): T[] {
  const source = section.contentSource || 'static';
  const maxItems = section.maxItems || items.length;
  const manualIds = section.manualItemIds || [];

  if (source === 'manual' && manualIds.length > 0) {
    const itemMap = new Map(items.map((item) => [item.id, item]));
    return manualIds
      .map((id) => itemMap.get(id))
      .filter((item): item is T => Boolean(item))
      .slice(0, maxItems);
  }

  if (source === 'featured') {
    const explicitId =
      section.featuredProjectId || section.featuredPostId || section.featuredBookshelfEntryId;
    const targetId = explicitId || options.fallbackFeaturedId || null;
    if (targetId) {
      const matched = items.find((item) => item.id === targetId);
      if (matched) return [matched];
    }
    if (options.isFeatured) {
      const featuredItems = items.filter(options.isFeatured).slice(0, maxItems);
      if (featuredItems.length > 0) return featuredItems;
    }
  }

  if (source === 'pinned' && options.isPinned) {
    const pinnedItems = items.filter(options.isPinned).slice(0, maxItems);
    if (pinnedItems.length > 0) return pinnedItems;
  }

  return items.slice(0, maxItems);
}

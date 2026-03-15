import type { ContactLink } from '../types/types';

export interface ContactLinkTypeOption {
  value: string;
  label: string;
  description: string;
  placeholder: string;
}

export interface ContactLinkMeta {
  label: string;
  accent: 'direct' | 'work' | 'social' | 'community' | 'custom';
  actionLabel: string;
  channelLabel: string;
  helperText: string;
}

export const CONTACT_LINK_TYPE_OPTIONS: ContactLinkTypeOption[] = [
  {
    value: 'email',
    label: 'Email',
    description: 'Best for direct, thoughtful messages.',
    placeholder: 'hello@example.com or mailto:hello@example.com',
  },
  {
    value: 'linkedin',
    label: 'LinkedIn',
    description: 'Professional profile and work context.',
    placeholder: 'https://linkedin.com/in/your-handle',
  },
  {
    value: 'x',
    label: 'X',
    description: 'Short updates, threads, and public conversation.',
    placeholder: 'https://x.com/your-handle',
  },
  {
    value: 'facebook',
    label: 'Facebook',
    description: 'Social profile, page, or community link.',
    placeholder: 'https://facebook.com/your-handle',
  },
  {
    value: 'github',
    label: 'GitHub',
    description: 'Code, experiments, and repositories.',
    placeholder: 'https://github.com/your-handle',
  },
  {
    value: 'instagram',
    label: 'Instagram',
    description: 'Visual updates and profile link.',
    placeholder: 'https://instagram.com/your-handle',
  },
  {
    value: 'youtube',
    label: 'YouTube',
    description: 'Videos, talks, and demos.',
    placeholder: 'https://youtube.com/@your-handle',
  },
  {
    value: 'discord',
    label: 'Discord',
    description: 'Community invite or profile link.',
    placeholder: 'https://discord.gg/your-invite',
  },
  {
    value: 'telegram',
    label: 'Telegram',
    description: 'Direct messaging or channel link.',
    placeholder: 'https://t.me/your-handle',
  },
  {
    value: 'website',
    label: 'Website',
    description: 'Personal site, portfolio, or external home base.',
    placeholder: 'https://example.com',
  },
  {
    value: 'newsletter',
    label: 'Newsletter',
    description: 'Subscription or writing platform.',
    placeholder: 'https://newsletter.example.com',
  },
  {
    value: 'phone',
    label: 'Phone',
    description: 'Direct phone or WhatsApp-style contact.',
    placeholder: '+880123456789 or tel:+880123456789',
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Use any other link type you need in the future.',
    placeholder: 'Enter a custom type below',
  },
];

const CONTACT_LINK_ALIASES: Record<string, string> = {
  twitter: 'x',
  'x.com': 'x',
  mail: 'email',
  mailto: 'email',
  e_mail: 'email',
  fb: 'facebook',
  site: 'website',
  portfolio: 'website',
};

export function normalizeContactLinkType(type: string | undefined): string {
  const normalized = (type || '').trim().toLowerCase();
  if (!normalized) return 'custom';
  return CONTACT_LINK_ALIASES[normalized] || normalized;
}

export function normalizeContactLinkUrl(linkType: string, rawUrl: string): string {
  const type = normalizeContactLinkType(linkType);
  const value = rawUrl.trim();

  if (!value) return '';

  if (type === 'email') {
    return value.startsWith('mailto:') ? value : `mailto:${value.replace(/^mailto:/i, '')}`;
  }

  if (type === 'phone') {
    return value.startsWith('tel:') ? value : `tel:${value.replace(/^tel:/i, '')}`;
  }

  if (/^[a-z]+:\/\//i.test(value)) return value;

  return `https://${value.replace(/^\/+/, '')}`;
}

export function getContactLinkHref(link: Pick<ContactLink, 'url' | 'linkType'>): string {
  return normalizeContactLinkUrl(link.linkType, link.url);
}

export function isContactLinkExternal(link: Pick<ContactLink, 'url' | 'linkType'>): boolean {
  const type = normalizeContactLinkType(link.linkType);
  return type !== 'email' && type !== 'phone';
}

export function getContactLinkMeta(linkType: string): ContactLinkMeta {
  const type = normalizeContactLinkType(linkType);

  switch (type) {
    case 'email':
      return {
        label: 'Email',
        accent: 'direct',
        actionLabel: 'Send email',
        channelLabel: 'Direct contact',
        helperText: 'Best for thoughtful notes, collaboration, and longer messages.',
      };
    case 'github':
      return {
        label: 'GitHub',
        accent: 'work',
        actionLabel: 'View GitHub',
        channelLabel: 'Work in public',
        helperText: 'Best for code, experiments, repositories, and implementation context.',
      };
    case 'linkedin':
      return {
        label: 'LinkedIn',
        accent: 'work',
        actionLabel: 'Open LinkedIn',
        channelLabel: 'Professional profile',
        helperText: 'Best for professional context, background, and career conversations.',
      };
    case 'x':
      return {
        label: 'X',
        accent: 'social',
        actionLabel: 'Open X',
        channelLabel: 'Public conversation',
        helperText: 'Best for short updates, threads, and lightweight public exchange.',
      };
    case 'facebook':
      return {
        label: 'Facebook',
        accent: 'social',
        actionLabel: 'Open Facebook',
        channelLabel: 'Social profile',
        helperText: 'Best for community presence, page links, and social follow-ups.',
      };
    case 'instagram':
      return {
        label: 'Instagram',
        accent: 'social',
        actionLabel: 'Open Instagram',
        channelLabel: 'Visual updates',
        helperText: 'Best for visual updates, snapshots, and lighter social presence.',
      };
    case 'youtube':
      return {
        label: 'YouTube',
        accent: 'community',
        actionLabel: 'Watch on YouTube',
        channelLabel: 'Video channel',
        helperText: 'Best for demos, talks, and long-form video content.',
      };
    case 'discord':
      return {
        label: 'Discord',
        accent: 'community',
        actionLabel: 'Join Discord',
        channelLabel: 'Community space',
        helperText: 'Best for community chat, group discussion, and live back-and-forth.',
      };
    case 'telegram':
      return {
        label: 'Telegram',
        accent: 'community',
        actionLabel: 'Open Telegram',
        channelLabel: 'Messaging channel',
        helperText: 'Best for direct messaging, channels, and lightweight updates.',
      };
    case 'website':
      return {
        label: 'Website',
        accent: 'custom',
        actionLabel: 'Visit website',
        channelLabel: 'External home base',
        helperText: 'Best for external profiles, portfolios, and personal landing pages.',
      };
    case 'newsletter':
      return {
        label: 'Newsletter',
        accent: 'custom',
        actionLabel: 'Open newsletter',
        channelLabel: 'Writing channel',
        helperText: 'Best for subscriptions, longer writing, and recurring updates.',
      };
    case 'phone':
      return {
        label: 'Phone',
        accent: 'direct',
        actionLabel: 'Call now',
        channelLabel: 'Direct line',
        helperText: 'Best for urgent contact or scheduled direct conversation.',
      };
    default:
      return {
        label: formatCustomLinkType(type),
        accent: 'custom',
        actionLabel: 'Open link',
        channelLabel: 'Custom link',
        helperText: 'A flexible custom contact path you can rename and repurpose anytime.',
      };
  }
}

export function getContactLinkDisplayValue(link: Pick<ContactLink, 'url' | 'linkType'>): string {
  const type = normalizeContactLinkType(link.linkType);
  const href = getContactLinkHref(link);

  if (type === 'email') return href.replace(/^mailto:/i, '');
  if (type === 'phone') return href.replace(/^tel:/i, '');

  try {
    const parsed = new URL(href);
    const host = parsed.hostname.replace(/^www\./i, '');
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];

    if (lastPart && ['github', 'x', 'instagram', 'telegram'].includes(type)) {
      return `@${lastPart}`;
    }

    if (lastPart && type === 'linkedin') {
      return `in/${lastPart}`;
    }

    if (lastPart && type === 'youtube') {
      return parsed.pathname.replace(/^\/+/, '');
    }

    return lastPart ? `${host}${parsed.pathname}` : host;
  } catch {
    return link.url;
  }
}

export function formatCustomLinkType(type: string): string {
  return (type || 'Custom')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

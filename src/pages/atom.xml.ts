import type { APIRoute } from 'astro';
import { getPublishedPosts, getSiteSettings } from '@/lib/supabase';

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();
  const settings = await getSiteSettings();
  const siteUrl = context.site!.href.replace(/\/$/, '');
  const now = new Date().toISOString();

  const entries = posts
    .map(
      (post) => `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${siteUrl}/blog/${post.slug}" rel="alternate"/>
    <id>${siteUrl}/blog/${post.slug}</id>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary>${escapeXml(post.excerpt)}</summary>
    <category term="${escapeXml(post.category)}"/>
${post.tags.map((t) => `    <category term="${escapeXml(t)}"/>`).join('\n')}
    <author><name>${escapeXml(settings.author_name)}</name></author>
  </entry>`
    )
    .join('\n');

  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(settings.site_name)}</title>
  <subtitle>${escapeXml(settings.site_description)}</subtitle>
  <link href="${siteUrl}/atom.xml" rel="self"/>
  <link href="${siteUrl}"/>
  <id>${siteUrl}/</id>
  <updated>${now}</updated>
  <author><name>${escapeXml(settings.author_name)}</name></author>
${entries}
</feed>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

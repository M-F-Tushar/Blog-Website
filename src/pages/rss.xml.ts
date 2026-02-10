import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPublishedPosts, getSiteSettings } from '@/lib/supabase';

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();
  const settings = await getSiteSettings();

  return rss({
    title: settings.site_name,
    description: settings.site_description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.date),
      description: post.excerpt,
      link: `/blog/${post.slug}`,
      categories: [post.category, ...post.tags],
    })),
    customData: `<language>en-us</language>`,
  });
};

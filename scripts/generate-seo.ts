import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { generateRSS } from '../src/utils/generateRSS';
import { siteConfig } from '../src/utils/seo';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found. Skipping dynamic SEO generation.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const staticPages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/blog', changefreq: 'daily', priority: 0.9 },
  { url: '/recommendations', changefreq: 'weekly', priority: 0.7 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  { url: '/tags', changefreq: 'weekly', priority: 0.5 },
];

console.log('🔍 Fetching posts from Supabase...');
const { data: posts, error } = await supabase.from('posts').select('*').eq('status', 'published');

if (error) {
  console.error('❌ Error fetching posts:', error);
  return;
}

console.log(`✅ Found ${posts.length} published posts.`);

// 1. Generate Sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticPages
    .map(
      (page) => `  <url>
    <loc>${siteConfig.url}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
    )
    .join('\n')}
${posts
    .map(
      (post) => `  <url>
    <loc>${siteConfig.url}/blog/${post.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    ${post.cover_image
          ? `<image:image>
      <image:loc>${post.cover_image}</image:loc>
      <image:title>${post.title}</image:title>
    </image:image>`
          : ''
        }
  </url>`
    )
    .join('\n')}
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('✅ Sitemap generated at public/sitemap.xml');

// 2. Generate RSS
// Map Supabase posts to the Post type expected by generateRSS
const mappedPosts = posts.map((p) => ({
  id: p.id,
  title: p.title,
  excerpt: p.excerpt,
  content: p.content,
  date: p.date,
  category: p.category,
  tags: p.tags || [],
  coverImage: p.cover_image,
  status: p.status,
}));

generateRSS(mappedPosts as any, path.join(publicDir, 'rss.xml'));
console.log('✅ RSS feed generated at public/rss.xml');
}

generateSEO().catch((err) => {
  console.error(err);
  fs.writeFileSync(path.join(__dirname, 'error.log'), `Error: ${err.message}\nStack: ${err.stack}`);
  process.exit(1);
});

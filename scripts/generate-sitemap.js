import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = process.env.SITE_URL || 'https://m-f-tushar.github.io/Blog-Website';

const staticPages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/#/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/#/blog', changefreq: 'daily', priority: 0.9 },
  { url: '/#/recommendations', changefreq: 'weekly', priority: 0.7 },
  { url: '/#/contact', changefreq: 'monthly', priority: 0.6 },
  { url: '/#/tags', changefreq: 'weekly', priority: 0.5 },
];

const generateSitemap = () => {
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
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
};

generateSitemap();

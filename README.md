<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Personal Blog Website

A modern, minimalist personal blog website built with React, TypeScript, and Vite.

View your app in AI Studio: https://ai.studio/apps/drive/1lw5uk7but41mWQvO2doVKUs26pVHFHBe

## Features

- 📝 Blog posts with markdown support
- 🎨 Dark/Light theme toggle
- 🔍 Search functionality
- 🏷️ Tag-based categorization
- 💼 Admin dashboard for content management
- 🗄️ Supabase integration for dynamic content (optional)
- 📤 Image upload to Supabase Storage (1GB free!)
- ⚡ Real-time content synchronization
- 📱 Responsive design
- ⚡ Fast and optimized with Vite

## Run Locally

**Prerequisites:**  Node.js 18 or higher

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Set the `GEMINI_API_KEY` in [.env.local](.env.local) if you need AI features

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Deploy to the Web

Ready to share your blog with the world?

### GitHub Pages (Recommended - Free & Easy!)

**Deploy your website in just 3 steps:**

1. Go to **Settings** → **Pages** in your repository
2. Under "Source", select **"GitHub Actions"**
3. Push to `main` branch or manually trigger the workflow

Your website will be live at `https://<your-username>.github.io/Blog-Website/` in 1-3 minutes! 

📖 **[Complete GitHub Pages Setup Guide](./GITHUB_PAGES_SETUP.md)** - Step-by-step instructions with screenshots

### Other Deployment Options

- **Vercel:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/M-F-Tushar/Blog-Website)
- **Netlify:** [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/M-F-Tushar/Blog-Website)

📚 See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel, Netlify, and other platforms.

## 🗄️ Supabase Integration (Optional, but Recommended!)

This blog supports Supabase for dynamic content management! With Supabase enabled:

- ✅ **Completely FREE** - No credit card required (includes 1GB storage!)
- ✅ Manage posts and recommendations through the admin dashboard
- ✅ Upload images directly to Supabase Storage
- ✅ Real-time content updates across all clients
- ✅ No code changes needed to add/edit/delete content
- ✅ **Simpler setup** - Only 2 environment variables vs 6 with Firebase!

### Setup Supabase

**Quick Start (10 minutes):**

1. **Create a free Supabase account** at [supabase.com](https://supabase.com)
2. **Create a new project** and run the SQL schema (provided in setup guide)
3. **Copy `.env.example` to `.env`** and add your Supabase URL and key
4. **Run the migration** at `/admin/migrate` to transfer initial data to Supabase

📖 **[Complete Supabase Setup Guide](./SUPABASE_SETUP.md)** - Detailed step-by-step instructions with SQL schema

### Without Supabase

The blog works perfectly fine without Supabase! It will use:
- **LocalStorage** for user-created posts and recommendations
- **Initial data** from `constants.ts` (hardcoded posts)

Admin features will work, but data is stored locally in your browser.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

**Note:** If using Supabase, make sure to set environment variables in your hosting platform:
- GitHub Pages: Add secrets in repository settings (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
- Vercel/Netlify: Add environment variables in project settings

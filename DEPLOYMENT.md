# Deployment Guide

This guide covers multiple deployment options for your Blog Website. Choose the platform that best suits your needs.

## Table of Contents
- [Quick Deploy Options](#quick-deploy-options)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Other Platforms](#other-platforms)
- [Environment Variables](#environment-variables)

---

## Quick Deploy Options

### One-Click Deploy

Click one of these buttons to deploy instantly:

**Vercel:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/M-F-Tushar/Blog-Website)

**Netlify:**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/M-F-Tushar/Blog-Website)

---

## Vercel Deployment

### Method 1: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your repository `M-F-Tushar/Blog-Website`
5. Vercel will automatically detect the settings from `vercel.json`
6. Click "Deploy"

**Configuration:** The project includes a `vercel.json` file with pre-configured settings.

---

## Netlify Deployment

### Method 1: Using Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy:**
   ```bash
   netlify init
   ```

4. **Manual Deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Method 2: Using Netlify Dashboard

1. Visit [netlify.com](https://netlify.com)
2. Sign in with your GitHub account
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Netlify will automatically detect the settings from `netlify.toml`
6. Click "Deploy site"

### Method 3: Drag and Drop

1. Build the project locally:
   ```bash
   npm run build
   ```

2. Visit [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder

**Configuration:** The project includes a `netlify.toml` file with pre-configured settings.

---

## GitHub Pages Deployment

### Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the `main` branch.

**Setup Steps:**

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"
4. Push to the `main` branch or manually trigger the workflow
5. Your site will be available at `https://<username>.github.io/<repository>/`

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Install gh-pages:**
   ```bash
   npm install -g gh-pages
   ```

3. **Deploy:**
   ```bash
   gh-pages -d dist
   ```

**Note:** For GitHub Pages, you may need to configure the base path in `vite.config.ts` if deploying to a repository path (not a custom domain):

```typescript
export default defineConfig({
  base: '/Blog-Website/', // Replace with your repository name
  // ... other config
});
```

---

## Other Platforms

### Render

1. Visit [render.com](https://render.com)
2. Create a new "Static Site"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. Deploy

### Railway

1. Visit [railway.app](https://railway.app)
2. Create a new project from GitHub
3. Select your repository
4. Railway will auto-detect the configuration
5. Deploy

### Cloudflare Pages

1. Visit [pages.cloudflare.com](https://pages.cloudflare.com)
2. Create a new project
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm run build`
   - Build Output Directory: `dist`
5. Deploy

---

## Environment Variables

If your application uses environment variables (like API keys), configure them in your deployment platform:

### Vercel
1. Go to Project Settings → Environment Variables
2. Add your variables (e.g., `GEMINI_API_KEY`)

### Netlify
1. Go to Site Settings → Environment Variables
2. Add your variables

### GitHub Pages
Environment variables are not supported directly. Consider using GitHub Secrets in your workflow or hardcoding non-sensitive configuration.

---

## Build Configuration

The project is configured with:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Dev Command:** `npm run dev`
- **Framework:** Vite + React

---

## Troubleshooting

### Build Failures

1. **Check Node version:** Ensure you're using Node.js 18 or higher
   ```bash
   node --version
   ```

2. **Clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Routing Issues

This project uses `HashRouter` to handle routing in static deployments. URLs will have a `#` (e.g., `yoursite.com/#/about`).

If you prefer clean URLs, you can:
1. Switch to `BrowserRouter` in `App.tsx`
2. Ensure your hosting platform is configured to redirect all routes to `index.html`

### 404 Errors

If you're getting 404 errors on refresh:
- **Vercel/Netlify:** The configuration files include rewrites to handle this
- **GitHub Pages:** Consider using `HashRouter` (already configured)
- **Other platforms:** Add a rewrite rule to serve `index.html` for all routes

---

## Performance Optimization

### Recommended Post-Deployment Steps

1. **Enable HTTPS** (most platforms do this automatically)
2. **Configure CDN** (Vercel, Netlify, and Cloudflare provide this by default)
3. **Set up custom domain** (optional)
4. **Enable compression** (usually automatic)
5. **Configure caching headers** (check platform documentation)

---

## Continuous Deployment

All platforms mentioned support automatic deployments:
- Push to `main` branch → Automatic deployment
- Pull request deployments for preview (Vercel, Netlify)

---

## Support

For platform-specific issues, refer to their documentation:
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Render Documentation](https://render.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)

---

## Next Steps

After deployment:
1. Test all pages and functionality
2. Set up custom domain (optional)
3. Configure analytics (optional)
4. Set up monitoring (optional)
5. Share your blog with the world! 🚀

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

## Deploy to the Web

Ready to share your blog with the world? Check out our comprehensive **[Deployment Guide](./DEPLOYMENT.md)** for step-by-step instructions.

### Quick Deploy Options:

- **Vercel:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/M-F-Tushar/Blog-Website)
- **Netlify:** [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/M-F-Tushar/Blog-Website)
- **GitHub Pages:** Automatic deployment configured via GitHub Actions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel, Netlify, GitHub Pages, and other platforms.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

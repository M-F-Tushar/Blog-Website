# 📝 Personal Blog

A modern, professional personal blog platform built with React, TypeScript, and Tailwind CSS. Features a beautiful, responsive design with dark mode support, SEO optimization, and a powerful admin panel for content management.

![Blog Preview](https://via.placeholder.com/1200x600?text=Modern+Personal+Blog)
  
## ✨ Key Features
           
### 🎨 Modern Design
- **Professional UI/UX** - Clean, modern interface with glassmorphism effects
- **Responsive Layout** - Optimized for mobile, tablet, and desktop
- **Dark Mode** - Seamless theme switching with system preference detection
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Custom Typography** - Beautiful font pairing with Inter and Playfair Display

### 📖 Content Management
- **Rich Markdown Editor** - Write posts with full Markdown support
- **Syntax Highlighting** - Code blocks with highlight.js
- **Math Rendering** - LaTeX support via KaTeX
- **Image Optimization** - Automatic image handling and optimization
- **Draft System** - Save and publish posts when ready

### 🔍 Discovery & Navigation
- **Advanced Search** - Filter posts by title, content, tags, and categories
- **Tag System** - Organize content with multiple tags
- **Reading Time** - Automatic reading time calculation
- **Table of Contents** - Auto-generated TOC for long posts
- **Related Posts** - Smart content recommendations

### 🎯 User Experience
- **SEO Optimized** - Dynamic meta tags, Open Graph, and Twitter Cards
- **Fast Performance** - Vite-powered build with code splitting
- **Accessibility** - WCAG 2.1 AA compliant
- **Bookmarks** - Save posts to read later
- **Social Sharing** - Share posts on Twitter, LinkedIn, and Facebook
- **Comments** - Engage with readers (optional)

### 🔐 Admin Features
- **Secure Authentication** - Supabase-powered auth system
- **Content Dashboard** - Manage posts, recommendations, and settings
- **Profile Management** - Update author bio, social links, and photo
- **Site Settings** - Customize site name, description, and metadata
- **Analytics Ready** - Easy integration with analytics platforms

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/M-F-Tushar/Blog-Website.git
   cd Blog-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the SQL scripts in `supabase/schema.sql` in your Supabase SQL editor

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to `http://localhost:3000`

## 🗄️ Database Setup

### Supabase Configuration

Execute these SQL commands in your Supabase SQL Editor:

```sql
-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'General',
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'draft',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'My Blog',
  site_description TEXT,
  author_name TEXT,
  author_tagline TEXT,
  author_bio TEXT,
  author_image TEXT,
  social_github TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  social_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile settings table
CREATE TABLE profile_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio TEXT,
  skills JSONB,
  timeline JSONB,
  achievements JSONB,
  statistics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON profile_settings FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Allow authenticated users to insert" ON posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete" ON posts FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert" ON recommendations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON recommendations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete" ON recommendations FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update" ON site_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to update" ON profile_settings FOR UPDATE TO authenticated USING (true);
```

### Create Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and secure password
4. Check "Auto Confirm User"
5. Save credentials for admin login

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run generate-sitemap` - Generate sitemap.xml

## 🚀 Deployment

### Deploy to GitHub Pages

1. **Update `vite.config.ts`** with your repository name (already configured)

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   
   The built files in `dist/` can be deployed to GitHub Pages using GitHub Actions or manually.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/M-F-Tushar/Blog-Website)

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables (Supabase credentials)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/M-F-Tushar/Blog-Website)

1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Router v6** - Routing
- **Lucide React** - Icons

### Content & Markdown
- **React Markdown** - Markdown rendering
- **Remark GFM** - GitHub Flavored Markdown
- **Rehype Highlight** - Syntax highlighting
- **KaTeX** - Math rendering
- **Mermaid** - Diagrams

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Row Level Security** - Data protection

### Build & Development
- **Vite** - Build tool
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit checks

## 📁 Project Structure

```
Blog-Website/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin panel components
│   │   ├── blog/           # Blog-specific components
│   │   ├── comments/       # Comment system
│   │   └── common/         # Reusable components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── context/            # React contexts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
│   ├── posts/             # Blog post markdown files
│   └── images/            # Images and media
├── scripts/               # Build and utility scripts
├── supabase/              # Database schema
├── index.css              # Global styles
├── tailwind.config.js     # Tailwind configuration
└── vite.config.ts         # Vite configuration
```

## 🎨 Customization

### Update Site Information

1. **Login to Admin Panel**
   - Navigate to `/admin/login`
   - Use your Supabase credentials

2. **Update Settings**
   - Go to Settings → Site Settings
   - Update site name, description, and metadata
   - Go to Settings → Profile Settings
   - Update author bio, skills, and social links

### Customize PWA Icons

The blog comes with optimized PWA icons, but you can customize them to match your brand:

#### Option 1: Using Node.js Script (Recommended)

```bash
npm run generate-icons
```

This will generate three optimized icons:
- `pwa-192x192.png` (< 20KB) - Standard PWA icon
- `pwa-512x512.png` (< 50KB) - High-resolution PWA icon  
- `apple-touch-icon.png` (< 20KB) - Apple Touch Icon

You can customize the icon design by editing `scripts/generate-pwa-icons.js`.

#### Option 2: Using Browser-Based Generator

1. Open `scripts/icon-generator.html` in your browser
2. Customize the icon text and colors
3. Click "Download All Icons"
4. Place the downloaded files in the `public/` directory

The browser-based generator is perfect if you:
- Don't want to run Node scripts
- Want a visual, interactive way to design icons
- Need quick icon generation without dependencies

#### Icon Requirements

- **192x192**: Should be under 20KB for optimal performance
- **512x512**: Should be under 50KB for optimal performance
- **180x180**: Apple Touch Icon, should be under 20KB

All generated icons are automatically optimized for web use.

### Customize Theme

Edit `tailwind.config.js` to customize:
- Color palette
- Fonts
- Spacing
- Animations

### Add Custom Pages

1. Create component in `src/components/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Header.tsx`

## 📖 Writing Posts

### Using the Admin Panel

1. Login to admin panel
2. Navigate to Posts → Create New
3. Write content in Markdown
4. Add tags and category
5. Upload cover image (optional)
6. Save as draft or publish

### Markdown Features

- **Headers**: `# H1`, `## H2`, etc.
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Links**: `[text](url)`
- **Images**: `![alt](url)`
- **Code**: `` `code` `` or ` ```language `
- **Math**: `$inline$` or `$$block$$`
- **Tables**: GitHub Flavored Markdown tables
- **Task Lists**: `- [ ] Task`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**M-F-Tushar**
- GitHub: [@M-F-Tushar](https://github.com/M-F-Tushar)
- LinkedIn: [Connect with me](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Supabase](https://supabase.com/) - Backend platform
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [documentation](https://github.com/M-F-Tushar/Blog-Website/wiki)
- Reach out via email

## 🌟 Show Your Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔀 Contributing code

---

**Made with ❤️ by M-F-Tushar**

*A modern personal blog platform for developers and writers*

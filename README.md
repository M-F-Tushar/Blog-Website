# 📝 Personal Blog Website

A modern, responsive personal blog built with React, TypeScript, Tailwind CSS, and Supabase.

![Blog Screenshot](https://via.placeholder.com/800x400?text=Blog+Screenshot)

## ✨ Features

- 📱 **Fully Responsive** - Works on all devices
- 🌙 **Dark Mode** - Toggle between light and dark themes
- ⚡ **Fast Performance** - Optimized build with Vite
- 🔍 **SEO Optimized** - Dynamic meta tags and sitemap
- ♿ **Accessible** - WCAG 2.1 Level AA compliant
- 🔐 **Secure Admin** - Supabase authentication
- 📖 **Reading Time** - Estimated reading time for posts
- 🏷️ **Tag System** - Organize posts by topics
- 💬 **Recommendations** - Share favorite tools and resources
- 🔗 **Social Sharing** - Share posts on social media

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works great)
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
   
   Navigate to `http://localhost:5173`

## 🗄️ Database Setup

### Create Tables in Supabase

Execute these SQL commands in your Supabase SQL Editor:

```sql
-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
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
  category TEXT NOT NULL,
  image TEXT,
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
  photo_url TEXT,
  social_github TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  social_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON site_settings FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Allow authenticated users to insert" ON posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete" ON posts FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert" ON recommendations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON recommendations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete" ON recommendations FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update" ON site_settings FOR UPDATE TO authenticated USING (true);
```

### Create Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and secure password
4. Check "Auto Confirm User"
5. Save credentials

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate-sitemap` - Generate sitemap.xml

## 🚀 Deployment

### Deploy to GitHub Pages

1. **Update `vite.config.ts`** base path (already configured)

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**
   
   The built files in `dist/` directory can be deployed to GitHub Pages.
   
   Or use GitHub Actions for automatic deployment.

### Deploy to Vercel/Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Markdown:** Marked.js
- **Icons:** Heroicons (via SVG)

## 📁 Project Structure

```
Blog-Website/
├── src/
│   ├── components/       # React components
│   │   ├── admin/       # Admin panel components
│   │   └── common/      # Reusable components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── constants/       # Constants
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── scripts/             # Build scripts
└── supabase/           # Database schema
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**M-F-Tushar**
- GitHub: [@M-F-Tushar](https://github.com/M-F-Tushar)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Built with React and Vite
- Styled with Tailwind CSS
- Powered by Supabase
- Icons from Heroicons

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

Made with ❤️ by M-F-Tushar

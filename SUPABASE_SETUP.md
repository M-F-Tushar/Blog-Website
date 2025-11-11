# Supabase Setup Guide

## Why Supabase?

Supabase provides a **completely FREE** backend solution with no credit card required! Here's why it's better than Firebase for this blog:

✅ **Completely FREE** - No credit card needed for Storage (1GB included)  
✅ **Simpler Setup** - Only 2 environment variables needed (vs 6 for Firebase)  
✅ **Everything in ONE place** - Database, Storage, and Auth all in one dashboard  
✅ **More Powerful** - PostgreSQL database (more flexible than Firestore)  
✅ **Better Developer Experience** - SQL is easier to debug and understand  

**What's included in the FREE tier:**
- PostgreSQL database (500 MB)
- File storage (1 GB)
- 50,000 monthly active users
- 2 GB bandwidth
- Real-time subscriptions
- Row Level Security

---

## Complete Setup Guide

Total setup time: **~10 minutes**

### Step 1: Create Supabase Account (2 minutes)

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

### Step 2: Create New Project (2 minutes)

1. Click "New project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Project Name**: `my-blog` (or your preferred name)
   - **Database Password**: Generate a strong password (save it somewhere safe!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free (default)
4. Click "Create new project"
5. Wait 1-2 minutes for the project to be provisioned

### Step 3: Create Database Tables (3 minutes)

1. In your Supabase project dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy and paste this complete SQL script:

```sql
-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  excerpt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  cover_image TEXT,
  content TEXT NOT NULL,
  is_initial BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  is_initial BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  featured_post_id UUID,
  site_title TEXT DEFAULT 'My Blog',
  site_description TEXT DEFAULT 'A personal blog'
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can read)
CREATE POLICY "Allow public read" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON settings FOR SELECT USING (true);

-- Allow all writes for now (you can add authentication later)
CREATE POLICY "Allow writes" ON posts FOR ALL USING (true);
CREATE POLICY "Allow writes" ON recommendations FOR ALL USING (true);
CREATE POLICY "Allow writes" ON settings FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_recommendations_created_at ON recommendations(created_at DESC);
```

4. Click "Run" to execute the script
5. You should see "Success. No rows returned" - that's good!

### Step 4: Create Storage Bucket (2 minutes)

1. Click "Storage" in the left sidebar
2. Click "Create a new bucket"
3. Fill in bucket details:
   - **Name**: `blog-images`
   - **Public bucket**: ✅ **Check this box** (important!)
4. Click "Create bucket"

5. Configure bucket policies:
   - Click on your `blog-images` bucket
   - Go to "Policies" tab
   - Click "Add policy" → "New policy"
   - Select template: "Allow public access to files"
   - Policy name: `public_access`
   - Click "Review" then "Save policy"

### Step 5: Get Your Credentials (1 minute)

1. Click "Settings" in the left sidebar (at the bottom)
2. Click "API" under Project Settings
3. You'll see two important values:

   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`

4. Copy both values - you'll need them next

### Step 6: Configure Local Environment

1. In your project root, create or update `.env` file:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the placeholder values with your actual Supabase credentials
3. Save the file

**Important:** Never commit your `.env` file to Git! It's already in `.gitignore`.

### Step 7: Create Admin User in Supabase

1. In your Supabase dashboard, click "Authentication" in the left sidebar
2. Click on the "Users" tab
3. Click "Add user" → "Create new user"
4. Fill in the details:
   - **Email**: Your admin email address
   - **Password**: A strong password (save it securely!)
   - **Auto Confirm User**: ✅ **Check this box**
5. Click "Create user"
6. Save your email and password - you'll use these to log into the admin dashboard

### Step 8: Configure GitHub Secrets (for deployment)

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret" and add these two secrets:

   - Name: `VITE_SUPABASE_URL`  
     Value: Your Supabase project URL
   
   - Name: `VITE_SUPABASE_ANON_KEY`  
     Value: Your Supabase anon key

### Step 9: Run Data Migration

1. Start your local development server:
   ```bash
   npm install
   npm run dev
   ```

2. Open http://localhost:5173 in your browser
3. Go to the admin login page: `/admin/login`
4. Log in with your Supabase admin email and password (created in Step 7)
5. Navigate to "Data Migration" in the admin dashboard
6. Click "Migrate Data from constants.ts"
7. Wait for the migration to complete (should take a few seconds)
8. Verify success message showing posts and recommendations migrated

### Step 10: Verify Everything Works

1. Go back to your Supabase dashboard
2. Click "Table Editor" in the left sidebar
3. Click on "posts" table - you should see your migrated posts
4. Click on "recommendations" table - you should see your recommendations
5. Try creating a new post from your admin dashboard
6. Try uploading an image (goes to Supabase Storage)

**Congratulations! Your blog is now running on Supabase! 🎉**

---

## Database Schema Reference

### Posts Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| title | TEXT | Post title |
| date | TEXT | Display date (e.g., "January 15, 2024") |
| category | TEXT | Post category |
| tags | TEXT[] | Array of tag strings |
| excerpt | TEXT | Short description |
| status | TEXT | "Published" or "Draft" |
| cover_image | TEXT | URL to cover image (nullable) |
| content | TEXT | Full post content (Markdown) |
| is_initial | BOOLEAN | True if migrated from constants.ts |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on modification |

### Recommendations Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| title | TEXT | Recommendation title |
| url | TEXT | Link to resource |
| description | TEXT | Description of the resource |
| type | TEXT | Type: "Article", "Book", "Tool", "Video", "Course" |
| is_initial | BOOLEAN | True if migrated from constants.ts |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on modification |

### Settings Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| featured_post_id | UUID | ID of featured post (nullable) |
| site_title | TEXT | Website title |
| site_description | TEXT | Website description |

---

## Managing Your Content

### Using the Supabase Dashboard

1. **View Data:**
   - Go to "Table Editor" in your Supabase dashboard
   - Click on any table to see its data
   - You can edit data directly in the dashboard

2. **Manual Data Entry:**
   - Click "Insert row" to add new content
   - Fill in the fields
   - Click "Save" when done

3. **Export Data:**
   - Click "Export" in the table view
   - Choose CSV or JSON format

### Using the Admin Dashboard (Recommended)

The easiest way to manage content is through your blog's admin dashboard at `/admin`:

- Create, edit, and delete posts
- Manage recommendations
- Upload images
- Set featured posts
- All changes sync automatically to Supabase!

---

## Troubleshooting

### Issue: "Supabase is not initialized" error

**Solution:**
1. Check that your `.env` file has the correct variables
2. Make sure the variable names start with `VITE_`
3. Restart your development server after changing `.env`
4. Verify your Supabase URL and key are correct

### Issue: Migration shows 0 posts migrated

**Solution:**
1. Check the browser console for errors
2. Verify your Supabase URL and key are correct
3. Make sure tables were created successfully (check Table Editor)
4. Try running the SQL script again to ensure all tables exist

### Issue: Images won't upload

**Solution:**
1. Verify `blog-images` bucket exists in Supabase Storage
2. Make sure the bucket is **public** (check bucket settings)
3. Verify public access policy is enabled
4. Check browser console for specific error messages

### Issue: Can't see data in the app

**Solution:**
1. Open browser DevTools → Network tab
2. Refresh the page and look for failed Supabase requests
3. Check that RLS policies are set correctly (see Step 3)
4. Verify data exists in Supabase Table Editor

### Issue: "CORS error" or network errors

**Solution:**
1. This usually means your Supabase project isn't fully provisioned yet
2. Wait a few minutes and try again
3. Check that your project is active in the Supabase dashboard
4. Verify you're using the correct Project URL (not the database URL)

### Issue: Real-time updates not working

**Solution:**
1. Supabase real-time is enabled by default on free tier
2. Make sure you're not exceeding the concurrent connection limit
3. Check browser console for subscription errors
4. Try refreshing the page

---

## Security Best Practices

### Current Setup (Development)

The current setup allows anyone to read and write to your database. This is fine for:
- Personal blogs with admin password protection
- Development and testing
- Blogs where you trust all visitors

### Recommended for Production

For better security, you can:

1. **Add Authentication:**
   - Use Supabase Auth for user login
   - Restrict write access to authenticated users only

2. **Update RLS Policies:**
   ```sql
   -- Remove the "Allow writes" policy
   DROP POLICY "Allow writes" ON posts;
   
   -- Add authenticated-only write policy
   CREATE POLICY "Authenticated users can write" 
   ON posts FOR ALL 
   USING (auth.role() = 'authenticated');
   ```

3. **Enable Email Verification:**
   - Go to Authentication → Policies
   - Enable email verification for new users

4. **Use Service Role Key:**
   - Use anon key for public reads
   - Use service role key only in secure server environments

---

## Useful Supabase Dashboard Links

After logging in to your project:

- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom queries
- **Storage**: Manage uploaded files
- **Database**: View database stats and settings
- **API Docs**: Auto-generated API documentation
- **Logs**: View recent queries and errors

---

## Next Steps

Now that Supabase is set up:

1. ✅ Your blog is running on a completely free backend
2. ✅ You can create posts without worrying about storage costs
3. ✅ All your data is backed up automatically by Supabase
4. ✅ You can scale to thousands of visitors on the free tier

**Happy blogging! 🚀**

---

## Getting Help

- **Supabase Documentation**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Blog Repository Issues**: Open an issue on GitHub if you encounter problems

---

## Comparison: Firebase vs Supabase

| Feature | Firebase | Supabase |
|---------|----------|----------|
| Free Storage | ❌ Requires credit card (Blaze plan) | ✅ 1GB included, no credit card |
| Environment Variables | 6 variables | 2 variables |
| Database | Firestore (NoSQL) | PostgreSQL (SQL) |
| Dashboard | Multiple sections | Single unified dashboard |
| Queries | Limited query capabilities | Full SQL power |
| Real-time | ✅ Yes | ✅ Yes |
| Setup Time | ~20 minutes | ~10 minutes |
| Learning Curve | Steeper | Gentler (SQL is familiar) |

The choice is clear: **Supabase is simpler, free, and more powerful!**

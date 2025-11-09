# Firebase Setup Guide

This guide will help you set up Firebase for your blog website, enabling dynamic content management without code changes.

## Overview

Firebase provides:
- **Firestore Database**: Store posts and recommendations
- **Firebase Storage**: Store uploaded images
- **Real-time Updates**: Changes sync automatically across all clients

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., "blog-website")
4. Google Analytics is optional - you can disable it for simplicity
5. Click **"Create project"** and wait for it to complete

## Step 2: Register Web App

1. In your Firebase project, click the **web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "blog-website")
3. **Do not** check "Set up Firebase Hosting" (we're using GitHub Pages)
4. Click **"Register app"**
5. You'll see your Firebase configuration object - **keep this page open**

## Step 3: Enable Firestore Database

1. In the Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose your preferred region (select closest to your users)
5. Click **"Enable"**

## Step 4: Enable Firebase Storage

1. In the Firebase Console sidebar, click **"Storage"**
2. Click **"Get started"**
3. Keep the default security rules (test mode)
4. Use the same region as Firestore
5. Click **"Done"**

## Step 5: Configure Environment Variables

### For Local Development

1. Create a `.env` file in your project root (it's already in .gitignore)
2. Copy the Firebase config from Step 2 and format it like this:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
VITE_ADMIN_PASSWORD=your_secure_admin_password
```

3. Replace the placeholder values with your actual Firebase config values
4. Set a secure admin password

### For GitHub Pages Deployment

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** for each variable:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_PASSWORD`

4. Update your GitHub Actions workflow (`.github/workflows/deploy.yml`) to use these secrets:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
    VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
    VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
    VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
    VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
    VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
    VITE_ADMIN_PASSWORD: ${{ secrets.VITE_ADMIN_PASSWORD }}
```

## Step 6: Migrate Initial Data

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the admin panel
3. Go to `/admin/migrate` route (e.g., `http://localhost:5173/#/admin/migrate`)
4. Click **"Migrate Data from constants.ts"**
5. Wait for the migration to complete successfully

The migration will:
- Copy all posts from `constants.ts` to Firestore
- Copy all recommendations to Firestore
- Mark them as "initial" (read-only in the admin UI)
- Can be run multiple times safely (won't duplicate data)

## Step 7: Update Firestore Security Rules (Important!)

After migration, update your security rules for better security:

### Firestore Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts collection
    match /posts/{postId} {
      allow read: if true;  // Anyone can read posts
      allow write: if request.auth != null;  // Only authenticated users can write
    }
    
    // Recommendations collection
    match /recommendations/{recId} {
      allow read: if true;  // Anyone can read recommendations
      allow write: if request.auth != null;  // Only authenticated users can write
    }
    
    // Settings collection
    match /settings/{setting} {
      allow read: if true;  // Anyone can read settings
      allow write: if request.auth != null;  // Only authenticated users can write
    }
  }
}
```

3. Click **"Publish"**

**Note**: Currently, the app uses simple password authentication. The rules above allow authenticated users to write. For production, consider implementing proper Firebase Authentication.

### Storage Rules

1. Go to **Storage** → **Rules**
2. Replace the content with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;  // Anyone can view images
      allow write: if request.auth != null;  // Only authenticated users can upload
    }
  }
}
```

3. Click **"Publish"**

## Step 8: Test Your Setup

1. Log in to the admin dashboard
2. Try creating a new post
3. Check if it appears on the blog page
4. Try uploading an image (when that feature is implemented)
5. Verify real-time updates work (open the blog in two tabs)

## Troubleshooting

### "Firebase is not initialized" Error

- **Cause**: Environment variables not set correctly
- **Solution**: 
  - Check your `.env` file has all required variables
  - Restart your dev server after changing `.env`
  - Verify variable names start with `VITE_`

### Data Not Appearing After Migration

- **Cause**: Security rules blocking reads
- **Solution**: Check Firestore rules allow read access

### "Permission Denied" When Creating Posts

- **Cause**: Security rules too restrictive
- **Solution**: Check Firestore rules allow write with `request.auth != null`

### Images Not Uploading

- **Cause**: Storage not configured or rules too restrictive
- **Solution**: 
  - Verify Storage is enabled in Firebase Console
  - Check Storage rules allow upload for authenticated users

## Data Structure Reference

### Posts Collection

```typescript
{
  id: string (auto-generated document ID)
  title: string
  date: string (e.g., "January 15, 2024")
  category: string
  tags: string[]
  excerpt: string
  status: "Published" | "Draft"
  coverImage: string (URL or storage path)
  content: string (markdown)
  isInitial: boolean (true for migrated posts)
  createdAt: Timestamp (Firestore timestamp)
  updatedAt: Timestamp (Firestore timestamp)
}
```

### Recommendations Collection

```typescript
{
  id: string (auto-generated document ID)
  title: string
  url: string
  description: string
  type: "Book" | "Video" | "Tool" | "Article" | "Course"
  isInitial: boolean (true for migrated items)
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Settings Collection

```typescript
{
  featuredPostId: string | null
  siteTitle: string (optional)
  siteDescription: string (optional)
}
```

## Cost Considerations

Firebase offers a generous free tier:

- **Firestore**: 50,000 reads/day, 20,000 writes/day, 1 GB storage
- **Storage**: 5 GB storage, 1 GB downloads/day
- **Authentication**: Unlimited users (if you upgrade to Firebase Auth)

For a personal blog, you'll likely stay within the free tier.

## Next Steps

1. Consider implementing Firebase Authentication for better security
2. Add image upload functionality in CreatePost component
3. Set up Firebase Cloud Functions for advanced features (optional)
4. Configure backup for your Firestore database
5. Monitor usage in Firebase Console

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Query Documentation](https://firebase.google.com/docs/firestore/query-data/queries)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Support

If you encounter issues:
1. Check Firebase Console for error messages
2. Review browser console for JavaScript errors
3. Verify all environment variables are set correctly
4. Check Firestore and Storage security rules

---

**Security Note**: The current implementation uses simple password authentication. For production use, consider implementing Firebase Authentication with proper user management.

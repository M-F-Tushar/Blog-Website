# 🚀 How to Upload Your Blog Website to the Web Using GitHub Pages

This is a **step-by-step guide** to get your blog website live on the internet using GitHub Pages - completely free!

## 📋 What You'll Get

After following these steps, your website will be live at:
```
https://<your-username>.github.io/Blog-Website/
```

For example: `https://M-F-Tushar.github.io/Blog-Website/`

---

## ✅ Prerequisites

Before you start, make sure you have:
- ✓ A GitHub account
- ✓ This repository on your GitHub account (already done if you're reading this!)
- ✓ The repository is **public** (GitHub Pages free tier requires public repos)

---

## 🎯 Step-by-Step Guide

### Step 1: Enable GitHub Pages in Repository Settings

1. **Go to your repository on GitHub:**
   - Navigate to `https://github.com/<your-username>/Blog-Website`
   - Replace `<your-username>` with your actual GitHub username

2. **Open Settings:**
   - Click on the **"Settings"** tab (top right area of your repository)

3. **Navigate to Pages:**
   - In the left sidebar, scroll down and click on **"Pages"**

4. **Configure the Source:**
   - Under **"Build and deployment"** section
   - For **"Source"**: Select **"GitHub Actions"** from the dropdown
   - (Don't select "Deploy from a branch" - we want to use GitHub Actions)

5. **Save:**
   - The settings are automatically saved when you select GitHub Actions

### Step 2: Trigger the Deployment

Your website has an automated deployment system already configured! You have two options:

#### Option A: Automatic Deployment (Recommended)
- Simply **push any change** to the `main` branch
- The deployment will start automatically
- You can push a small change like updating the README to trigger it

#### Option B: Manual Trigger
1. Go to the **"Actions"** tab in your repository
2. Click on **"Deploy to GitHub Pages"** workflow on the left
3. Click the **"Run workflow"** button (on the right)
4. Select the `main` branch
5. Click the green **"Run workflow"** button

### Step 3: Wait for Deployment to Complete

1. **Monitor the deployment:**
   - Go to the **"Actions"** tab
   - You'll see a workflow running (yellow dot = in progress)
   - Wait for it to complete (green checkmark = success)
   - This usually takes 1-3 minutes

2. **Check for success:**
   - When the workflow shows a green checkmark ✓, your site is deployed!

### Step 4: Access Your Live Website

1. **Find your website URL:**
   - Go back to **Settings** → **Pages**
   - At the top, you'll see: **"Your site is live at https://\<your-username\>.github.io/Blog-Website/"**
   
2. **Visit your website:**
   - Click the link or copy it into your browser
   - Your blog is now live on the internet! 🎉

---

## 🔄 Updating Your Website

Every time you push changes to the `main` branch, your website will automatically rebuild and redeploy. The process is:

1. Make changes to your code
2. Commit and push to the `main` branch
3. Wait 1-3 minutes for automatic deployment
4. Refresh your live website to see the changes

---

## 🛠️ Troubleshooting

### Issue: "Deploy to GitHub Pages" workflow not found

**Solution:** 
- Make sure the file `.github/workflows/deploy-github-pages.yml` exists in your repository
- This should already be there, but if it's missing, check the `main` branch

### Issue: Workflow fails with permissions error

**Solution:**
1. Go to **Settings** → **Actions** → **General**
2. Scroll to **"Workflow permissions"**
3. Select **"Read and write permissions"**
4. Check **"Allow GitHub Actions to create and approve pull requests"**
5. Click **"Save"**

### Issue: Website shows 404 error

**Solution:**
- Make sure you selected **"GitHub Actions"** as the source (not "Deploy from a branch")
- Wait a few minutes after the workflow completes
- Clear your browser cache and try again
- Check that the workflow completed successfully (green checkmark)

### Issue: CSS/Images not loading properly

**Solution:**
- This is already handled! The `vite.config.ts` automatically sets the correct base path
- If you forked this repo and renamed it, update line 8 in `vite.config.ts`:
  ```typescript
  base: process.env.GITHUB_ACTIONS ? '/YOUR-REPO-NAME/' : '/',
  ```

---

## 📱 Custom Domain (Optional)

Want to use your own domain (like `myblog.com`) instead of `github.io`?

1. Buy a domain from a domain registrar (GoDaddy, Namecheap, etc.)
2. Go to **Settings** → **Pages**
3. Enter your custom domain in the **"Custom domain"** field
4. Follow GitHub's instructions to configure DNS settings
5. More details: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

---

## 🌟 What's Next?

Now that your website is live:
- ✅ Share the link with friends and family
- ✅ Add the link to your GitHub profile
- ✅ Post about it on social media
- ✅ Start writing blog posts!

---

## 📚 Additional Resources

- **Detailed Deployment Guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for other platforms (Vercel, Netlify, etc.)
- **GitHub Pages Docs:** https://docs.github.com/en/pages
- **Need Help?** Open an issue in this repository

---

## 🎉 Congratulations!

Your blog website is now live on the internet! You can access it anytime at `https://<your-username>.github.io/Blog-Website/`

Every time you push changes to the `main` branch, your website will automatically update. Happy blogging! ✨

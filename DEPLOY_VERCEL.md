# Deploy to Vercel - Complete Guide

## ✅ Yes, this will work on Vercel!

Vercel has excellent support for Vite + React applications. Your app will work perfectly!

## 🚀 Quick Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project**
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `dist` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_SUPABASE_URL = https://bzxwwuofgemlsaxlbspb.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = your_supabase_anon_key_here
   ```
   
   **Important:** Get your Supabase key from:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Settings → API
   - Copy the "anon public" key

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live! 🎉

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? **No** (first time)
   - Project name? **des-mentorconnect** (or your choice)
   - Directory? **./** (current directory)
   - Override settings? **No**

4. **Add Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
   ```
   
   Enter the values when prompted.

5. **Redeploy with env vars**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Files

The project includes `vercel.json` which:
- ✅ Configures SPA routing (all routes serve index.html)
- ✅ Sets up proper caching for assets
- ✅ Auto-detects Vite framework

## 📝 Environment Variables Required

You **must** set these in Vercel:

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key | Supabase Dashboard → Settings → API |

### How to Get Supabase Credentials:

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project (or create one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_PUBLISHABLE_KEY`

## ✅ What Works on Vercel

- ✅ React Router (SPA routing)
- ✅ Supabase authentication
- ✅ Real-time features (Supabase Realtime)
- ✅ All API calls to Supabase
- ✅ Static assets
- ✅ Environment variables
- ✅ Hot Module Replacement (HMR) in preview deployments

## 🎯 Post-Deployment Checklist

After deployment:

1. ✅ Test authentication (sign up/login)
2. ✅ Test messaging (real-time chat)
3. ✅ Test all routes (dashboard, profile, etc.)
4. ✅ Check browser console for errors
5. ✅ Verify environment variables are set

## 🔄 Updating Your Deployment

Every time you push to GitHub:

1. Vercel automatically detects the push
2. Builds your app
3. Deploys to production
4. You get a new URL (or updates your custom domain)

Or manually trigger:
```bash
vercel --prod
```

## 🌐 Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-10 minutes)

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)

### Environment Variables Not Working
- Make sure variable names start with `VITE_`
- Redeploy after adding env vars
- Check Vercel dashboard → Settings → Environment Variables

### Routing Issues (404 on refresh)
- `vercel.json` is already configured for SPA routing
- If issues persist, check the rewrites section

### Supabase Connection Errors
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure RLS (Row Level Security) policies allow public access if needed

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Supabase Documentation](https://supabase.com/docs)

## 🎉 You're All Set!

Your app will work perfectly on Vercel. The configuration is already set up - just add your environment variables and deploy!


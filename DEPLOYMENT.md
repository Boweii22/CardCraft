# Deploying CardCraft to Vercel

This guide will help you deploy your business card creator app to Vercel.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub and push
git remote add origin https://github.com/yourusername/cardcraft.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project
5. Click **"Deploy"**

### Step 3: Configure (Optional)
- **Project Name**: `cardcraft` or `business-card-creator`
- **Framework Preset**: Vite (auto-detected)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# From your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [your-account]
# - Link to existing project? N
# - What's your project's name? cardcraft
# - In which directory is your code located? ./
# - Want to override the settings? N
```

### Step 4: Deploy to Production
```bash
vercel --prod
```

## Configuration Files

### vercel.json
This file is already created and configured for:
- ✅ PWA support (Service Worker)
- ✅ SPA routing (all routes redirect to index.html)
- ✅ Security headers
- ✅ Proper caching for Service Worker

### package.json
Your build scripts are already configured:
- ✅ `npm run build` - Creates production build
- ✅ `npm run preview` - Preview production build locally

## Post-Deployment

### 1. Test Your App
- Visit your deployed URL
- Test all features: create cards, edit, share, export
- Test PWA installation on mobile devices

### 2. Custom Domain (Optional)
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Domains**
4. Add your custom domain

### 3. Environment Variables (If Needed)
Currently, no environment variables are required. If you add any later:
1. Go to **Settings** → **Environment Variables**
2. Add your variables
3. Redeploy

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation

### PWA Not Working
- Check if `manifest.json` and `sw.js` are in the `public` folder
- Verify HTTPS is enabled (Vercel provides this automatically)
- Test on a mobile device

### Routing Issues
- The `vercel.json` includes SPA routing configuration
- All routes should redirect to `index.html`

## Performance Optimization

Your app is already optimized with:
- ✅ Vite for fast builds
- ✅ Tailwind CSS for optimized CSS
- ✅ Framer Motion for smooth animations
- ✅ PWA for offline support

## Monitoring

Vercel provides:
- ✅ Real-time deployment status
- ✅ Performance analytics
- ✅ Error tracking
- ✅ Function logs

## Support

If you encounter issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review build logs in your Vercel dashboard
3. Test locally with `npm run build && npm run preview`

---

**Your app should now be live at: `https://your-project-name.vercel.app`** 
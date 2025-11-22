# Balans Collective Website

Professional Swedish minimalist website for balans-collective.com with multilanguage support.

## Quick GitHub Pages Deployment

### Step 1: Create Repository
1. Go to [github.com](https://github.com) and create a new repository
2. Name it: `balans-collective-website`
3. Make it **Public** (required for free GitHub Pages)
4. Initialize with README ✅

### Step 2: Upload Files
1. Click "uploading an existing file" or drag and drop
2. Upload `index.html` from this folder
3. Commit with message: "Add Balans Collective website"

### Step 3: Enable GitHub Pages
1. Go to repository **Settings** tab
2. Scroll to **Pages** section (left sidebar)
3. Source: **Deploy from a branch**
4. Branch: **main**
5. Folder: **/ (root)**
6. Click **Save**

### Step 4: Get Your URL
- GitHub will give you a URL like: `https://yourusername.github.io/balans-collective-website`
- Site will be live in 2-3 minutes

### Step 5: Set Custom Domain
1. In Pages settings, add custom domain: `balans-collective.com`
2. Enable "Enforce HTTPS" ✅

### Step 6: Configure Namecheap DNS
1. Login to Namecheap → Domain List → Manage `balans-collective.com`
2. Advanced DNS tab
3. Add these records:
   ```
   Type: CNAME | Host: www | Value: yourusername.github.io
   Type: A    | Host: @   | Value: 185.199.108.153
   Type: A    | Host: @   | Value: 185.199.109.153
   Type: A    | Host: @   | Value: 185.199.110.153
   Type: A    | Host: @   | Value: 185.199.111.153
   ```

**Total time: 10 minutes to live website**

## Website Features

✅ **Swedish minimalist design** with lagom principles  
✅ **Multilanguage support** (English/Swedish toggle)  
✅ **Mobile responsive** design  
✅ **Fast loading** (pure CSS, minimal dependencies)  
✅ **SEO optimized** with proper meta tags  
✅ **Professional appearance** suitable for parent presentation  

## File Structure
```
balans-collective-website/
├── index.html          # Main website file
├── README.md          # This deployment guide
└── CNAME             # Custom domain file (auto-created by GitHub)
```

## Language Toggle
- Top-right corner button switches between English and Swedish
- All content translates dynamically
- No page reload required

## Cognitive Modes
Four thinking styles clearly presented:
- **CREATE Mode** - For explorers and dreamers
- **CRITIQUE Mode** - For analysts and skeptics  
- **SYNTHESIZE Mode** - For integrators and diplomats
- **DEFENSE Mode** - For guardians and traditionalists

## Next Steps After Deployment
1. Test the live site on mobile and desktop
2. Share URL with your parent for feedback
3. Consider adding Google Analytics (optional)
4. Plan content for individual mode pages
5. Add contact form or email (future enhancement)

## Technical Notes
- Pure HTML/CSS/JavaScript (no build process needed)
- Google Fonts for typography
- CSS Grid and Flexbox for responsive layout
- Semantic HTML for accessibility
- Progressive enhancement approach

---

**Ready to show your parent tomorrow!** 🇸🇪

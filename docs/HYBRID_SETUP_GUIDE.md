# VetCare Plus - Hybrid Approach Setup Guide

## Overview
This guide explains how to set up VetCare Plus using the **Hybrid Approach**:
- **Frontend**: HTML files hosted on GitHub
- **Backend**: Google Apps Script (fetches HTML from GitHub + handles data)
- **Database**: Google Sheets

## Architecture

```
GitHub Repository (Public)
    └── html/
        ├── Login.html
        ├── Dashboard.html
        ├── Medicines.html
        ├── Sales.html
        └── Vaccinations.html
            ↓ (Apps Script fetches via raw URLs)
Google Apps Script
    ├── Code-Hybrid.gs (fetches HTML + backend logic)
    └── Serves HTML to users
            ↓
Google Sheets (Database)
```

## Benefits

✅ **Version Control**: All HTML files in Git
✅ **Easy Updates**: Push to GitHub, changes reflect automatically (after cache expires)
✅ **Collaboration**: Multiple developers can work on frontend
✅ **Separation**: Frontend (GitHub) separate from Backend (Apps Script)
✅ **Simple Backend**: Still use `google.script.run` API
✅ **Free Hosting**: Both GitHub and Apps Script are free

## Step-by-Step Setup

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New Repository"
3. Repository settings:
   - **Name**: `VetCarePlus-GAS`
   - **Visibility**: **Public** (required for raw URLs)
   - **Initialize**: Check "Add a README file"
4. Click "Create repository"

### Step 2: Organize HTML Files for GitHub

Create this folder structure in your repository:

```
VetCarePlus-GAS/
├── README.md
├── html/
│   ├── Login.html
│   ├── Dashboard.html
│   ├── Medicines.html
│   ├── Sales.html
│   └── Vaccinations.html
└── docs/
    ├── DEPLOYMENT_GUIDE.md
    └── NAVIGATION_FIX.md
```

### Step 3: Upload HTML Files to GitHub

**Option A: Using GitHub Web Interface**

1. In your repository, click "Add file" → "Create new file"
2. Type `html/Login.html` in the filename field
3. Paste the content from `Login-WORKING.html`
4. Click "Commit new file"
5. Repeat for all HTML files

**Option B: Using Git Command Line**

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/VetCarePlus-GAS.git
cd VetCarePlus-GAS

# Create html directory
mkdir html

# Copy HTML files
cp /Users/c2096299/Documents/learningProjects/VetCarePlus-GAS/Login-WORKING.html html/Login.html
cp /Users/c2096299/Documents/learningProjects/VetCarePlus-GAS/Dashboard-WORKING.html html/Dashboard.html
cp /Users/c2096299/Documents/learningProjects/VetCarePlus-GAS/Medicines-WORKING.html html/Medicines.html
cp /Users/c2096299/Documents/learningProjects/VetCarePlus-GAS/Sales-WORKING.html html/Sales.html
cp /Users/c2096299/Documents/learningProjects/VetCarePlus-GAS/Vaccinations-WORKING.html html/Vaccinations.html

# Commit and push
git add .
git commit -m "Add HTML files for VetCare Plus"
git push origin main
```

### Step 4: Verify GitHub Raw URLs

After uploading, verify you can access the raw HTML files:

1. Go to your repository on GitHub
2. Navigate to `html/Login.html`
3. Click the "Raw" button
4. Copy the URL - it should look like:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/VetCarePlus-GAS/main/html/Login.html
   ```
5. Open this URL in a browser - you should see the HTML content

### Step 5: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "VetCare Plus Database"
4. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

### Step 6: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Name it "VetCare Plus Hybrid"
4. Delete the default code
5. Copy the entire content from `Code-Hybrid.gs`
6. Paste into the Apps Script editor

### Step 7: Configure Code-Hybrid.gs

Update these configuration values in `Code-Hybrid.gs`:

```javascript
// Line 7: Replace with your Spreadsheet ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// Lines 16-20: Replace with your GitHub details
const GITHUB_CONFIG = {
  username: 'YOUR_GITHUB_USERNAME',  // e.g., 'johnsmith'
  repo: 'VetCarePlus-GAS',          // Your repo name
  branch: 'main',                    // or 'master'
  folder: 'html'                     // Folder where HTML files are
};
```

**Example:**
```javascript
const SPREADSHEET_ID = '1abc123xyz789';

const GITHUB_CONFIG = {
  username: 'johnsmith',
  repo: 'VetCarePlus-GAS',
  branch: 'main',
  folder: 'html'
};
```

### Step 8: Initialize Database

1. In Apps Script, find the `initializeSpreadsheet()` function
2. Click "Run" → Select `initializeSpreadsheet`
3. Authorize the script when prompted
4. Check your Google Sheet - it should now have 5 sheets:
   - Medicines
   - Sales
   - Vaccinations
   - Users (with default admin user)
   - Settings

### Step 9: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Click the gear icon ⚙️ → Select "Web app"
3. Configure:
   - **Description**: VetCare Plus Hybrid v1.0
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the Web App URL
6. Click "Authorize access" if prompted

### Step 10: Test the Application

1. Open the Web App URL in your browser
2. You should see the Login page (fetched from GitHub)
3. Login with:
   - **Username**: admin
   - **Password**: admin123
4. Test navigation: Dashboard → Medicines → Sales → Vaccinations
5. All pages should load from GitHub

## How It Works

### First Request Flow:

```
User opens Web App URL
    ↓
Apps Script doGet() executes
    ↓
Apps Script checks cache for HTML
    ↓ (cache miss)
Apps Script fetches from GitHub raw URL
    ↓
Apps Script caches HTML (5 minutes)
    ↓
Apps Script serves HTML to user
    ↓
User sees page
```

### Subsequent Requests (within 5 minutes):

```
User navigates to another page
    ↓
Apps Script checks cache
    ↓ (cache hit)
Apps Script serves cached HTML
    ↓
User sees page (faster!)
```

### Backend API Calls:

```
User clicks "Add Medicine"
    ↓
JavaScript calls google.script.run.saveMedicine()
    ↓
Apps Script executes saveMedicine()
    ↓
Apps Script writes to Google Sheets
    ↓
Apps Script returns result
    ↓
JavaScript updates UI
```

## Updating HTML Files

### Method 1: Edit on GitHub (Simple)

1. Go to your repository on GitHub
2. Navigate to the HTML file (e.g., `html/Login.html`)
3. Click the pencil icon (Edit)
4. Make your changes
5. Click "Commit changes"
6. Wait 5 minutes for cache to expire, or run `clearCache()` in Apps Script

### Method 2: Local Development (Recommended)

```bash
# Make changes locally
cd VetCarePlus-GAS
nano html/Login.html  # or use your favorite editor

# Commit and push
git add html/Login.html
git commit -m "Update login page styling"
git push origin main

# Clear cache in Apps Script (optional, for immediate effect)
# Run clearCache() function in Apps Script
```

## Cache Management

The system caches HTML files for **5 minutes** to improve performance.

### Clear Cache Manually:

1. In Apps Script, find the `clearCache()` function
2. Click "Run" → Select `clearCache`
3. Check logs to confirm cache cleared

### Disable Cache (Development):

In `Code-Hybrid.gs`, change:
```javascript
const CACHE_DURATION = 0; // Disable cache
```

## Troubleshooting

### Issue: "Error Loading Page" message

**Possible causes:**
1. GitHub repository is private (must be public)
2. Wrong GITHUB_CONFIG settings
3. HTML files not in correct folder
4. GitHub raw URL not accessible

**Solution:**
1. Verify repository is public
2. Check GITHUB_CONFIG matches your repo
3. Test raw URL in browser
4. Check Apps Script logs for detailed error

### Issue: Changes not reflecting

**Cause:** Cache is still active

**Solution:**
1. Wait 5 minutes for cache to expire, OR
2. Run `clearCache()` function in Apps Script, OR
3. Set `CACHE_DURATION = 0` during development

### Issue: "Failed to fetch from GitHub: 404"

**Cause:** File not found on GitHub

**Solution:**
1. Verify file exists in repository
2. Check filename matches exactly (case-sensitive)
3. Verify branch name is correct (main vs master)
4. Test raw URL manually

### Issue: HTML loads but backend calls fail

**Cause:** SPREADSHEET_ID not configured

**Solution:**
1. Update SPREADSHEET_ID in Code-Hybrid.gs
2. Run initializeSpreadsheet()
3. Redeploy web app

## Development Workflow

### Recommended Workflow:

1. **Make changes locally**
   ```bash
   # Edit HTML files
   code html/Dashboard.html
   ```

2. **Test locally** (optional - open HTML in browser)
   ```bash
   open html/Dashboard.html
   ```

3. **Commit to Git**
   ```bash
   git add .
   git commit -m "Update dashboard layout"
   ```

4. **Push to GitHub**
   ```bash
   git push origin main
   ```

5. **Clear cache** (in Apps Script)
   ```javascript
   // Run clearCache() function
   ```

6. **Test in production**
   - Open Web App URL
   - Verify changes

## Security Considerations

1. **Public Repository**: HTML files are publicly accessible
   - Don't include sensitive data in HTML
   - API keys should be in Apps Script only
   - Backend logic is protected in Apps Script

2. **Authentication**: Still handled by Apps Script
   - Login credentials stored in Google Sheets
   - Session managed by PropertiesService

3. **SPREADSHEET_ID**: Keep this private
   - Don't commit to GitHub
   - Only in Apps Script

## Performance

### Cache Benefits:
- **First load**: ~2-3 seconds (GitHub fetch)
- **Cached load**: ~0.5 seconds (from cache)
- **Cache duration**: 5 minutes

### Optimization Tips:
1. Keep HTML files small (inline CSS/JS)
2. Use cache for production
3. Disable cache only during development
4. Consider CDN for large assets

## Comparison: Embedded vs Hybrid

| Feature | Embedded (Current) | Hybrid (New) |
|---------|-------------------|--------------|
| Version Control | Manual copy-paste | Git |
| Collaboration | Difficult | Easy |
| Updates | Redeploy Apps Script | Push to GitHub |
| Development | Apps Script editor | Any IDE |
| Performance | Fast | Fast (with cache) |
| Complexity | Simple | Moderate |
| Cost | Free | Free |

## Next Steps

1. ✅ Set up GitHub repository
2. ✅ Upload HTML files
3. ✅ Configure Code-Hybrid.gs
4. ✅ Deploy web app
5. ✅ Test all functionality
6. 📝 Document your changes
7. 🚀 Share with team

## Support Files

- `Code-Hybrid.gs` - Apps Script backend
- `html/Login.html` - Login page
- `html/Dashboard.html` - Dashboard
- `html/Medicines.html` - Medicines management
- `html/Sales.html` - Sales & billing
- `html/Vaccinations.html` - Vaccination records

## Additional Resources

- [GitHub Docs](https://docs.github.com)
- [Apps Script Docs](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
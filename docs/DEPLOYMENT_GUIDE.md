# VetCare Plus - Google Apps Script Deployment Guide

## Overview
This guide will help you deploy the VetCare Plus application using Google Apps Script with Google Sheets as the backend database.

## Prerequisites
1. Google Account
2. Google Sheets (for database)
3. Google Apps Script project

## Step 1: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "VetCare Plus Database"
4. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

## Step 2: Set Up Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Name it "VetCare Plus"

## Step 3: Add Files to Apps Script

### File 1: Code.gs
- Copy the entire content from [`Code.gs`](./Code.gs)
- **IMPORTANT**: Replace `YOUR_SPREADSHEET_ID_HERE` on line 7 with your actual Spreadsheet ID
- Paste into the default `Code.gs` file in Apps Script

### File 2: Login.html
- In Apps Script, click the "+" next to Files
- Select "HTML"
- Name it "Login"
- Copy the entire content from [`Login-WORKING.html`](./Login-WORKING.html)
- Paste into the Login.html file

### File 3: Dashboard.html
- Create new HTML file named "Dashboard"
- Copy content from [`Dashboard-WORKING.html`](./Dashboard-WORKING.html)
- Paste into Dashboard.html

### File 4: Medicines.html
- Create new HTML file named "Medicines"
- Copy content from [`Medicines-WORKING.html`](./Medicines-WORKING.html)
- Paste into Medicines.html

### File 5: Sales.html
- Create new HTML file named "Sales"
- Copy content from [`Sales-WORKING.html`](./Sales-WORKING.html) (if you have it)
- Or use the template pattern from Medicines-WORKING.html
- Paste into Sales.html

### File 6: Vaccinations.html
- Create new HTML file named "Vaccinations"
- Copy content from [`Vaccinations-WORKING.html`](./Vaccinations-WORKING.html)
- Paste into Vaccinations.html

## Step 4: Initialize the Database

1. In Apps Script, click on "Code.gs"
2. Find the `initializeSpreadsheet()` function
3. Click "Run" → Select `initializeSpreadsheet`
4. Authorize the script when prompted
5. Check your Google Sheet - it should now have sheets: Medicines, Sales, Vaccinations, Users, Settings
6. The Users sheet should have a default admin user

## Step 5: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Click the gear icon ⚙️ next to "Select type"
3. Select "Web app"
4. Configure:
   - **Description**: VetCare Plus v1.0
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone (or your preferred setting)
5. Click "Deploy"
6. Copy the Web App URL (you'll need this to access your app)
7. Click "Authorize access" if prompted

## Step 6: Test the Application

1. Open the Web App URL in your browser
2. You should see the Login page
3. Use default credentials:
   - **Username**: admin
   - **Password**: admin123
4. After login, you should be redirected to the Dashboard
5. Test navigation:
   - Click Dashboard → Should stay on dashboard
   - Click Medicines → Should open medicines page
   - Click Sales → Should open sales page
   - Click Vaccinations → Should open vaccinations page

## Step 7: Verify Navigation

All navigation should use the proper deployment URL, not the iframe URL. The URL should look like:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?page=dashboard
```

NOT like:
```
https://n-xxxxx.googleusercontent.com/userCodeAppPanel?page=dashboard
```

## Troubleshooting

### Issue: Navigation redirects to iframe URL
**Solution**: Make sure you copied the -WORKING.html files, not the original .html files. The -WORKING files have the navigation fix implemented.

### Issue: Blank pages after navigation
**Solution**: 
1. Check that all HTML files are named correctly (Login, Dashboard, Medicines, Sales, Vaccinations)
2. Verify Code.gs is using `createHtmlOutputFromFile()` not `createTemplateFromFile()`
3. Redeploy the web app

### Issue: CSS not loading
**Solution**: The -WORKING.html files have inline CSS. Make sure you're using those files, not the original ones that try to include external CSS.

### Issue: "Script function not found: getWebAppUrl"
**Solution**: Make sure Code.gs has the `getWebAppUrl()` function (should be around line 193)

### Issue: Database errors
**Solution**: 
1. Run `initializeSpreadsheet()` function
2. Check that SPREADSHEET_ID in Code.gs matches your actual spreadsheet ID
3. Verify the script has permission to access the spreadsheet

## Features

### Dashboard
- View statistics (total medicines, low stock, expired, expiring soon)
- View total sales and revenue
- View total vaccinations
- Quick action buttons

### Medicines
- Add new medicines
- Edit existing medicines
- Delete medicines (soft delete)
- Search medicines
- View medicine details
- Track quantity, prices, expiry dates

### Sales
- Create new bills
- Add multiple items to cart
- Calculate totals automatically
- Track payment methods
- View sales history
- Automatic inventory update

### Vaccinations
- Add vaccination records
- Track pet information
- Record owner details
- Schedule next due dates
- View vaccination history
- Edit records

## Default Login Credentials

**Username**: admin  
**Password**: admin123

**IMPORTANT**: Change the default password after first login by:
1. Opening your Google Sheet
2. Going to the "Users" sheet
3. Updating the password in row 2

## Security Notes

1. The app uses Google's built-in authentication
2. Passwords are stored in plain text in the spreadsheet (consider implementing hashing for production)
3. Session management uses PropertiesService
4. All data is stored in your private Google Sheet

## File Structure in Apps Script

```
VetCare Plus/
├── Code.gs                 (Backend logic)
├── Login.html             (Login page)
├── Dashboard.html         (Dashboard page)
├── Medicines.html         (Medicines management)
├── Sales.html            (Sales & billing)
└── Vaccinations.html     (Vaccination records)
```

## Support

For issues or questions, refer to:
- [`NAVIGATION_FIX.md`](./NAVIGATION_FIX.md) - Navigation troubleshooting
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) - General troubleshooting
- [`README.md`](./README.md) - Project overview

## Version History

- **v1.0** - Initial release with navigation fixes
  - Login with proper URL handling
  - Dashboard with statistics
  - Medicines CRUD operations
  - Sales & billing
  - Vaccination records
  - Fixed iframe navigation issues
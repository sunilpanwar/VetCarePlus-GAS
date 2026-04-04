# Navigation Fix Guide

## Problem
Google Apps Script web apps run inside iframes with URLs like:
```
https://n-chsht356rxqmodvmgdskqk3qspgrwownehozdwi-0lu-script.googleusercontent.com/userCodeAppPanel
```

When using relative links like `href="?page=dashboard"`, the browser navigates within this iframe URL instead of the actual deployment URL.

## Solution
We implemented a server-side function to get the actual deployment URL and use it for all navigation.

### Changes Made:

#### 1. Code.gs - Added getWebAppUrl() function
```javascript
/**
 * Get the web app URL
 */
function getWebAppUrl() {
  return ScriptApp.getService().getUrl();
}
```

This returns the actual deployment URL like:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

#### 2. Login-WORKING.html - Updated redirect after login
```javascript
// After successful login
google.script.run
    .withSuccessHandler(function(webAppUrl) {
        window.top.location.href = webAppUrl + '?page=dashboard';
    })
    .getWebAppUrl();
```

#### 3. Dashboard-WORKING.html - Fixed all navigation links
Added:
- Global `webAppUrl` variable to store the deployment URL
- `navigateTo(page)` helper function for navigation
- Event listeners to intercept all link clicks and use proper URLs
- Uses `window.top.location.href` to break out of iframe

```javascript
// Navigation helper function
function navigateTo(page) {
    if (webAppUrl) {
        window.top.location.href = webAppUrl + '?page=' + page;
    } else {
        // Fallback to relative URL
        window.top.location.href = '?page=' + page;
    }
}

// Intercept all navigation links
document.querySelectorAll('.nav-link[href^="?page="]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var page = this.getAttribute('href').replace('?page=', '');
        navigateTo(page);
    });
});
```

## How It Works:

1. **On page load**: The page calls `getWebAppUrl()` to get the deployment URL from the server
2. **Store URL**: The URL is stored in a global variable `webAppUrl`
3. **Navigation**: All links are intercepted with event listeners
4. **Redirect**: Navigation uses `window.top.location.href` with the full deployment URL
5. **Fallback**: If the server call fails, it falls back to relative URLs

## Key Points:

- ✅ Always use `window.top.location.href` to break out of iframes
- ✅ Get the deployment URL from server using `ScriptApp.getService().getUrl()`
- ✅ Intercept all link clicks to prevent default iframe navigation
- ✅ Use event listeners instead of inline `onclick` for better control
- ✅ Provide fallback to relative URLs if server call fails

## Testing:

1. Deploy the web app with the updated files
2. Login with admin/admin123
3. Click on any navigation link (Dashboard, Medicines, Sales, Vaccinations)
4. Verify the URL in the browser address bar shows the correct deployment URL
5. Verify the page content loads correctly

## Files to Update in Google Apps Script:

1. **Code.gs** - Copy the entire updated file
2. **Login** - Rename Login-WORKING.html to Login and copy content
3. **Dashboard** - Rename Dashboard-WORKING.html to Dashboard and copy content

After updating, redeploy the web app for changes to take effect.
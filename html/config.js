// Google Apps Script Web App Configuration
// Replace this URL with your deployed Google Apps Script web app URL
const API_URL = 'https://script.google.com/macros/s/AKfycbxWvnpxL5cZbsJjNQx-N5S1ZHDR9wJkyn5u9OpaBYx6B8tgq_BE0dioHb2QpN_xX6Ov4A/exec';

// Helper function to call API using GET requests (avoids CORS issues)
async function callAPI(action, data = {}) {
    try {
        // Build URL with parameters
        const params = new URLSearchParams({
            action: action,
            ...data
        });
        
        const url = `${API_URL}?${params.toString()}`;
        
        // Use GET request to avoid CORS issues
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Make API_URL available globally
window.API_URL = API_URL;
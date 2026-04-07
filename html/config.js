// Google Apps Script Web App Configuration
// Replace this URL with your deployed Google Apps Script web app URL
const API_URL = 'https://script.google.com/macros/s/AKfycbz1SZ3KVEDJyhLFD2lovkWPn5Itj165-BMrwqBptB9EbILo61pBCq9V06wSZ7iOU5o7pA/exec';

// Helper function to call API using GET requests (avoids CORS issues)
async function callAPI(action, data = {}) {
    try {
        // Build URL with parameters
        const params = new URLSearchParams({
            action: action,
            ...data
        });
        
        const url = `${API_URL}?${params.toString()}`;
        console.log('API Call:', action, 'URL:', url);
        
        // Use GET request to avoid CORS issues
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        
        // Get response text first to check if it's valid JSON
        const responseText = await response.text();
        console.log('API Response:', responseText);
        
        // Try to parse as JSON
        try {
            return JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse JSON response:', responseText);
            throw new Error('Invalid JSON response from server. Response: ' + responseText.substring(0, 200));
        }
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Make API_URL available globally
window.API_URL = API_URL;
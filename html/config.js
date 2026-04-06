// Google Apps Script Web App Configuration
// Replace this URL with your deployed Google Apps Script web app URL
const API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

// API endpoints
const API = {
    login: API_URL + '?action=login',
    logout: API_URL + '?action=logout',
    getDashboardData: API_URL + '?action=getDashboardData',
    getAllMedicines: API_URL + '?action=getAllMedicines',
    saveMedicine: API_URL + '?action=saveMedicine',
    deleteMedicine: API_URL + '?action=deleteMedicine',
    getAllSales: API_URL + '?action=getAllSales',
    createSale: API_URL + '?action=createSale',
    getAllVaccinations: API_URL + '?action=getAllVaccinations',
    saveVaccination: API_URL + '?action=saveVaccination'
};

// Helper function to call API
async function callAPI(action, data = {}) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                data: data
            })
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
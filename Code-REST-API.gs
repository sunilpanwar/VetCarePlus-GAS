/**
 * VetCare Plus - Google Apps Script REST API Backend
 * For use with GitHub Pages frontend
 * Handles CORS and JSON requests/responses
 */

// Spreadsheet configuration
const SPREADSHEET_ID = '18IZ6Q8O8pz2LailmQ9PRrpXBshrj8I-nA76YDjtwEG8';
const SHEETS = {
  MEDICINES: 'Medicines',
  SALES: 'Sales',
  VACCINATIONS: 'Vaccinations',
  USERS: 'Users',
  SETTINGS: 'Settings'
};

/**
 * Handle GET requests (for simple API calls)
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Handle POST requests (for data submission)
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Main request handler with CORS support
 */
function handleRequest(e) {
  // Handle case when running from editor (e is undefined)
  if (!e) {
    return createCORSResponse({
      success: true,
      message: 'API is running. Use GET requests with action parameter.',
      example: 'GET ?action=login&username=admin&password=admin123'
    });
  }
  
  try {
    // Get action from URL parameters (GET request)
    const action = e.parameter.action;
    const params = e.parameter;
    
    // Route to appropriate function based on action
    let response;
    
    switch (action) {
      case 'login':
        response = login(params.username, params.password);
        break;
        
      case 'logout':
        response = logout();
        break;
        
      case 'getDashboardData':
        response = { success: true, data: getDashboardData() };
        break;
        
      case 'getAllMedicines':
        response = { success: true, data: getAllMedicines() };
        break;
        
      case 'saveMedicine':
        // Parse medicine data from URL parameters
        const medicineData = {
          id: params.id && params.id !== 'null' && params.id !== 'undefined' ? params.id : null,
          barcode: params.barcode || '',
          name: params.name || '',
          manufacturer: params.manufacturer || '',
          category: params.category || '',
          quantity: params.quantity ? parseFloat(params.quantity) : 0,
          mrp: params.mrp ? parseFloat(params.mrp) : 0,
          buyingPrice: params.buyingPrice ? parseFloat(params.buyingPrice) : 0,
          sellingPrice: params.sellingPrice ? parseFloat(params.sellingPrice) : 0,
          gstPercentage: params.gstPercentage ? parseFloat(params.gstPercentage) : 0,
          manufacturingDate: params.manufacturingDate || '',
          expiryDate: params.expiryDate || '',
          description: params.description || ''
        };
        response = saveMedicine(medicineData);
        break;
        
      case 'deleteMedicine':
        response = deleteMedicine(params.id);
        break;
        
      case 'getAllSales':
        response = { success: true, data: getAllSales() };
        break;
        
      case 'createSale':
        // Parse sale data from URL parameters
        const saleData = {
          customerName: params.customerName || '',
          customerPhone: params.customerPhone || '',
          items: params.items ? JSON.parse(params.items) : [],
          totalAmount: params.totalAmount ? parseFloat(params.totalAmount) : 0,
          paymentMethod: params.paymentMethod || 'CASH',
          notes: params.notes || '',
          createdBy: params.createdBy || 'system'
        };
        response = createSale(saleData);
        break;
        
      case 'getAllVaccinations':
        response = { success: true, data: getAllVaccinations() };
        break;
        
      case 'saveVaccination':
        // Parse vaccination data from URL parameters
        const vaccinationData = {
          id: params.id && params.id !== 'null' && params.id !== 'undefined' ? params.id : null,
          petName: params.petName || '',
          petType: params.petType || '',
          ownerName: params.ownerName || '',
          ownerPhone: params.ownerPhone || '',
          vaccineType: params.vaccineType || '',
          vaccineName: params.vaccineName || '',
          vaccinationDate: params.vaccinationDate || '',
          nextDueDate: params.nextDueDate || '',
          veterinarian: params.veterinarian || '',
          notes: params.notes || ''
        };
        response = saveVaccination(vaccinationData);
        break;
        
      default:
        response = { success: false, message: 'Unknown action: ' + action };
    }
    
    return createCORSResponse(response);
    
  } catch (error) {
    Logger.log('Error: ' + error.message);
    return createCORSResponse({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
}

/**
 * Create JSON response (no CORS issues with GET requests)
 */
function createCORSResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Generate unique ID
 */
function generateId() {
  return 'ID' + new Date().getTime() + Math.random().toString(36).substr(2, 9);
}

/**
 * Authentication functions
 */
function login(username, password) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const usersSheet = ss.getSheetByName(SHEETS.USERS);
    const data = usersSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      const isActive = data[i][7] === true || data[i][7] === 'TRUE' || data[i][7] === 'true';
      if (data[i][1] === username && data[i][2] === password && isActive) {
        return { 
          success: true, 
          message: 'Login successful',
          user: {
            username: username,
            fullName: data[i][3],
            role: data[i][4]
          }
        };
      }
    }
    
    return { success: false, message: 'Invalid username or password' };
  } catch (error) {
    return { success: false, message: 'Login error: ' + error.message };
  }
}

function logout() {
  return { success: true, message: 'Logged out successfully' };
}

/**
 * Medicine CRUD operations
 */
function getAllMedicines() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.MEDICINES);
    const data = sheet.getDataRange().getValues();
    
    const medicines = [];
    for (let i = 1; i < data.length; i++) {
      const isActive = data[i][15] === true || data[i][15] === 'TRUE' || data[i][15] === 'true';
      
      if (isActive) {
        medicines.push({
          id: data[i][0],
          barcode: data[i][1],
          name: data[i][2],
          manufacturer: data[i][3],
          category: data[i][4],
          quantity: data[i][5],
          mrp: data[i][6],
          buyingPrice: data[i][7],
          sellingPrice: data[i][8],
          gstPercentage: data[i][9],
          manufacturingDate: data[i][10],
          expiryDate: data[i][11],
          description: data[i][12],
          createdAt: data[i][13],
          updatedAt: data[i][14]
        });
      }
    }
    
    return medicines;
  } catch (error) {
    Logger.log('Error getting medicines: ' + error.message);
    return [];
  }
}

function saveMedicine(medicineData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.MEDICINES);
    
    if (medicineData.id) {
      // Update existing
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === medicineData.id) {
          sheet.getRange(i + 1, 1, 1, 16).setValues([[
            medicineData.id,
            medicineData.barcode,
            medicineData.name,
            medicineData.manufacturer,
            medicineData.category,
            medicineData.quantity,
            medicineData.mrp,
            medicineData.buyingPrice,
            medicineData.sellingPrice,
            medicineData.gstPercentage,
            medicineData.manufacturingDate,
            medicineData.expiryDate,
            medicineData.description,
            data[i][13],
            new Date(),
            true
          ]]);
          return { success: true, message: 'Medicine updated successfully', id: medicineData.id };
        }
      }
    } else {
      // Create new
      const id = generateId();
      sheet.appendRow([
        id,
        medicineData.barcode,
        medicineData.name,
        medicineData.manufacturer,
        medicineData.category,
        medicineData.quantity,
        medicineData.mrp,
        medicineData.buyingPrice,
        medicineData.sellingPrice,
        medicineData.gstPercentage,
        medicineData.manufacturingDate,
        medicineData.expiryDate,
        medicineData.description,
        new Date(),
        new Date(),
        true
      ]);
      return { success: true, message: 'Medicine created successfully', id: id };
    }
  } catch (error) {
    return { success: false, message: 'Error saving medicine: ' + error.message };
  }
}

function deleteMedicine(id) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.MEDICINES);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.getRange(i + 1, 16).setValue(false);
        return { success: true, message: 'Medicine deleted successfully' };
      }
    }
    
    return { success: false, message: 'Medicine not found' };
  } catch (error) {
    return { success: false, message: 'Error deleting medicine: ' + error.message };
  }
}

/**
 * Sales operations
 */
function getAllSales() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.SALES);
    const data = sheet.getDataRange().getValues();
    
    const sales = [];
    for (let i = 1; i < data.length; i++) {
      sales.push({
        id: data[i][0],
        billNumber: data[i][1],
        customerName: data[i][2],
        customerPhone: data[i][3],
        items: JSON.parse(data[i][4] || '[]'),
        totalAmount: data[i][5],
        paymentMethod: data[i][6],
        notes: data[i][7],
        createdAt: data[i][8],
        createdBy: data[i][9]
      });
    }
    
    return sales;
  } catch (error) {
    Logger.log('Error getting sales: ' + error.message);
    return [];
  }
}

function createSale(saleData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.SALES);
    
    const id = generateId();
    const billNumber = 'BILL' + new Date().getTime();
    
    sheet.appendRow([
      id,
      billNumber,
      saleData.customerName || '',
      saleData.customerPhone || '',
      JSON.stringify(saleData.items),
      saleData.totalAmount,
      saleData.paymentMethod,
      saleData.notes || '',
      new Date(),
      saleData.createdBy || 'system'
    ]);
    
    // Update medicine quantities
    updateMedicineQuantities(saleData.items);
    
    return { success: true, message: 'Sale created successfully', id: id, billNumber: billNumber };
  } catch (error) {
    return { success: false, message: 'Error creating sale: ' + error.message };
  }
}

function updateMedicineQuantities(items) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.MEDICINES);
  const data = sheet.getDataRange().getValues();
  
  items.forEach(item => {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === item.medicineId) {
        const currentQty = data[i][5];
        const newQty = currentQty - item.quantity;
        sheet.getRange(i + 1, 6).setValue(newQty);
        break;
      }
    }
  });
}

/**
 * Vaccination operations
 */
function getAllVaccinations() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.VACCINATIONS);
    const data = sheet.getDataRange().getValues();
    
    const vaccinations = [];
    for (let i = 1; i < data.length; i++) {
      vaccinations.push({
        id: data[i][0],
        petName: data[i][1],
        petType: data[i][2],
        ownerName: data[i][3],
        ownerPhone: data[i][4],
        vaccineType: data[i][5],
        vaccineName: data[i][6],
        vaccinationDate: data[i][7],
        nextDueDate: data[i][8],
        veterinarian: data[i][9],
        notes: data[i][10],
        createdAt: data[i][11],
        updatedAt: data[i][12]
      });
    }
    
    return vaccinations;
  } catch (error) {
    Logger.log('Error getting vaccinations: ' + error.message);
    return [];
  }
}

function saveVaccination(vaccinationData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.VACCINATIONS);
    
    if (vaccinationData.id) {
      // Update existing
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === vaccinationData.id) {
          sheet.getRange(i + 1, 1, 1, 13).setValues([[
            vaccinationData.id,
            vaccinationData.petName,
            vaccinationData.petType,
            vaccinationData.ownerName,
            vaccinationData.ownerPhone,
            vaccinationData.vaccineType,
            vaccinationData.vaccineName,
            vaccinationData.vaccinationDate,
            vaccinationData.nextDueDate,
            vaccinationData.veterinarian,
            vaccinationData.notes,
            data[i][11],
            new Date()
          ]]);
          return { success: true, message: 'Vaccination updated successfully' };
        }
      }
    } else {
      // Create new
      const id = generateId();
      sheet.appendRow([
        id,
        vaccinationData.petName,
        vaccinationData.petType,
        vaccinationData.ownerName,
        vaccinationData.ownerPhone,
        vaccinationData.vaccineType,
        vaccinationData.vaccineName,
        vaccinationData.vaccinationDate,
        vaccinationData.nextDueDate,
        vaccinationData.veterinarian,
        vaccinationData.notes,
        new Date(),
        new Date()
      ]);
      return { success: true, message: 'Vaccination created successfully', id: id };
    }
  } catch (error) {
    return { success: false, message: 'Error saving vaccination: ' + error.message };
  }
}

/**
 * Dashboard data
 */
function getDashboardData() {
  const medicines = getAllMedicines();
  const sales = getAllSales();
  const vaccinations = getAllVaccinations();
  
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
  
  return {
    totalMedicines: medicines.length,
    lowStockCount: medicines.filter(m => m.quantity < 10).length,
    expiredCount: medicines.filter(m => new Date(m.expiryDate) < today).length,
    expiringSoonCount: medicines.filter(m => {
      const expiry = new Date(m.expiryDate);
      return expiry > today && expiry < thirtyDaysFromNow;
    }).length,
    totalSales: sales.length,
    totalRevenue: sales.reduce((sum, s) => sum + s.totalAmount, 0),
    totalVaccinations: vaccinations.length
  };
}
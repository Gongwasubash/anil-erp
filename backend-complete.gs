/**
 * EVEREST SCHOOL ERP - GOOGLE APPS SCRIPT BACKEND
 * Complete CRUD operations for Financial Year Management
 */

// Configuration
const SHEET_NAME = 'Everest_ERP_Database';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Invalid request");
    }
    
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const payload = params.payload || {};
    
    let result;
    
    switch (action) {
      case 'SETUP':
        result = setupDatabase();
        break;
      case 'GET_DATA':
        result = getData(payload.sheetName);
        break;
      case 'SAVE_DATA':
        result = saveData(payload.sheetName, payload.data);
        break;
      case 'UPDATE_DATA':
        result = updateData(payload.sheetName, payload.id, payload.data);
        break;
      case 'DELETE_DATA':
        result = deleteData(payload.sheetName, payload.id);
        break;
      case 'LOGIN':
        result = loginUser(payload.username, payload.password);
        break;
      default:
        throw new Error('Invalid action: ' + action);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      data: result 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Everest ERP Backend is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getSpreadsheet() {
  // Try to find existing spreadsheet
  const files = DriveApp.getFilesByName(SHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  
  // Create new spreadsheet if not found
  const ss = SpreadsheetApp.create(SHEET_NAME);
  setupDatabase();
  return ss;
}

function setupDatabase() {
  const ss = getSpreadsheet();
  
  // Create users sheet
  let userSheet = ss.getSheetByName('users');
  if (!userSheet) {
    userSheet = ss.insertSheet('users');
    userSheet.appendRow(['id', 'username', 'password', 'role', 'status']);
    userSheet.appendRow(['1', 'superadmin', 'admin123', 'Super Admin', 'Active']);
  }
  
  // Create financial_years sheet
  let fySheet = ss.getSheetByName('financial_years');
  if (!fySheet) {
    fySheet = ss.insertSheet('financial_years');
    fySheet.appendRow(['id', 'financialYear', 'name', 'startDate', 'endDate', 'status']);
    
    // Add sample data
    fySheet.appendRow(['Current Year', '2024/25', 'Current Year', '2024-04-01', '2025-03-31', 'Active']);
    fySheet.appendRow(['Next Year', '2025/26', 'Next Year', '2025-04-01', '2026-03-31', 'Inactive']);
  }
  
  return 'Database setup completed. Spreadsheet ID: ' + ss.getId();
}

function loginUser(username, password) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('users');
  
  if (!sheet) {
    throw new Error('Users sheet not found');
  }
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[1] === username && row[2] === password) {
      if (row[4] === 'Inactive') {
        throw new Error('Account is inactive');
      }
      return {
        id: row[0],
        username: row[1],
        role: row[3],
        status: row[4]
      };
    }
  }
  
  throw new Error('Invalid username or password');
}

function getData(sheetName) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return [];
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

function saveData(sheetName, data) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    // Create sheet if it doesn't exist
    sheet = ss.insertSheet(sheetName);
    const headers = Object.keys(data);
    sheet.appendRow(headers);
  }
  
  // For financial_years, use name as ID
  if (sheetName === 'financial_years') {
    data.id = data.name || 'Unnamed';
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(header => data[header] || '');
  
  sheet.appendRow(row);
  
  return { ...data, success: true };
}

function updateData(sheetName, id, data) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idIndex = headers.indexOf('id');
  
  if (idIndex === -1) {
    throw new Error('ID column not found');
  }
  
  // Find the row to update
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idIndex] === id) {
      // Update the row
      const newRow = headers.map(header => {
        if (header === 'id' && sheetName === 'financial_years') {
          // For financial_years, update ID to new name if name changed
          return data.name || id;
        }
        return data[header] !== undefined ? data[header] : allData[i][headers.indexOf(header)];
      });
      
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([newRow]);
      return { success: true };
    }
  }
  
  throw new Error('Record not found with ID: ' + id);
}

function deleteData(sheetName, id) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idIndex = headers.indexOf('id');
  
  if (idIndex === -1) {
    throw new Error('ID column not found');
  }
  
  // Find and delete the row
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idIndex] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  
  throw new Error('Record not found with ID: ' + id);
}

// Test function
function testFinancialYear() {
  // Test creating a financial year
  const testData = {
    financialYear: '2023/24',
    name: 'Previous Year',
    startDate: '2023-04-01',
    endDate: '2024-03-31',
    status: 'Inactive'
  };
  
  const result = saveData('financial_years', testData);
  console.log('Test result:', result);
  
  return result;
}
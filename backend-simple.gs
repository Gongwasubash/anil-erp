/**
 * SIMPLE EVEREST ERP BACKEND - NO DELETION ISSUES
 */

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const payload = params.payload || {};
    
    let result;
    
    if (action === 'SETUP') {
      result = createSheets();
    } else if (action === 'GET_DATA') {
      result = getFinancialYears();
    } else if (action === 'SAVE_DATA') {
      result = addFinancialYear(payload.data);
    } else if (action === 'UPDATE_DATA') {
      result = updateFinancialYear(payload.id, payload.data);
    } else if (action === 'DELETE_DATA') {
      result = deleteFinancialYear(payload.id);
    } else if (action === 'LOGIN') {
      result = { id: '1', username: 'superadmin', role: 'Super Admin', status: 'Active' };
    } else {
      throw new Error('Invalid action');
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('ERP Backend Working!')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('financial_years');
  
  if (!sheet) {
    sheet = ss.insertSheet('financial_years');
    sheet.appendRow(['id', 'financialYear', 'name', 'startDate', 'endDate', 'status']);
  }
  
  return sheet;
}

function createSheets() {
  const sheet = getSheet();
  
  // Add sample data if empty
  if (sheet.getLastRow() === 1) {
    sheet.appendRow(['Current Year', '2024/25', 'Current Year', '2024-04-01', '2025-03-31', 'Active']);
    sheet.appendRow(['Next Year', '2025/26', 'Next Year', '2025-04-01', '2026-03-31', 'Inactive']);
  }
  
  return 'Setup completed';
}

function getFinancialYears() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || '';
    });
    return obj;
  });
}

function addFinancialYear(data) {
  const sheet = getSheet();
  
  const id = data.name || 'Unnamed';
  const row = [
    id,
    data.financialYear || '',
    data.name || '',
    data.startDate || '',
    data.endDate || '',
    data.status || 'Active'
  ];
  
  sheet.appendRow(row);
  return { ...data, id: id };
}

function updateFinancialYear(id, data) {
  const sheet = getSheet();
  const allData = sheet.getDataRange().getValues();
  
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][0] === id) {
      const newId = data.name || id;
      sheet.getRange(i + 1, 1, 1, 6).setValues([[
        newId,
        data.financialYear || allData[i][1],
        data.name || allData[i][2],
        data.startDate || allData[i][3],
        data.endDate || allData[i][4],
        data.status || allData[i][5]
      ]]);
      return { success: true };
    }
  }
  
  throw new Error('Record not found');
}

function deleteFinancialYear(id) {
  const sheet = getSheet();
  const allData = sheet.getDataRange().getValues();
  
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  
  throw new Error('Record not found');
}
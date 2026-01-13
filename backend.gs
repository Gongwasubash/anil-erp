/**
 * GOOGLE APPS SCRIPT BACKEND - EVEREST SCHOOL ERP
 */

function doPost(e) {
  let SS;
  try {
    console.log('doPost called with:', e);
    SS = SpreadsheetApp.getActiveSpreadsheet();
    if (!SS) {
      throw new Error("Spreadsheet Connection Failed: This script must be bound to a Google Sheet.");
    }
    
    if (!e || !e.postData || !e.postData.contents) {
      console.log('Missing postData:', e);
      throw new Error("Invalid request: Missing postData");
    }
    
    const requestBody = e.postData.contents;
    console.log('Request body:', requestBody);
    if (!requestBody) {
      throw new Error("Empty request body");
    }
    
    const params = JSON.parse(requestBody);
    const action = params.action;
    const payload = params.payload || {};
    console.log('Action:', action, 'Payload:', payload);
    
    let result;

    switch (action) {
      case 'LOGIN':
        result = loginUser(SS, payload.username, payload.password);
        break;
      case 'GET_DATA':
        result = getSheetData(SS, payload.sheetName);
        break;
      case 'SAVE_DATA':
        result = saveToSheet(SS, payload.sheetName, payload.data);
        break;
      case 'UPDATE_DATA':
        result = updateInSheet(SS, payload.sheetName, payload.id, payload.data);
        break;
      case 'DELETE_DATA':
        result = deleteFromSheet(SS, payload.sheetName, payload.id);
        break;
      case 'SETUP':
        result = setup();
        break;
      case 'RESET_MONTHS':
        result = resetMonthMaster(SS);
        break;
      case 'TEST_MONTHS':
        result = testMonthData(SS);
        break;
      case 'INIT_FEE_STRUCTURE':
        result = initializeFeeStructure(SS);
        break;
      case 'FIX_FEE_STRUCTURE_HEADERS':
        result = fixFeeStructureHeaders(SS);
        break;
      case 'SEARCH_FEE_STRUCTURE':
        result = searchFeeStructure(SS, payload.criteria);
        break;
      default:
        throw new Error('Invalid Action: ' + (action || 'undefined'));
    }

    console.log('Result:', result);
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error('API Error:', err.message);
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function searchFeeStructure(SS, criteria) {
  console.log('searchFeeStructure called with criteria:', criteria);
  const sheet = SS.getSheetByName('fee_structure_details');
  if (!sheet) {
    console.log('Sheet fee_structure_details not found');
    return [];
  }
  
  const rows = sheet.getDataRange().getValues();
  console.log('Total rows found:', rows.length);
  if (rows.length < 2) {
    console.log('No data rows found');
    return [];
  }
  
  const headers = rows[0];
  console.log('Headers:', headers);
  const results = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    let match = true;
    
    const batchValue = row[headers.indexOf('batch')];
    const classValue = row[headers.indexOf('class')];
    
    console.log(`Row ${i}: batch=${batchValue}, class=${classValue}`);
    console.log(`Criteria: batch=${criteria.batch}, class=${criteria.class}`);
    
    if (criteria.batch && batchValue !== criteria.batch) match = false;
    if (criteria.class && classValue !== criteria.class) match = false;
    
    console.log(`Row ${i} match:`, match);
    
    if (match) {
      let obj = {};
      headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });
      results.push(obj);
    }
  }
  
  console.log('Search results:', results.length, 'records found');
  return results;
}

function getOrCreateSheet(SS, name, headers = ['id']) {
  const spreadsheet = SS || SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    if (name === 'fee_structure_details') {
      headers = ['id', 'school', 'branch', 'batch', 'class', 'monthName', 'applyDDCharges', 'feeHeadId', 'feeHead', 'general', 'twentyFivePercent', 'fiftyPercent', 'outOfThree'];
    }
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f3f3');
    SpreadsheetApp.flush();
  }
  return sheet;
}

function getSheetData(SS, sheetName) {
  const sheet = getOrCreateSheet(SS, sheetName);
  const rows = sheet.getDataRange().getValues();
  
  if (rows.length < 2) return [];
  const headers = rows[0];
  
  return rows.slice(1).map((row, index) => {
    let obj = {};
    headers.forEach((header, i) => {
      let val = row[i];
      if (header === 'id' && (!val || val === '')) {
        val = (index + 1).toString();
      }
      if (val instanceof Date) {
        obj[header] = val.toISOString();
      } else {
        obj[header] = val;
      }
    });
    return obj;
  });
}

function saveToSheet(SS, sheetName, data) {
  let sheetHeaders;
  if (sheetName === 'fee_structure_details') {
    sheetHeaders = ['id', 'school', 'branch', 'batch', 'class', 'monthName', 'applyDDCharges', 'feeHeadId', 'feeHead', 'general', 'twentyFivePercent', 'fiftyPercent', 'outOfThree'];
    
    // Check if record exists with same batch, class, and feeHeadId
    const sheet = getOrCreateSheet(SS, sheetName, sheetHeaders);
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const existingBatch = row[headers.indexOf('batch')];
      const existingClass = row[headers.indexOf('class')];
      const existingFeeHeadId = row[headers.indexOf('feeHeadId')];
      
      if (existingBatch === data.batch && existingClass === data.class && existingFeeHeadId === data.feeHeadId) {
        // Update existing record
        const newRow = headers.map(header => {
          return data[header] !== undefined ? data[header] : row[headers.indexOf(header)];
        });
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([newRow]);
        SpreadsheetApp.flush();
        return { ...data, id: row[headers.indexOf('id')] };
      }
    }
  } else {
    sheetHeaders = ['id', ...Object.keys(data).filter(k => k !== 'id')];
  }
  
  const sheet = getOrCreateSheet(SS, sheetName, sheetHeaders);
  const idValue = data.id || Date.now().toString();
  const headers = sheet.getDataRange().getValues()[0];
  
  const row = headers.map(header => {
    if (header === 'id') {
      return idValue;
    }
    return data[header] !== undefined ? data[header] : '';
  });
  
  sheet.appendRow(row);
  SpreadsheetApp.flush();
  
  return { ...data, id: idValue.toString() };
}

function fixFeeStructureHeaders(SS) {
  const sheet = SS.getSheetByName('fee_structure_details');
  if (!sheet) {
    return 'Sheet not found';
  }
  
  const correctHeaders = ['id', 'school', 'branch', 'batch', 'class', 'monthName', 'applyDDCharges', 'feeHeadId', 'feeHead', 'general', 'twentyFivePercent', 'fiftyPercent', 'outOfThree'];
  
  sheet.getRange(1, 1, 1, sheet.getMaxColumns()).clearContent();
  sheet.getRange(1, 1, 1, correctHeaders.length).setValues([correctHeaders]);
  sheet.getRange(1, 1, 1, correctHeaders.length).setFontWeight('bold').setBackground('#f3f3f3');
  
  SpreadsheetApp.flush();
  return 'Headers fixed successfully';
}

function setup() {
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  getOrCreateSheet(SS, 'fee_structure_details');
  return "Database setup completed";
}

function doGet(e) {
  return ContentService.createTextOutput('Google Apps Script is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}
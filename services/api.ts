
/**
 * API Service for communicating with Google Apps Script
 */

const DEFAULT_URL = 'https://script.google.com/macros/s/AKfycbzvBcx91X4m7Y1HTkrxuSnD9q-gHSjDJuakHeYYhnh0nptpag5I1jb0lnde8IrGHoWXyg/exec';

export const getApiUrl = () => localStorage.getItem('erp_api_url') || DEFAULT_URL;

export const setApiUrl = (url: string) => {
  if (url && !url.endsWith('/exec')) {
    console.warn('Apps Script URL usually ends with /exec');
  }
  localStorage.setItem('erp_api_url', url);
};

export async function testConnection() {
  const url = getApiUrl();
  console.log('Testing connection to:', url);
  
  try {
    // First test with GET request
    const getResponse = await fetch(url, { method: 'GET' });
    console.log('GET test status:', getResponse.status);
    const getResult = await getResponse.text();
    console.log('GET test result:', getResult);
    
    // Then test with POST request
    const result = await callBackend('SETUP', {});
    console.log('POST test result:', result);
    
    return { success: true, message: 'Connection successful' };
  } catch (error: any) {
    console.error('Connection test failed:', error);
    return { success: false, error: error.message };
  }
}

export async function callBackend(action: string, payload: any = {}) {
  const url = getApiUrl();
  console.log('API URL:', url);
  console.log('Calling backend with action:', action, 'payload:', payload);
  
  if (!url) {
    throw new Error('API URL not configured. Please set it in Admin Control.');
  }

  try {
    const requestData = { action, payload };
    console.log('Request data:', requestData);
    
    const response = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    const result = JSON.parse(responseText);
    console.log('Parsed result:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Backend action failed');
    }

    return result.data;
  } catch (error: any) {
    console.error('API Call Error:', error);
    throw error;
  }
}

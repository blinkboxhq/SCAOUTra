import { CONFIG } from './settings.js';

export async function submitAudit(data) {
  // Use native FormData which survives Google's 302 redirects
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('website', data.website);

  try {
    await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', // Prevents CORS errors blocking the script
      body: formData,  // Do NOT set Content-Type header; browser sets the boundary automatically
    });
    
    // Because of no-cors, the response is opaque, so we assume success if no network error thrown
    return { success: true };
  } catch (error) {
    console.error('Submission failed:', error);
    return { success: false };
  }
}

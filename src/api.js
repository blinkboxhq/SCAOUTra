import { CONFIG } from './settings.js';

export async function submitAudit(formData) {
  const payload = {
    name: formData.name,
    email: formData.email,
    website: formData.website,
  };

  try {
    await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(payload).toString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Submission failed:', error);
    return { success: false };
  }
}

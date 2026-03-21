import { CONFIG } from './settings.js';

export async function submitAudit(data) {
  try {
    await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        name: data.name,
        email: data.email,
        website: data.website,
      }).toString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Submission failed:', error);
    return { success: false };
  }
}

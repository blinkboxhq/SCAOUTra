import { CONFIG } from './settings.js';

/**
 * Submit lead form data to the n8n webhook.
 * Sends a JSON POST request and returns { success: bool, message?: string }.
 */
export async function submitAudit(data) {
  const payload = {
    name:    data.name,
    email:   data.email,
    website: data.website,
  };

  try {
    const res = await fetch(CONFIG.WEBHOOK_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (res.ok) return { success: true };

    const json = await res.json().catch(() => null);
    return {
      success: false,
      message: json?.message || `Server error (${res.status})`,
    };
  } catch (err) {
    console.error('Form submission failed:', err);
    return { success: false };
  }
}

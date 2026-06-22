import { CONFIG } from './settings.js';

const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/hello@scoutra.co';

/**
 * Submit lead form data.
 * Primary: FormSubmit.co (AJAX endpoint) — returns { success: "true" }.
 * Fallback: n8n webhook (CONFIG.WEBHOOK_URL).
 * Returns { success: bool, message?: string }.
 */
export async function submitAudit(data) {
  const payload = {
    name:     data.name,
    email:    data.email,
    website:  data.website,
    _subject: 'New Audit Request from Scoutra.co',
    _captcha: 'false',
  };

  // --- Primary: FormSubmit.co ---
  try {
    const res = await fetch(FORMSUBMIT_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json().catch(() => null);
      // FormSubmit returns { success: "true" } (string, not boolean)
      if (json && (json.success === true || json.success === 'true')) {
        return { success: true };
      }
    }
    // Non-OK response — fall through to n8n
  } catch (err) {
    console.warn('FormSubmit.co failed, trying n8n fallback:', err);
  }

  // --- Fallback: n8n webhook ---
  try {
    const n8nPayload = {
      name:    data.name,
      email:   data.email,
      website: data.website,
    };

    const res = await fetch(CONFIG.WEBHOOK_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(n8nPayload),
    });

    if (res.ok) return { success: true };

    const json = await res.json().catch(() => null);
    return {
      success: false,
      message: json?.message || `Server error (${res.status})`,
    };
  } catch (err) {
    console.error('Form submission failed on both endpoints:', err);
    return { success: false };
  }
}

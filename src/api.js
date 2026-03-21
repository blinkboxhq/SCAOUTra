import { CONFIG } from './settings.js';

/**
 * Submit lead form data to the Google Apps Script webhook.
 *
 * Strategy:
 *  1. Try standard CORS fetch (Google returns Access-Control-Allow-Origin: *)
 *     — this lets us read the real response and detect errors.
 *  2. If CORS fails for any reason, fall back to no-cors mode
 *     — submission still goes through, we just can't read the response.
 */
export async function submitAudit(data) {
  const body = new URLSearchParams({
    name: data.name,
    email: data.email,
    website: data.website,
  }).toString();

  // ── Attempt 1: Standard CORS (preferred — can read response) ──
  try {
    const res = await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
      redirect: 'follow',
    });

    if (res.ok) {
      const json = await res.json().catch(() => null);
      if (json && json.result === 'error') {
        console.error('Server rejected submission:', json);
        return { success: false, message: json.message || json.errors?.join(', ') };
      }
      return { success: true };
    }

    // Non-ok status — fall through to fallback
    console.warn('CORS fetch returned status', res.status, '— trying fallback.');
  } catch (corsError) {
    console.warn('CORS fetch failed — trying no-cors fallback:', corsError.message);
  }

  // ── Attempt 2: no-cors fallback (opaque — assume success if no network error) ──
  try {
    await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    });
    return { success: true };
  } catch (fallbackError) {
    console.error('Both submission attempts failed:', fallbackError);
    return { success: false };
  }
}

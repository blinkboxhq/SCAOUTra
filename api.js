import { CONFIG } from "../config/settings.js";

export async function submitAudit(formData) {
  // 1. Prepare the payload matching the Google Script expects
  const payload = {
    name: formData.name,
    email: formData.email,
    website: formData.website,
    revenue: formData.revenue,
    bottleneck: formData.bottleneck,
  };

  try {
    // 2. Send to Google Sheets
    // Note: mode 'no-cors' means we won't get a readable response JSON back,
    // but it allows the data to send without error.
    await fetch(CONFIG.WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    // Since we use 'no-cors', we assume success if no network error occurred
    return { success: true };
  } catch (error) {
    console.error("Submission Failed:", error);
    return { success: false, error: "Network error" };
  }
}

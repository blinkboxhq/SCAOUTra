import { CONFIG } from "../config/settings.js";

/**
 * Sends the audit application data to the automation workflow.
 * @param {Object} formData - The data from the form
 * @returns {Promise<Object>} - The response from the webhook
 */
export async function submitAudit(formData) {
  const payload = {
    ...formData,
    submittedAt: new Date().toISOString(),
    source: "Website_Audit_Form",
    metadata: {
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
    },
  };

  try {
    const response = await fetch(CONFIG.WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    // Return a clean success object
    return { success: true, timestamp: new Date() };
  } catch (error) {
    console.error("Submission Failed:", error);
    // In a real production app, you might log this to Sentry or similar
    return { success: false, error: error.message };
  }
}

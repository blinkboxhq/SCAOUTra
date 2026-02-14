export const CONFIG = {
  // This is where you paste your Make.com or Zapier Webhook URL
  // For now, it points to a dummy echo service for testing
  WEBHOOK_URL: "https://hook.us1.make.com/YOUR_ACTUAL_WEBHOOK_HERE",

  // Feature Flags (Turn parts of the site on/off easily)
  ENABLE_CALCULATOR: true,
  ENABLE_FORM_VALIDATION: true,

  // The "Grudge" Settings (Default assumptions for the calculator)
  DEFAULTS: {
    HOURLY_RATE_EUR: 50, // Value of the owner's time
    AVG_MANUAL_HOURS: 15, // Hours wasted per week (average)
    COMPETITOR_SPEED: "10x", // Marketing stat
  },
};

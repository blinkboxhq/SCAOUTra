/* ============================================================
   Scoutra Lead Capture — Google Apps Script
   ============================================================
   Paste this entire file into the Apps Script editor (Code.gs).
   Deploy as a Web App to generate your webhook URL.
   ============================================================ */

// ── Configuration ──────────────────────────────────────────────
var CONFIG = {
  SHEET_NAME: 'Leads',
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 254,
  MAX_WEBSITE_LENGTH: 500,
  DUPLICATE_WINDOW_HOURS: 24,
  EMAIL_SUBJECT: 'Welcome to Scoutra \u2014 Your Automation Journey Starts Now',
  SENDER_NAME: 'Scoutra',
  REPLY_TO: 'hello@scoutra.co'
};

var EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

// ── Health Check ───────────────────────────────────────────────
function doGet(e) {
  var output = {
    status: 'ok',
    service: 'Scoutra Lead Capture',
    timestamp: new Date().toISOString()
  };
  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Main Webhook Handler ───────────────────────────────────────
function doPost(e) {
  try {
    // 1. Extract parameters
    var params = e && e.parameter ? e.parameter : {};
    var name    = sanitize(params.name,    CONFIG.MAX_NAME_LENGTH);
    var email   = sanitize(params.email,   CONFIG.MAX_EMAIL_LENGTH).toLowerCase();
    var website = sanitize(params.website, CONFIG.MAX_WEBSITE_LENGTH);

    // 2. Validate
    if (name.length < 2) {
      return jsonResponse({ result: 'error', message: 'Name must be at least 2 characters.' });
    }
    if (!isValidEmail(email)) {
      return jsonResponse({ result: 'error', message: 'A valid email address is required.' });
    }
    if (website.length < 1) {
      return jsonResponse({ result: 'error', message: 'Website or project description is required.' });
    }

    // 3. Get sheet
    var sheet = getOrCreateSheet();

    // 4. Check for duplicate submission (same email within window)
    if (isDuplicate(sheet, email, CONFIG.DUPLICATE_WINDOW_HOURS)) {
      return jsonResponse({ result: 'success', note: 'Already received.' });
    }

    // 5. Generate timestamp
    var now = new Date();
    var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    // 6. Append row
    sheet.appendRow([timestamp, name, email, website, 'New', 'Pending']);

    // 7. Send welcome email (non-blocking — lead is already saved)
    var emailStatus = 'Sent';
    try {
      sendWelcomeEmail(name, email);
    } catch (mailError) {
      console.error('Email failed: ' + mailError.message);
      emailStatus = 'Failed';
    }

    // 8. Update email status in column F
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 6).setValue(emailStatus);

    return jsonResponse({ result: 'success' });

  } catch (error) {
    console.error('doPost error: ' + error.message);
    return jsonResponse({ result: 'error', message: 'An internal error occurred.' });
  }
}

// ── Welcome Email ──────────────────────────────────────────────
function sendWelcomeEmail(name, email) {
  var year = new Date().getFullYear();
  var firstName = name.split(' ')[0];

  var htmlBody = '<!DOCTYPE html>' +
    '<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<meta name="color-scheme" content="dark light">' +
    '<meta name="supported-color-schemes" content="dark light">' +
    '<title>' + CONFIG.EMAIL_SUBJECT + '</title>' +
    '<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->' +
    '</head>' +
    '<body style="margin:0;padding:0;word-spacing:normal;background-color:#0c0c0f;">' +

    // ── Outer wrapper ──
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0c0c0f;">' +
    '<tr><td align="center" style="padding:40px 16px;">' +

    // ── Inner container ──
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#111115;border:1px solid #26262b;border-radius:16px;">' +

    // ── Header ──
    '<tr><td align="center" style="padding:40px 40px 24px 40px;" bgcolor="#111115">' +
    '<span style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-0.5px;color:#f4f4f5;">SCOUT</span>' +
    '<span style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-0.5px;color:#52525b;">RA</span>' +
    '<br>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;"><tr><td style="width:40px;height:2px;background-color:#4ade80;border-radius:1px;"></td></tr></table>' +
    '</td></tr>' +

    // ── Welcome message ──
    '<tr><td style="padding:0 40px 8px 40px;" bgcolor="#111115">' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;color:#f4f4f5;margin:0 0 16px 0;">Hi ' + escapeHtml(firstName) + ',</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#a1a1aa;margin:0 0 24px 0;">' +
    'Thank you for applying for a free automation audit. We\u2019ve received your details and our team will personally review your business within 24 hours.' +
    '</p>' +
    '</td></tr>' +

    // ── Motto quote ──
    '<tr><td style="padding:0 40px 32px 40px;" bgcolor="#111115">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>' +
    '<td style="border-left:2px solid #4ade80;padding:16px 20px;background-color:#18181c;border-radius:0 8px 8px 0;">' +
    '<p style="font-family:Georgia,\'Times New Roman\',serif;font-size:17px;font-style:italic;color:#f4f4f5;margin:0;line-height:1.6;">' +
    '\u201CAutomate the work that limits your growth.\u201D' +
    '</p>' +
    '</td></tr></table>' +
    '</td></tr>' +

    // ── Divider ──
    '<tr><td style="padding:0 40px;" bgcolor="#111115"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid #26262b;height:1px;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>' +

    // ── Protocol section header ──
    '<tr><td style="padding:32px 40px 8px 40px;" bgcolor="#111115">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td style="background-color:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.15);border-radius:20px;padding:4px 14px;">' +
    '<span style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#4ade80;">Our Process</span>' +
    '</td></tr></table>' +
    '</td></tr>' +

    '<tr><td style="padding:12px 40px 24px 40px;" bgcolor="#111115">' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:#f4f4f5;margin:0;">What Happens Next</p>' +
    '</td></tr>' +

    // ── Step 1: Diagnostic Audit ──
    '<tr><td style="padding:0 40px 12px 40px;" bgcolor="#111115">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#18181c;border:1px solid #26262b;border-radius:12px;">' +
    '<tr><td style="padding:24px;" bgcolor="#18181c">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td valign="top" style="padding-right:16px;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td align="center" style="width:44px;height:44px;background-color:#0f1f15;border-radius:10px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;color:#4ade80;">01</td>' +
    '</tr></table>' +
    '</td>' +
    '<td valign="top">' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#f4f4f5;margin:0 0 6px 0;">Diagnostic Audit</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#a1a1aa;margin:0;">' +
    'We map your entire workflow to pinpoint the highest-value automation opportunity \u2014 the one manual process costing you the most time and revenue. You receive a prioritised roadmap, not a generic report.' +
    '</p>' +
    '</td>' +
    '</tr></table>' +
    '</td></tr></table>' +
    '</td></tr>' +

    // ── Step 2: Architecture & Build ──
    '<tr><td style="padding:0 40px 12px 40px;" bgcolor="#111115">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#18181c;border:1px solid #26262b;border-radius:12px;">' +
    '<tr><td style="padding:24px;" bgcolor="#18181c">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td valign="top" style="padding-right:16px;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td align="center" style="width:44px;height:44px;background-color:#0f1c1f;border-radius:10px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;color:#22d3ee;">02</td>' +
    '</tr></table>' +
    '</td>' +
    '<td valign="top">' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#f4f4f5;margin:0 0 6px 0;">Architecture &amp; Build</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#a1a1aa;margin:0;">' +
    'We design and build your automation using enterprise-grade tools \u2014 n8n, OpenAI, Google Apps Script, and more. Everything is tested in a sandbox so your live business is never at risk during rollout.' +
    '</p>' +
    '</td>' +
    '</tr></table>' +
    '</td></tr></table>' +
    '</td></tr>' +

    // ── Step 3: Deployment & Handoff ──
    '<tr><td style="padding:0 40px 32px 40px;" bgcolor="#111115">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#18181c;border:1px solid #26262b;border-radius:12px;">' +
    '<tr><td style="padding:24px;" bgcolor="#18181c">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td valign="top" style="padding-right:16px;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td align="center" style="width:44px;height:44px;background-color:#0f1f15;border-radius:10px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;color:#86efac;">03</td>' +
    '</tr></table>' +
    '</td>' +
    '<td valign="top">' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#f4f4f5;margin:0 0 6px 0;">Deployment &amp; Handoff</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#a1a1aa;margin:0;">' +
    'We go live, train your team on the new system, and provide 30 days of active monitoring. You walk away with a running automation and the knowledge to manage it \u2014 no dependency on us required.' +
    '</p>' +
    '</td>' +
    '</tr></table>' +
    '</td></tr></table>' +
    '</td></tr>' +

    // ── Closing message ──
    '<tr><td style="padding:0 40px 32px 40px;" bgcolor="#111115">' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#a1a1aa;margin:0;">' +
    'In the meantime, if you have any questions, simply reply to this email or reach out to us directly. We\u2019re here to help.' +
    '</p>' +
    '</td></tr>' +

    // ── Footer divider ──
    '<tr><td style="padding:0 40px;" bgcolor="#111115"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid #26262b;height:1px;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>' +

    // ── Footer ──
    '<tr><td align="center" style="padding:24px 40px 32px 40px;" bgcolor="#111115">' +
    '<p style="margin:0 0 6px 0;">' +
    '<span style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.3px;color:#f4f4f5;">SCOUT</span>' +
    '<span style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.3px;color:#52525b;">RA</span>' +
    '</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:12px;color:#52525b;margin:0 0 12px 0;">AI Automation for Modern Businesses</p>' +
    '<p style="margin:0 0 12px 0;">' +
    '<a href="mailto:hello@scoutra.co" style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:13px;color:#4ade80;text-decoration:none;">hello@scoutra.co</a>' +
    '</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:11px;color:#52525b;margin:0 0 8px 0;">\u00A9 ' + year + ' Scoutra. All rights reserved.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:11px;color:#3f3f46;margin:0;line-height:1.5;">' +
    'You received this email because you applied for a free automation audit at scoutra.co.<br>If this wasn\u2019t you, please ignore this email.' +
    '</p>' +
    '</td></tr>' +

    // ── Close tables ──
    '</table>' +  // inner container
    '</td></tr></table>' +  // outer wrapper
    '</body></html>';

  MailApp.sendEmail({
    to: email,
    subject: CONFIG.EMAIL_SUBJECT,
    htmlBody: htmlBody,
    name: CONFIG.SENDER_NAME,
    replyTo: CONFIG.REPLY_TO
  });
}

// ── Helper Functions ───────────────────────────────────────────

/**
 * Strip HTML tags, trim whitespace, and truncate to max length.
 */
function sanitize(str, maxLen) {
  if (str == null) return '';
  var clean = String(str)
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/[\r\n]+/g, ' ')  // collapse newlines
    .trim();
  return clean.substring(0, maxLen);
}

/**
 * Validate email format.
 */
function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

/**
 * Escape HTML special characters for safe insertion into the email.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Check if this email was already submitted within the duplicate window.
 * Returns true if a duplicate is found (prevents re-appending).
 */
function isDuplicate(sheet, email, windowHours) {
  var data = sheet.getDataRange().getValues();
  var cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - windowHours);

  // Start from row index 1 (skip header)
  for (var i = 1; i < data.length; i++) {
    var rowEmail = String(data[i][2]).toLowerCase().trim();
    if (rowEmail === email) {
      var rowTimestamp = new Date(data[i][0]);
      if (rowTimestamp >= cutoff) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Get the "Leads" sheet. If it doesn't exist, create it with headers.
 */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Website', 'Status', 'Email Sent']);
    sheet.setFrozenRows(1);
    // Bold the header row
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }

  return sheet;
}

/**
 * Build a JSON response via ContentService.
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ============================================================
   Scoutra Lead Capture — Google Apps Script
   ============================================================
   SETUP:
   1. Open your Google Sheet → Extensions → Apps Script
   2. Delete everything in Code.gs and paste this entire file
   3. Update SPREADSHEET_ID below with your Sheet's ID
      (the long string in the sheet URL between /d/ and /edit)
   4. Click Run → select "setupSheet" → Run (accept permissions)
   5. Deploy → New deployment → Web app
      - Execute as: Me
      - Who has access: Anyone
   6. Copy the Web App URL into src/settings.js
   ============================================================ */

// ── CONFIGURATION — UPDATE THESE ──────────────────────────────
var SPREADSHEET_ID = '';  // ← Paste your Google Sheet ID here (leave empty for container-bound scripts)
var SHEET_NAME     = 'Leads';

// ── INTERNAL CONFIG (no need to change) ───────────────────────
var HEADERS        = ['Timestamp', 'Name', 'Email', 'Website', 'Status', 'Email Sent'];
var MAX_NAME       = 100;
var MAX_EMAIL      = 254;
var MAX_WEBSITE    = 500;
var DEDUP_HOURS    = 24;
var EMAIL_REGEX    = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
var SENDER_NAME    = 'Scoutra';
var REPLY_TO       = 'hello@scoutra.co';
var EMAIL_SUBJECT  = 'Welcome to Scoutra — Your Automation Journey Starts Now';


// ================================================================
//  1. SETUP — Run this ONCE from the editor to prepare the sheet
// ================================================================

function setupSheet() {
  var sheet = getSheet_();
  var lastCol = sheet.getLastColumn();

  // If sheet is empty or headers are wrong, write correct headers
  if (lastCol === 0) {
    sheet.appendRow(HEADERS);
  } else {
    var currentHeaders = sheet.getRange(1, 1, 1, Math.max(lastCol, HEADERS.length)).getValues()[0];
    for (var i = 0; i < HEADERS.length; i++) {
      if (String(currentHeaders[i]).trim() !== HEADERS[i]) {
        sheet.getRange(1, i + 1).setValue(HEADERS[i]);
      }
    }
  }

  // Format header row
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#111115');
  headerRange.setFontColor('#4ade80');
  sheet.setFrozenRows(1);

  // Set column widths
  sheet.setColumnWidth(1, 160);  // Timestamp
  sheet.setColumnWidth(2, 180);  // Name
  sheet.setColumnWidth(3, 250);  // Email
  sheet.setColumnWidth(4, 300);  // Website
  sheet.setColumnWidth(5, 100);  // Status
  sheet.setColumnWidth(6, 100);  // Email Sent

  // Add Status dropdown validation on column E
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New', 'Contacted', 'Qualified', 'Converted', 'Archived'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E2:E').setDataValidation(statusRule);

  Logger.log('Sheet setup complete. Headers: ' + HEADERS.join(', '));
  Logger.log('Sheet URL: ' + getSpreadsheet_().getUrl());
}


// ================================================================
//  2. WEB APP ENDPOINTS
// ================================================================

/**
 * GET — Health check. Visit your Web App URL in a browser to test.
 */
function doGet(e) {
  return jsonResponse_({
    status: 'ok',
    service: 'Scoutra Lead Capture',
    timestamp: new Date().toISOString(),
    sheet: SHEET_NAME
  });
}

/**
 * POST — Receives form submissions from the Scoutra website.
 * Expects URL-encoded body with: name, email, website
 */
function doPost(e) {
  try {
    // ── Extract & sanitize ──
    var p = (e && e.parameter) ? e.parameter : {};
    var name    = sanitize_(p.name,    MAX_NAME);
    var email   = sanitize_(p.email,   MAX_EMAIL).toLowerCase();
    var website = sanitize_(p.website, MAX_WEBSITE);

    // ── Validate ──
    var errors = [];
    if (name.length < 2)      errors.push('Name must be at least 2 characters.');
    if (!EMAIL_REGEX.test(email)) errors.push('A valid email is required.');
    if (website.length < 1)   errors.push('Website or project details required.');

    if (errors.length > 0) {
      Logger.log('Validation failed: ' + errors.join(' | '));
      return jsonResponse_({ result: 'error', errors: errors });
    }

    // ── Get sheet (auto-fixes headers if wrong) ──
    var sheet = getSheet_();
    ensureHeaders_(sheet);

    // ── Duplicate check ──
    if (isDuplicate_(sheet, email)) {
      Logger.log('Duplicate submission blocked: ' + email);
      return jsonResponse_({ result: 'success', note: 'Already received.' });
    }

    // ── Append lead ──
    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd HH:mm:ss'
    );
    sheet.appendRow([timestamp, name, email, website, 'New', 'Pending']);
    var newRow = sheet.getLastRow();
    Logger.log('Lead appended at row ' + newRow + ': ' + email);

    // ── Send welcome email ──
    var emailStatus = 'Sent';
    try {
      sendWelcomeEmail_(name, email);
      Logger.log('Welcome email sent to: ' + email);
    } catch (mailErr) {
      emailStatus = 'Failed';
      Logger.log('Email failed for ' + email + ': ' + mailErr.message);
    }
    sheet.getRange(newRow, 6).setValue(emailStatus);

    return jsonResponse_({ result: 'success' });

  } catch (err) {
    Logger.log('doPost FATAL: ' + err.message + '\n' + err.stack);
    return jsonResponse_({ result: 'error', message: 'Internal server error.' });
  }
}


// ================================================================
//  3. WELCOME EMAIL
// ================================================================

function sendWelcomeEmail_(name, email) {
  var firstName = escapeHtml_(name.split(' ')[0]);
  var year = new Date().getFullYear();

  var html = [
    '<!DOCTYPE html>',
    '<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1.0">',
    '<meta name="color-scheme" content="dark light">',
    '<meta name="supported-color-schemes" content="dark light">',
    '<title>' + EMAIL_SUBJECT + '</title>',
    '<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->',
    '</head>',
    '<body style="margin:0;padding:0;word-spacing:normal;background-color:#0c0c0f;">',

    // Outer wrapper
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0c0c0f;">',
    '<tr><td align="center" style="padding:40px 16px;">',

    // Inner container (600px max)
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#111115;border:1px solid #26262b;border-radius:16px;">',

    // ── Logo ──
    '<tr><td align="center" style="padding:40px 40px 24px 40px;" bgcolor="#111115">',
    '<span style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-0.5px;color:#f4f4f5;">SCOUT</span>',
    '<span style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-0.5px;color:#52525b;">RA</span>',
    '<br>',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;"><tr><td style="width:40px;height:2px;background-color:#4ade80;border-radius:1px;"></td></tr></table>',
    '</td></tr>',

    // ── Welcome ──
    '<tr><td style="padding:0 40px 8px 40px;" bgcolor="#111115">',
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;color:#f4f4f5;margin:0 0 16px 0;">Hi ' + firstName + ',</p>',
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#a1a1aa;margin:0 0 24px 0;">',
    'Thank you for applying for a free automation audit. We\u2019ve received your details and our team will personally review your business within 24 hours.',
    '</p>',
    '</td></tr>',

    // ── Motto ──
    '<tr><td style="padding:0 40px 32px 40px;" bgcolor="#111115">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>',
    '<td style="border-left:2px solid #4ade80;padding:16px 20px;background-color:#18181c;border-radius:0 8px 8px 0;">',
    '<p style="font-family:Georgia,\'Times New Roman\',serif;font-size:17px;font-style:italic;color:#f4f4f5;margin:0;line-height:1.6;">',
    '\u201CAutomate the work that limits your growth.\u201D',
    '</p>',
    '</td></tr></table>',
    '</td></tr>',

    // ── Divider ──
    '<tr><td style="padding:0 40px;" bgcolor="#111115"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid #26262b;height:1px;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>',

    // ── Section header ──
    '<tr><td style="padding:32px 40px 8px 40px;" bgcolor="#111115">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>',
    '<td style="background-color:#0f1f15;border:1px solid #1a3a25;border-radius:20px;padding:4px 14px;">',
    '<span style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#4ade80;">Our Process</span>',
    '</td></tr></table>',
    '</td></tr>',
    '<tr><td style="padding:12px 40px 24px 40px;" bgcolor="#111115">',
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:#f4f4f5;margin:0;">What Happens Next</p>',
    '</td></tr>',

    // ── Step 1 ──
    buildStepHtml_('01', 'Diagnostic Audit',
      'We map your entire workflow to pinpoint the highest-value automation opportunity \u2014 the one manual process costing you the most time and revenue. You receive a prioritised roadmap, not a generic report.',
      '#4ade80', '#0f1f15', false),

    // ── Step 2 ──
    buildStepHtml_('02', 'Architecture & Build',
      'We design and build your automation using enterprise-grade tools \u2014 n8n, OpenAI, Google Apps Script, and more. Everything is tested in a sandbox so your live business is never at risk during rollout.',
      '#22d3ee', '#0f1c1f', false),

    // ── Step 3 ──
    buildStepHtml_('03', 'Deployment & Handoff',
      'We go live, train your team on the new system, and provide 30 days of active monitoring. You walk away with a running automation and the knowledge to manage it \u2014 no dependency on us required.',
      '#86efac', '#0f1f15', true),

    // ── Closing ──
    '<tr><td style="padding:0 40px 32px 40px;" bgcolor="#111115">',
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#a1a1aa;margin:0;">',
    'In the meantime, if you have any questions, simply reply to this email or reach out to us directly. We\u2019re here to help.',
    '</p>',
    '</td></tr>',

    // ── Footer divider ──
    '<tr><td style="padding:0 40px;" bgcolor="#111115"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid #26262b;height:1px;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>',

    // ── Footer ──
    '<tr><td align="center" style="padding:24px 40px 32px 40px;" bgcolor="#111115">',
    '<p style="margin:0 0 6px 0;">',
    '<span style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.3px;color:#f4f4f5;">SCOUT</span>',
    '<span style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.3px;color:#52525b;">RA</span>',
    '</p>',
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:12px;color:#52525b;margin:0 0 12px 0;">AI Automation for Modern Businesses</p>',
    '<p style="margin:0 0 12px 0;">',
    '<a href="mailto:hello@scoutra.co" style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:13px;color:#4ade80;text-decoration:none;">hello@scoutra.co</a>',
    '</p>',
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:11px;color:#52525b;margin:0 0 8px 0;">\u00A9 ' + year + ' Scoutra. All rights reserved.</p>',
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:11px;color:#3f3f46;margin:0;line-height:1.5;">',
    'You received this email because you applied for a free automation audit at scoutra.co.<br>If this wasn\u2019t you, please ignore this email.',
    '</p>',
    '</td></tr>',

    '</table>',  // inner container
    '</td></tr></table>',  // outer wrapper
    '</body></html>'
  ].join('');

  MailApp.sendEmail({
    to: email,
    subject: EMAIL_SUBJECT,
    htmlBody: html,
    name: SENDER_NAME,
    replyTo: REPLY_TO
  });
}

/**
 * Build one step card for the email (DRY helper).
 */
function buildStepHtml_(number, title, body, accentColor, bgTint, isLast) {
  var bottomPad = isLast ? '32px' : '12px';
  return [
    '<tr><td style="padding:0 40px ' + bottomPad + ' 40px;" bgcolor="#111115">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#18181c;border:1px solid #26262b;border-radius:12px;">',
    '<tr><td style="padding:24px;" bgcolor="#18181c">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>',
    '<td valign="top" style="padding-right:16px;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>',
    '<td align="center" style="width:44px;height:44px;background-color:' + bgTint + ';border-radius:10px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;color:' + accentColor + ';">' + number + '</td>',
    '</tr></table>',
    '</td>',
    '<td valign="top">',
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#f4f4f5;margin:0 0 6px 0;">' + escapeHtml_(title) + '</p>',
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#a1a1aa;margin:0;">' + body + '</p>',
    '</td>',
    '</tr></table>',
    '</td></tr></table>',
    '</td></tr>'
  ].join('');
}


// ================================================================
//  4. INTERNAL HELPERS
// ================================================================

/**
 * Get the spreadsheet. Works for both container-bound and standalone scripts.
 */
function getSpreadsheet_() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.length > 10) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Get or create the Leads sheet.
 */
function getSheet_() {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    Logger.log('Created new "' + SHEET_NAME + '" sheet with headers.');
  }
  return sheet;
}

/**
 * Validate headers — fix any that don't match.
 * This runs on every doPost to self-heal the sheet.
 */
function ensureHeaders_(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    return;
  }

  var currentHeaders = sheet.getRange(1, 1, 1, Math.max(lastCol, HEADERS.length)).getValues()[0];
  var needsFix = false;

  for (var i = 0; i < HEADERS.length; i++) {
    if (String(currentHeaders[i]).trim() !== HEADERS[i]) {
      sheet.getRange(1, i + 1).setValue(HEADERS[i]);
      needsFix = true;
    }
  }

  if (needsFix) {
    sheet.setFrozenRows(1);
    Logger.log('Headers were incorrect — auto-fixed.');
  }
}

/**
 * Strip HTML, collapse whitespace, trim, and truncate.
 */
function sanitize_(str, maxLen) {
  if (str == null) return '';
  return String(str)
    .replace(/<[^>]*>/g, '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .substring(0, maxLen);
}

/**
 * Escape HTML for safe email insertion.
 */
function escapeHtml_(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Check for duplicate email within the dedup window.
 */
function isDuplicate_(sheet, email) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return false;  // only header row

  var cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - DEDUP_HOURS);

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase().trim() === email) {
      var ts = new Date(data[i][0]);
      if (ts >= cutoff) return true;
    }
  }
  return false;
}

/**
 * Return a JSON response.
 */
function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

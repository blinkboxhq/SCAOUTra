/* ============================================================
   Scoutra Lead Capture — Google Apps Script
   ============================================================

   HOW TO DEPLOY (3 steps):

   1. Open your "Scoutra Leads" Google Sheet
      → Extensions → Apps Script
      → Delete ALL existing code in Code.gs
      → Paste this ENTIRE file → Save (Ctrl+S)

   2. Click "Run" button (▶) with any function selected
      → A permission popup appears → Review Permissions
      → Choose your Google account → Advanced
      → "Go to Scoutra Lead Capture (unsafe)" → Allow

   3. Click Deploy → New deployment
      → Type: Web app
      → Execute as: Me
      → Who has access: Anyone
      → Deploy → Copy the URL

   IMPORTANT: If you already have a deployment, do NOT create
   a new one. Instead: Deploy → Manage deployments → ✏️ Edit
   → Version: New version → Deploy (keeps same URL)

   ============================================================ */

// ── CONFIG ─────────────────────────────────────────────────────
var SHEET_NAME    = 'Leads';
var HEADERS       = ['Timestamp', 'Name', 'Email', 'Website', 'Status', 'Email Sent'];
var EMAIL_SUBJECT = 'Welcome to Scoutra \u2014 Your Automation Journey Starts Now';
var SENDER_NAME   = 'Scoutra';
var REPLY_TO      = 'hello@scoutra.co';
var EMAIL_REGEX   = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;


// ================================================================
//  HEALTH CHECK — visit your URL in a browser to verify
// ================================================================
function doGet(e) {
  return respond_({ status: 'ok', service: 'Scoutra Lead Capture', version: 2, timestamp: new Date().toISOString() });
}


// ================================================================
//  FORM HANDLER — receives POST from the website
// ================================================================
function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // Sanitize
    var name    = clean_(p.name, 100);
    var email   = clean_(p.email, 254).toLowerCase();
    var website = clean_(p.website, 500);

    // Validate
    if (name.length < 2)          return respond_({ result: 'error', message: 'Name too short' });
    if (!EMAIL_REGEX.test(email))  return respond_({ result: 'error', message: 'Invalid email' });
    if (website.length < 1)        return respond_({ result: 'error', message: 'Website required' });

    // Get or create sheet + always fix headers
    var sheet = prepareSheet_();

    // Duplicate check (same email in last 24h)
    if (recentlySubmitted_(sheet, email)) {
      return respond_({ result: 'success', note: 'duplicate' });
    }

    // Append the lead
    var ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([ts, name, email, website, 'New', 'Pending']);
    var row = sheet.getLastRow();

    // Send welcome email
    try {
      sendEmail_(name, email);
      sheet.getRange(row, 6).setValue('Sent');
    } catch (mailErr) {
      sheet.getRange(row, 6).setValue('Failed');
      Logger.log('Email error: ' + mailErr);
    }

    return respond_({ result: 'success' });
  } catch (err) {
    Logger.log('FATAL: ' + err + '\n' + err.stack);
    return respond_({ result: 'error', message: 'Server error' });
  }
}


// ================================================================
//  SHEET SETUP — auto-creates and auto-heals on every request
// ================================================================
function prepareSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  // Create if missing
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Always verify and fix headers (row 1)
  var cols = Math.max(sheet.getLastColumn(), HEADERS.length);
  if (cols === 0) {
    sheet.appendRow(HEADERS);
  } else {
    var row1 = sheet.getRange(1, 1, 1, cols).getValues()[0];
    for (var i = 0; i < HEADERS.length; i++) {
      if (String(row1[i]).trim() !== HEADERS[i]) {
        sheet.getRange(1, i + 1).setValue(HEADERS[i]);
      }
    }
  }

  sheet.setFrozenRows(1);
  return sheet;
}

// Optional: run this manually to format the sheet nicely
function setupSheet() {
  var sheet = prepareSheet_();
  var hr = sheet.getRange(1, 1, 1, HEADERS.length);
  hr.setFontWeight('bold').setBackground('#111115').setFontColor('#4ade80');
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 250);
  sheet.setColumnWidth(4, 300);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 100);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New', 'Contacted', 'Qualified', 'Converted', 'Archived'], true)
    .setAllowInvalid(false).build();
  sheet.getRange('E2:E').setDataValidation(rule);
  Logger.log('Done! Sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
}


// ================================================================
//  WELCOME EMAIL
// ================================================================
function sendEmail_(name, email) {
  var first = escHtml_(name.split(' ')[0]);
  var yr = new Date().getFullYear();

  var h = [
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">',
    '<meta name="color-scheme" content="dark light"><title>', EMAIL_SUBJECT, '</title></head>',
    '<body style="margin:0;padding:0;background-color:#0c0c0f;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0c0c0f;">',
    '<tr><td align="center" style="padding:40px 16px;">',
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#111115;border:1px solid #26262b;border-radius:16px;">',

    // Logo
    '<tr><td align="center" style="padding:40px 40px 24px" bgcolor="#111115">',
    '<span style="font-family:Helvetica,Arial,sans-serif;font-size:28px;font-weight:800;color:#f4f4f5;">SCOUT</span>',
    '<span style="font-family:Helvetica,Arial,sans-serif;font-size:28px;font-weight:800;color:#52525b;">RA</span><br>',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px"><tr><td style="width:40px;height:2px;background:#4ade80;border-radius:1px"></td></tr></table>',
    '</td></tr>',

    // Welcome
    '<tr><td style="padding:0 40px 8px" bgcolor="#111115">',
    '<p style="font-family:Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;color:#f4f4f5;margin:0 0 16px">Hi ', first, ',</p>',
    '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#a1a1aa;margin:0 0 24px">',
    'Thank you for applying for a free automation audit. We\u2019ve received your details and our team will personally review your business within 24 hours.</p>',
    '</td></tr>',

    // Motto
    '<tr><td style="padding:0 40px 32px" bgcolor="#111115">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>',
    '<td style="border-left:2px solid #4ade80;padding:16px 20px;background:#18181c;border-radius:0 8px 8px 0">',
    '<p style="font-family:Georgia,serif;font-size:17px;font-style:italic;color:#f4f4f5;margin:0;line-height:1.6">',
    '\u201CAutomate the work that limits your growth.\u201D</p>',
    '</td></tr></table></td></tr>',

    // Divider
    '<tr><td style="padding:0 40px" bgcolor="#111115"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #26262b;height:1px">&nbsp;</td></tr></table></td></tr>',

    // Section header
    '<tr><td style="padding:32px 40px 8px" bgcolor="#111115">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>',
    '<td style="background:#0f1f15;border:1px solid #1a3a25;border-radius:20px;padding:4px 14px">',
    '<span style="font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#4ade80">Our Process</span>',
    '</td></tr></table></td></tr>',
    '<tr><td style="padding:12px 40px 24px" bgcolor="#111115">',
    '<p style="font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:#f4f4f5;margin:0">What Happens Next</p>',
    '</td></tr>',

    // Step 1
    step_('01', 'Diagnostic Audit',
      'We map your entire workflow to pinpoint the highest-value automation opportunity \u2014 the one manual process costing you the most time and revenue. You receive a prioritised roadmap, not a generic report.',
      '#4ade80', '#0f1f15', '12px'),
    // Step 2
    step_('02', 'Architecture &amp; Build',
      'We design and build your automation using enterprise-grade tools \u2014 n8n, OpenAI, Google Apps Script, and more. Everything is tested in a sandbox so your live business is never at risk during rollout.',
      '#22d3ee', '#0f1c1f', '12px'),
    // Step 3
    step_('03', 'Deployment &amp; Handoff',
      'We go live, train your team on the new system, and provide 30 days of active monitoring. You walk away with a running automation and the knowledge to manage it \u2014 no dependency on us required.',
      '#86efac', '#0f1f15', '32px'),

    // Closing
    '<tr><td style="padding:0 40px 32px" bgcolor="#111115">',
    '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#a1a1aa;margin:0">',
    'In the meantime, if you have any questions, simply reply to this email or reach out to us directly. We\u2019re here to help.</p>',
    '</td></tr>',

    // Footer divider
    '<tr><td style="padding:0 40px" bgcolor="#111115"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #26262b;height:1px">&nbsp;</td></tr></table></td></tr>',

    // Footer
    '<tr><td align="center" style="padding:24px 40px 32px" bgcolor="#111115">',
    '<p style="margin:0 0 6px">',
    '<span style="font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:800;color:#f4f4f5">SCOUT</span>',
    '<span style="font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:800;color:#52525b">RA</span></p>',
    '<p style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#52525b;margin:0 0 12px">AI Automation for Modern Businesses</p>',
    '<p style="margin:0 0 12px"><a href="mailto:hello@scoutra.co" style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#4ade80;text-decoration:none">hello@scoutra.co</a></p>',
    '<p style="font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#52525b;margin:0 0 8px">\u00A9 ', yr, ' Scoutra. All rights reserved.</p>',
    '<p style="font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#3f3f46;margin:0;line-height:1.5">',
    'You received this email because you applied for a free automation audit at scoutra.co.<br>If this wasn\u2019t you, please ignore this email.</p>',
    '</td></tr>',

    '</table></td></tr></table></body></html>'
  ].join('');

  MailApp.sendEmail({ to: email, subject: EMAIL_SUBJECT, htmlBody: h, name: SENDER_NAME, replyTo: REPLY_TO });
}

function step_(num, title, body, color, bg, pad) {
  return [
    '<tr><td style="padding:0 40px ', pad, ' 40px" bgcolor="#111115">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#18181c;border:1px solid #26262b;border-radius:12px">',
    '<tr><td style="padding:24px" bgcolor="#18181c">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>',
    '<td valign="top" style="padding-right:16px">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>',
    '<td align="center" style="width:44px;height:44px;background:', bg, ';border-radius:10px;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;color:', color, '">', num, '</td>',
    '</tr></table></td>',
    '<td valign="top">',
    '<p style="font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#f4f4f5;margin:0 0 6px">', title, '</p>',
    '<p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#a1a1aa;margin:0">', body, '</p>',
    '</td></tr></table></td></tr></table></td></tr>'
  ].join('');
}


// ================================================================
//  HELPERS
// ================================================================
function clean_(s, max) {
  if (s == null) return '';
  return String(s).replace(/<[^>]*>/g, '').replace(/[\r\n]+/g, ' ').trim().substring(0, max);
}

function escHtml_(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function recentlySubmitted_(sheet, email) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return false;
  var cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 24);
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2]).toLowerCase().trim() === email && new Date(data[i][0]) >= cutoff) return true;
  }
  return false;
}

function respond_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

# Scoutra Lead Capture — Complete Setup Guide

This guide walks you through setting up a secure Google Sheet, deploying the Apps Script webhook, and verifying everything works end-to-end.

---

## Part 1: Create & Secure the Google Sheet

### Step 1 — Create the spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com) and click **Blank spreadsheet**
2. Rename the spreadsheet to **Scoutra Leads** (click "Untitled spreadsheet" in the top left)
3. Rename the default tab to **Leads** (double-click the tab name at the bottom)

### Step 2 — Add column headers

Type these headers in **Row 1**:

| Cell | Header |
|------|--------|
| A1 | Timestamp |
| B1 | Name |
| C1 | Email |
| D1 | Website |
| E1 | Status |
| F1 | Email Sent |

Select A1:F1 and **bold** them (Ctrl+B).

### Step 3 — Freeze the header row

1. Go to **View → Freeze → 1 row**
2. This prevents the headers from scrolling out of view and protects them from accidental edits when sorting

### Step 4 — Protect the header row (lock it)

1. Select cells **A1:F1**
2. Go to **Data → Protect sheets and ranges**
3. Click **Add a sheet or range**
4. Name the protection: `Headers — Do Not Edit`
5. Range should show `Leads!A1:F1`
6. Click **Set permissions**
7. Select **Restrict who can edit this range → Only you**
8. Click **Done**

Now only you (the sheet owner) can modify the header row.

### Step 5 — Add email validation (Column C)

1. Select column C starting from **C2** (click C2, then Ctrl+Shift+Down to select C2:C)
2. Go to **Data → Data validation → Add rule**
3. Set **Criteria** to: `Custom formula is`
4. Enter the formula:
   ```
   =REGEXMATCH(C2, "^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")
   ```
5. Under **If the data is invalid**: select **Show a warning**
6. Click **Done**

This flags any malformed emails with a warning triangle.

### Step 6 — Add status dropdown (Column E)

1. Select column E starting from **E2** (E2:E)
2. Go to **Data → Data validation → Add rule**
3. Set **Criteria** to: `Dropdown (from a list of items)`
4. Enter these items: `New, Contacted, Qualified, Converted, Archived`
5. Click **Done**

Each new lead will automatically be set to "New" by the script.

### Step 7 — Conditional formatting for Status (optional)

1. Select **E2:E**
2. Go to **Format → Conditional formatting**
3. Add rules:

| Text is | Background color |
|---------|-----------------|
| New | Green (#d9ead3) |
| Contacted | Blue (#cfe2f3) |
| Qualified | Yellow (#fff2cc) |
| Converted | Dark green (#b6d7a8) |
| Archived | Gray (#d9d9d9) |

### Step 8 — Lock down sharing permissions

1. Click the **Share** button (top right)
2. Ensure it says **Restricted — Only people with access can open with this link**
3. Do NOT change this to "Anyone with the link"
4. Do NOT add any editors or viewers unless absolutely necessary
5. The Apps Script accesses this sheet as YOU (the owner), so no sharing is needed

### Step 9 — Enable version history

1. Go to **File → Version history → See version history**
2. Google Sheets auto-saves versions, but you can also name milestones (e.g., "Pre-launch baseline") by clicking the three dots next to a version

---

## Part 2: Deploy the Apps Script

### Step 1 — Open the Script Editor

1. With the **Scoutra Leads** spreadsheet open, go to **Extensions → Apps Script**
2. This opens the Apps Script editor in a new tab
3. You'll see a default `Code.gs` file with an empty `myFunction()`

### Step 2 — Paste the code

1. **Delete everything** in the default `Code.gs`
2. Open the `Code.gs` file from this folder (`apps-script/Code.gs`)
3. Copy the **entire contents** and paste it into the Apps Script editor
4. Click **Save** (Ctrl+S)
5. Rename the project to **Scoutra Lead Capture** (click "Untitled project" at the top)

### Step 3 — Authorize the script

1. In the function dropdown at the top, select **doGet**
2. Click **Run** (the play button)
3. A dialog will appear: **Authorization required** — click **Review permissions**
4. Select your Google account
5. You may see "Google hasn't verified this app" — click **Advanced → Go to Scoutra Lead Capture (unsafe)**
6. Click **Allow** to grant permissions for:
   - Google Sheets (to read/write lead data)
   - Gmail (to send welcome emails)
7. Check the **Execution log** at the bottom — it should complete without errors

### Step 4 — Deploy as a Web App

1. Click **Deploy → New deployment**
2. Click the **gear icon** next to "Select type" and choose **Web app**
3. Fill in the fields:
   - **Description**: `Scoutra Lead Capture v1`
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
6. Save this URL — you'll need it for the frontend

> **Why "Anyone"?** The frontend sends unauthenticated POST requests (no Google login). The script itself validates and sanitizes all input, so public access is safe. The script runs as YOU, so only your account can read/write the sheet and send emails.

### Step 5 — Verify the deployment

**Test 1 — Health check (browser):**
Open the Web App URL in your browser. You should see:
```json
{"status":"ok","service":"Scoutra Lead Capture","timestamp":"2026-03-21T..."}
```

**Test 2 — Submit a test lead (curl):**
Open a terminal and run:
```bash
curl -L -d "name=Test User&email=your-real-email@example.com&website=example.com" "YOUR_WEB_APP_URL"
```
Replace `YOUR_WEB_APP_URL` with the URL you copied.

**Test 3 — Verify the sheet:**
Go back to your Google Sheet. You should see a new row with the test data.

**Test 4 — Check your inbox:**
You should receive a beautifully formatted welcome email from Scoutra at the email address you used in the curl command.

**Test 5 — Duplicate prevention:**
Run the same curl command again (same email). Check the sheet — no new row should appear.

### Step 6 — Update the frontend

Open `src/settings.js` in your code editor and replace the webhook URL:

```javascript
export const CONFIG = {
  WEBHOOK_URL:
    'https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_ID/exec',
  DEFAULTS: {
    HOURLY_RATE_EUR: 50,
    AVG_MANUAL_HOURS: 15,
  },
};
```

Then commit and deploy the frontend:
```bash
git add src/settings.js
git commit -m "Update webhook URL to new Apps Script deployment"
git push
```

---

## Part 3: Ongoing Maintenance

### Updating the script

When you edit the Apps Script code:

1. Go to **Deploy → Manage deployments**
2. Click the **pencil icon** on your active deployment
3. Change **Version** to **New version**
4. Click **Deploy**

> **Important:** This keeps the same URL so you don't need to update `settings.js` again.

### Checking email quota

In the Apps Script editor, run this one-liner to see remaining daily emails:

1. Add a temporary function:
   ```javascript
   function checkQuota() {
     console.log('Remaining emails today: ' + MailApp.getRemainingDailyQuota());
   }
   ```
2. Select `checkQuota` and click Run
3. Check the Execution log

**Quotas:**
- Free Gmail: **100 emails/day**
- Google Workspace: **1,500 emails/day**

### Monitoring errors

1. In the Apps Script editor, go to **Executions** (left sidebar, clock icon)
2. You'll see a log of every `doGet` and `doPost` call with status and errors
3. Filter by **Failed** to spot issues

### Sheet maintenance

- Use the **Status** dropdown to track lead progress (New → Contacted → Qualified → Converted)
- The **Email Sent** column shows whether the welcome email was delivered ("Sent") or failed ("Failed")
- If an email failed, you can manually resend by running `sendWelcomeEmail("Name", "email@example.com")` from the script editor

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Form submits but no row appears | Check the Executions log in Apps Script for errors. Verify the URL in `settings.js` matches your deployment. |
| "Authorization required" error | Re-run `doGet` from the editor and re-authorize. |
| Welcome email not arriving | Check spam folder. Run `checkQuota()` to verify you haven't hit the daily limit. Check the "Email Sent" column. |
| Duplicate leads appearing | The 24-hour dedup window may have expired. This is by design to allow legitimate re-submissions. |
| CORS errors in browser console | This is expected — the frontend uses `mode: 'no-cors'`, which means the response is opaque. The submission still works. |
| "Script function not found: doPost" | Make sure you saved the Code.gs file. Click the floppy disk icon or Ctrl+S. |

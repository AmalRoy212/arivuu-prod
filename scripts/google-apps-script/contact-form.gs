/**
 * Arivuu contact form → Google Sheet
 *
 * Setup:
 * 1. Open your contact submissions Google Sheet.
 * 2. Extensions → Apps Script → paste this file → Save.
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web app URL into .env as ARIVUU_CONTACT_FORM_APPS_SCRIPT_URL
 * 5. Run: node scripts/build-env.js
 */

var HEADERS = [
  'Timestamp',
  'Form Type',
  'Name',
  'Email',
  'Phone',
  'Subject',
  'Message',
  'Institution',
  'City',
  'Designation',
  'Audience',
  'Page URL'
];

function getTargetSheet_(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss && payload && payload.sheetId) {
    ss = SpreadsheetApp.openById(payload.sheetId);
  }

  if (!ss) {
    throw new Error('Spreadsheet not available');
  }

  if (payload && payload.tabGid) {
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      if (String(sheets[i].getSheetId()) === String(payload.tabGid)) {
        return sheets[i];
      }
    }
  }

  return ss.getSheets()[0];
}

var PHONE_COLUMN = 5;

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }
  sheet.appendRow(HEADERS);
  sheet.getRange(1, PHONE_COLUMN, sheet.getMaxRows(), PHONE_COLUMN).setNumberFormat('@');
}

/** Always store user input as plain text in Sheets (never as a formula). */
function asSheetString_(value) {
  return String(value == null ? '' : value);
}

/** Write phone as literal text. A leading + must use apostrophe or Sheets throws #ERROR!. */
function writePhoneCell_(sheet, row, phone) {
  var text = asSheetString_(phone).trim();
  var cell = sheet.getRange(row, PHONE_COLUMN);
  cell.setNumberFormat('@');
  if (!text) {
    cell.setValue('');
    return;
  }
  cell.setValue("'" + text);
}

function appendContactRow_(sheet, payload) {
  var row = sheet.getLastRow() + 1;
  var values = [
    asSheetString_(payload.submittedAt || new Date().toISOString()),
    asSheetString_(payload.formType),
    asSheetString_(payload.name),
    asSheetString_(payload.email),
    '',
    asSheetString_(payload.subject),
    asSheetString_(payload.message),
    asSheetString_(payload.institution),
    asSheetString_(payload.city),
    asSheetString_(payload.designation),
    asSheetString_(payload.audience),
    asSheetString_(payload.pageUrl)
  ];

  sheet.getRange(row, 1, 1, values.length).setValues([values]);
  writePhoneCell_(sheet, row, payload.phone);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheet = getTargetSheet_(payload);

    ensureHeaders_(sheet);
    appendContactRow_(sheet, payload);

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err.message || err) });
  }
}

function doGet() {
  return jsonResponse_({ ok: true, service: 'Arivuu contact form' });
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

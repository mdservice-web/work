/**
 * MD Service Work — Partner Application backend
 *
 * SETUP (do this once in the provided Google Sheet):
 * 1. Open the Google Sheet.
 * 2. Extensions → Apps Script
 * 3. Delete any default code and paste THIS file.
 * 4. Save. Click Deploy → New deployment.
 * 5. Type: Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 6. Deploy, copy the Web App URL.
 * 7. Paste that URL into config.js as formEndpoint.
 *
 * This script:
 * - Appends the application to the "Applications" tab
 * - Emails mdservice.in@gmail.com
 * - Never exposes the sheet URL to the public website
 */

var NOTIFY_EMAIL = "mdservice.in@gmail.com";
var SHEET_NAME = "Applications";

var HEADERS = [
  "Application Date",
  "Partner Name",
  "Age",
  "City",
  "WhatsApp",
  "Email",
  "Occupation",
  "Potential Client Category",
  "Client Acquisition Method",
  "Source",
  "Application Status",
  "Contacted",
  "Approved/Rejected",
  "Partner Active/Inactive",
  "Client Name",
  "Client Business",
  "Client Status",
  "Project Value",
  "Payment Status",
  "Commission",
  "Commission Status",
  "Notes",
  "Follow-up Date"
];

function doPost(e) {
  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      var raw = e.postData.contents;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        data = {};
        if (e.parameter) data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var sheet = getOrCreateSheet_();
    var now = new Date();

    var name = safe_(data.name || data.fullName);
    var age = safe_(data.age);
    var city = safe_(data.city);
    var whatsapp = safe_(data.whatsapp);
    var email = safe_(data.email);
    var occupation = safe_(data.occupation);
    var businesses = safe_(data.businesses);
    var method = safe_(data.method);
    var source = safe_(data.source);

    if (!name || !age || !city || !whatsapp || !email) {
      return json_({ ok: false, error: "missing_fields" });
    }

    var ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 16) {
      return json_({ ok: false, error: "age" });
    }

    sheet.appendRow([
      now,
      name,
      ageNum,
      city,
      whatsapp,
      email,
      occupation,
      businesses,
      method,
      source,
      "New Application",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ]);

    var body =
      "New MD Service Partner Application\n\n" +
      "Name: " + name + "\n" +
      "Age: " + ageNum + "\n" +
      "City: " + city + "\n" +
      "WhatsApp: " + whatsapp + "\n" +
      "Email: " + email + "\n" +
      "Occupation: " + occupation + "\n" +
      "Business contacts: " + businesses + "\n" +
      "Client acquisition method: " + method + "\n" +
      "Source: " + source + "\n" +
      "Submission date/time: " + now + "\n\n" +
      "Status: New Application\n" +
      "Recorded in the partner Google Sheet.";

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "New MD Service Partner Application",
      body: body
    });

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "server" });
  }
}

function doGet() {
  return json_({ ok: true, service: "MD Service Work applications" });
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  var first = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var empty = first.every(function (c) { return c === ""; });
  if (empty || first[0] !== HEADERS[0]) {
    if (!empty) sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function safe_(v) {
  return String(v == null ? "" : v).trim();
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

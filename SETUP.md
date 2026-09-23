# MD Service Work — Setup (GitHub Pages + Google Sheet)

Public website never shows the Google Sheet URL or any private WhatsApp number.

Public contact email: mdservice.in@gmail.com

## 1. Connect the application form to your Google Sheet

Sheet (keep private): use the sheet you already created.

1. Open the Google Sheet on your phone or computer.
2. Menu: **Extensions → Apps Script**
3. Delete any default code.
4. Copy everything from `apps-script/Code.gs` and paste it.
5. Click **Save**.
6. Click **Deploy → New deployment**.
7. Select type **Web app**.
8. Description: `MD Service Work form`
9. Execute as: **Me**
10. Who has access: **Anyone**
11. Click **Deploy** and authorize your Google account.
12. Copy the Web App URL (looks like `https://script.google.com/macros/s/XXXX/exec`).
13. Open `config.js` in this project and paste the URL:

```js
formEndpoint: "https://script.google.com/macros/s/XXXX/exec"
```

14. Save and upload/commit the site.

After this, every form submission:

- Adds a row to the **Applications** tab
- Emails **mdservice.in@gmail.com** with subject **New MD Service Partner Application**

## 2. Deploy the website on GitHub Pages

1. Create a GitHub repository (example name: `md-service-work`).
2. Upload all website files (`index.html`, `join.html`, `rules.html`, `privacy.html`, `terms.html`, `style.css`, `script.js`, `config.js`, `assets/`).
3. Settings → Pages → Deploy from branch `main` / root.
4. Your site will be live at `https://YOUR-USER.github.io/md-service-work/`

If the repo is named `username.github.io`, the site is at the root.

## 3. What not to publish

- Do not put the Google Sheet link on the website.
- Do not put the private WhatsApp number on the website.
- Do not put Apps Script credentials or Google passwords in the frontend.

## 4. Internal statuses (use in the Sheet)

New Application → Contacted → Approved → Active Partner → Client Referred → Client Interested → Client Confirmed → Payment Received → Commission Due → Commission Paid

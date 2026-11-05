# Lead Tracker

A simple productivity tool for saving, organising, searching and managing useful leads and website opportunities.

Lead Tracker consists of two components:

1. **Lead Tracker Website** – A web application for saving and managing leads.
2. **Lead Tracker Chrome Extension** – A browser extension for quickly saving website links and opportunities while browsing.

## Project Structure

```text
lead-tracker-website/
│
├── website/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── favicon.svg
│
├── chrome-extension/
│   ├── manifest.json
│   ├── index.html
│   ├── index.css
│   ├── index.js
│   └── icons/
│
└── README.md
```

## Features

### Website
- Save website links and opportunities.
- Search saved leads.
- Copy saved URLs.
- Remove individual leads.
- Clear all saved leads with confirmation.
- Import and export leads using JSON.
- Responsive user interface.
- Local browser storage.

### Chrome Extension
- Save the current browser tab.
- Add leads manually.
- Search saved leads.
- Copy and remove saved links.
- Import and export leads.
- Duplicate detection.
- Chrome local storage.
- Safe URL validation.

## Technologies

- HTML5
- CSS3
- JavaScript
- Chrome Extensions Manifest V3
- Chrome Storage API
- Vercel (website deployment)

## Website Deployment

The website can be deployed using Vercel.

1. Connect this GitHub repository to Vercel.
2. Select the `website` directory as the Root Directory.
3. Use the following build settings:
   - Framework Preset: Other
   - Build Command: Leave empty
   - Output Directory: `.`
   - Install Command: Leave empty
4. Deploy the project.

## Installing the Chrome Extension

1. Open Google Chrome.
2. Visit `chrome://extensions/`.
3. Enable Developer mode.
4. Select Load unpacked.
5. Choose the `chrome-extension` folder.
6. The Lead Tracker extension will appear in Chrome.

## Data and Privacy

Lead Tracker stores saved leads locally in the browser.

The website and Chrome extension maintain separate local storage. Leads can be transferred between them through JSON export and import.

Automatic cloud synchronisation is not currently implemented.

## Future Improvements

- Cloud synchronisation between website and extension.
- User accounts and authentication.
- Backend database integration.
- Lead categories and status tracking.
- Improved productivity features.

## Project

**Lead Tracker — Keep useful opportunities close.**

Developed by Charles Tunde Adeyoju.

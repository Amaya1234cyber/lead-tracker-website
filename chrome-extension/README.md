# Lead Tracker — Chrome Extension

A lightweight Manifest V3 extension for saving, searching, importing, and exporting useful website links and opportunities.

## Features

- Save a URL manually or save the active browser tab.
- Validate HTTP/HTTPS URLs and prevent duplicate links.
- Search saved leads and remove individual entries.
- Export and import leads as JSON (imports merge without duplicates).
- Store data locally with `chrome.storage.local`.
- Migrate links from the original version's `myLeads` localStorage key when the updated extension is first opened.
- No analytics, advertising, remote scripts, or external network calls.

## Install locally

1. Extract this folder to a permanent location.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose this folder (the folder containing `manifest.json`).
5. Pin Lead Tracker from the Extensions menu if desired.

## Permissions

- `activeTab`: read the active tab URL after the user invokes the extension, for the **Save current tab** action.
- `storage`: save the user's lead list in Chrome's local extension storage.

The extension does not request broad browsing-history access or a persistent background process.

## Data and privacy

Saved URLs are kept in the browser's local extension storage. Exported JSON files are created only when the user selects Export. Import reads a JSON file selected by the user. No data is transmitted to a developer-controlled server. See `PRIVACY.md`.

## Project files

- `manifest.json` — Manifest V3 configuration and least-privilege permissions.
- `index.html` — popup structure.
- `index.css` — popup styling and responsive layout.
- `index.js` — storage, validation, rendering, import/export, and event handling.
- `icons/` — Chrome icon sizes.

## Release checklist

- Test manual URL saving, Enter-key saving, current-tab saving, search, duplicate handling, remove, clear-all confirmation, export, and import.
- Verify behavior on restricted Chrome pages (saving those URLs is intentionally unavailable).
- Test upgrade migration with a profile that has the original `myLeads` data.
- Capture genuine screenshots from the final installed build for the Chrome Web Store listing.
- Complete the Chrome Web Store privacy/data-use disclosures accurately before submission.

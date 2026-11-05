# Lead Tracker Website 2.1

A responsive, local-first web companion for the Lead Tracker Chrome extension.

## Features
- Save and validate HTTP/HTTPS URLs
- Search saved leads
- Copy and remove individual links
- Clear all with confirmation
- Import/export JSON compatible with Lead Tracker extension v2
- Responsive layout and accessible labels/status messages
- Safe DOM rendering (no user-provided HTML insertion)

## Run locally
Open `index.html` in a modern browser, or serve this directory with any static server.

## Deploy to Vercel
1. Put the contents of this folder in the root of a Git repository.
2. Import that repository into Vercel.
3. Choose **Other** as the framework preset.
4. Leave Build Command and Output Directory empty (or use `.` as output directory).
5. Deploy.

No environment variables or backend are required.

## Storage and privacy
The website stores data in the current browser's `localStorage`. The Chrome extension stores data in `chrome.storage.local`. These are separate browser storage areas and do not automatically sync. Use Export on one product and Import on the other to transfer data. Clearing browser data can remove website leads. No account or server database is used.

## Limitations
The website cannot read the active browser tab URL because it is not a Chrome extension. Use the extension's **Save current tab** action for that capability.

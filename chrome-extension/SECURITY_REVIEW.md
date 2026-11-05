# Security Review

**Review date:** 5 November 2026

## Changes made

- Replaced string-built `innerHTML` rendering with DOM node creation and `textContent` to prevent saved URL text from becoming executable markup.
- Replaced broad `tabs` permission with `activeTab` and added only the `storage` permission needed by the extension.
- Replaced broad `localStorage.clear()` with the namespaced `chrome.storage.local` key `leadTrackerItems`.
- Restricted saved links to HTTP and HTTPS URLs; unsupported protocols are rejected.
- Added duplicate detection and safe link attributes (`noopener noreferrer`).
- Added confirmation before destructive bulk deletion.
- Added import size limit (2 MB), JSON validation, URL validation, and duplicate filtering.
- Kept all scripts and styles local; no remote code or third-party dependencies.

## Remaining release checks

- Perform hands-on testing in the supported Chrome versions and with a clean profile and an upgraded profile.
- Verify the active-tab flow against ordinary pages and restricted pages such as `chrome://`.
- Review Chrome Web Store policy requirements and the final data-use disclosures.
- Add a real support contact and publish the privacy notice at a stable public URL.
- Consider independent security review before broad distribution.

## Scope and limitations

This is a source-level review and static validation, not a penetration test or a guarantee of security. The extension intentionally stores URLs only; it does not fetch page content or scrape websites.

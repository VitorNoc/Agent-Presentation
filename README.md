# Belmoney — AI Contract Review Assistant (Docs Site)

Single-page internal documentation site built with HTML, CSS, and JavaScript. No framework or build step is required.

## Files

- `index.html` — document content and accessible FAQ markup
- `styles.css` — visual system and responsive layout
- `print.css` — A4/PDF export rules
- `app.js` — icons, progress bar, reveal effects, step indicators, FAQ, print, and back-to-top controls

## Viewing locally

Open `index.html` with VS Code Live Server, or open it directly in a modern browser.

## Exporting to PDF

Use the floating **Print / PDF** button or press `Ctrl+P`. Enable **Background graphics** in the browser print dialog. FAQ answers are automatically expanded in print.

## Publishing

The page contains `noindex`, `nofollow`, `noarchive`, and `nosnippet` metadata. This helps keep it out of search results, but it does **not** make the page private. Protect sensitive internal documentation with authentication, access control, VPN, or a private network.

## External assets

Google Fonts and Lucide icons are loaded from CDNs. The document content remains readable if either CDN is unavailable, although custom fonts or icons may not appear.

## Final interactive edition (v2.2)

- Fixed desktop table of contents with active-section tracking
- Mobile navigation drawer
- Full-document search (`Ctrl/Cmd + K`)
- Light and dark themes with saved preference
- Copyable deep links for every section
- Reading progress and back-to-top controls
- Accessible keyboard navigation and reduced-motion support
- Print/PDF mode that removes all interactive UI


## Request handling

The assistant supports both single and multiple contract changes in the same message. Multi-part requests should be written as a clear numbered list so each item can be reviewed and routed correctly.

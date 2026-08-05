# Belmoney — AI Contract Review Assistant (Docs Site)

A handcrafted, single-page editorial documentation site. No frameworks, no build step.

## Files

```
belmoney-docs/
  index.html   All markup and content, section by section
  styles.css   Design tokens + full visual system (screen)
  print.css    Print/PDF-specific overrides, loaded only for @media print
  app.js       Scroll progress, reveal-on-scroll, stepper "spine" fill,
               nav active-state, and the FAQ accordion
```

Fonts (League Spartan, Roboto, Roboto Mono) load from Google Fonts, and icons
from the Lucide CDN — both are standard `<link>`/`<script>` tags in `index.html`,
so an internet connection is needed the first time a browser opens the page.

## Viewing

Open `index.html` directly in any modern browser. No server required.

## Exporting to PDF

Click "Print / PDF" in the top navigation, or press Cmd/Ctrl+P.
In the print dialog, make sure **Background graphics** is turned on so the
dark sections and colored callouts print correctly. `print.css` handles
pagination: it keeps cards, tables, and steps from splitting across pages,
expands the FAQ answers, and hides anything screen-only (nav, scroll cues,
the print button itself).

## Editing content

All copy lives directly in `index.html`, section by section, in the same
order as the on-page navigation. The FAQ is the one exception — its
questions and answers are stored as data at the top of `app.js` so new
entries don't require touching the accordion markup.

# marinsabo.online

Personal portfolio of Marin Sabo — Computer Science student at FERIT Osijek and mainframe developer (z/OS, COBOL, CICS, Db2, JCL).

Plain HTML, CSS and JavaScript, served by GitHub Pages. No build step.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | The portfolio (single page, English) |
| `work/*.html` | Short case studies of freelance web projects |
| `data/shipped.json` | The Shipped log. Newest entry first; the counter and "Last shipped" date are computed from it |
| `brushy/` | Brushy app concept (research & UX design) |
| `assets/Marin-Sabo-CV.pdf` | Downloadable CV |
| `styles.css`, `script.js` | Shared styles; the menu, Shipped log and DartZ console |
| `404.html` | Not-found page; also redirects old case-study URLs to `work/` |
| `sw.js` | Removes the service worker the previous site installed. Keep it for a while so returning visitors aren't stuck on a cached copy of the old site. |

The DartZ console screens live in `<template id="screen-…">` blocks in `index.html` (64 columns wide).

## Analytics

[GoatCounter](https://www.goatcounter.com/) (cookie-free, no consent banner needed), site code `marinsabo`.

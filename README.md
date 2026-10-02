# marinsabo.online

Personal portfolio of Marin Sabo — Computer Science student at FERIT Osijek and mainframe developer (z/OS, COBOL, CICS, Db2, JCL).

Plain HTML, CSS and JavaScript, served by GitHub Pages. No build step.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | The portfolio (single page) |
| `work/*.html` | Short case studies of freelance web projects |
| `brushy/` | Brushy app concept (research & UX design) |
| `assets/Marin-Sabo-CV.pdf` | Downloadable CV |
| `styles.css`, `script.js` | Shared styles and the DartZ console / theme toggle |
| `404.html` | Not-found page; also redirects old case-study URLs to `work/` |
| `sw.js` | Removes the service worker the previous site installed. Keep it for a while so returning visitors aren't stuck on a cached copy of the old site. |

The DartZ console screens live in `<template id="screen-…">` blocks in `index.html` (64 columns wide).

## Analytics

[GoatCounter](https://www.goatcounter.com/) (cookie-free, no consent banner needed), site code `marinsabo`.

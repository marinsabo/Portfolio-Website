# marinsabo.online

Source for my freelance site, [marinsabo.online](https://marinsabo.online). It lists the client projects I've built and has a case study for each one, in Croatian and English.

Plain HTML, CSS and JavaScript, no build step. Hosted on GitHub Pages with a custom domain.

## Structure

```
index.html                 Croatian homepage (default)
en/                        English versions of the homepage and case studies
*-case-study.html          one page per client project
case-study.css             shared styles for the case study pages
brushy/                    case study for Brushy, a kids' toothbrushing app concept (EN/HR toggle)
script.js                  custom cursor, mobile menu, infinite project carousel
sw.js                      service worker: cache-first for images, stale-while-revalidate for the rest
```

## Running locally

Any static server works. The service worker only registers over `http://localhost` or HTTPS, so opening `index.html` straight from disk skips it.

```
python3 -m http.server 8000
```

## Notes

- The carousel clones the first and last three cards to each end and jumps `scrollLeft` when you reach a clone, so it loops without a visible reset.
- After changing any precached file in `sw.js`, bump `CACHE_NAME` so returning visitors get the new version.

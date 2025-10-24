This repository is a static personal website (HTML/CSS/JS) with a few interactive pieces (GSAP, Lottie, Lenis).
Keep guidance short and actionable so an AI coding agent can get productive quickly.

1) Big picture
- Purpose: a static portfolio + blog served as plain files. Major sections live in top-level folders: `about/`, `blog/`, `iGEM/`, `projects/`, `Lottie/`, `Pic/`.
- Runtime: client-side only (no build step). HTML pages reference scripts and JSON assets directly. Example: `index.html` loads `style.css`, `script.js`, Lottie and GSAP.

2) Important integration points & patterns
- Lottie animations: JSON files are in `Lottie/` and are loaded via `lottie.loadAnimation(...)` from `script.js`. Paths are relative to the HTML file (common pattern: `../Lottie/NAME.json`). Example: `script.js` calls `lottie.loadAnimation({ path: '../Lottie/Coding-Computer.json' })`.
- GSAP + ScrollTrigger: animations live in `script.js` (see `gsap.registerPlugin(ScrollTrigger)` and `gsap.utils.toArray('.skill-card')`). `index.html` loads GSAP via CDN and also includes a local `gsap.js` at the bottom — avoid duplicating plugin imports.
- Smooth-scroll: `Lenis` is used if present (`lenis` object) for smooth scrolling. The code falls back to `scrollIntoView` if Lenis isn't available.
- Global DOM patterns: multiple `DOMContentLoaded` listeners are used; many functions rely on specific element IDs (`lottie-skill`, `lottie-animation`, `bg-canvas`, `.dynamic-nav`). When adding features, prefer reusing these IDs/classes.

3) Developer workflows (how to run / debug)
- There is no build tool; serve the files over HTTP to allow XHR/Fetch of JSON assets (Lottie). Two quick options:
  - Python (macOS zsh): `python3 -m http.server 8000` from repository root.
  - VS Code: use the Live Server extension and open the workspace root.
- Debugging: use browser DevTools (Console/Network). Common pitfalls:
  - Lottie JSON won't load via `file://` — start a local server.
  - Duplicate library imports (e.g., lottie or gsap) may cause conflicts — check `index.html` for multiple `<script>` tags.

4) Project-specific conventions
- Asset placement: all Lottie JSONs → `Lottie/`; images → `Pic/`; page folders contain page-specific CSS/JS (e.g., `blog/blog.css`, `blog/blog.js`).
- Paths: most HTML files live in subfolders and use relative paths (`../...`) to reach top-level assets. When editing/adding assets, prefer absolute paths (e.g., `/Lottie/your.json`) if you will always serve from repo root.
- Animation hooks: add DOM containers with explicit IDs used by `script.js` (example ids: `lottie-skill`, `lottie-animation`, `lottie-3D-printer`). Copy the pattern from `index.html` and `script.js` when adding new Lottie instances.

5) Things to watch for (gotchas)
- Duplicate imports: `index.html` includes lottie twice and GSAP from CDN plus a local `gsap.js`. Remove or consolidate duplicates to avoid multiple runtime copies.
- Relative path fragility: many scripts assume they are executed from pages with specific folder depth. When moving code between pages, verify JSON/script paths.
- Inline scripts vs external: some logic is inline in `index.html` and some in `script.js`. Keep library imports (Lottie/GSAP/Lenis) before `script.js`.

6) Examples (copy/paste friendly)
- Add a new Lottie animation on a page in `about/`:
  - Put `my.json` into `Lottie/`.
  - Add a container in `about/about.html`: `<div id="lottie-my"></div>`.
  - In `about/about.js` or `script.js` call:
    ```js
    lottie.loadAnimation({ container: document.getElementById('lottie-my'), renderer:'svg', loop:true, autoplay:true, path: '/Lottie/my.json' })
    ```

7) Where to look for examples in this repo
- Entry & layout: `index.html`, `style.css`, `script.js` (animated background, magnetic SVG, Lottie hooks, GSAP usage).
- Blog structure: `blog/blog.html`, `blog/blog.css`, `blog/blog.js` (separate page that uses similar patterns — note relative paths like `../index.html`).
- Animations: `Lottie/` directory contains multiple `.json` animations used across pages.

If anything here is unclear or you'd like the instructions expanded (for example: recommended import consolidation, a suggested minimal test server script, or explicit rules for adding new pages), tell me which area to expand and I will iterate.

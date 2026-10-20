# Frontend migration

## What was inspected

The previous project was a static root-level HTML/CSS/JavaScript site, with 11
page sections, global hash navigation, a Canvas map, p5.js iframes, the Three.js
cassette cabinet, a second Three.js project journey, Mermaid reading diagrams,
local Feedback notes, screenshots, videos, and a GLB model. There was no npm
package, development server command, or production bundler.

## Decisions

React owns the initial page shells and shared navigation/overlays. The established
interaction engines are isolated in `src/runtime/`, booted once after all page
components mount. The log content stays in `src/data/`. All original IDs, content,
artworks, and media have been retained. `public/` holds standalone embedded works
and media whose relative URLs must remain stable.

This is a staged migration, not a complete rewrite of canvas and navigation code
into React hooks. That avoids changing the working behavior. The imperative
engines must continue to own their DOM islands until individually migrated. Do
not add React rerenders/state to a subtree that an engine also edits. StrictMode
is omitted intentionally, and JavaScript edits use a full page reload so global
listeners and animation loops cannot accumulate. CSS retains Vite hot updates.

Three.js and GLTFLoader stay at their original matching versions under
`public/vendor/`, with their licenses. They are loaded locally through a shared
runtime module, using the configured base URL. Mermaid is also local. No CDN
runtime dependency, server framework, database, or router was added. The existing
Google Fonts request and external reference thumbnails remain as before.

## Reversibility and publishing

The original source remains in Git history; this work was built in a separate
checkout/branch. The current live GitHub Pages website stays intact until the
migration is merged and the Pages source is switched to GitHub Actions. The
production artifact is `dist/`, not the source repository root.

## Continuing with AI assistance

Tell the assistant the page/feature and its folder. Ask it to preserve DOM IDs,
existing hash routes, base-relative public asset URLs, canvas ownership, and the
shared Three.js version. Run `npm run check` after a code change and manually
visit the map, the cassette archive and a log, presentation slide index, project
journey, About, Feedback, and the two edge-flag rooms.

## Validation completed

- Clean dependency install, production build, and all nine existing camera/scroll
  tests pass. The Python asset/GLB check also passes.
- All 119 original element IDs and all 46 shipped media, vendor, and embedded
  artwork files were compared against the original commit and preserved exactly.
- Chromium checked the home map, Visual Journey and p5 iframe, 3D cassette archive,
  fifth log and five screenshots, presentation index, Feedback save/reload, About,
  clickable project card, project WebGL journey and About jump, and both edge rooms.
- The built site was checked at a domain root and `/QuellaLivingStudio/`, including
  Three.js/model loading. Mobile presentation navigation was checked at 390px.
- No page JavaScript errors or missing local resources remained in those checks.
- The test environment blocked Google Fonts and some external reference thumbnails.
  Those are pre-existing remote resources; their links, fallback labels, and font
  fallbacks are retained. The migration does not make them available offline.
- The original CommonJS export shim in `engine.js` was removed during migration:
  it caused a build-only global-engine error. Both dev and compiled browser paths
  now initialize the same engine.

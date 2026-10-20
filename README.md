# Quella Living Studio

A personal website created for the **Generative AI Workflow for Media Art** course.

The existing pixel map, starfield galleries, cassette Working Log, Idea Presentation,
Programming Dream 3D journey, and local Feedback notes are preserved.

## Start on your computer

Install **Node.js 22.12 or newer** (Node 22 LTS recommended). Open a terminal in
this project folder, then run:

```sh
npm install
npm run dev
```

Open **http://localhost:5173**. Keep the terminal open while editing; Ctrl+C stops
the server. Use the localhost address, rather than double-clicking `index.html`.
CSS edits update immediately. Page or interaction-code edits reload the site to
restart the canvas engines cleanly.

## Build and check

```sh
npm test            # existing camera and scroll behavior tests
npm run build       # creates the complete deployable website in dist/
npm run preview     # checks that build at http://localhost:4173
```

`npm run check` runs the tests and build together. `npm ci` installs the exact
locked dependency versions for CI or a clean checkout.

## Project layout

| Folder | What to edit |
| --- | --- |
| `src/pages/` | Each existing page as a React component, including the Idea Presentation |
| `src/components/` | Shared navigation and screen overlays |
| `src/styles/` | Original CSS, split by feature; no visual redesign |
| `src/data/` | Log metadata, reading responses, and dated log bodies |
| `src/runtime/` | Map, navigation, drawing previews, 3D archive, and project interaction engines |
| `public/assets/` | Images, videos, screenshots, and GLB models |
| `public/art/`, `public/pixel-world/` | Independent embedded artworks and mini-game |
| `public/vendor/` | Matching local Three.js/GLTFLoader and Mermaid libraries |
| `tools/` | Existing tests and asset preparation/validation tools |
| `dist/` | Generated production output; do not edit or commit |

The stack is **Node.js + npm + Vite + React**, using JavaScript. There is no router
or UI library: the established hash routes and styling are retained.

## How to keep developing

- Edit a page in `src/pages/`, not generated files in `dist/`.
- Add a journal entry in `src/data/`, update `notes.js`, and import the entry in
  `src/runtime/bootstrap.js` before the archive starts. Keep tape numbering intact.
- Store new media under `public/assets/`; reference it as `./assets/...` in page
  markup or log content. Use `/assets/...` inside CSS so Vite rewrites it correctly.
- Adjust the project camera/model setup in `src/runtime/dream-config.js`.
- The current runtime engines own their DOM regions after React mounts them.
  Keep the existing IDs. When adding React state to an interactive region, migrate
  that region's old DOM logic at the same time. Do not enable StrictMode until the
  global animation/listener cleanup has been implemented. See the migration notes.

## Deploy later

Upload the **contents of `dist/`** to any static host. Vite uses relative build
paths so the site works at a domain root or at `/QuellaLivingStudio/`. Keep its
trailing slash and the existing `#log`, `#idea`, and other hash links.

For this repository's GitHub Pages:

1. Before merging the migration, open **Settings → Pages → Build and deployment**
   and change **Source** to **GitHub Actions**. The old branch-based publishing
   mode cannot compile React source.
2. Merge into `main`. The included **Deploy Living Studio to Pages** workflow
   installs dependencies, runs tests, builds, and publishes `dist/`.
3. Wait for the deploy workflow to succeed. Subsequent pushes to `main` publish
   automatically; you can also run that workflow manually from Actions.

The migration branch and pull request do not replace the current live website.

## Privacy and limits

No API key is needed. `.env` files, `node_modules/`, and `dist/` are ignored.
Anything named `VITE_*` is public browser configuration, never a place for secrets.
Private keys and account credentials belong on a backend, not in React or `public/`.
Feedback notes still live in each visitor's browser; this migration adds no shared
comment service. The gameplay video slot remains intentionally empty.

See [migration notes](docs/frontend-migration.md) and
[Programming Dream integration notes](docs/programming-dream-web.md).

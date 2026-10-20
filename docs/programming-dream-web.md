# Programming Dream — scroll-driven project page

Entry: Project → **Enter the Digital World**, or `index.html#programming-dream`.

Scroll down: digital sea → floating computer → screen portal → Question → About
→ film transition title → Showcase → further reading buttons.
Scroll up reverses the camera and portal along the same timeline. Native wheel,
trackpad, touch, Page Down and arrow-key scrolling remain available. The further
reading buttons at the very end route to the existing `#log` and `#idea` pages,
using a tape shutter and a soft white-light transition respectively. The gameplay slot is empty
and has no pretend play control. Nothing changes the real game or its inference.

## Asset status

- `computer.glb`: supplied model, all nine meshes and original geometry retained.
  Embedded maps are reduced to 512px; color is JPEG and data maps remain PNG.
  Web copy: 516,112 bytes (source: 29,537,400 bytes).
- `scene-reference.webp`: web copy of the supplied `rendered.png`; used when 3D
  is unavailable. The original uploads are not changed.
- The sea, columns, rocks and planets form an illustrative spatial environment
  based on the supplied reference. The user accepted this visual direction;
  a more detailed Blender scene reconstruction is not part of the current scope.
  The earlier `.blend` upload failed and was not read or used.
- Gameplay video: pending; intentionally empty.

## Optional future scene replacement

1. Re-upload the `.blend` and pack external textures (`File → External Data →
   Pack Resources`), or export a self-contained GLB with materials/textures.
2. Export scenery separately from the computer and ocean. Keep the named `screen`
   mesh on the computer. Check material appearance: procedural Blender shaders
   may require baking into maps for glTF.
3. Save scenery to `public/assets/programming-dream/environment.glb`, and set
   `environment` in `src/runtime/dream-config.js` to that relative URL. Set its scale/position
   from the actual export. This disables the temporary scenery; if it fails to
   load, the temporary environment is used and the page reports that state.
4. Adjust `startPosition`, `startTarget`, `computerPosition` and `computerHeight`
   to match the reference composition. The near/screen camera positions are
   calculated from the named screen's bounds, avoiding its offset export origin.
5. When a gameplay MP4 is ready, replace `.pd-video-slot` with a `<video controls
   playsinline preload="metadata">`; retain the title and 16:9 frame.

## Implementation and checks

Three.js r170 and its matching GLTFLoader/BufferGeometryUtils are vendored locally
(MIT, see `public/vendor/gltf/LICENSE`). The React/Vite app loads these locally; no CDN or GSAP dependency is required.
Native scroll plus one smoothed progress value drives all camera/portal stages.
Modules use relative paths for both GitHub project Pages and root hosting.
Loading is lazy on route entry; rendering pauses on route exit, hidden tabs and
after entering the text sections. Reduced motion disables ambient waves/bobbing,
pointer drift and smoothing. WebGL/model failures preserve the supplied render
and allow access to all text and links. Use an HTTP server rather than `file://`.

The Question and film interlude use sticky title scenes whose opacity/scale/light
follow scroll progress in both directions. About and Showcase text reveal gently
on entering the viewport. About's title is capped at 68px (48px on mobile).
Nested section jumps are calculated against the actual scroll container, so the
HUD's Skip to About and the About-to-film button reach the correct section.
Animations route under a fully opaque cover, then uncover the painted destination;
modified link clicks retain native behaviour and reduced motion bypasses the cover.

Run `node --test tools/dream-*.test.mjs` (9 tests) and
`python tools/check-dream-assets.py` from the repository root. Use `npm run dev` for local browser checks and `npm run build` for production.
Publishing now uses the Vite `dist/` artifact; see the root README.

# Programming Dream — scroll-driven project page

Entry: Project → **Enter the Digital World**, or `index.html#programming-dream`.

Scroll down: digital sea → floating computer → screen portal → About → Showcase.
Scroll up reverses the camera and portal along the same timeline. Native wheel,
trackpad, touch, Page Down and arrow-key scrolling remain available. The About
buttons route to the existing `#log` and `#idea` pages. The gameplay slot is empty
and has no pretend play control. Nothing changes the real game or its inference.

## Asset status

- `computer.glb`: supplied model, all nine meshes and original geometry retained.
  Embedded maps are reduced to 512px; color is JPEG and data maps remain PNG.
  Web copy: 516,112 bytes (source: 29,537,400 bytes).
- `scene-reference.webp`: web copy of the supplied `rendered.png`; used when 3D
  is unavailable. The original uploads are not changed.
- `programmingdream01scene.blend`: **upload failed; not read or used**. The sea,
  columns, rocks and planets currently form a temporary spatial reconstruction,
  not a conversion of that Blender scene. Full scene fidelity is pending.
- Gameplay video: pending; intentionally empty.

## Connect the complete Blender scene

1. Re-upload the `.blend` and pack external textures (`File → External Data →
   Pack Resources`), or export a self-contained GLB with materials/textures.
2. Export scenery separately from the computer and ocean. Keep the named `screen`
   mesh on the computer. Check material appearance: procedural Blender shaders
   may require baking into maps for glTF.
3. Save scenery to `assets/programming-dream/environment.glb`, and set
   `environment` in `dream-config.js` to that relative URL. Set its scale/position
   from the actual export. This disables the temporary scenery; if it fails to
   load, the temporary environment is used and the page reports that state.
4. Adjust `startPosition`, `startTarget`, `computerPosition` and `computerHeight`
   to match the reference composition. The near/screen camera positions are
   calculated from the named screen's bounds, avoiding its offset export origin.
5. When a gameplay MP4 is ready, replace `.pd-video-slot` with a `<video controls
   playsinline preload="metadata">`; retain the title and 16:9 frame.

## Implementation and checks

Three.js r170 and its matching GLTFLoader/BufferGeometryUtils are vendored locally
(MIT, see `vendor/gltf/LICENSE`). No CDN, bundler or GSAP dependency is required.
Native scroll plus one smoothed progress value drives all camera/portal stages.
Modules use relative paths for both GitHub project Pages and root hosting.
Loading is lazy on route entry; rendering pauses on route exit, hidden tabs and
after entering the text sections. Reduced motion disables ambient waves/bobbing,
pointer drift and smoothing. WebGL/model failures preserve the supplied render
and allow access to all text and links. Use an HTTP server rather than `file://`.

Run `node --test tools/dream-*.test.mjs` and
`python tools/check-dream-assets.py` from the repository root. Browser visual QA
was unavailable in the task environment; inspect desktop and mobile rendering
before merging, especially the final portal composition. The new branch does
not deploy or alter the main website.

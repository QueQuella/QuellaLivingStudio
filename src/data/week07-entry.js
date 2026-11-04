const root = "./assets/working-log/week07/";
const image = (file, alt) => `<img src="${root}${file}" alt="${alt}" loading="lazy">`;
const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
const row = (file, alt, title, copy) => `<div class="week07-row"><figure>${image(file, alt)}</figure><div><h3>${title}</h3>${copy}</div></div>`;
const pair = (file, alt, caption, file2, alt2, caption2) => `<div class="project-log-gallery"><figure>${image(file, alt)}<figcaption>${caption}</figcaption></figure><figure>${image(file2, alt2)}<figcaption>${caption2}</figcaption></figure></div>`;

window.StudioEntries.log[5] = `
<article class="real-entry project-log-entry week07-entry">
  <p class="project-log-kicker">PROGRAMMING DREAM · WEEK 7 · 2026 / 10 / 21</p>
  <section>
    <h2>01 / ITERATION2 CONCEPT</h2>
    <p>As models emerge from the CRT screen, they briefly reveal their computational structure: points, wireframes, and surfaces.</p>
    ${row("beikeCar.png", "Wireframe model of Sutherland’s Volkswagen", "Volkswagen Beetle", `<p>${link("https://www.computerhistory.org/revolution/computer-graphics-music-and-art/15/206/558", "Wireframe model of Sutherland’s Volkswagen ↗")}</p><p>Expose the model as a luminous wireframe before it becomes a solid object.</p><p class="week07-tools">UE: Wireframe Material, Fresnel, Emissive, Niagara Points.</p>`)}
    ${row("Pasted image 20261020144817.png", "Volkswagen Beetle green wireframe", "Wireframe study", "<p>A dense green mesh exposes the structure beneath the vehicle’s surface.</p>")}
    ${row("Pasted image 20261020140824.png", "Utah Teapot", "The Utah Teapot", `<p>${link("https://www.computerhistory.org/revolution/computer-graphics-music-and-art/15/206", "Computer History Museum ↗")}</p><p>Use layered lighting, a limited color palette, and dithering to recall early shading and rendering experiments. The model can gradually shift from an untextured form into a colored solid.</p><p class="week07-tools">UE: Posterization, Dither Pattern, Flat Shading.</p>`)}
    ${row("Rabbit.png", "Stanford Bunny triangulated mesh", "Stanford Bunny", `<p>Continuously transition between a point cloud and a mesh.</p><p class="week07-tools">UE: Niagara Mesh Particles, Dither Dissolve, World Position Offset.</p><p>${link("https://graphics.stanford.edu/data/3Dscanrep/", "Stanford 3D Scanning Repository ↗")}<br>${link("https://faculty.cc.gatech.edu/~turk/bunny/bunny.html", "Model deformation reference ↗")}</p>`)}
    ${row("Pasted image 20261020141025.png", "Catmull’s animated 3D hand on CRT screens", "Catmull’s Hand", "<p>Recall early human modeling through visible triangles, displaced vertices, and unstable meshes. The fingers occasionally make small mechanical movements.</p><p class='week07-tools'>UE: Faceted Normals, Vertex Color, World Position Offset.</p>")}
    ${row("Pasted image 20261020143300.png", "Blender Suzanne triangulated mesh", "Suzanne", "<p>Blender’s classic monkey-head model, presented with a digital scanning effect.</p>")}
  </section>
  <section>
    <h2>02 / THEME</h2>
    <p>Programming Dream is an interactive digital environment inspired by the early history of computer graphics and retro-futuristic visions of computing. Through drawing, participants communicate with a fictional machine that interprets their sketches and reconstructs iconic objects from computer graphics history. Emerging from points, wireframes, and imperfect surfaces, these digital artifacts become animated inhabitants of a surreal computational space. The project explores how machines translate human imagination into visual form, and how the aesthetics of early computing continue to shape our understanding of digital worlds.</p>
    <blockquote><p>A sterile future imagined by the past, inhabited by the imperfect memories of early computer graphics.</p></blockquote>
  </section>
  <section>
    <h2>03 / AESTHETIC DIRECTION</h2>
    ${row("Pasted image 20261020151652.png", "Tron (1982) visual references", "Retro-Futurist Computational Surrealism", `<p>Visual references: <em>Tron</em> and <em>2001: A Space Odyssey</em>.</p><p>Retro-Futurism establishes the overall historical visual direction. Space Age Modernism informs the architecture; Early Digital Aesthetics informs the graphics and materials; Computational Surrealism describes the spatial logic.</p><p>${link("https://theasc.com/article/making-of-tron-1982/", "The Making of Tron · American Cinematographer ↗")}</p>`)}
  </section>
  <section>
    <h2>04 / PLAYER FLOW</h2>
    <p>From the Main Menu, Start opens the Main Level. The player floats freely as a cloud through an infinite blue grid. A distant light leads into a fast stream of colored data ribbons. As these streams converge on a building, the player follows them toward its enclosed shell, passes through it, and enters the computational chamber.</p>
    <p>Initially, a post-process effect renders the world in black-and-white lines. If the volume is unbound, a dedicated variable must control when this effect disappears. The first press of E at the computer permanently removes the line effect before the Drawing UI opens, restoring the normal world without that post-process effect.</p>
    <p>After Confirm, the interface reveals part of the AI recognition result and process, retaining the previous interaction work. The drawing interface then closes automatically, generated objects scatter through the space, and the player can continue drawing.</p>
  </section>
  <section>
    <h2>05 / ENVIRONMENT &amp; COMPUTER DESIGN</h2>
    ${row("空间设计初稿.png", "Programming Dream spatial design sketch", "Spatial sketch", "<p>A curved elliptical chamber is interrupted by an angular cut. Layered wall lines reveal its structure, while dim blue-green light creates a retro-futuristic atmosphere.</p>")}
    ${row("Pasted image 20261020181115.png", "Ellipsoidal chamber architecture design", "Architectural study", "<p>Curved ivory panels, a ceiling ring, a local grid, and an angular wall structure define the computational chamber.</p>")}
    ${row("复古未来大型计算机概念设计板.png", "Retro-futuristic mainframe computer concept board", "Mainframe concept", "<p>A central composite computer combines large-scale processing, storage, and multiple displays into one intelligent presence.</p>")}
    ${row("Pasted image 20261021151628.png", "Detailed mainframe computer blueprint", "Mainframe blueprint", "<p>The main CRT screen, auxiliary displays, side cabinets, and operator consoles form a single machine.</p>")}
    ${row("Pasted image 20261021184907.png", "Infinite blue grid reference", "Main Level / Infinite grid", "<p>A blue grid establishes the open computational space at the beginning of the journey.</p>")}
    ${row("Pasted image 20261021204906.png", "Colored data stream reference", "Main Level / Data stream", "<p>High-speed ribbons of colored light guide the player toward the chamber.</p>")}
    ${row("Pasted image 20261021204944.png", "Wireframe world reference", "Main Level / Wireframe corridor", "<p>Repeated light frames and exposed terrain meshes turn the approach into a passage through computation.</p>")}
  </section>
  <section>
    <h2>06 / PROGRESS</h2>
    ${pair("mainmenu.png", "Programming Daydream main menu", "UI / Main Menu · Moving background.", "Main测试.png", "MainLevel linear shader test", "Main Level · Line shader test.")}
    ${pair("Pasted image 20261021172357.png", "Mainframe computer model in progress", "Mainframe · Modeling progress.", "Pasted image 20261021204132.png", "Illuminated mainframe computer in Unreal Engine", "Mainframe · CRT displays in Unreal Engine.")}
  </section>
  <section>
    <h2>07 / NEXT</h2>
    <p>Work on the visual display and scene building.<br>Transfer the Blueprint.<br>Press E to interact with the new computer.</p>
  </section>
  <footer class="entry-footer">Programming Dream · Development Log<a href="#log" data-log-slot="6">Next cassette / Log 07 →</a></footer>
</article>`;

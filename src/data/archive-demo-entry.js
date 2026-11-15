const screenshotFolder = "./assets/working-log/archive-demo";
const screenshots = [
  ["level-boundaries", "Level boundaries in the Unreal Engine editor"],
  ["boundary-warning", "Bounds &amp; block player pawn · DANGER warning"],
  ["bunny-observation", "Stanford Bunny · In-world observation prompt"],
  ["bunny-archive", "Stanford Bunny · 3D scanning and digital reconstruction entry"],
];

window.StudioEntries.log[10] = `
<article class="real-entry project-log-entry">
  <p class="project-log-kicker">PROGRAMMING DREAM · WEEK 10 · 2026 / 11 / 14</p>
  <section>
    <h2>01 / ARCHIVE</h2>
    <p>I created an archive for the five objects, with descriptions in the drawing UI and archaeological context in the game world.</p>
    <div class="prototype-table-scroll" role="region" aria-label="Programming Dream object archive" tabindex="0">
      <table class="prototype-table">
        <thead>
          <tr>
            <th scope="col">Objects</th>
            <th scope="col">UI Information</th>
            <th scope="col">In Setting / Archaeological History</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Volkswagen Beetle</strong><br><small>DIGITAL REPRESENTATION &amp; SURFACE DESIGN</small></td>
            <td>In computer graphics, it becomes a collection of geometric surfaces, curves and vertices. Its digital form allows us to explore how real-world objects can be reconstructed, represented and transformed in virtual space.</td>
            <td>Humans began inputting the coordinates of real-world objects into computers. The World Becomes Coordinates. The shapes of the real world began to be translated into data structures that computers could store, transform, and project.</td>
          </tr>
          <tr>
            <td><strong>Catmull's Hand</strong><br><small>SUBDIVISION &amp; ORGANIC GEOMETRY</small></td>
            <td>A hand-shaped digital model offers an opportunity to explore how polygonal geometry can be transformed into smoother, more organic surfaces. Through subdivision techniques, a relatively simple mesh can develop more detailed curvature and form, revealing the relationship between mathematical rules and visual complexity.</td>
            <td>In 1972, Ed Catmull established an early digital hand model by measuring a plaster model of his own hand and demonstrated its animation. Not only static objects, but the human body and its movements also began to enter the field of digital modeling and computer animation.</td>
          </tr>
          <tr>
            <td><strong>Utah Teapot</strong><br><small>COMPUTER GRAPHICS &amp; RENDERING</small></td>
            <td>The Utah teapot is one of the most iconic test models in computer graphics. Its curved surfaces, handle, spout and lid make it an ideal object for studying lighting, shading, reflections and rendering techniques.</td>
            <td>It's iconic model for testing surfaces, shading, lighting, and rendering algorithms in graphics research. Computers not only know where objects are, but also start studying how to make mathematical surfaces look tangible.</td>
          </tr>
          <tr>
            <td><strong>Stanford Bunny</strong><br><small>3D SCANNING &amp; DIGITAL RECONSTRUCTION</small></td>
            <td>Introduced in 1994, the Stanford Bunny became a widely used benchmark in computer graphics. Originally reconstructed from 3D scanning data, it demonstrates how physical forms can be captured as digital geometry, making it useful for studying meshes, topology and surface reconstruction.</td>
            <td>Introduced in 1994, the Stanford Bunny became a widely used benchmark in computer graphics. Originally reconstructed from 3D scanning data, it demonstrates how physical forms can be captured as digital geometry, making it useful for studying meshes, topology and surface reconstruction.</td>
          </tr>
          <tr>
            <td><strong>Suzanne</strong><br><small>3D MODELLING &amp; MESH TOPOLOGY</small></td>
            <td>Suzanne is Blender's iconic monkey-head test model. Its distinctive facial structure and complex geometry make it useful for experimenting with mesh topology, surface details, shading and different modelling techniques. A simple shape can become a playground for computational creativity.</td>
            <td>Blender's iconic monkey head mesh is also a common object for artists and developers to test materials, modifiers, and rendering effects. Digital models are no longer just scientific test subjects, but have also become cultural symbols for creators to share, modify, experiment with, and reinvent.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <section>
    <h2>02 / PROGRESS</h2>
    <p>Added a time mechanic. Spawned objects disappear after 12 minutes.</p>
    <div class="project-log-gallery">
      ${screenshots.map(([file, caption]) => `
        <figure>
          <a href="${screenshotFolder}/${file}.webp" target="_blank" rel="noopener">
            <img src="${screenshotFolder}/${file}.webp" alt="${caption}" loading="lazy">
          </a>
          <figcaption>${caption}</figcaption>
        </figure>`).join("")}
    </div>
  </section>
  <section>
    <h2>03 / DEMO</h2>
    <h3>Demo video ready</h3>
    <div class="project-posts">
      <a href="#programming-dream" data-project-portal>Explore Programming Dream ↗</a>
    </div>
  </section>
  <footer class="entry-footer">Programming Dream · Development Log</footer>
</article>`;

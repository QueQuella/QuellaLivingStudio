const agencyAssetFolder = "./assets/working-log/agency";

const agencyDiagram = (file, alt, caption) => `
  <figure class="agency-diagram">
    <a href="${agencyAssetFolder}/${file}.svg" target="_blank" rel="noopener">
      <img src="${agencyAssetFolder}/${file}.svg" alt="${alt}" loading="lazy">
    </a>
    <figcaption>${caption}</figcaption>
  </figure>`;

window.StudioEntries.log[11] = `
<article class="real-entry project-log-entry agency-log">
  <p class="project-log-kicker">PROGRAMMING DREAM · LOG 12 · 2026 / 11 / 18</p>
  <section>
    <h2>01 / PROJECT OVERVIEW</h2>
    <p class="agency-lead"><em>Programming Dream</em> is an interactive Unreal Engine experience that turns a participant's drawing into a floating digital relic.</p>
    <p>The work is set in a surreal landscape built from water, computer hardware, luminous cables, and suspended objects. Instead of asking the participant to choose an object from a conventional menu, the project invites them to draw. Their image is interpreted by a machine-learning model and translated into one of five objects from the history and visual culture of computer graphics: a car, the Utah Teapot, the Stanford Bunny, Catmull's Hand, or Suzanne, Blender's monkey head. The object then enters the 3D world as something the participant can approach and examine.</p>
    <p>The central question of agency is therefore not simply, “Does the player control the experience?” Agency is distributed across the participant, the trained classifier, and the rules authored into the Unreal Engine world. The participant initiates the transformation and supplies an expressive image. The classifier interprets it according to learned categories. The game system decides how the recognized category becomes a model, where it appears, how it moves, how long it remains, and what information it reveals. The result is a form of negotiated or co-authored agency rather than total freedom.</p>
    ${agencyDiagram("interaction-flow", "Four-stage interaction flow from participant drawing through system processing and AI classification to a floating relic in the world", "One interaction, from drawing to discovery.")}
  </section>
  <section>
    <h2>02 / TRACING ONE INTERACTION</h2>
    <p>One complete interaction begins when the participant opens the drawing interface and uses the mouse to make white strokes on a black digital canvas. Suppose the participant intends to draw a rabbit. They control the number and speed of strokes, the proportions of the ears and body, the scale, and how recognizable or abstract the drawing will be. They can erase or redraw before submitting. The input is a personal visual gesture rather than a button labelled “rabbit.”</p>
    <p>After submission, the project reads the drawing from a render target. The program finds the visible pixels, calculates the drawing's bounds, recentres the marks, preserves thin bright strokes, and converts the image into a normalized 28-by-28 input tensor. This also limits participant agency because the system translates the image into the format expected by the model instead of interpreting it exactly as it appeared on the large canvas.</p>
    <p>The ONNX classifier generates five probabilities in a fixed order: car, teapot, rabbit, hand, and monkey head. The project selects the strongest category only when confidence reaches the 80 percent threshold. If no category is confident enough, the project refuses to produce a relic and the participant must revise the drawing. This makes the model's uncertainty visible rather than pretending every interpretation is equally valid.</p>
    ${agencyDiagram("classifier-space", "Open expressive drawing input passes through an ONNX model with an 80 percent threshold into five fixed output categories", "The participant draws freely, but the model's vocabulary is fixed.")}
    <p>Once “rabbit” is accepted, the system maps that class to the Stanford Bunny relic and spawns its actor in the environment. The participant determines the source image and indirectly influences the species, but does not directly choose the exact mesh, material, animation, spawn location, interaction radius, or lifetime. The spawn manager places the relic within the designed lakeside area, avoids overlapping interaction zones, and keeps it in the world for a limited time. The output is responsive and constrained: the relic exists because of the drawing, while its physical and temporal behaviour belongs to the system.</p>
    <p>The interaction continues after generation. The participant uses first-person movement to search the landscape and decides whether the relic deserves attention. Entering its interaction sphere displays a “Press F” prompt. Pressing F opens an authored panel identifying the Stanford Bunny and explaining its connection to 3D scanning, meshes, topology, and surface reconstruction. Agency shifts from making to navigating and interpreting.</p>
    ${agencyDiagram("agency-balance", "Participant agency and system or author agency shown as two connected groups of decisions", "Expressive choice enters a designed computational frame.")}
  </section>
  <section>
    <h2>03 / WHERE AGENCY LIES</h2>
    <p>The participant's strongest agency lies in intention, gesture, repetition, and exploration. They decide what to attempt, how to depict it, whether to redraw after failure or misclassification, where to travel, and which generated objects to observe. Because two people are unlikely to draw the same rabbit in exactly the same way, the input remains personal even though the final categories are limited. A mistaken classification can also become productive: a rabbit interpreted as a hand reveals the gap between human intention and machine perception.</p>
    <p>The system's agency lies in interpretation and framing. It defines the five-category vocabulary, preprocessing method, confidence threshold, and mapping from numerical results to cultural objects. It also controls randomized lakeside placement, floating behaviour, interaction range, lifespan, and historical text. The authors retain substantial agency because the model, world, and possible meanings have all been designed in advance.</p>
    <p class="agency-summary">Ultimately, agency in <em>Programming Dream</em> lies in the feedback loop between these forces. The participant proposes a form; the classifier names it; the world materializes and contextualizes it; and the participant responds through movement, observation, or another drawing. Computation converts a private gesture into a public digital object, while every conversion exposes the assumptions and limits of the system doing the seeing.</p>
    <figure class="project-log-wide">
      <a href="${agencyAssetFolder}/programming-dream-agency.webp" target="_blank" rel="noopener">
        <img src="${agencyAssetFolder}/programming-dream-agency.webp" alt="Programming Dream world with the Stanford Bunny, Utah Teapot, Suzanne, Catmull's Hand, and floating computer components outlined in yellow" loading="lazy">
      </a>
      <figcaption>Programming Dream · Human gesture, machine interpretation, and digital relics.</figcaption>
    </figure>
  </section>
  <footer class="entry-footer">Programming Dream · Interaction &amp; Agency</footer>
</article>`;

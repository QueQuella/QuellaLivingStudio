const videoFolder = "./assets/working-log/week10";
const clips = [
  ["arms-lowering", "Lowering the arms"],
  ["walking-approach", "Walking approach"],
  ["hand-gesture", "Raising the hand"],
];

window.StudioEntries.log[9] = `
<article class="real-entry project-log-entry">
  <p class="project-log-kicker">AI VIDEO · WEEK 10 · 2026 / 11 / 12</p>
  <section>
    <h2>01 / TEMPLATE &amp; WORKFLOW</h2>
    <p><strong>Template:</strong> Image to Video with Wan2.2.</p>
    <p>I used ChatGPT to generate reference images. I then paired those images with prompts I wrote and ran the image-to-video workflow in ComfyUI Desktop to generate the clips below.</p>
  </section>
  <section>
    <h2>02 / REFLECTION</h2>
    <p>For walking shots, I prompt for steady framing and feet that stay planted on contact with the floor. For dialogue, I ask the character to speak slowly. I also specify that the shot should preserve the reference image’s visual style and background.</p>
    <p>Facial expressions can become exaggerated or unsettling. I get more control by describing a visible movement, such as “open the eyes halfway,” and specifying its timing and intensity.</p>
  </section>
  <section>
    <h2>03 / VIDEO STUDIES</h2>
    <div class="project-log-gallery week10-videos">
      ${clips.map(([file, title]) => `
        <figure>
          <video autoplay muted loop playsinline controls preload="metadata" aria-label="${title}" src="${videoFolder}/${file}.mp4"></video>
          <figcaption>${title}</figcaption>
        </figure>`).join("")}
    </div>
  </section>
</article>`;

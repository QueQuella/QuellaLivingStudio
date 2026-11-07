window.StudioEntries.log[8] = `
<article class="real-entry project-log-entry retro-experiment-log">
  <p class="project-log-kicker">VISUAL JOURNEY · EXPERIMENT 02 · 2026 / 11 / 07</p>
  <a class="project-post retro-experiment-card" href="#visual/retro-time-machine">
    <div class="project-post-image">
      <img src="./art/retro-ragdoll/mode-flock.png" alt="Retro Time Machine in Zero-G Flock mode">
      <span class="project-post-image-cue" aria-hidden="true">ENTER EXPERIMENT ↗</span>
    </div>
    <div class="project-post-content">
      <span class="project-post-meta">VISUAL JOURNEY / EXPERIMENT 02</span>
      <h2>Retro Time Machine / Human Field</h2>
      <p>Drift through a field of pixel swimmers, then click to turn the flock into a stream of meteors.</p>
      <span class="project-post-open">PLAY IN VISUAL JOURNEY <b aria-hidden="true">↗</b></span>
    </div>
  </a>
  <section>
    <h2>01 / CONCEPT</h2>
    <p>I wanted the sketch to feel like roaming through space. A weightless body drifts among small pixel swimmers that move together and scatter around it. Switching modes turns the same field into a meteor stream, shifting the experience from quiet drifting to a rush through space.</p>
    <p>I began with my <a href="https://editor.p5js.org/wanglinger115/sketches/PMlQec7bn" target="_blank" rel="noopener">Time Reverse Control sketch ↗</a>. The plan was to retain its time-reversal logic and upper-right-to-lower-left motion, then use smaller, denser foreground pixels as the field the player could disturb.</p>
    <div class="project-log-gallery prototype-pair">
      <figure>
        <img src="./art/retro-ragdoll/mode-flock.png" alt="A floating body surrounded by pixel swimmers in Zero-G Flock mode" loading="lazy">
        <figcaption>Zero-G / Flock</figcaption>
      </figure>
      <figure>
        <img src="./art/retro-ragdoll/mode-meteor.png" alt="Pixel particles streaking across the canvas in Time Warp mode" loading="lazy">
        <figcaption>Time Warp / Meteor Stream</figcaption>
      </figure>
    </div>
  </section>
  <section>
    <h2>02 / WORK PLAN &amp; INTERACTION FLOW</h2>
    <ol>
      <li><strong>Recognize an object.</strong> The first plan was to train a webcam image classifier in <a href="https://teachablemachine.withgoogle.com/train/image" target="_blank" rel="noopener">Google Teachable Machine ↗</a>. The two classes, <code>phone</code> and <code>without phone</code>, would map to <code>true</code> and <code>false</code> to show or hide a doughnut cursor.</li>
      <li><strong>Place the cursor.</strong> A separate tracking step would provide the phone's position so the cursor could follow it. I planned to render the doughnut in Three.js, varying its rotation over multiple axes so it could be seen from different angles.</li>
      <li><strong>Disturb the field.</strong> Small pixels would drift diagonally and take on bird- or fish-like movement, informed by this <a href="https://www.youtube.com/watch?v=mhjuuHl6qHM" target="_blank" rel="noopener">flocking study ↗</a>. At a configurable update rate, nearby particles would check their distance from the cursor. Inside a set radius, each particle would take a quick turn with a randomized angle, then ease back into the flock.</li>
    </ol>
    <p>In the live experiment, the floating body became the moving disturbance. The webcam tracks the player's palm to guide the ragdoll, and the player switches between flock and meteor modes with a click.</p>
  </section>
  <section>
    <h2>03 / TECHNICAL SKILLS</h2>
    <ul>
      <li><strong>p5.js and WebGL.</strong> Build on the earlier pixel field, draw a zero-gravity ragdoll, and use canvas input to switch between two visual modes.</li>
      <li><strong>Flocking and steering.</strong> Apply separation, alignment, and cohesion to the micro-swimmers, then use avoidance forces to let movement disturb the group.</li>
      <li><strong>Webcam and MediaPipe Hands.</strong> Read hand landmarks in the browser and map palm position and middle-finger direction to the body's movement and tilt.</li>
      <li><strong>Site navigation.</strong> Link the Working Log directly to the Experiment 02 player and position the Visual Journey map at the artwork.</li>
    </ul>
  </section>
  <section>
    <h2>04 / HOW TO PLAY</h2>
    <ol>
      <li>Open the experiment using the card above. Click inside the artwork canvas to switch between <strong>Zero-G / Flock</strong> and <strong>Time Warp / Meteor Stream</strong>.</li>
      <li>For gesture control, press <strong>START</strong> and allow camera access. Move your palm to guide the body and point your middle finger left or right to tilt it. Move your hand out of view to let the body drift. Press <strong>STOP</strong> to close the camera.</li>
      <li>With the artwork focused, press <strong>F</strong> to toggle the swimmers or <strong>R</strong> to reset the body.</li>
    </ol>
  </section>
  <footer class="entry-footer">Visual Journey · Experiment Log</footer>
</article>`;

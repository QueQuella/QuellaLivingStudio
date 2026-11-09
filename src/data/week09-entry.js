window.StudioEntries.log[7] = `
<article class="real-entry project-log-entry prototype-log">
  <p class="project-log-kicker">PROGRAMMING DREAM · WEEK 9 · 2026 / 11 / 07</p>
  <section>
    <h2>01 / PROGRESS</h2>
    <div class="prototype-table-scroll" role="region" aria-label="Object effects comparison" tabindex="0">
      <table class="prototype-table">
        <thead><tr><th scope="col">Object / features &amp; VFX</th><th scope="col">VFX BP / Shader</th><th scope="col">Screenshot</th></tr></thead>
        <tbody>
        <tr><td><strong>Car</strong><br>Box and round wheels<br>Points → wireframe → solid</td><td><img class="prototype-image" src="./assets/working-log/prototype/20261104225452.webp" alt="Car Blueprint timeline" loading="lazy"></td><td><img class="prototype-image" src="./assets/working-log/prototype/20261104225612.webp" alt="Car wireframe in Unreal Engine" loading="lazy"></td></tr>
        <tr><td><strong>Hand</strong><br>Five fingers</td><td><img class="prototype-image" src="./assets/working-log/prototype/20261106232254.webp" alt="Hand skeletal mesh and animation assets" loading="lazy"><small>Skeletal animation</small></td><td><img class="prototype-image" src="./assets/working-log/prototype/20261106232228.webp" alt="Animated hand in the scene" loading="lazy"></td></tr>
        <tr><td><strong>Teapot</strong><br>Round body, handle, and spout<br>Quantized → dithered → smooth + specular<br><code>WBP_renderinfo</code> and a sphere marking the point light</td><td><img class="prototype-image" src="./assets/working-log/prototype/20261106210806.webp" alt="Teapot lighting and dithering shader" loading="lazy"><img class="prototype-image" src="./assets/working-log/prototype/20261106224530.webp" alt="Teapot with ordered dithering" loading="lazy"></td><td><img class="prototype-image" src="./assets/working-log/prototype/20261106212157.webp" alt="Teapot with smooth lighting" loading="lazy"><small>Smooth lighting</small></td></tr>
        <tr><td><strong>Rabbit</strong><br>Long ears and round body<br>Particles gather → wireframe → solid with scan glitch → particles disperse → repeat</td><td><img class="prototype-image" src="./assets/working-log/prototype/20261107171145.webp" alt="Rabbit reconstruction Blueprint" loading="lazy"><img class="prototype-image" src="./assets/working-log/prototype/20261107171220.webp" alt="Rabbit scan and glitch shader" loading="lazy"></td><td><div class="prototype-table-pair"><img class="prototype-image" src="./assets/working-log/prototype/20261107170935.webp" alt="Rabbit scan band in the scene" loading="lazy"><img class="prototype-image" src="./assets/working-log/prototype/20261107170843.webp" alt="Rabbit point cloud and wireframe" loading="lazy"></div></td></tr>
        <tr><td><strong>Monkey head</strong><br>Round face and ears<br>RGB normals and outline</td><td><img class="prototype-image" src="./assets/working-log/prototype/20261107175939.webp" alt="Monkey head RGB normal and outline shader" loading="lazy"></td><td><div class="prototype-table-pair"><img class="prototype-image" src="./assets/working-log/prototype/20261107175808.webp" alt="Monkey head with solid color and outline" loading="lazy"><img class="prototype-image" src="./assets/working-log/prototype/20261107175745.webp" alt="Monkey head with RGB normal colors" loading="lazy"></div></td></tr>
        </tbody>
      </table>
    </div>
    <p><strong>More:</strong> Random Run DiscoSpotlight, to attract/guide players' attention to the computer</p>
    <div class="project-log-gallery prototype-pair prototype-pair-height">
      <figure><img class="prototype-image" src="./assets/working-log/prototype/20261106232433.webp" alt="Spotlight moving above the CRT" loading="lazy"></figure>
      <figure><img class="prototype-image" src="./assets/working-log/prototype/20261106232636.webp" alt="Spotlight spline and Blueprint" loading="lazy"></figure>
    </div>
    <figure class="project-log-wide">
      <img src="./assets/working-log/prototype/all-vfx-objects.webp" alt="All five prototype objects together in the Programming Dream scene" loading="lazy">
      <figcaption>All five object effects in the Unreal Engine scene.</figcaption>
    </figure>
  </section>
  <section>
    <h2>02 / PROBLEM &amp; SOLUTION</h2>
    <p><strong>Problem:</strong> BP_Car’s Niagara Points appeared near the computer while its Wireframe and Solid modes appeared at the randomized car location. (use GPT to detect the problem/twice)<br>
      <strong>Solution:</strong> In <code>FloatingRelicActor.cpp</code>, <code>BeginPlay()</code> now finalizes the actor’s randomized transform before activating BP_Car’s timeline and Niagara system, ensuring Points, Wireframe, and Solid remain aligned.</p>
    <p><strong>Problem:</strong> Accidentally deleted the folder after renaming it, which caused the model to be lost.<br>
      <strong>Solution:</strong> AI automatically recover the model and BP, but fail. I have to deal with the BP and Niagara again.</p>
    <p><strong>Question：</strong>When spawning a Rabbit, Niagara Points kept the generator's initial position, while Wireframe/Solid followed the Rabbit's randomly moved final position, causing the three to separate.<br>
      <strong>Solution:</strong> AI detects and solves it. But still useless, I have to handle it and find the missing auto activate detail... AI generates the scripts to hidden the option...<br>
      AI runs all the possible potential problems but still fail. Run three times until the problem solved through coding scripts but still the missing details' option...Time wasting!</p>
  </section>
  <section>
    <h2>03 / NEXT</h2>
    <ol><li>UIUX</li><li>Information/explanation for the five objects in UI both canvas and setting, and maybe visual display</li><li>level BP &amp; WBP BP</li><li>demo video</li></ol>
  </section>
  <footer class="entry-footer">Programming Dream · Development Log</footer>
</article>`;

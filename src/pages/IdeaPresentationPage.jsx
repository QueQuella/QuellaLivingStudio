// Existing page content; interactive regions are owned by src/runtime.
export default function IdeaPresentationPage() {
  return (
    <section
      id="ideaSettings"
      className="view idea-settings"
      hidden={true}
      aria-labelledby="ideaTitle"
    >
      <div className="dream-layout">
        <nav className="dream-index" aria-label="Presentation slides">
          <p>SLIDE INDEX</p>
          <a href="#dream-01" data-dream-slide="01">
            01 / THE IDEA
          </a>
          <a href="#dream-02" data-dream-slide="02">
            02 / MOTIVATION
          </a>
          <a href="#dream-03" data-dream-slide="03">
            03 / INSPIRATION
          </a>
          <a href="#dream-04" data-dream-slide="04">
            04 / PATHWAY &amp; PLAN
          </a>
          <a href="#dream-05" data-dream-slide="05">
            05 / TOOLS &amp; AI
          </a>
          <a href="#dream-06" data-dream-slide="06">
            06 / QUESTIONS &amp; CHALLENGES
          </a>
        </nav>
        <div className="dream-presentation">
          <header className="dream-cover">
            <p className="dream-kicker">IDEA PRESENTATION · 2026</p>
            <h1 id="ideaTitle" tabIndex="-1">
              PROGRAMMING DREAM
            </h1>
            <p className="dream-subtitle">
              An Interactive World Between Human Imagination and Machine
              Interpretation
            </p>
            <p className="dream-meta">6 Slides · 5–6 Minutes</p>
          </header>
          <hr className="dream-divider" />
          <section className="dream-section" aria-labelledby="dream-01">
            <p className="dream-kicker">01 / THE IDEA</p>
            <h2 id="dream-01">WHAT IF A DRAWING COULD COME ALIVE?</h2>
            <p className="dream-project-name">
              <strong>PROGRAMMING DREAM</strong>
              <br />
              <em>Drawing Life into a Digital Dream</em>
            </p>
            <p>
              <em>Programming Dream</em> is a 3D exploration game. Players
              explore an endless ocean, draw abstract patterns, and watch their
              drawings become digital creatures through AI interpretation.
            </p>
            <p className="dream-pipeline">
              EXPLORE → DRAW → INTERPRET → BRING TO LIFE
            </p>
            <figure className="dream-ocean">
              <img
                src="./assets/week05/programming-dream.png"
                alt="Programming Dream concept: dreamcore ocean with a floating computer"
              />
            </figure>
          </section>
          <hr className="dream-divider" />
          <section className="dream-section" aria-labelledby="dream-02">
            <p className="dream-kicker">02 / MOTIVATION</p>
            <h2 id="dream-02">CAN AI BECOME A CREATIVE PARTNER?</h2>
            <p>
              I want to explore whether AI can become a creative partner by
              responding to what a player draws. Learning about deep learning
              and CNNs made me curious about how a machine sees a pattern, and
              how an unexpected interpretation might open up a new idea. My
              central interests are human–AI collaboration, machine perception,
              and creative uncertainty.{" "}
              <a
                href="https://playground.tensorflow.org/#activation=tanh&batchSize=12&dataset=circle&regDataset=reg-plane&learningRate=0.03&regularizationRate=0&noise=0&networkShape=4,2&seed=0.53043&showTestData=false&discretize=false&percTrainData=50&x=true&y=true&xTimesY=true&xSquared=true&ySquared=false&cosX=false&sinX=false&cosY=false&sinY=false&collectStats=false&problem=classification&initZero=false&hideText=false"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore neural networks in TensorFlow Playground ↗
              </a>
            </p>
          </section>
          <hr className="dream-divider" />
          <section className="dream-section" aria-labelledby="dream-03">
            <p className="dream-kicker">03 / INSPIRATION</p>
            <h2 id="dream-03">ARTIFICIAL LIFE &amp; LIVING VIRTUAL WORLDS</h2>
            <p>
              My project is inspired by interactive artworks that explore
              artificial life and the relationship between humans and digital
              organisms. Both references demonstrate how computational systems
              can transform virtual creatures from simple visual objects into
              living, responsive experiences.
            </p>
            <div className="dream-grid references">
              <article>
                <img
                  src="./assets/week05/emissaries.jpg"
                  alt="Ian Cheng, Emissaries installation at MoMA; photograph by Pablo Enriquez"
                  loading="lazy"
                />
                <div className="dream-ref-copy">
                  <h3>01 — EMISSARIES</h3>
                  <p className="dream-artist">
                    <strong>Ian Cheng (2015–2017)</strong>
                    <br />
                    <em>Live Simulation / Game Engine Art</em>
                  </p>
                  <p>
                    A series of self-running simulations in which virtual
                    characters interact within unpredictable digital ecosystems.
                    It inspires me to create a virtual environment where
                    creatures can exist and behave independently.
                  </p>
                  <a
                    href="https://iancheng.com/emissaries"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Artwork ↗
                  </a>
                </div>
              </article>
              <article>
                <img
                  src="./assets/week05/a-volve.jpg"
                  alt="Christa Sommerer and Laurent Mignonneau, A-Volve interactive water installation"
                  loading="lazy"
                />
                <div className="dream-ref-copy">
                  <h3>02 — A-VOLVE</h3>
                  <p className="dream-artist">
                    <strong>
                      Christa Sommerer &amp; Laurent Mignonneau (1994)
                    </strong>
                    <br />
                    <em>Interactive Installation / Artificial Life</em>
                  </p>
                  <p>
                    Visitors draw shapes on a touchscreen to create virtual
                    organisms that swim and interact in a water environment. It
                    directly inspires my drawing-to-creature interaction and the
                    idea of giving digital forms a sense of life.
                  </p>
                  <a
                    href="https://interface.ufg.ac.at/christa-laurent/A-Volve.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Artwork ↗
                  </a>
                </div>
              </article>
            </div>
            <p className="dream-note">
              <strong>My Direction:</strong> I refer to <em>Emissaries</em> for
              its independently behaving creatures and <em>A-Volve</em> for its
              drawing-based participation. These references guide my own
              exploration of machine perception in a dreamlike ocean.{" "}
              <a
                href="https://www.moma.org/calendar/exhibitions/3656"
                target="_blank"
                rel="noopener noreferrer"
              >
                The Museum of Modern Art
              </a>
            </p>
          </section>
          <hr className="dream-divider" />
          <section className="dream-section" aria-labelledby="dream-04">
            <p className="dream-kicker">04 / PATHWAY &amp; PLAN</p>
            <h2 id="dream-04">FROM DRAWING TO DIGITAL LIFE</h2>
            <p className="dream-label">
              SELECTED PATHWAY — GAME ENGINE &amp; INTERACTIVE MEDIA
            </p>
            <p>
              I will develop a small interactive prototype in UE. The player
              enters a dreamlike ocean, approaches a floating computer, and
              draws an abstract pattern. UE captures the drawing as an image and
              passes its resized, normalised pixel data to the trained model. A
              trained CNN interprets the drawing and identifies a creature type.
              After confirmation, the corresponding 3D creature appears in the
              ocean, where the player can observe it and continue exploring.
            </p>
            <h3 className="dream-grid-label">PLAYER EXPERIENCE</h3>
            <div className="dream-grid three">
              <article>
                <h3>01 — EXPLORE</h3>
                <p>Discover the floating computer in a surreal ocean.</p>
                <strong>3D Environment</strong>
              </article>
              <article>
                <h3>02 — CREATE</h3>
                <p>Draw a pattern and let AI classify it.</p>
                <strong>Drawing UI + CNN</strong>
              </article>
              <article>
                <h3>03 — BRING TO LIFE</h3>
                <p>Spawn a creature, explore, and repeat.</p>
                <strong>Real-time Interaction</strong>
              </article>
            </div>
            <p className="dream-note">
              <strong>FINAL OUTCOME</strong>
              <br />
              One explorable environment · One AI drawing interface · Six
              low-poly creatures · One complete interaction loop
            </p>
          </section>
          <hr className="dream-divider" />
          <section className="dream-section" aria-labelledby="dream-05">
            <p className="dream-kicker">05 / TOOLS &amp; AI</p>
            <h2 id="dream-05">CONNECTING ART, AI &amp; GAME DESIGN</h2>
            <p>
              UE will capture the player's drawing as an image and resize and
              normalise its pixels to match the training data. An inference
              plugin or C++ bridge will feed this data into the trained{" "}
              <em>.onnx</em> model and convert its output scores into a creature
              label. Blueprints will map the returned label to the matching
              creature Blueprint and use <em>Spawn Actor from Class</em> to
              create it after the player confirms.
            </p>
            <h3 className="dream-grid-label">PRODUCTION WORKFLOW</h3>
            <div className="dream-grid three">
              <article>
                <h3>01 — 3D DESIGN</h3>
                <strong>Blender + UE</strong>
                <p>Environment, creatures, lighting, and animation.</p>
              </article>
              <article>
                <h3>02 — AI TRAINING</h3>
                <strong>Python + PyTorch + JupyterLab</strong>
                <p>Drawing dataset, CNN training, and data augmentation.</p>
              </article>
              <article>
                <h3>03 — INTERACTIVE SYSTEM</h3>
                <strong>UE Blueprints + Model Inference</strong>
                <p>
                  Drawing interface, prediction results, and creature spawning.
                </p>
              </article>
            </div>
            <h3 className="dream-grid-label">ROLE OF AI</h3>
            <p className="dream-note">
              AI will help me write and debug code, generate extra training
              patterns, and develop modelling references and rough assets. I
              will also use it to work through CNN training, model integration,
              and Blueprint logic.
            </p>
          </section>
          <hr className="dream-divider" />
          <section className="dream-section" aria-labelledby="dream-06">
            <p className="dream-kicker">06 / QUESTIONS &amp; CHALLENGES</p>
            <h2 id="dream-06">WHEN DOES AI BECOME MORE THAN A TOOL?</h2>
            <p>
              Moving a drawing from UE to the deep learning model may take
              processing time, and resizing or changing its pixel values may
              lose details that affect recognition accuracy. I need to test how
              well the model reads different drawing styles and decide on clear
              drawing rules, such as canvas size, stroke thickness, and simple
              shape hints. These rules should help the machine read the patterns
              while leaving players room to express their own ideas.
            </p>
            <p>
              I also want to study how rough textures and simple low-poly shapes
              express digital nostalgia, anti-fidelity aesthetics, and
              imperfection. Thinking through art modding and cargo cult coding,
              I see these figures as constructed digital objects, shaped by a
              bricoleur who reworks existing tools and fragments. Incomplete
              visual clues may invite players to use memory, experience, and
              visual schemas to form guesses and fill in the gaps. This may
              encourage imagination, but the link between visual uncertainty and
              imaginative engagement remains an open question for this project,
              and responses may differ between players. I could explore this
              through saved drawings and player choices, alongside brief player
              feedback about what they imagined.
            </p>
            <div className="dream-closing">
              <p className="dream-kicker">THE OPEN QUESTION</p>
              <h3>
                Can the difference between what we imagine and what AI
                understands become a new form of creative expression?
              </h3>
              <p>
                <em>
                  Programming Dream explores a world where human imagination
                  begins the process, machine interpretation shapes the result,
                  and digital life emerges.
                </em>
              </p>
              <p className="dream-thanks">THANK YOU.</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

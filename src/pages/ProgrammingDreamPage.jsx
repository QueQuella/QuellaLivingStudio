// Existing page content; interactive regions are owned by src/runtime.
export default function ProgrammingDreamPage() {
  return (
    <section
      id="programmingDream"
      className="view pd-view"
      hidden={true}
      aria-labelledby="pdTitle"
      tabIndex="0"
    >
      <div className="pd-stage" aria-hidden="true">
        <img
          className="pd-reference"
          src="./assets/programming-dream/scene-reference.webp"
          alt=""
        />
        <div id="pdCanvas" className="pd-canvas"></div>
        <div className="pd-vignette"></div>
        <div id="pdPortal" className="pd-portal"></div>
      </div>
      <div className="pd-hud">
        <a href="#project" className="pd-return">
          ← PROJECTS
        </a>
        <span id="pdChapter">01 / DIGITAL SEA</span>
        <button id="pdSkip" type="button">
          SKIP TO ABOUT ↓
        </button>
      </div>
      <div id="pdStory" className="pd-story">
        <header id="pdIntro" className="pd-intro">
          <p className="pd-kicker">QUELLA / INTERACTIVE ART / 2026</p>
          <h1 id="pdTitle" tabIndex="-1">
            A dream,
            <br />
            <em>waiting for life.</em>
          </h1>
          <p className="pd-invitation">
            Somewhere in this sea, a computer is dreaming.
          </p>
          <button id="pdBegin" className="pd-scroll-cue" type="button">
            SCROLL TO ENTER <span>↓</span>
          </button>
        </header>
        <p id="pdStatus" className="pd-status" role="status">
          Preparing the digital world…
        </p>
      </div>
      <div className="pd-content">
        <section
          id="pdQuestion"
          className="pd-question"
          aria-labelledby="pdQuestionTitle"
        >
          <div className="pd-question-scene">
            <div className="pd-question-orbit" aria-hidden="true"></div>
            <div className="pd-question-copy">
              <p className="pd-kicker">02 / A QUESTION TO ENTER WITH</p>
              <h2 id="pdQuestionTitle">
                What if a drawing
                <br />
                could <em>come alive?</em>
              </h2>
              <p>And what would a machine see in it?</p>
              <span className="pd-section-scroll" aria-hidden="true">
                SCROLL TO DISCOVER ↓
              </span>
            </div>
          </div>
        </section>
        <section
          id="pdAbout"
          className="pd-about"
          aria-labelledby="pdAboutTitle"
        >
          <div className="pd-section-label" data-pd-reveal={true}>
            <span>03 / ABOUT THE PROJECT</span>
            <i></i>
            <span>IN DEVELOPMENT</span>
          </div>
          <h2 id="pdAboutTitle" tabIndex="-1" data-pd-reveal={true}>
            Programming <em>Dream</em>
            <span className="pd-title-star" aria-hidden="true">
              ✦
            </span>
          </h2>
          <div className="pd-about-copy" data-pd-reveal={true}>
            <p className="pd-subtitle">
              Between human imagination
              <br />
              and machine interpretation.
            </p>
            <div>
              <p className="pd-pitch">
                <em>Programming Dream</em> is a small interactive art experiment
                set in a dreamlike digital ocean. A floating computer invites
                players to draw abstract patterns, which a trained neural
                network interprets as one of six low-poly creatures. These
                handmade creatures emerge into the sea, turning each drawing
                into an encounter between what a person imagines and what a
                machine recognises. Through rough textures, uncertain forms, and
                moments of surprise, I explore how digital life can leave room
                for our own imagination.
              </p>
            </div>
          </div>
          <div className="pd-bottom-line" data-pd-reveal={true}>
            <span>BLENDER · UNREAL ENGINE · PYTORCH</span>
            <button id="pdToShowcase" type="button">
              FOLLOW THE DREAM ↓
            </button>
          </div>
        </section>
        <section
          id="pdFilmTransition"
          className="pd-film-transition"
          aria-labelledby="pdFilmTitle"
        >
          <div className="pd-film-scene">
            <div className="pd-film-glow" aria-hidden="true"></div>
            <div className="pd-film-frame" aria-hidden="true"></div>
            <div className="pd-film-copy">
              <p className="pd-kicker">04 / THE DREAM IN MOTION</p>
              <h2 id="pdFilmTitle" tabIndex="-1">
                <span>From a line</span>
                <br />
                <em>to a living dream.</em>
              </h2>
              <p>A glimpse into the world taking shape.</p>
              <span className="pd-section-scroll" aria-hidden="true">
                KEEP SCROLLING ↓
              </span>
            </div>
            <div className="pd-film-wash" aria-hidden="true"></div>
          </div>
        </section>
        <section
          id="pdShowcase"
          className="pd-showcase"
          aria-labelledby="pdShowcaseTitle"
        >
          <div className="pd-section-label" data-pd-reveal={true}>
            <span>05 / SHOWCASE</span>
            <i></i>
            <span>WORK IN PROGRESS</span>
          </div>
          <header data-pd-reveal={true}>
            <h2 id="pdShowcaseTitle" tabIndex="-1">
              Inside <em>the dream.</em>
            </h2>
            <p>Gameplay film / coming soon</p>
          </header>
          <div
            className="pd-video-slot"
            data-pd-reveal={true}
            aria-label="Gameplay video placeholder. Video not yet available."
          >
            <div className="pd-video-corners" aria-hidden="true"></div>
            <span className="pd-video-icon" aria-hidden="true">
              ▷
            </span>
            <p>THE DREAM IS STILL TAKING SHAPE.</p>
            <span>GAMEPLAY VIDEO / COMING SOON</span>
          </div>
          <footer data-pd-reveal={true}>
            <p>Human input → machine interpretation → digital life.</p>
          </footer>
        </section>
        <section
          id="pdFurther"
          className="pd-further"
          aria-labelledby="pdFurtherTitle"
        >
          <div className="pd-section-label" data-pd-reveal={true}>
            <span>06 / BEHIND THE DREAM</span>
            <i></i>
            <span>CONTINUE EXPLORING</span>
          </div>
          <h2 id="pdFurtherTitle" tabIndex="-1" data-pd-reveal={true}>
            Every dream has
            <br />
            <em>a process.</em>
          </h2>
          <p className="pd-further-intro" data-pd-reveal={true}>
            Follow the experiments, or return to the idea that started them.
          </p>
          <nav
            className="pd-links"
            aria-label="Explore the project further"
            data-pd-reveal={true}
          >
            <a href="#log" data-pd-route="tape">
              <span>01 / PROCESS</span>Working Log <b aria-hidden="true">↗</b>
            </a>
            <a href="#idea" data-pd-route="light">
              <span>02 / CONCEPT</span>Idea Presentation{" "}
              <b aria-hidden="true">↗</b>
            </a>
          </nav>
          <footer data-pd-reveal={true}>
            <span>QUELLA / PROGRAMMING DREAM / 2026</span>
            <button id="pdReplay" type="button">
              ↑ RETURN TO THE SEA
            </button>
          </footer>
        </section>
      </div>
    </section>
  );
}

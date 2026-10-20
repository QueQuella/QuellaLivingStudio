// Existing page content; interactive regions are owned by src/runtime.
export default function AboutPage() {
  return (
    <section id="about" className="view about-view" hidden={true}>
      <canvas
        id="starfield"
        aria-label="A gently twinkling star field"
      ></canvas>
      <div className="about-universe">
        <p className="universe-coordinates">
          YOU ARE HERE / QUELLA'S CORNER OF THE INTERNET
        </p>
        <div className="cosmic-layout">
          <aside className="old-window link-window">
            <div className="window-title">HYPERLINKS.EXE</div>
            <a href="#home">return to the garden</a>
            <a href="#visual">look at something</a>
            <a href="#log">read a stray thought</a>
            <a href="#project">follow a project</a>
            <a
              href="https://quequella.github.io/Quella.github.io/"
              target="_blank"
              rel="noreferrer"
            >
              Quella's portfolio ↗
            </a>
            <span className="tiny-star">✦</span>
            <p>
              Every link is
              <br />
              another little door.
            </p>
          </aside>
          <article className="old-window profile-window">
            <div className="window-title">
              ABOUT / PLAYER 01 <span>✧</span>
            </div>
            <div className="profile-inner">
              <p className="welcome-text">welcome to</p>
              <h1 id="aboutTitle" tabIndex="-1">
                Quella's
                <br />
                <em>small universe</em>
              </h1>
              <figure className="avatar-frame video-avatar">
                <video
                  src="./assets/portrait-interaction-web.mp4"
                  autoPlay={true}
                  muted={true}
                  loop={true}
                  playsInline={true}
                  aria-label="Quella's looping interactive pixel portrait"
                ></video>
                <figcaption>INTERACTIVE PORTRAIT · LOOP 01</figcaption>
              </figure>
              <p>Hi, I'm Quella.</p>
              <p>
                This is my Personal Living Studio for
                <br />
                <strong>Generative AI Workflow for Media Art.</strong>
              </p>
              <p className="profile-note">
                A place for things I make,
                <br />
                things I notice, and things still becoming.
              </p>
              <div className="profile-links">
                <a href="#visual">visual journey</a> ·{" "}
                <a href="#log">working notes</a> ·{" "}
                <a href="#feedback">leave feedback</a>
              </div>
            </div>
          </article>
          <aside className="old-window satellite-window">
            <div className="window-title">SOMEWHERE NEARBY</div>
            <p>✳   PERSONAL WEB SPACE</p>
            <p>
              still growing.
              <br />
              still connected.
            </p>
            <a href="#idea">ideas in orbit ↗</a>
            <div className="orbital-note">
              ✦<br />
              no final version
              <br />
              of a small universe.
            </div>
          </aside>
        </div>
        <footer className="universe-footer">
          <span>PERSONAL LIVING STUDIO / QUELLA</span>
        </footer>
      </div>
    </section>
  );
}

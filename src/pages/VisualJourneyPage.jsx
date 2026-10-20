// Existing page content; interactive regions are owned by src/runtime.
export default function VisualJourneyPage() {
  return (
    <section
      id="visualMap"
      className="view journey-view"
      hidden={true}
      aria-labelledby="journeyTitle"
    >
      <div
        id="journeyViewport"
        className="journey-viewport"
        tabIndex="0"
        aria-label="Visual Journey map. Drag the background, swipe, or use arrow keys to explore."
      >
        <div id="journeyWorld" className="journey-world">
          <div className="journey-sparkles" aria-hidden="true"></div>
          <header className="journey-intro">
            <p>QUELLA.OS / PLAYER'S ARCHIVE</p>
            <h1 id="journeyTitle" tabIndex="-1">
              Welcome To Quella's
              <br />
              <em>Visual Journey.</em>
            </h1>
            <span>DRAG THE STARFIELD TO EXPLORE · 03 JOURNEYS ONLINE</span>
          </header>

          <section
            id="journeyCollection"
            className="j-collection journey-frame-target"
            aria-label="Visual Journey 01 works"
          >
            <div className="collection-corner top-left" aria-hidden="true">
              01
            </div>
            <div className="collection-corner top-right" aria-hidden="true">
              ✦
            </div>
            <div className="collection-corner bottom-left" aria-hidden="true">
              HP
            </div>
            <div className="collection-corner bottom-right" aria-hidden="true">
              ↯
            </div>
            <div className="collection-topline" aria-hidden="true">
              <span>QUELLA'S GAME PARK</span>
              <i></i>
              <span>2 / ∞</span>
            </div>
            <span className="j-sticker sticker-park" aria-hidden="true">
              ★ GAME
              <br />
              PARK ★
            </span>
            <span className="j-sticker sticker-avatar" aria-hidden="true">
              <img src="./assets/quella-retro-avatar-wink.png" alt="" />
            </span>
            <span className="j-sticker sticker-play" aria-hidden="true">
              ♥ PLAY!
            </span>
            <article id="journeyMain" className="j-work work-one">
              <div className="j-player">
                <div className="j-player-bar">
                  <span>▶ RETRO_TIME_MACHINE.P5</span>
                  <span>LIVE SIGNAL</span>
                </div>
                <iframe
                  id="journeyArtwork"
                  data-src="./art/index.html"
                  title="Retro Time Machine — Quella's interactive p5.js artwork"
                  allow="fullscreen"
                  tabIndex="0"
                ></iframe>
                <div className="j-player-controls">
                  <span>CLICK / SPACE = TIME WARP</span>
                  <button id="journeyReload" aria-label="Restart artwork">
                    ↻
                  </button>
                </div>
              </div>
              <footer className="j-work-caption">
                <h2>TIME TRAVEL</h2>
                <time dateTime="2026-09">2026 / 9</time>
                <p>
                  A live pixel journey through drifting memories and accelerated
                  time.
                </p>
                <a
                  href="https://editor.p5js.org/QueQuella/sketches/v3DsFC2gH"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN THE P5.JS WORK ↗
                </a>
              </footer>
            </article>
            <div className="j-inner-divider" aria-hidden="true">
              <i></i>
              <span>✦ WORK 002 ✦</span>
              <i></i>
            </div>
            <article id="journeySecond" className="j-work work-two">
              <div className="j-player">
                <div className="j-player-bar">
                  <span>▶ TIME_TRAVELER_PART2.EXE</span>
                  <span>LIGHT SPEED / LIVE</span>
                </div>
                <iframe
                  id="journeyPart2"
                  data-src="./art/part2/index.html"
                  title="time traveler_part2 — an interactive 16 by 9 light-beam artwork"
                  tabIndex="0"
                ></iframe>
                <div className="j-player-controls">
                  <span>MOVE THE WAND = BEND THE TIME RIFT</span>
                  <button
                    id="journeyReload2"
                    aria-label="Restart time traveler part two"
                  >
                    ↻
                  </button>
                </div>
              </div>
              <footer className="j-work-caption">
                <h2>TIME TRAVELER_PART2</h2>
                <time dateTime="2026-09">2026 / 9</time>
                <p>
                  A live 16:9 light corridor where cyan and red beams rush
                  through a shifting temporal seam.
                </p>
              </footer>
            </article>
            <div className="collection-bottomline" aria-hidden="true">
              <span>JOURNEY 01 COMPLETE</span>
              <i></i>
            </div>
          </section>
          <aside
            className="j-note j-reference-note"
            aria-label="References and tools for Time Travel"
          >
            <span className="note-edge-sticker" aria-hidden="true">
              PIXEL
              <br />
              PLAYGROUND
            </span>
            <div className="j-note-tabs" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
            </div>
            <p className="j-note-label">WORK 001 / FIELD NOTE</p>
            <h2>Visual references</h2>
            <a
              href="https://p5js.org/examples/"
              target="_blank"
              rel="noopener noreferrer"
            >
              p5.js examples ↗
            </a>
            <a
              href="https://art.teleportacia.org/#CenterOfTheUniverse"
              target="_blank"
              rel="noopener noreferrer"
            >
              Olia Lialina's web universe ↗
            </a>
            <h2>Tools</h2>
            <a
              href="https://editor.p5js.org/QueQuella/sketches/v3DsFC2gH"
              target="_blank"
              rel="noopener noreferrer"
            >
              p5.js Web Editor ↗
            </a>
            <a
              href="https://p5js.org/reference/"
              target="_blank"
              rel="noopener noreferrer"
            >
              p5.js reference ↗
            </a>
            <p className="j-note-small">
              A tiny machine for stretching a second into a century.
            </p>
          </aside>
          <div className="j-sprite sprite-moon" aria-hidden="true"></div>
          <div className="j-sprite sprite-portal" aria-hidden="true"></div>
          <div className="j-sprite sprite-flowers" aria-hidden="true"></div>
          <div className="j-sprite sprite-sparkles" aria-hidden="true"></div>
          <div className="j-sprite sprite-saturn" aria-hidden="true"></div>
          <div className="j-game-sign sign-one" aria-hidden="true">
            HP ✦✦✦
            <br />
            MEMORY SLOT 01
          </div>
          <div className="j-game-sign sign-two" aria-hidden="true">
            SAVE POINT
            <br />
            SEPTEMBER 2026
          </div>
          <aside
            className="j-cinema-note"
            aria-label="Visual reference for time traveler part two"
          >
            <span className="cinema-sticker" aria-hidden="true">
              ★ ARCADE
              <br />
              DREAM ★
            </span>
            <div className="cinema-pin" aria-hidden="true">
              ☺
            </div>
            <figure>
              <img
                src="./assets/time-traveler-reference.jpg"
                alt="Abstract cyan, white and red light rays used as a visual reference"
              />
              <figcaption>by 2001: A Space Odyssey</figcaption>
            </figure>
          </aside>
          <div className="j-sprite sprite-castle" aria-hidden="true"></div>
          <div className="j-sprite sprite-nebula" aria-hidden="true"></div>
          <div className="j-game-sign sign-three" aria-hidden="true">
            PORTAL 02
            <br />
            BEAM COUNT 64
          </div>
          <section
            id="journeyCollection02"
            className="journey-ref-frame journey-ref-two journey-frame-target"
            aria-labelledby="journey02Title"
          >
            <div className="ref-corner ref-tl" aria-hidden="true">
              02
            </div>
            <div className="ref-corner ref-tr" aria-hidden="true">
              CG
            </div>
            <div className="ref-corner ref-bl" aria-hidden="true">
              ▶
            </div>
            <div className="ref-corner ref-br" aria-hidden="true">
              ✦
            </div>
            <header className="ref-frame-head">
              <p>VISUAL JOURNEY 02</p>
              <h2 id="journey02Title">CGI ART / VIDEO ART / ANIMATION</h2>
              <span>2026 / 09 · FIVE SIGNALS</span>
            </header>
            <article className="journey-ref-row">
              <div className="ref-media ref-tv">
                <span className="ref-fallback" aria-hidden="true">
                  TV
                  <br />
                  BUDDHA
                </span>
                <img
                  src="https://njpart.ggcf.kr/storage/upload/2023/02/09/bnsjMxzDZoowPFWzxjYYQ3TwdVV3kyLOT3lg6TlI.jpg"
                  alt="Nam June Paik's TV Buddha installation"
                  loading="lazy"
                />
              </div>
              <div className="ref-copy">
                <a
                  href="https://njpart.ggcf.kr/collections/205"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN WORK / SOURCE ↗
                </a>
                <h3>TV BUDDHA — NAM JUNE PAIK, 1974</h3>
                <p>
                  - Video sculpture: a Buddha watches its live image on a
                  television.
                </p>
                <p className="ref-learn">
                  - Learn: build a closed feedback loop between object, camera
                  and screen.
                </p>
              </div>
            </article>
            <div className="ref-divider" aria-hidden="true">
              <i></i>
              <span>✦ SIGNAL 02</span>
              <i></i>
            </div>
            <article className="journey-ref-row">
              <div className="ref-media ref-drome">
                <span className="ref-fallback" aria-hidden="true">
                  MOVIE
                  <br />
                  DROME
                </span>
                <img
                  src="https://www.moma.org/media/W1siZiIsIjUzNzA2OCJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MjAwMFx1MDAzZSJdXQ.jpg?sha=1bd6a95eca29cd73"
                  alt="Stan VanDerBeek's Movie-Drome"
                  loading="lazy"
                />
              </div>
              <div className="ref-copy">
                <a
                  href="https://www.moma.org/collection/works/273553"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN WORK / SOURCE ↗
                </a>
                <h3>MOVIE-DROME — STAN VANDERBEEK, 1964–65</h3>
                <p>
                  - A dome filled with simultaneous films and slides instead of
                  one fixed screen.
                </p>
                <p className="ref-learn">
                  - Learn: treat projection as spatial architecture, not a flat
                  image.
                </p>
              </div>
            </article>
            <div className="ref-divider" aria-hidden="true">
              <i></i>
              <span>✦ SIGNAL 03</span>
              <i></i>
            </div>
            <article className="journey-ref-row">
              <div className="ref-media ref-emissaries">
                <span className="ref-fallback" aria-hidden="true">
                  LIVE
                  <br />
                  WORLD
                </span>
                <img
                  src="https://www.moma.org/d/assets/W1siZiIsIjIwMTcvMDEvMjYvN2FrNG42eDZpb19MZWFkSW1hZ2VfRUZBUF9TQ1JFRU5TSE9UX0hVR0VSRVNfMDFfQUxULmpwZyJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4NjY3XiAtZ3Jhdml0eSBDZW50ZXIgLWNyb3AgMjAwMHg2NjcrMCswIl1d/LeadImage_EFAP_SCREENSHOT_HUGERES_01_ALT.jpg?sha=fcdc1a34146d60ed"
                  alt="Ian Cheng's Emissaries simulated world"
                  loading="lazy"
                />
              </div>
              <div className="ref-copy">
                <a
                  href="https://www.moma.org/calendar/exhibitions/3656"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN WORK / SOURCE ↗
                </a>
                <h3>EMISSARIES — IAN CHENG, 2015–17</h3>
                <p>
                  - Game-engine ecosystems unfold through agents, rules and
                  unstable stories.
                </p>
                <p className="ref-learn">
                  - Learn: let a world behave beyond the artist's direct
                  control.
                </p>
              </div>
            </article>
            <div className="ref-divider" aria-hidden="true">
              <i></i>
              <span>✦ SIGNAL 04</span>
              <i></i>
            </div>
            <article className="journey-ref-row">
              <div className="ref-media ref-geomancer">
                <span className="ref-fallback" aria-hidden="true">
                  AI
                  <br />
                  SATELLITE
                </span>
                <img
                  src="./assets/week05/geomancer.jpg"
                  alt="Lawrence Lek's CGI film Geomancer"
                  loading="lazy"
                />
              </div>
              <div className="ref-copy">
                <a
                  href="https://zkm.de/en/artwork/geomancer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN WORK / SOURCE ↗
                </a>
                <h3>GEOMANCER — LAWRENCE LEK, 2017</h3>
                <p>
                  - A CGI film follows an AI satellite that wants to become an
                  artist.
                </p>
                <p className="ref-learn">
                  - Learn: use a game engine to stage atmosphere, memory and
                  machine identity.
                </p>
              </div>
            </article>
            <div className="ref-divider" aria-hidden="true">
              <i></i>
              <span>✦ SIGNAL 05</span>
              <i></i>
            </div>
            <article className="journey-ref-row">
              <div className="ref-media ref-laturbo">
                <span className="ref-fallback" aria-hidden="true">
                  VIRTUAL
                  <br />
                  SELF
                </span>
                <img
                  src="https://cdn.prod.website-files.com/62ee0bbe0c783a903ecc0ddb/6472a4723ea0d9389807388c_laturbo11-230x300.jpeg"
                  alt="LaTurbo Avedon's virtual avatar"
                  loading="lazy"
                />
              </div>
              <div className="ref-copy">
                <a
                  href="https://www.laturboavedon.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN ARTIST WORLD ↗
                </a>
                <h3>LATURBO AVEDON — 2008–PRESENT</h3>
                <p>
                  - A virtual avatar exists as both artist and artwork across
                  online worlds.
                </p>
                <p className="ref-learn">
                  - Learn: make the avatar an ongoing identity, not only a
                  character model.
                </p>
              </div>
            </article>
            <footer className="ref-frame-foot">
              <span>END OF JOURNEY 02</span>
              <i></i>
              <b>CONTINUE ↓</b>
            </footer>
          </section>

          <section
            id="journeyCollection03"
            className="journey-ref-frame journey-ref-three journey-frame-target"
            aria-labelledby="journey03Title"
          >
            <div className="ref-corner ref-tl" aria-hidden="true">
              03
            </div>
            <div className="ref-corner ref-tr" aria-hidden="true">
              IX
            </div>
            <div className="ref-corner ref-bl" aria-hidden="true">
              ♥
            </div>
            <div className="ref-corner ref-br" aria-hidden="true">
              ↯
            </div>
            <header className="ref-frame-head">
              <p>VISUAL JOURNEY 03</p>
              <h2 id="journey03Title">INTERACTIVE ART &amp; GAME ART</h2>
              <span>2026 / 09 · FIVE LIVING SYSTEMS</span>
            </header>
            <article className="journey-ref-row">
              <div className="ref-media ref-avolve">
                <span className="ref-fallback" aria-hidden="true">
                  A-VOLVE
                  <br />
                  1994
                </span>
                <img
                  src="./assets/week05/a-volve.jpg"
                  alt="A-Volve interactive artificial-life installation"
                  loading="lazy"
                />
              </div>
              <div className="ref-copy">
                <a
                  href="https://www.ntticc.or.jp/en/archive/works/a-volve/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN WORK / SOURCE ↗
                </a>
                <h3>A-VOLVE — SOMMERER &amp; MIGNONNEAU, 1994</h3>
                <p>
                  - Visitors draw creatures, release them into a virtual pool
                  and alter their survival.
                </p>
                <p className="ref-learn">
                  - Learn: connect simple input to a living system with visible
                  consequences.
                </p>
              </div>
            </article>
            <div className="ref-divider" aria-hidden="true">
              <i></i>
              <span>✦ SIGNAL 02</span>
              <i></i>
            </div>
            <article className="journey-ref-row">
              <div className="ref-media ref-body">
                <span className="ref-fallback" aria-hidden="true">
                  BODY
                  <br />
                  MOVIES
                </span>
                <img
                  src="https://www.lozano-hemmer.com/image_sets/body_movies/hongkong_2006/bodymovies_hongkong_01_t.jpg"
                  alt="Rafael Lozano-Hemmer's Body Movies"
                  loading="lazy"
                />
              </div>
              <div className="ref-copy">
                <a
                  href="https://www.lozano-hemmer.com/body_movies.php"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN WORK / SOURCE ↗
                </a>
                <h3>BODY MOVIES — RAFAEL LOZANO-HEMMER, 2001</h3>
                <p>
                  - Passers-by reveal portraits by moving enlarged shadows
                  across a public façade.
                </p>
                <p className="ref-learn">
                  - Learn: make the participant's body both controller and
                  image.
                </p>
              </div>
            </article>
            <div className="ref-divider" aria-hidden="true">
              <i></i>
              <span>✦ SIGNAL 03</span>
              <i></i>
            </div>
            <article className="journey-ref-row">
              <div className="ref-media ref-night">
                <span className="ref-fallback" aria-hidden="true">
                  NIGHT
                  <br />
                  JOURNEY
                </span>
                <img
                  src="https://images.squarespace-cdn.com/content/v1/59ad778ee6f2e1ebbce682fb/1505971166636-GKIIRWCM39IDZ394ZRAA/NightJourney_windyTrees.jpg"
                  alt="The Night Journey experimental art game"
                  loading="lazy"
                />
              </div>
              <div className="ref-copy">
                <a
                  href="https://www.thenightjourney.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN WORK / SOURCE ↗
                </a>
                <h3>THE NIGHT JOURNEY — BILL VIOLA + USC, 2007–18</h3>
                <p>
                  - A slow, dreamlike game turns wandering into a journey toward
                  enlightenment.
                </p>
                <p className="ref-learn">
                  - Learn: let movement, pace and atmosphere carry meaning
                  without goals.
                </p>
              </div>
            </article>
            <div className="ref-divider" aria-hidden="true">
              <i></i>
              <span>✦ SIGNAL 04</span>
              <i></i>
            </div>
            <article className="journey-ref-row">
              <div className="ref-media ref-rmb">
                <span className="ref-fallback" aria-hidden="true">
                  RMB
                  <br />
                  CITY
                </span>
                <img
                  src="https://www.moma.org/d/c/installation_images/W1siZiIsIjQzMzQ2NCJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDEyMDB4NjAwXHUwMDNlIl1d.jpg?sha=31ba0f3425d4f704"
                  alt="Cao Fei exhibition view featuring RMB City"
                  loading="lazy"
                />
              </div>
              <div className="ref-copy">
                <a
                  href="https://www.mplus.org.hk/en/collection/objects/rmb-city-201286/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN WORK / SOURCE ↗
                </a>
                <h3>RMB CITY — CAO FEI, 2007–11</h3>
                <p>
                  - A surreal Second Life city became a platform for events and
                  virtual life.
                </p>
                <p className="ref-learn">
                  - Learn: design a world as a social stage that keeps changing
                  after launch.
                </p>
              </div>
            </article>
            <div className="ref-divider" aria-hidden="true">
              <i></i>
              <span>✦ SIGNAL 05</span>
              <i></i>
            </div>
            <article className="journey-ref-row">
              <div className="ref-media ref-everything">
                <span className="ref-fallback" aria-hidden="true">
                  EVERY
                  <br />
                  THING
                </span>
                <img
                  src="https://www.irishtimes.com/resizer/v2/EWZIWMC5HMB5QDO6U5G7D3EERM.jpg?auth=988987405b18ab76b4c3c24b3f0272a2b4b0d12856508558705f0c91ef1585f3&height=450&width=800"
                  alt="David OReilly's game Everything"
                  loading="lazy"
                />
              </div>
              <div className="ref-copy">
                <a
                  href="https://www.doublefine.com/games/everything"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN WORK / SOURCE ↗
                </a>
                <h3>EVERYTHING — DAVID OREILLY, 2017</h3>
                <p>
                  - Players can become animals, objects, planets or galaxies in
                  one universe.
                </p>
                <p className="ref-learn">
                  - Learn: use perspective-switching to turn interaction into an
                  idea.
                </p>
              </div>
            </article>
            <footer className="ref-frame-foot">
              <span>END OF JOURNEY 03</span>
              <i></i>
              <b>ARCHIVE SAVED ✦</b>
            </footer>
          </section>

          <div className="map-zone-label zone-own">01 / MY EXPERIMENTS</div>
          <div className="map-zone-label zone-references">
            02 + 03 / VISUAL REFERENCES
          </div>
          <aside
            className="jodi-card journey-frame-target"
            aria-label="Visual Journey 03 extra reference: JODI Untitled Game"
          >
            <p className="pixel-kicker">JOURNEY 03 / EXTRA LIFE</p>
            <a
              href="https://www.eai.org/titles/untitled-game"
              target="_blank"
              rel="noopener"
            >
              OPEN WORK / EAI
            </a>
            <img
              src="./assets/week05/jodi.jpg"
              alt="JODI Untitled Game screenshot"
              loading="lazy"
            />
            <h2>
              JODI — <em>Untitled Game</em>
            </h2>
            <time>1996–2001 / QUAKE MODS</time>
            <p>
              - Altered code strips the game into disorienting abstract space.
            </p>
            <p>
              - Learn: expose the engine through errors that unsettle the
              player's sense of control.
            </p>
            <a href="#log" data-log-slot="3">
              READ MY RESPONSE
            </a>
          </aside>
          <aside
            className="journey-library journey-frame-target"
            aria-labelledby="readingShelfTitle"
          >
            <p className="pixel-kicker">READING / SAVE DATA</p>
            <h2 id="readingShelfTitle">Books in orbit</h2>
            <div className="reading-shelf">
              <a
                href="https://www.openhumanitiespress.org/books/titles/ai-art/"
                target="_blank"
                rel="noopener"
              >
                <img src="./assets/week05/ai-art.jpg" alt="AI Art book cover" />
                <strong>AI Art</strong>
                <span>Joanna Zylinska</span>
              </a>
              <a
                href="https://www.scribd.com/document/47831705/Internet-Art-Rachel-Greene"
                target="_blank"
                rel="noopener"
              >
                <img
                  src="./assets/week05/internet-art.jpeg"
                  alt="Internet Art book cover"
                />
                <strong>Internet Art</strong>
                <span>Rachel Greene</span>
              </a>
              <a
                href="https://www.bloomsbury.com/us/unstable-aesthetics-9781501364907/"
                target="_blank"
                rel="noopener"
              >
                <img
                  src="./assets/week05/unstable-aesthetics.jpg"
                  alt="Unstable Aesthetics book cover"
                />
                <strong>Unstable Aesthetics</strong>
                <span>Eddie Lohmeyer</span>
              </a>
            </div>
            <a className="shelf-reading-link" href="#log">
              OPEN READING RESPONSES
            </a>
          </aside>
          <a className="journey-project journey-frame-target" href="#project">
            <p className="pixel-kicker">PROJECT / LEVEL SELECT</p>
            <img
              src="./assets/week05/programming-dream.png"
              alt="Programming Dream starting interface, a computer floating on a dreamlike sea"
            />
            <h2>Programming Dream</h2>
            <p>A digital living system, learning to inhabit a dream.</p>
            <span>ENTER PROJECT</span>
          </a>
          <div className="j-work-divider divider-after" aria-hidden="true">
            <i></i>
            <span>NEXT PORTAL · STILL DREAMING</span>
            <i></i>
          </div>
        </div>
      </div>
      <button
        id="journeyLocate"
        className="journey-locate"
        type="button"
        hidden={true}
        aria-label="Locate the Visual Journey works"
      >
        <span aria-hidden="true">✿</span> Locate
      </button>
    </section>
  );
}

// Existing page content; interactive regions are owned by src/runtime.
export default function SecretPage() {
  return (
    <section id="secret" className="view secret-view" hidden={true}>
      <a href="#home" className="back-link secret-default-home">
        ← RETURN TO MAP
      </a>
      <div id="surpriseRoom" className="secret-room note-room" hidden={true}>
        <div className="secret-window">
          <div className="window-title">LEFT FLAG / SURPRISE_NOTE.EXE</div>
          <button
            id="noteEnvelope"
            className="pixel-envelope"
            aria-expanded="false"
          >
            <span>✦</span>
            <b>OPEN ME</b>
          </button>
          <article
            id="surpriseNote"
            className="surprise-note"
            aria-live="polite"
          >
            <p id="noteText"></p>
            <button id="anotherNote" className="pixel-key">
              ANOTHER NOTE ↻
            </button>
          </article>
        </div>
      </div>
      <div
        id="gameRoom"
        className="secret-room game-room pixel-world-room"
        hidden={true}
      >
        <iframe
          id="pixelWorldFrame"
          className="pixel-world-frame"
          data-src="./pixel-world/index.html"
          title="Pixel World trackpad explorer"
        ></iframe>
        <a href="#home" className="journey-locate pixel-world-home">
          <span aria-hidden="true">⌂</span> Home
        </a>
        <div hidden={true} aria-hidden="true">
          <canvas id="miniGame" width="1" height="1"></canvas>
          <span id="gameScore"></span>
          <button id="restartGame" type="button"></button>
        </div>
      </div>
    </section>
  );
}

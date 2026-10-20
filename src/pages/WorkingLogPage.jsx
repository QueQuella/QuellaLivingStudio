// Existing page content; interactive regions are owned by src/runtime.
export default function WorkingLogPage() {
  return (
    <section id="archive" className="view archive-view" hidden={true}>
      <div className="section-heading">
        <p id="archiveKicker">THE LOST GAME ARCHIVE</p>
        <h1 id="archiveTitle" tabIndex="-1">
          VISUAL JOURNEY
        </h1>
        <span id="archiveHint">SCROLL FREELY · CLICK ANY CARTRIDGE</span>
      </div>
      <a id="archiveNext" className="section-next" href="#log">
        CONTINUE TO WORKING LOG ↗
      </a>
      <div
        id="vhsScene"
        className="vhs-scene"
        aria-label="3D VHS archive. Drag to orbit, click a tape to play."
      >
        <p className="vhs-scene-status">LOADING 3D ARCHIVE…</p>
      </div>
      <div id="vhsDeck" className="vhs-deck" hidden={true} aria-hidden="true">
        <div className="vhs-deck-top">
          <span>QUELLA · MEMORY SYSTEM</span>
          <i>VHS</i>
        </div>
        <div className="vhs-slot">
          <span>INSERT A WORKING LOG TAPE</span>
        </div>
        <div className="vhs-deck-controls">
          <b>● REC</b>
          <span>▰▰ ▶ ▣ ◀</span>
          <em>00:00:00</em>
        </div>
      </div>
      <div
        id="carousel"
        className="carousel"
        aria-roledescription="carousel"
        aria-label="Archive slots"
      >
        <svg id="orbitLines" className="orbit-lines" aria-hidden="true">
          <path id="orbitBack"></path>
          <path id="orbitFront"></path>
        </svg>
        <div id="cardTrack" className="card-track"></div>
      </div>
      <button id="prevCard" className="arrow prev" aria-label="Previous slot">
        ◀
      </button>
      <button id="nextCard" className="arrow next" aria-label="Next slot">
        ▶
      </button>
      <canvas
        id="timeline"
        role="slider"
        tabIndex="0"
        aria-label="Archive time ruler; drag to scrub, use left and right arrows to move"
        aria-valuemin="1"
        aria-valuemax="24"
        aria-valuenow="1"
        hidden={true}
      ></canvas>
      <div id="staticTip" className="static-tip" aria-hidden="true">
        RUB ME FOR A TINY STATIC SPARK! ⚡
      </div>
      <div
        id="timelineTicks"
        className="timeline-ticks"
        aria-label="Choose a dated note"
        hidden={true}
      ></div>
      <div className="archive-meta">
        <span id="slotNumber"></span>
        <div className="summary-line">
          <svg id="summaryArrow" width="52" height="40" aria-hidden="true">
            <path
              d="M4 1 V29 H46 M38 21 L46 29 L38 37"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="3 4"
            ></path>
          </svg>
          <h2 id="slotSummary"></h2>
        </div>
        <p id="slotInfo"></p>
      </div>
      <div className="archive-actions">
        <p>DRAG / TRACKPAD · ← →</p>
        <button id="openSlot" className="pixel-key">
          OPEN FILE ↵
        </button>
      </div>
    </section>
  );
}

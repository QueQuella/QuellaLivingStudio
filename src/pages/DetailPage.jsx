// Existing page content; interactive regions are owned by src/runtime.
export default function DetailPage() {
  return (
    <section id="detail" className="view detail-view" hidden={true}>
      <button id="backArchive" className="back-link">
        ← RETURN TO ARCHIVE
      </button>
      <a id="detailNext" className="section-next" href="#about">
        MEET QUELLA ↗
      </a>
      <div className="detail-scroll" id="detailScroll">
        <header className="detail-header">
          <p id="detailKicker"></p>
          <h1 id="detailTitle" tabIndex="-1"></h1>
          <span id="detailHint">SCROLL TO EXPLORE ↓</span>
        </header>
        <div id="detailSections"></div>
      </div>
      <canvas
        id="logMascot"
        className="log-mascot"
        aria-hidden="true"
        hidden={true}
      ></canvas>
      <svg className="data-strip" id="dataStrip" aria-hidden="true">
        <path id="stripShadow"></path>
        <path id="stripPath"></path>
      </svg>
    </section>
  );
}

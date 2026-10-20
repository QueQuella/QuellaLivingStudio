// Existing page content; interactive regions are owned by src/runtime.
export default function HomePage() {
  return (
    <section
      id="home"
      className="view home-view"
      aria-label="Primary exploration map"
    >
      <div className="map-caption">
        <h1>GENERATIVE AI WORKFLOW FOR MEDIA ART</h1>
        <p>Quella · Personal Living Studio</p>
      </div>
      <canvas
        id="world"
        aria-label="Click a building to walk to its entrance. Drag or scroll sideways to explore. Arrow keys or WASD also move the character."
      ></canvas>
      <div id="mapTargets" className="map-targets"></div>
      <button
        id="gateEnter"
        className="pixel-key gate-enter"
        aria-label="Walk to and enter Visual Journey"
      >
        ENTER ↵
      </button>
      <button
        className="edge-pan left"
        id="panLeft"
        aria-label="Explore left edge"
      >
        ◀<span>EXPLORE</span>
      </button>
      <button
        className="edge-pan right"
        id="panRight"
        aria-label="Explore right edge"
      >
        ▶<span>EXPLORE</span>
      </button>
      <footer className="map-footer">
        <span>
          CLICK TO WALK · DRAG TO EXPLORE{" "}
          <span className="desktop-hint">· WASD / ARROWS</span>
        </span>
        <span id="mapStatus" role="status">
          CHOOSE A DESTINATION
        </span>
      </footer>
    </section>
  );
}

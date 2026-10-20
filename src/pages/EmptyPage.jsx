// Existing page content; interactive regions are owned by src/runtime.
export default function EmptyPage() {
  return (
    <section id="empty" className="view empty-view" hidden={true}>
      <p id="emptyKicker">UNFILLED SPACE</p>
      <h1 id="emptyTitle" tabIndex="-1"></h1>
      <div
        className="empty-content"
        aria-label="Content intentionally left empty"
      ></div>
      <a href="#home" className="back-link">
        ← RETURN TO MAP
      </a>
      <a href="#idea" id="projectNext" className="section-next" hidden={true}>
        EXPLORE IDEA PRESENTATION ↗
      </a>
    </section>
  );
}

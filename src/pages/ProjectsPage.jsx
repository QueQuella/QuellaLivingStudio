// Existing page content; interactive regions are owned by src/runtime.
export default function ProjectsPage() {
  return (
    <section
      id="projectLevels"
      className="view project-levels"
      hidden={true}
      aria-labelledby="projectTitle"
    >
      <header>
        <p>PROJECT / ARCHIVE</p>
        <h1 id="projectTitle">Projects</h1>
        <p>Experiments in digital worlds, interaction, and imagination.</p>
      </header>
      <div className="project-posts">
        <a
          className="project-post"
          href="#programming-dream"
          aria-label="Explore Programming Dream project"
        >
          <div className="project-post-image">
            <img
              src="./assets/programming-dream/scene-reference.webp"
              alt="A computer floating above the dreamlike sea"
            />
            <span className="project-post-image-cue" aria-hidden="true">
              ENTER WORLD ↗
            </span>
          </div>
          <div className="project-post-content">
            <span className="project-post-meta">
              QUELLA <span aria-hidden="true">·</span> 2026{" "}
              <span aria-hidden="true">·</span> INTERACTIVE ART
            </span>
            <h2>Programming Dream</h2>
            <p>
              What if a drawing could come alive? Enter a dreamlike digital
              ocean where human imagination meets machine interpretation, and
              abstract patterns become creatures.
            </p>
            <span className="project-post-category">
              3D WORLD / AI / WORK IN PROGRESS
            </span>
            <span className="project-post-open" aria-hidden="true">
              EXPLORE PROJECT <b>↗</b>
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}

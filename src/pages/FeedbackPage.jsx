// Existing page content; interactive regions are owned by src/runtime.
export default function FeedbackPage() {
  return (
    <section
      id="feedback"
      className="view feedback-view"
      hidden={true}
      aria-labelledby="feedbackTitle"
    >
      <canvas id="feedbackStars" aria-hidden="true"></canvas>
      <div className="feedback-desktop">
        <div className="desktop-bar">
          <span>QUELLA FEEDBACK ROOM 2000</span>
          <div>
            <i></i>
            <i></i>
            <i></i>
          </div>
        </div>
        <aside className="avatar-console">
          <div className="avatar-poster animated-avatar">
            <img
              className="avatar-open"
              src="./assets/quella-retro-avatar.png"
              alt="Quella's retro anime-style digital garden avatar"
            />
            <img
              className="avatar-wink"
              src="./assets/quella-retro-avatar-wink.png"
              alt=""
            />
            <img
              className="avatar-kiss"
              src="./assets/quella-retro-avatar-kiss.png"
              alt=""
            />
            <span className="kiss-hearts" aria-hidden="true">
              <i>♥</i>
              <i>♥</i>
              <i>♥</i>
            </span>
          </div>
          <div className="avatar-stats">
            <strong>QUELLA</strong>
            <span>ONLINE · DIGITAL GARDEN KEEPER</span>
            <a href="#about">VISIT MY ABOUT PAGE ↗</a>
          </div>
          <div className="buddy-status">✦ waiting for a message…</div>
        </aside>
        <section className="chat-console">
          <header>
            <div>
              <p>FEEDBACK.EXE</p>
              <h1 id="feedbackTitle" tabIndex="-1">
                Leave a message
              </h1>
            </div>
            <span id="feedbackConnection">PERSONAL NOTES · THIS BROWSER</span>
          </header>
          <div id="feedbackList" className="feedback-list" aria-live="polite">
            <p className="feedback-loading">Opening the message archive…</p>
          </div>
          <form id="feedbackForm" className="feedback-form">
            <label>
              SCREEN NAME
              <input
                id="feedbackName"
                name="name"
                maxLength="40"
                autoComplete="nickname"
                required={true}
                placeholder="Your name"
              />
            </label>
            <label>
              MESSAGE
              <textarea
                id="feedbackMessage"
                name="message"
                maxLength="1200"
                required={true}
                placeholder="Type your feedback here…"
              ></textarea>
            </label>
            <div className="feedback-form-row">
              <span id="feedbackStatus" role="status">
                SAVED ONLY IN THIS BROWSER
              </span>
              <button className="pixel-key" type="submit">
                SAVE NOTE ↵
              </button>
            </div>
          </form>
        </section>
      </div>
      <a href="#home" className="feedback-home">
        ← RETURN TO MAP
      </a>
    </section>
  );
}

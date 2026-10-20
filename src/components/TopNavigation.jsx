export default function TopNavigation() {
  return (
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Return to exploration map">
        ✦ QUELLA.OS
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="#visual">VISUAL JOURNEY</a>
        <a href="#project">PROJECT</a>
        <a href="#log">WORKING LOG</a>
        <a href="#idea">IDEA PRESENTATION</a>
      </nav>
      <div className="right-nav">
        <a href="#feedback">FEEDBACK</a>
        <a href="#about">ABOUT</a>
      </div>
    </header>
  );
}

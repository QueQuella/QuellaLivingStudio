export default function JourneyReferenceFrame({ number, title, subtitle, entries }) {
  return (
    <section id={`journeyCollection${number}`} className={`journey-ref-frame journey-ref-${number} journey-frame-target`} aria-labelledby={`journey${number}Title`}>
      <div className="ref-corner ref-tl" aria-hidden="true">{number}</div>
      <div className="ref-corner ref-tr" aria-hidden="true">{number === "04" ? "FX" : "RF"}</div>
      <div className="ref-corner ref-bl" aria-hidden="true">▶</div>
      <div className="ref-corner ref-br" aria-hidden="true">✦</div>
      <header className="ref-frame-head">
        <p>VISUAL JOURNEY {number}</p>
        <h2 id={`journey${number}Title`}>{title}</h2>
        <span>{subtitle}</span>
      </header>
      {entries.map((entry, index) => (
        <div key={entry.title}>
          {index > 0 && <div className="ref-divider" aria-hidden="true"><i></i><span>✦ SIGNAL {String(index + 1).padStart(2, "0")}</span><i></i></div>}
          <article className="journey-ref-row">
            <div className="ref-media">
              <span className="ref-fallback" aria-hidden="true">{entry.signal}</span>
              <img src={entry.image} alt={entry.alt} loading="lazy" />
            </div>
            <div className="ref-copy">
              <a href={entry.source} target="_blank" rel="noopener noreferrer">OPEN WORK / SOURCE ↗</a>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <p className="ref-learn">Learn: {entry.learn}</p>
              <small className="ref-credit">{entry.credit}</small>
            </div>
          </article>
        </div>
      ))}
      <footer className="ref-frame-foot"><span>END OF JOURNEY {number}</span><i></i><b>{number === "04" ? "CONTINUE ↓" : "ARCHIVE SAVED ✦"}</b></footer>
    </section>
  );
}

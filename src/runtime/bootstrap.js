// The existing engines own canvas/WebGL state and their DOM islands.
// Boot once, after React has mounted every page. Never attach duplicate listeners.
let bootPromise;
function loadDiagramLibrary() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = new URL(
      `${import.meta.env.BASE_URL}vendor/mermaid.min.js`,
      document.baseURI,
    ).href;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Could not load diagram library."));
    document.head.append(script);
  });
}
export function bootStudio() {
  return (bootPromise ??= (async () => {
    await loadDiagramLibrary();
    await import("./engine.js");
    await import("../data/notes.js");
    await import("../data/entries.js");
    await import("../data/week05-entry.js");
    await import("../data/week06-entry.js");
    await import("./expansion.js");
    await import("./journey.js");
    await import("./script.js");
    await import("./vhs-scene.js");
    await import("./programming-dream.js");
    document.documentElement.dataset.studioReady = "true";
  })());
}

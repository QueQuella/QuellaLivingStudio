import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/style.css";
import "./styles/journey.css";
import "./styles/expansion.css";
import "./styles/programming-dream.css";

// StrictMode is deliberately omitted while the legacy engines own global listeners.
createRoot(document.getElementById("root")).render(<App />);

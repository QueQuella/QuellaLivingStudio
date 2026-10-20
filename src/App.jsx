import { useEffect } from "react";
import TopNavigation from "./components/TopNavigation.jsx";
import ScreenEffects from "./components/ScreenEffects.jsx";
import { bootStudio } from "./runtime/bootstrap.js";
import HomePage from "./pages/HomePage.jsx";
import VisualJourneyPage from "./pages/VisualJourneyPage.jsx";
import WorkingLogPage from "./pages/WorkingLogPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import IdeaPresentationPage from "./pages/IdeaPresentationPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ProgrammingDreamPage from "./pages/ProgrammingDreamPage.jsx";
import EmptyPage from "./pages/EmptyPage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import SecretPage from "./pages/SecretPage.jsx";

// Render static page shells once. The preserved engines manage their interactive
// subtrees; don't add React state to those same DOM regions without migrating them.
export default function App() {
  useEffect(() => {
    bootStudio().catch((error) => {
      console.error(error);
      const notice = document.createElement("p");
      notice.setAttribute("role", "alert");
      notice.className = "startup-error";
      notice.textContent =
        "The studio could not start. Please refresh the page.";
      document.body.append(notice);
    });
  }, []);
  return (
    <>
      <TopNavigation />
      <main id="app">
        <HomePage />
        <VisualJourneyPage />
        <WorkingLogPage />
        <DetailPage />
        <IdeaPresentationPage />
        <ProjectsPage />
        <ProgrammingDreamPage />
        <EmptyPage />
        <FeedbackPage />
        <AboutPage />
        <SecretPage />
      </main>
      <ScreenEffects />
    </>
  );
}

import { useEffect, useState } from "react";
import "../css/About.css";

export default function About() {
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setShowAbout(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="about-container">
      <button
        type="button"
        className="about-trigger"
        onClick={() => setShowAbout((previous) => !previous)}
        aria-expanded={showAbout}
        aria-controls="about-panel"
      >
        <span className="about-button" aria-hidden="true">
          {showAbout ? "×" : "i"}
        </span>
        <span className="about-label">אודות</span>
      </button>

      <aside
        id="about-panel"
        className={`about-panel ${showAbout ? "about-panel--visible" : "about-panel--hidden"}`}
        aria-hidden={!showAbout}
      >
        <h3 className="about-item">מפתחות האתר:</h3>
        <p className="about-item">סמל גילי נחום</p>
        <p className="about-item">סמל מאיה מרום</p>

        <h3 className="about-item">רמ״ד טי״ל:</h3>
        <p className="about-item">סמ״ר קטיה מדבדב</p>

        <h3 className="about-item">גרסה:</h3>
        <p className="about-item">ספטמבר 2026</p>
      </aside>
    </div>
  );
}

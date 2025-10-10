import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import './StartupModal.css';

const StartupModal = ({ onStartupComplete }) => {
  const [hoveredMode, setHoveredMode] = useState("default");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [backendReady, setBackendReady] = useState(false);
  const [closing, setClosing] = useState(false);

  const descriptions = {
    default: "Please choose a simulation mode to begin:",
    cpu: "Run simulation using CPU — slower but works on most devices.",
    gpu: "Run simulation using GPU — faster, but requires compatible hardware and more disk space.",
  };

  const handleSelect = async (mode) => {
    if (loading) return; // Prevent double clicks
    setLoading(true);
    setError(null);
    setStatusMessage(`Launching ${mode.toUpperCase()} backend...`);
    await new Promise((r) => setTimeout(r, 0)); // Let React repaint spinner before blocking
    try {
      const result = await invoke("start_backend_shell", { mode });

      if (result?.status === "ok") {
        setStatusMessage("All good to go 👍");
        setBackendReady(true);
        // Wait briefly before closing modal
        setTimeout(() => {
          setClosing(true);
          setTimeout(() => {
            if (typeof onStartupComplete === 'function') {
              onStartupComplete(mode);
            } else {
              console.warn("onStartupComplete is not defined");
            }
          }, 300); // Match fade-out duration in CSS
        }, 1000);
      } else {
        setError(result?.message || "Unknown error occurred.");
        setStatusMessage("");
        setLoading(false);
      }
    } catch (err) {
      setError(err?.message || "Backend failed to start.");
      setStatusMessage("");
      setLoading(false);
    }
  };

  return (
    <div className={`startup-modal-overlay${closing ? " closing" : ""}`}>
      <div className={`startup-modal-box${closing ? " closing" : ""}`}>
        <h2 className="startup-modal-title">Simulation Mode</h2>

        <p className="startup-modal-subtitle startup-description">
          {descriptions[hoveredMode]}
        </p>

        <div className="startup-modal-buttons">
          <button
            className="startup-button cpu"
            onClick={() => handleSelect("cpu")}
            onMouseEnter={() => setHoveredMode("cpu")}
            onMouseLeave={() => setHoveredMode("default")}
            disabled={loading}
          >
            ⚙️ CPU Mode
          </button>
          <button
            className="startup-button gpu"
            onClick={() => handleSelect("gpu")}
            onMouseEnter={() => setHoveredMode("gpu")}
            onMouseLeave={() => setHoveredMode("default")}
            disabled={loading}
          >
            🚀 GPU Mode
          </button>
        </div>

        <div className="startup-modal-status-wrapper">
          <div className="startup-status">
            {loading ? (
              <div className="startup-spinner" aria-hidden="true" />
            ) : (
              backendReady && <div className="startup-status-text">{statusMessage}</div>
            )}
          </div>
        </div>

        {error && (
          <div className="startup-error">
            <p>⚠️ {error}</p>
            <button onClick={() => setError(null)} disabled={loading}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupModal;
import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { resourceDir } from "@tauri-apps/api/path";
import './StartupModal.css';

const appendDebug = (msg) => {
  const el = document.getElementById("startup-debug-log");
  if (el) {
    el.textContent += `\n${msg}`;
    el.scrollTop = el.scrollHeight; // auto-scroll to bottom
  }
};

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
      const resourceDirPath = await resourceDir(); // Get path to resource directory
      console.log("📁 resourceDirPath:", resourceDirPath);
      appendDebug(`📁 resourceDirPath: ${resourceDirPath}`);
      console.log("🧠 Invoking backend with:", { mode, resourceDirPath });
      appendDebug(`🧠 Invoking backend with: mode=${mode}, resourceDirPath=${resourceDirPath}`);

      const result = await invoke("start_backend_shell", {
        mode,
        resourceDirPath, // Pass required second argument
      });

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
      setError(`Backend failed to start: ${err?.message || err || "unknown error"}`);
      console.error("❌ Error launching backend:", err);
      appendDebug(`❌ Error launching backend: ${err?.message || err || "unknown error"}`);
      console.log("🛑 Full error object:", err);
      appendDebug(`🛑 Full error object: ${JSON.stringify(err)}`);
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
        <div className="startup-debug-log-wrapper">
          <h4 style={{ marginBottom: "0.25rem" }}>🔍 Debug Log:</h4>
          <pre id="startup-debug-log" style={{
            backgroundColor: "#111",
            color: "#0f0",
            padding: "0.5rem",
            maxHeight: "150px",
            overflowY: "auto",
            fontSize: "0.75rem",
            borderRadius: "4px"
          }}></pre>
        </div>
      </div>
    </div>
  );
};

export default StartupModal;
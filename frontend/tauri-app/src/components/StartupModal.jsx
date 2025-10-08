import React, { useState } from "react";
import './StartupModal.css';

const StartupModal = ({ onSelect }) => {
  const [hoveredMode, setHoveredMode] = useState("default");

  const descriptions = {
    default: "Please choose a simulation mode to begin:",
    cpu: "Run simulation using CPU — slower but works on most devices.",
    gpu: "Run simulation using GPU — faster, but requires compatible hardware and more disk space.",
  };

  return (
    <div className="startup-modal-overlay">
      <div className="startup-modal-box">
        <h2 className="startup-modal-title">Simulation Mode</h2>
        <p className="startup-modal-subtitle startup-description">
          {descriptions[hoveredMode]}
        </p>
        <div className="startup-modal-buttons">
          <button
            className="startup-button cpu"
            onClick={() => onSelect("cpu")}
            onMouseEnter={() => setHoveredMode("cpu")}
            onMouseLeave={() => setHoveredMode("default")}
          >
            ⚙️ CPU Mode
          </button>
          <button
            className="startup-button gpu"
            onClick={() => onSelect("gpu")}
            onMouseEnter={() => setHoveredMode("gpu")}
            onMouseLeave={() => setHoveredMode("default")}
          >
            🚀 GPU Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartupModal;
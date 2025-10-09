// VisitorPage.jsx

import React, { useState, useRef, useEffect } from "react";
import Navbar8 from "../components/navbar8";
import "./visitor-page.css";

const VisitorPage = () => {
  const SIMS = [
    { id: 1, label: "Sim 1" },
    { id: 2, label: "Sim 2" },
    { id: 3, label: "Sim 3" },
  ];

  const MODES = [
    { id: "single", label: "Single Frame" },
    { id: "frame", label: "Frame by Frame" },
    { id: "side", label: "Side by Side" },
  ];

  const [activeSim, setActiveSim] = useState(1);
  const [activeMode, setActiveMode] = useState("single");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef(null);

  const getUrl = (simId, modeId) => {
    const pad2 = (n) => String(n).padStart(2, "0");
    if (modeId === "single") {
      return `http://127.0.0.1:8000/assets/gifs/GNN_${simId}.gif`;
    }
    if (modeId === "frame") {
      return `http://127.0.0.1:8000/assets/videos/GNN_${pad2(simId)}.mp4`;
    }
    return `http://127.0.0.1:8000/assets/videos/rollout_${simId}.mp4`;
  };

  useEffect(() => {
    if (activeMode === "single") return;
    const video = videoRef.current;
    if (!video) return;
    const update = () => setCurrentTime(video.currentTime || 0);
    video.addEventListener("timeupdate", update);
    return () => video.removeEventListener("timeupdate", update);
  }, [activeMode, activeSim]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [activeSim, activeMode]);

  const previewUrl = getUrl(activeSim, activeMode);
  const isVideo = activeMode !== "single";

  return (
    <div className="visitor-page">
      <Navbar8 />

      <div className="visitor-overlay">
        <div className="visitor-grid">
          <aside className="sidebar">
            <div className="sidebar-title">SIMULATIONS</div>
            {SIMS.map((s) => (
              <button
                key={s.id}
                className={`tag ${activeSim === s.id ? "active" : ""}`}
                onClick={() => setActiveSim(s.id)}
              >
                {s.label}
              </button>
            ))}
          </aside>

          <main className="main">
            <div className="header">
              <div>
                <h1 className="visitor-title">Visitor</h1>
                <p className="visitor-subtitle">Browse pre-rendered simulations</p>
              </div>
            </div>

            <div className="mode-bar">
              <div className="mode-row">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    className={`mode-btn ${activeMode === m.id ? "active" : ""}`}
                    onClick={() => setActiveMode(m.id)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="preview-box">
              {!isVideo && (
                <div className="media-wrap">
                  <img className="gif-img" src={previewUrl} alt="Simulation preview" />
                </div>
              )}

              {isVideo && (
                <div className="media-wrap">
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    className="video"
                    preload="metadata"
                    onLoadedMetadata={() => {
                      const v = videoRef.current;
                      setDuration((v && v.duration) || 0);
                    }}
                  />
                  <input
                    type="range"
                    className="frame-slider"
                    min="0"
                    max={duration || 0}
                    step="0.04"
                    value={currentTime}
                    onChange={(e) => {
                      const t = Number(e.target.value);
                      setCurrentTime(t);
                      if (videoRef.current) videoRef.current.currentTime = t;
                    }}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default VisitorPage;

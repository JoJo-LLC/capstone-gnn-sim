import React, { useState, useRef, useEffect } from "react";
import Navbar8 from "../components/navbar8";
import "./visitor-page.css";

const VisitorPage = () => {
  const ITEMS = [
    { id: 1, label: "Single Frame", type: "gif", url: "http://127.0.0.1:8000/assets/gifs/GNN_01.gif" },
    { id: 2, label: "Frame by Frame", type: "video", url: "http://127.0.0.1:8000/assets/videos/GNN_01.mp4" },
    { id: 3, label: "Side by Side", type: "video", url: "http://127.0.0.1:8000/assets/videos/rollout_2.mp4" }
  ];

  const [active, setActive] = useState(ITEMS[0]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef(null);

  // keep slider synced with video playback
  useEffect(() => {
    if (active.type !== "video") return;

    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    video.addEventListener("timeupdate", updateTime);
    return () => video.removeEventListener("timeupdate", updateTime);
  }, [active]);

  return (
    <div className="visitor-page">
      <Navbar8 />

      <div className="visitor-overlay">
        <h1 className="visitor-title">👋 Welcome, Visitor!</h1>
        <p className="visitor-subtitle">Explore our example simulations below</p>

        {/* Buttons */}
        <div className="visitor-buttons">
          {ITEMS.map(item => (
            <button
              key={item.id}
              className={`btn ${active.id === item.id ? "active" : ""}`}
              onClick={() => {
                setActive(item);
                setCurrentTime(0);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Preview Area */}
        <div className="visitor-preview-container">
          <div className="preview-box">
            {active.type === "gif" && (
              <img src={active.url} alt="Selected GIF" className="gif-img" />
            )}

            {active.type === "video" && (
              <div className="frame-by-frame">
                <video
                  ref={videoRef}
                  src={active.url}
                  className="gif-img"
                  onLoadedMetadata={() => setDuration(videoRef.current.duration)}
                />
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.04"   // ~25fps
                  value={currentTime}
                  onChange={(e) => {
                    const t = Number(e.target.value);
                    setCurrentTime(t);
                    videoRef.current.currentTime = t;
                  }}
                  className="frame-slider"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorPage;

// VisitorPage.jsx — keep structure but styled like Admin/Research; three stacked sections

import React, { useState, useRef, useEffect } from "react";
import Navbar8 from "../components/navbar8";
import Footer4 from "../components/footer4";   // ✅ footer
import "./visitor-page.css";

const MODES = [
  { id: "single", label: "Gif" },
  { id: "frame",  label: "MP4 Slider" },
  { id: "side",   label: "GNN VS Ls-Dyna" },
];

const mediaUrl = (simId, modeId) => {
  const pad2 = (n) => String(n).padStart(2, "0");
  if (modeId === "single") return `http://127.0.0.1:8000/assets/gifs/GNN_${simId}.gif`;
  if (modeId === "frame")  return `http://127.0.0.1:8000/assets/videos/GNN_${pad2(simId)}.mp4`;
  return `http://127.0.0.1:8000/assets/videos/rollout_${simId}.mp4`;
};

function SimulationSection({ simId, title }) {
  const [mode, setMode] = useState("single");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);

  const src = mediaUrl(simId, mode);
  const isVideo = mode !== "single";

  useEffect(() => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime || 0);
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [isVideo, src]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [mode, simId]);

  return (
    <section className="section">
      
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <p className="section-sub">Pre-rendered media</p>
      </div>

      <div className="mode-bar">
        <div className="mode-row">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`mode-btn ${mode === m.id ? "active" : ""}`}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="preview">
        {!isVideo ? (
          <div className="media">
            <img className="img" src={src} alt={`${title} preview`} />
          </div>
        ) : (
          <div className="media">
            <video
              ref={videoRef}
              src={src}
              className="video"
              preload="metadata"
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            />
            <input
              type="range"
              className="slider"
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
    </section>
  );
}

export default function VisitorPage(){
  return (
    <div className="visitor-page">
      <Navbar8 />
      <div className="page-wrap">
        <SimulationSection simId={1} title="Copper Bar Crash Test" />
        <SimulationSection simId={2} title="Concrete Centre Explosion" />
        <SimulationSection simId={3} title="Steel Beam Bending Test" />
      </div>

      {/* ✅ Footer at bottom */}
      <Footer4
        link1="About Us"
        link2="Contact Us"
        link3="FAQs"
        link4="Support"
        link5="Blog"
        termsLink="Terms of Service"
        cookiesLink="Cookies Policy"
        privacyLink="Privacy Policy"
        logoSrc="https://images.unsplash.com/photo-1521058001910-55b77aba2203"
      />
    </div>
  );
}

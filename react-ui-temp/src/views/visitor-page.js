import React, { useState } from "react";
import Navbar8 from "../components/navbar8";   // ✅ navbar added
import "./visitor-page.css";

const VisitorPage = () => {
  const GIFS = [
    { id: 1, label: "Single Frame", url: "http://127.0.0.1:8000/assets/gifs/GNN_1.gif" },
    { id: 2, label: "Frame by Frame", url: "http://127.0.0.1:8000/assets/gifs/Hello.gif" },
    { id: 3, label: "Side by side", url: "http://127.0.0.1:8000/assets/gifs/rollout_2.gif" }
  ];

  const [active, setActive] = useState(GIFS[0].url);

  return (
    <div className="visitor-page">
      {/* ✅ Navbar at the top */}
      <Navbar8 />

      <div className="visitor-overlay">
        <h1 className="visitor-title">👋 Welcome, Visitor!</h1>
        <p className="visitor-subtitle">Explore our example simulations below</p>

        {/* Render one button per GIF */}
        <div className="visitor-buttons">
          {GIFS.map(g => (
            <button
              key={g.id}
              className={`btn ${active === g.url ? "active" : ""}`}
              onClick={() => setActive(g.url)}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Show currently active GIF */}
        <div className="visitor-preview-container">
          <div className="preview-box">
            <img src={active} alt="Selected GIF" className="gif-img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorPage;

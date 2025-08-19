import React, { useState } from 'react';
import './visitor-page.css';

const VisitorPage = () => {
  const [view, setView] = useState('single');

  return (
    <div className="visitor-page">
      <div className="visitor-overlay">
        <h1 className="visitor-title">👋 Welcome, Visitor!</h1>
        <p className="visitor-subtitle">Explore our example simulations below</p>

        <div className="visitor-buttons">
          <button onClick={() => setView('single')}>Single Frame</button>
          <button onClick={() => setView('slider')}>Frame-by-Frame</button>
          <button onClick={() => setView('side')}>Side-by-Side</button>
        </div>

        <div className="visitor-preview-container">
          {view === 'single' && <div className="preview-box">🖼️ Single Frame Preview Placeholder</div>}
          {view === 'slider' && <div className="preview-box">🎞️ Frame-by-Frame Slider Placeholder</div>}
          {view === 'side' && <div className="preview-box">📸 Side-by-Side Comparison Placeholder</div>}
        </div>
      </div>
    </div>
  );
};

export default VisitorPage;

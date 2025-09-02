import React, { useState } from 'react'
import './view-mode-selector.css'

const ViewModeSelector = () => {
  const [mode, setMode] = useState('single-frame')

  return (
    <div className="view-mode-selector-container">
      <label className="thq-heading-3">Visualization Mode</label>
      <div className="view-mode-toggle-buttons">
        <button
          className={mode === 'single-frame' ? 'active' : ''}
          onClick={() => setMode('single-frame')}
        >
          Single Frame
        </button>
        <button
          className={mode === 'frame-by-frame' ? 'active' : ''}
          onClick={() => setMode('frame-by-frame')}
        >
          Frame-by-Frame
        </button>
        <button
          className={mode === 'side-by-side' ? 'active' : ''}
          onClick={() => setMode('side-by-side')}
        >
          Side-by-Side
        </button>
      </div>
    </div>
  )
}

export default ViewModeSelector
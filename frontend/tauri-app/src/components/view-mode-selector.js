// view-mode-selector.jsx
import React from 'react'
import './view-mode-selector.css'

const ViewModeSelector = ({ value, onChange }) => {
  return (
    <div className="view-mode-selector-container">
      <label className="thq-heading-3">Visualisation Mode</label>
      <div className="view-mode-toggle-buttons">
        <button
          className={value === 'single-frame' ? 'active' : ''}
          onClick={() => onChange('single-frame')}
        >
          Single Frame
        </button>
        <button
          className={value === 'frame-by-frame' ? 'active' : ''}
          onClick={() => onChange('frame-by-frame')}
        >
          Frame-by-Frame
        </button>
        <button
          className={value === 'side-by-side' ? 'active' : ''}
          onClick={() => onChange('side-by-side')}
        >
          Side-by-Side
        </button>
      </div>
    </div>
  )
}

export default ViewModeSelector

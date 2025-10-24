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
          EPS
        </button>
        <button
          className={value === 'frame-by-frame' ? 'active' : ''}
          onClick={() => onChange('frame-by-frame')}
        >
          EPS Frame-by-Frame
        </button>
        <button
          className={value === 'fragment' ? 'active' : ''}
          onClick={() => onChange('fragment')}
        >
          Fragment View
        </button>
      </div>
    </div>
  )
}

export default ViewModeSelector

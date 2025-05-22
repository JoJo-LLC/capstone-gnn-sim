import React, { useState } from 'react'
import './view-mode-selector.css'

const ViewModeSelector = () => {
  const [mode, setMode] = useState('single-frame')

  const handleChange = (event) => {
    setMode(event.target.value)
  }

  return (
    <div className="view-mode-selector-container">
      <label className="thq-heading-3">Visualization Mode</label>
      <select className="thq-select" value={mode} onChange={handleChange}>
        <option value="single-frame">Single Frame</option>
        <option value="frame-by-frame">Frame-by-Frame</option>
        <option value="side-by-side">Side-by-Side</option>
      </select>
    </div>
  )
}

export default ViewModeSelector
import React, { useState } from 'react'
import './execution-toggle.css'

const ExecutionToggle = () => {
  const [mode, setMode] = useState('cpu')

  const handleChange = (event) => {
    setMode(event.target.value)
  }

  return (
    <div className="execution-toggle-container">
      <label className="thq-heading-3">Execution Mode</label>
      <div className="execution-toggle-options">
        <label className="thq-body-large">
          <input
            type="radio"
            value="cpu"
            checked={mode === 'cpu'}
            onChange={handleChange}
          />
          CPU
        </label>
        <label className="thq-body-large">
          <input
            type="radio"
            value="gpu"
            checked={mode === 'gpu'}
            onChange={handleChange}
          />
          GPU
        </label>
      </div>
    </div>
  )
}

export default ExecutionToggle
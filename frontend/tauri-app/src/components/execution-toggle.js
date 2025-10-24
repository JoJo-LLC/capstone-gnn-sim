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
      <div className="researcher-toggle-buttons">
        <button
          className={mode === 'cpu' ? 'active' : ''}
          onClick={() => setMode('cpu')}
        >
          CPU
        </button>
        <button
          className={mode === 'gpu' ? 'active' : ''}
          onClick={() => setMode('gpu')}
        >
          GPU
        </button>
      </div>
    </div>
  )
}

export default ExecutionToggle
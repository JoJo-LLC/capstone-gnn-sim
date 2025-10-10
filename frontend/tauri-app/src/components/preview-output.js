import React from 'react'
import './preview-output.css'

const PreviewOutput = ({ previewUrl, isInferenceRunning, progress }) => {
  const { percentage = 0, current = 0, total = 0 } = progress || {}

  // Determine phase based on progress
  const getPhaseText = () => {
    if (percentage <= 5 && current === 0) {
      return 'Initialisation... (5%)'
    } else if (current > 0 && current < total) {
      return `Step ${current} of ${total} (${Math.round(percentage)}%)`
    } else if (percentage >= 90 && percentage < 100) {
      return `Post-processing... (${Math.round(percentage)}%)`
    } else if (percentage === 100) {
      return 'Complete! (100%)'
    } else {
      return `${Math.round(percentage)}%`
    }
  }

  return (
    <div className="preview-output-container">
      <label className="thq-heading-3">Result Preview</label>
      <div className="preview-output-box">
        {isInferenceRunning ? (
          <div className="loading-animation">
            <div className="spinner"></div>
            <p className="loading-text">Running FGN Inference...</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {getPhaseText()}
            </p>
          </div>
        ) : previewUrl ? (
          <img src={previewUrl} alt="Simulation Output" className="preview-output-image" />
        ) : (
          <p className="thq-body-small preview-output-placeholder">
            No preview loaded. Run a simulation.
          </p>
        )}
      </div>
    </div>
  )
}

export default PreviewOutput
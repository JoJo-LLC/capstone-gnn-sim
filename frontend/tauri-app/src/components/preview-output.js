import React from 'react'
import './preview-output.css'

const PreviewOutput = ({ previewUrl, isInferenceRunning, progress }) => {
  const { percentage = 0, current = 0, total = 0 } = progress || {}

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
              {current > 0 ? `Step ${current} of ${total} (${Math.round(percentage)}%)` : 'Initializing...'}
            </p>
            <p className="loading-subtext">This may take 70-90 seconds</p>
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
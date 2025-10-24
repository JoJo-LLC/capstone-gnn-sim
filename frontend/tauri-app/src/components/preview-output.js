// preview-output.jsx
import React from 'react'
import './preview-output.css'

const PreviewOutput = ({ gifUrl, mp4Url, fragmentGifUrl, viewMode, isInferenceRunning, progress }) => {
  const { percentage = 0, current = 0, total = 0 } = progress || {}

  const getPhaseText = () => {
    if (percentage <= 5 && current === 0) return 'Initialisation... (5%)'
    if (current > 0 && current < total) return `Step ${current} of ${total} (${Math.round(percentage)}%)`
    if (percentage >= 90 && percentage < 100) return `Post-processing... (${Math.round(percentage)}%)`
    if (percentage === 100) return 'Complete! (100%)'
    return `${Math.round(percentage)}%`
  }

  const renderContent = () => {
    if (isInferenceRunning) {
      return (
        <div className="loading-animation">
          <div className="spinner"></div>
          <p className="loading-text">Running FGN Inference...</p>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
          </div>
          <p className="progress-text">{getPhaseText()}</p>
        </div>
      )
    }

    if (!gifUrl && !mp4Url) {
      return (
        <p className="thq-body-small preview-output-placeholder">
          No preview loaded. Run a simulation.
        </p>
      )
    }

    if (viewMode === 'single-frame') {
      return gifUrl ? (
        <img src={gifUrl} alt="Simulation Output (GIF)" className="preview-output-image" />
      ) : mp4Url ? (
        <video
          key={mp4Url}
          src={mp4Url}
          controls
          loop
          muted
          className="preview-output-image"
        />
      ) : null
    }

    if (viewMode === 'frame-by-frame') {
      return mp4Url ? (
        <video
          key={mp4Url}
          src={mp4Url}
          controls
          loop
          muted
          className="preview-output-image"
        />
      ) : gifUrl ? (
        <img src={gifUrl} alt="Simulation Output (GIF)" className="preview-output-image" />
      ) : null
    }

    if (viewMode === 'fragment') {
      return fragmentGifUrl ? (
        <img src={fragmentGifUrl} alt="Fragment View (GIF)" className="preview-output-image" />
      ) : (
        <p className="thq-body-small preview-output-placeholder">
          No fragment data available. Run FGN inference to generate fragment visualisation.
        </p>
      )
    }

    return null
  }

  return (
    <div className="preview-output-container">
      <label className="thq-heading-3">Result Preview</label>
      <div className="preview-output-box">
        {renderContent()}
      </div>
    </div>
  )
}

export default PreviewOutput

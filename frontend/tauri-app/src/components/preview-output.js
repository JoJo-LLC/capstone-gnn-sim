import React from 'react'
import './preview-output.css'

const PreviewOutput = ({ previewUrl }) => {
  return (
    <div className="preview-output-container">
      <label className="thq-heading-3">Result Preview</label>
      <div className="preview-output-box">
        {previewUrl ? (
          <img src={previewUrl} alt="Simulation Output" className="preview-output-image" />
        ) : (
          <p className="thq-body-small preview-output-placeholder">
            No preview loaded. Run a simulation or upload an output.
          </p>
        )}
      </div>
    </div>
  )
}

export default PreviewOutput
import React from 'react'
import './export-buttons.css'

const ExportButtons = () => {
  const handleExport = (type) => {
    alert(`Export as ${type} is not implemented yet.`)
  }

  return (
    <div className="export-buttons-container">
      <label className="thq-heading-3">Export Options</label>
      <div className="export-buttons-group">
        <button
          className="thq-button-filled export-button"
          onClick={() => handleExport('GIF')}
        >
          Export GIF
        </button>
        <button
          className="thq-button-filled export-button"
          onClick={() => handleExport('MP4')}
        >
          Export MP4
        </button>
        <button
          className="thq-button-filled export-button"
          onClick={() => handleExport('CSV')}
        >
          Export CSV
        </button>
      </div>
    </div>
  )
}

export default ExportButtons

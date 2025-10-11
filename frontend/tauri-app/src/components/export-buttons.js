import React, { useState } from 'react'
import './export-buttons.css'

const ExportButtons = ({ onLogMessage }) => {
  const dataPath = "0.4_6"
  const [downloadingState, setDownloadingState] = useState({
    GIF: false,
    MP4: false,
    CSV: false
  })

  const handleExport = async (type) => {
    let url = ""
    let filename = ""
    let description = ""

    if (type === "GIF") {
      url = `http://localhost:8000/export/${dataPath}/gifs_all`
      filename = `${dataPath}_gifs.zip`
      description = "EPS and Fragment GIFs"
    } else if (type === "MP4") {
      url = `http://localhost:8000/export/${dataPath}/mp4s_all`
      filename = `${dataPath}_mp4s.zip`
      description = "EPS and Fragment MP4s"
    } else if (type === "CSV") {
      url = `http://localhost:8000/export/${dataPath}/csv_all`
      filename = `${dataPath}_csv_files.zip`
      description = "All property CSV files"
    } else {
      return
    }

    // Log start of download
    if (onLogMessage) {
      onLogMessage(`📥 Downloading ${description}...`, 'info')
    }

    // Set button to downloading state
    setDownloadingState(prev => ({ ...prev, [type]: true }))

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to export ${type}: ${res.status}`)

      const blob = await res.blob()
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Log success
      if (onLogMessage) {
        onLogMessage(`✅ Downloaded ${filename} successfully`, 'complete')
      }

      // Keep button in "Downloaded" state for 1 second
      setTimeout(() => {
        setDownloadingState(prev => ({ ...prev, [type]: false }))
      }, 1000)

    } catch (err) {
      console.error(err)

      // Log error
      if (onLogMessage) {
        onLogMessage(`❌ Failed to download ${description}: ${err.message}`, 'error')
      }

      alert(`Error exporting ${type}: ${err.message}`)

      // Reset button state immediately on error
      setDownloadingState(prev => ({ ...prev, [type]: false }))
    }
  }

  return (
    <div className="export-buttons-container">
      <div className="export-buttons-group">
        <button
          className={`thq-button-filled export-button ${downloadingState.GIF ? 'downloaded' : ''}`}
          onClick={() => handleExport('GIF')}
          disabled={downloadingState.GIF}
        >
          {downloadingState.GIF ? 'Downloaded!' : 'Export GIF'}
        </button>
        <button
          className={`thq-button-filled export-button ${downloadingState.MP4 ? 'downloaded' : ''}`}
          onClick={() => handleExport('MP4')}
          disabled={downloadingState.MP4}
        >
          {downloadingState.MP4 ? 'Downloaded!' : 'Export MP4'}
        </button>
        <button
          className={`thq-button-filled export-button ${downloadingState.CSV ? 'downloaded' : ''}`}
          onClick={() => handleExport('CSV')}
          disabled={downloadingState.CSV}
        >
          {downloadingState.CSV ? 'Downloaded!' : 'Export CSV'}
        </button>
      </div>
    </div>
  )
}

export default ExportButtons

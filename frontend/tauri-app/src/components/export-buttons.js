import React from 'react'
import './export-buttons.css'

const ExportButtons = () => {
  const dataPath = "0.4_6"

  const handleExport = async (type) => {
    let url = ""
    let filename = ""

    if (type === "GIF") {
      url = `http://localhost:8000/gallery/${dataPath}/gif`
      filename = `${dataPath}.gif`
    } else if (type === "MP4") {
      url = `http://localhost:8000/gallery/${dataPath}/mp4`
      filename = `${dataPath}.mp4`
    } else if (type === "CSV") {
      url = `http://localhost:8000/export/${dataPath}.csv`
      filename = `${dataPath}.csv`
    } else {
      return
    }

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
    } catch (err) {
      console.error(err)
      alert(`Error exporting ${type}: ${err.message}`)
    }
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

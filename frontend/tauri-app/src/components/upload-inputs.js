import React, { useState } from 'react'
import './upload-inputs.css'

const UploadInputs = () => {
  const [dataPath, setDataPath] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [conversionResult, setConversionResult] = useState(null)
  const [status, setStatus] = useState({ message: '', type: '' })

  const selectD3plotFolder = () => {
    // Trigger the hidden file input for d3plot folder selection
    document.getElementById('d3plotFolderSelector').click()
  }

  const handleD3plotFolderSelect = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // Get the first file and extract folder name from webkitRelativePath
      const filePath = files[0].webkitRelativePath
      if (filePath) {
        const folderName = filePath.split('/')[0]
        setDataPath(folderName)
        setConversionResult(null) // Reset previous results
        setStatus({ message: '', type: '' })
      }
      // Clear the input to prevent actual file upload
      event.target.value = ''
    }
  }

  const convertD3plot = async () => {
    if (!dataPath) {
      alert('Please select a d3plot data folder first')
      return
    }

    setIsConverting(true)
    setStatus({ message: 'Converting d3plot to NPZ format...', type: 'loading' })

    try {
      const url = `http://localhost:8000/convert-d3plot-to-npz/?data_path=${encodeURIComponent(dataPath)}`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (result.status === 'success') {
        setConversionResult(result)
        setStatus({
          message: `✅ Conversion complete! NPZ file located at: ${result.conversion.npz_path}`,
          type: 'success'
        })
      } else if (result.status === 'already_exists') {
        setConversionResult(result)
        setStatus({
          message: `ℹ️ NPZ file already exists at: ${result.npz_path}`,
          type: 'info'
        })
      } else {
        setStatus({
          message: `❌ Conversion failed: ${result.message}`,
          type: 'error'
        })
      }
    } catch (error) {
      setStatus({
        message: `❌ Connection error: ${error.message}`,
        type: 'error'
      })
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="upload-inputs-container">
      <div className="upload-inputs-section">
        <label htmlFor="d3plot-folder" className="thq-body-large">LS-DYNA d3plot Conversion</label>

        <div className="d3plot-folder-selector">
          <input
            type="text"
            id="d3plot-folder"
            value={dataPath}
            onChange={(e) => setDataPath(e.target.value)}
            disabled={isConverting}
            placeholder="Enter d3plot folder name or use browse button"
            className="thq-input"
          />
          <input
            type="file"
            id="d3plotFolderSelector"
            style={{ display: 'none' }}
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleD3plotFolderSelect}
            disabled={isConverting}
          />
          <button
            type="button"
            className="browse-btn"
            onClick={selectD3plotFolder}
            disabled={isConverting}
            title="Browse for d3plot folder"
          >
            📁 Browse
          </button>
        </div>

        <button
          type="button"
          className={`convert-btn ${isConverting ? 'converting' : ''}`}
          onClick={convertD3plot}
          disabled={isConverting || !dataPath}
        >
          {isConverting ? '🔄 Converting...' : '🔄 Convert to NPZ'}
        </button>

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="conversion-note">
          💡 Browse selects d3plot folder - converted NPZ will be used for FGN inference
        </div>
      </div>
    </div>
  )
}

export default UploadInputs
import React, { useState } from 'react'
import './upload-inputs.css'

const UploadInputs = () => {
  const [gnnFile, setGnnFile] = useState(null)
  const [lsdynaFile, setLsdynaFile] = useState(null)

  const handleGnnChange = (event) => {
    setGnnFile(event.target.files[0])
  }

  const handleLsdynaChange = (event) => {
    setLsdynaFile(event.target.files[0])
  }

  return (
    <div className="upload-inputs-container">
      <div className="upload-inputs-section">
        <label htmlFor="gnn-upload" className="thq-body-large">Upload GNN Input (.npz)</label>
        <input
          type="file"
          id="gnn-upload"
          accept=".npz"
          onChange={handleGnnChange}
          className="thq-input"
        />
        {gnnFile && <p className="thq-body-small">Selected: {gnnFile.name}</p>}
      </div>

      <div className="upload-inputs-section">
        <label htmlFor="lsdyna-upload" className="thq-body-large">Upload LS-DYNA Ground Truth (.npz)</label>
        <input
          type="file"
          id="lsdyna-upload"
          accept=".npz"
          onChange={handleLsdynaChange}
          className="thq-input"
        />
        {lsdynaFile && <p className="thq-body-small">Selected: {lsdynaFile.name}</p>}
      </div>
    </div>
  )
}

export default UploadInputs
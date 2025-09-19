import React, { useState } from 'react'
import UploadInputs from './upload-inputs'
import ViewModeSelector from './view-mode-selector'
import PreviewOutput from './preview-output'
import ExportButtons from './export-buttons'
import FGNInference from './fgn-inference'

import './researcher-tools.css'

const ResearcherTools = ({ mode, setMode }) => {
  const [previewUrl, setPreviewUrl] = useState(null)

  return (
    <div className="researcher-tools-container thq-section-padding">
      <h2 className="thq-heading-2">Upload & Predict</h2>
      <UploadInputs />
      {/* pass setPreviewUrl down so FGNInference can update it */}
      <FGNInference onSimulationComplete={setPreviewUrl} />
      <ViewModeSelector />
      <PreviewOutput previewUrl={previewUrl} />
      <ExportButtons />
    </div>
  )
}

export default ResearcherTools

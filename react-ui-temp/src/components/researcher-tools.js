import React from 'react'
import UploadInputs from './upload-inputs'
import ExecutionToggle from './execution-toggle'
import ViewModeSelector from './view-mode-selector'
import PreviewOutput from './preview-output'
import ExportButtons from './export-buttons'

import './researcher-tools.css'

const ResearcherTools = () => {
  return (
    <div className="researcher-tools-container thq-section-padding">
      <h2 className="thq-heading-2">Upload & Predict</h2>
      <UploadInputs />
      <ExecutionToggle />
      <ViewModeSelector />
      <PreviewOutput />
      <ExportButtons />
    </div>
  )
}

export default ResearcherTools
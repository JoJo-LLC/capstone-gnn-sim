import React from 'react'
import './data-logs.css'

const DataLogs = () => {
  return (
    <div className="thq-grid-3">
      <div className="thq-card thq-box-shadow">
        <h4 className="thq-heading-3">Sim #1001</h4>
        <p className="thq-body-small">Uploaded by: John | Date: 2025-08-07</p>
        <p className="thq-body-small">Status: Completed</p>
      </div>
      <div className="thq-card thq-box-shadow">
        <h4 className="thq-heading-3">Sim #1002</h4>
        <p className="thq-body-small">Uploaded by: Sarah | Date: 2025-08-07</p>
        <p className="thq-body-small">Status: Queued</p>
      </div>
      <div className="thq-card thq-box-shadow">
        <h4 className="thq-heading-3">Sim #1003</h4>
        <p className="thq-body-small">Uploaded by: Admin | Date: 2025-08-06</p>
        <p className="thq-body-small">Status: Failed</p>
      </div>
    </div>
  )
}

export default DataLogs
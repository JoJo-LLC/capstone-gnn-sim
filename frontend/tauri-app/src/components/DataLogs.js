import React from 'react'
import './data-logs.css'

const DataLogs = () => {
  return (
    <div className="thq-grid-3">
      <div className="thq-card thq-box-shadow sim-card">
        <h4 className="thq-heading-3">Sim #1001</h4>
        <p className="thq-body-small">Uploaded by: John | Date: 2025-08-07</p>
        <p className="thq-body-small">
          Status: <span className="status-badge completed">Completed</span>
        </p>
      </div>
      <div className="thq-card thq-box-shadow sim-card">
        <h4 className="thq-heading-3">Sim #1002</h4>
        <p className="thq-body-small">Uploaded by: Sarah | Date: 2025-08-07</p>
        <p className="thq-body-small">
          Status: <span className="status-badge queued">Queued</span>
        </p>
      </div>
      <div className="thq-card thq-box-shadow sim-card">
        <h4 className="thq-heading-3">Sim #1003</h4>
        <p className="thq-body-small">Uploaded by: Admin | Date: 2025-08-06</p>
        <p className="thq-body-small">
          Status: <span className="status-badge failed">Failed</span>
        </p>
      </div>
    </div>
  )
}

export default DataLogs
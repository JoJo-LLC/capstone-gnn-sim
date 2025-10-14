import React, { useState } from 'react'
import UploadInputs from './upload-inputs'
import ViewModeSelector from './view-mode-selector'
import PreviewOutput from './preview-output'
import ExportButtons from './export-buttons'
import FGNInference from './fgn-inference'

import './researcher-tools.css'

const ResearcherTools = ({ mode, setMode, isInferenceRunning, setIsInferenceRunning }) => {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [logs, setLogs] = useState([])
  const [terminalStatus, setTerminalStatus] = useState({ message: 'System initialized...', type: 'info' })
  const [showHelp, setShowHelp] = useState(false)
  const [inferenceProgress, setInferenceProgress] = useState({ percentage: 0, current: 0, total: 0 })
  const terminalRef = React.useRef(null)
  const [viewMode, setViewMode] = useState('single-frame')
  const addLogLine = (message, type = '') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { message, type, timestamp }])
  }

  const clearLogs = () => {
    setLogs([])
    addLogLine('Logs cleared', 'info')
  }

  const handleProgressUpdate = (percentage, current, total) => {
    setInferenceProgress({ percentage, current, total })
  }


  // Initialize with system ready message
  React.useEffect(() => {
    addLogLine('System initialized...', 'info')
    addLogLine('Ready for operations', 'info')
  }, [])

  // Auto-scroll terminal to bottom when new logs are added
  React.useEffect(() => {
    if (terminalRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      })
    }
  }, [logs])

  // Navigation guard: warn user before leaving page during inference
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isInferenceRunning) {
        e.preventDefault()
        e.returnValue = '⚠️ FGN Inference is running. Leaving this page will stop the process. Are you sure?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isInferenceRunning])

  return (
    <>
      {/* Left Sidebar - Controls */}
      <div className="controls-sidebar">
        <div className="sidebar-content">
          <h2 className="sidebar-title">Controls</h2>

          {/* Help Panel */}
          <div className="help-panel">
            <button
              className="help-toggle-btn"
              onClick={() => setShowHelp(!showHelp)}
              title="Toggle help instructions"
            >
              ℹ️ How to Use {showHelp ? '▼' : '▶'}
            </button>

            {showHelp && (
              <div className="help-content">
                <h4>Quick Start Guide</h4>
                <ol>
                  <li>
                    <strong>Step 1: Data Preprocessing</strong>
                    <ul>
                      <li>Upload your d3plot folder to app/srs/backend</li>
                      <li>Click "Select d3plot Folder" to choose your LS-DYNA simulation folder</li>
                      <li>Click "Convert to NPZ" to process the d3plot files</li>
                      <li>Wait for conversion to complete (status shown below button)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Step 2: FGN Inference</strong>
                    <ul>
                      <li>Enter the number of simulation steps (10-1000)</li>
                      <li>Enter the data path (folder name from Step 1)</li>
                      <li>Configure model path, model file, and detonation coordinates</li>
                      <li>Click "Start" to begin FGN inference</li>
                      <li>Monitor real-time progress in Process Logs (bottom right)</li>
                      <li>💡 <strong>Tip:</strong> For more steps and unlimited timeout check the unlimited mode checkbox</li>
                    </ul>
                  </li>
                  <li>
                    <strong>View Results</strong>
                    <ul>
                      <li>Visualisation appears in top right panel</li>
                      <li>Use mode selector to switch views</li>
                      <li>Export results using buttons in visualisation header</li>
                    </ul>
                  </li>
                </ol>
                <p className="help-note">
                  💡 <strong>Tip:</strong> Folder browsing only selects the path - no files are actually uploaded to the interface.
                </p>
              </div>
            )}
          </div>

          <div className="control-section">
            <h3 className="section-title">Step 1: Data Preprocessing</h3>
            <UploadInputs />
          </div>

          <div className="control-section">
            <h3 className="section-title">Step 2: FGN Inference</h3>
            <FGNInference
              onSimulationComplete={setPreviewUrl}
              onLogMessage={addLogLine}
              onStatusChange={setTerminalStatus}
              onRunningStateChange={setIsInferenceRunning}
              onProgressUpdate={handleProgressUpdate}
            />
          </div>

        </div>
      </div>

      {/* Top Right - Visualisation Output */}
      <div className="visualization-area">
        <div className="visualization-header">
          <div className="visualization-title-controls">
            <h3>Visualisation Output</h3>
            <ViewModeSelector value={viewMode} onChange={setViewMode} />
          </div>
          <div className="visualization-export">
            <ExportButtons onLogMessage={addLogLine} />
          </div>
        </div>
        <div className="visualization-content">
          <PreviewOutput
  gifUrl={previewUrl?.gifUrl}
   mp4Url={previewUrl?.mp4Url}
   fragmentGifUrl={previewUrl?.fragmentGifUrl}
   viewMode={viewMode}
   isInferenceRunning={isInferenceRunning}
   progress={inferenceProgress}
 />
        </div>
      </div>

      {/* Bottom Right - Log Terminal */}
      <div className="log-terminal">
        <div className="terminal-header">
          <h3>Process Logs</h3>
          <div className="terminal-status">
            <span className={`terminal-status-indicator ${terminalStatus.type}`}>
              {terminalStatus.message}
            </span>
          </div>
          <div className="terminal-controls">
            <button className="terminal-btn" onClick={clearLogs}>Clear</button>
          </div>
        </div>
        <div className="terminal-content" ref={terminalRef}>
          <div className="terminal-output">
            {logs.map((log, index) => (
              <div key={index} className={`log-line ${log.type}`}>
                <span className="log-timestamp">[{log.timestamp}]</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ResearcherTools

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

                <div style={{ backgroundColor: '#1e3a5f', padding: '12px', borderRadius: '5px', marginBottom: '15px', border: '1px solid #2563eb' }}>
                  <p style={{ margin: '0', fontSize: '0.9em', color: '#e0e7ff' }}>
                    📁 <strong style={{ color: '#93c5fd' }}>Data Storage:</strong> Place your data folders in:<br/>
                    <code style={{ backgroundColor: '#0f172a', padding: '3px 8px', borderRadius: '3px', color: '#7dd3fc', display: 'inline-block', marginTop: '4px', fontSize: '0.85em' }}>
                      ~/Documents/StructuralResponseSimulator/data/
                    </code>
                  </p>
                </div>

                <ol>
                  <li>
                    <strong>Step 1: Data Preprocessing</strong>
                    <ul>
                      <li><strong>Place your d3plot folder</strong> in the persistent data directory:<br/>
                        <code>~/Documents/StructuralResponseSimulator/data/your_folder_name/</code>
                      </li>
                      <li>In the UI, click "Select d3plot Folder" and browse to your folder</li>
                      <li>Click "Convert to NPZ" to process the d3plot files</li>
                      <li>Wait for conversion to complete (status shown below button)</li>
                      <li>💡 The folder name you use will be your "data path" in Step 2</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Step 2: FGN Inference Configuration</strong>
                    <ul>
                      <li><strong>Steps:</strong> Enter number of simulation steps (10-1000, or enable unlimited mode)</li>
                      <li><strong>Data Path:</strong> Enter just the folder name (e.g., "0.4_6" or "my_simulation")</li>
                      <li><strong>Model Selection:</strong>
                        <ul>
                          <li>Default bundled models work automatically</li>
                          <li>For custom models: Place in <code>~/Documents/StructuralResponseSimulator/models/</code></li>
                          <li>Enter model folder name in "Model Path" field</li>
                          <li>Select .pt file from that folder in "Model File" field</li>
                        </ul>
                      </li>
                      <li><strong>Detonation XY:</strong> Coordinates in "x,y" format (e.g., "0,0")</li>
                      <li>Click "Start" to begin FGN inference</li>
                      <li>Monitor real-time progress in Process Logs (bottom right)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Step 3: View & Export Results</strong>
                    <ul>
                      <li>Visualisation appears in top right panel automatically</li>
                      <li>Use mode selector to switch between EPS, Frame-by-Frame, and Fragment views</li>
                      <li>Export GIFs, MP4s, or CSVs using buttons in visualisation header</li>
                      <li>Results persist in <code>~/Documents/StructuralResponseSimulator/data/output/</code></li>
                    </ul>
                  </li>
                </ol>

                <div style={{ backgroundColor: '#422006', padding: '12px', borderRadius: '5px', marginTop: '10px', border: '1px solid #f59e0b' }}>
                  <p style={{ margin: '0', fontSize: '0.9em', color: '#fef3c7' }}>
                    💡 <strong style={{ color: '#fbbf24' }}>Important Tips:</strong>
                  </p>
                  <ul style={{ marginTop: '8px', marginBottom: '0', fontSize: '0.9em', color: '#fde68a' }}>
                    <li>Folder browsing only selects the path - no files are uploaded to the interface</li>
                    <li>Use folder names only (not full paths) in Data Path field</li>
                    <li>Models and data persist between app restarts</li>
                    <li>Each unique parameter combination creates a separate simulation record</li>
                  </ul>
                </div>
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

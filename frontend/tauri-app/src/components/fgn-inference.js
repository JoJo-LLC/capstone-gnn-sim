import React, { useState, useRef, useEffect } from 'react'
import './fgn-inference.css'

const FGNInference = () => {
  const [nsteps, setNsteps] = useState(20)
  const [dataPath, setDataPath] = useState('0.4_6')
  const [isRunning, setIsRunning] = useState(false)
  const [status, setStatus] = useState({ message: '', type: '' })
  const [logs, setLogs] = useState([
    { message: '📋 Ready to start FGN inference...', type: '', timestamp: new Date().toLocaleTimeString() },
    { message: '💡 Click "Start Inference" to begin real-time progress tracking', type: 'debug', timestamp: new Date().toLocaleTimeString() }
  ])

  const readerRef = useRef(null)
  const startTimeRef = useRef(null)

  const addLogLine = (message, type = '') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prevLogs => [...prevLogs, { message, type, timestamp }])
  }

  const selectFolder = () => {
    // Trigger the hidden file input for folder selection
    document.getElementById('folderSelector').click()
  }

  const handleFolderSelect = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // Get the first file and extract folder name from webkitRelativePath
      const filePath = files[0].webkitRelativePath
      if (filePath) {
        const folderName = filePath.split('/')[0]
        setDataPath(folderName)
        addLogLine(`📁 Selected folder: ${folderName}`, 'debug')
      }
      // Clear the input to prevent actual file upload
      event.target.value = ''
    }
  }

  const updateStatus = (message, type) => {
    setStatus({ message, type })
  }

  const clearLog = () => {
    setLogs([
      { message: '📋 Ready to start FGN inference...', type: '', timestamp: new Date().toLocaleTimeString() },
      { message: '💡 Click "Start Inference" to begin real-time progress tracking', type: 'debug', timestamp: new Date().toLocaleTimeString() }
    ])
    setStatus({ message: '', type: '' })
  }

  const startInference = async () => {
    if (!nsteps || !dataPath) {
      alert('Please enter both steps and data path')
      return
    }

    // Reset UI
    setLogs([])
    setIsRunning(true)
    startTimeRef.current = Date.now()
    updateStatus(`Starting FGN inference (${nsteps} steps)...`, 'running')
    addLogLine(`🚀 Starting inference with ${nsteps} steps on ${dataPath}`, 'case')

    try {
      const url = `http://localhost:8000/run-npz-inference-progress/?data_path=${dataPath}&nsteps=${nsteps}&detonation_xy=0,0&expanded_search=false`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      readerRef.current = reader
      const decoder = new TextDecoder()

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              setIsRunning(false)
              break
            }

            const text = decoder.decode(value)
            const lines = text.split('\n')

            for (let line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.substring(6).trim()

                if (data === 'COMPLETE') {
                  const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1)
                  updateStatus(`✅ Inference completed in ${elapsed}s`, 'complete')
                  addLogLine('🎉 Inference completed successfully!', 'complete')
                  setIsRunning(false)
                  return
                } else if (data === 'ERROR') {
                  updateStatus('❌ Inference failed', 'error')
                  addLogLine('❌ Inference failed with errors', 'error')
                  setIsRunning(false)
                  return
                } else if (data.includes('PROGRESS:')) {
                  addLogLine(data, 'progress')
                } else if (data.includes('CASE_') || data.includes('ROLLOUT_') || data.includes('POSTPROCESS_')) {
                  addLogLine(data, 'case')
                } else if (data.includes('[DEBUG]')) {
                  addLogLine(data, 'debug')
                } else if (data.includes('✓')) {
                  addLogLine(data, 'complete')
                } else if (data) {
                  addLogLine(data)
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream processing error:', error)
          addLogLine('❌ Stream processing error: ' + error.message, 'error')
          updateStatus('❌ Stream error', 'error')
          setIsRunning(false)
        }
      }

      await processStream()

    } catch (error) {
      console.error('Connection error:', error)
      addLogLine('❌ Connection error: ' + error.message, 'error')
      updateStatus('❌ Connection error', 'error')
      setIsRunning(false)
    }
  }

  const stopInference = () => {
    if (readerRef.current) {
      readerRef.current.cancel()
      readerRef.current = null
    }
    setIsRunning(false)
    updateStatus('Inference stopped', 'stopped')
    addLogLine('Inference stopped by user', 'debug')
  }

  // Auto-scroll to bottom when new logs are added
  const logContainerRef = useRef(null)
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="fgn-inference-container">
      <h3 className="fgn-inference-title"> FGN Inference</h3>

      <div className="fgn-inference-controls">
        <div className="fgn-control-group">
          <label htmlFor="nsteps">Steps:</label>
          <input
            type="number"
            id="nsteps"
            value={nsteps}
            onChange={(e) => setNsteps(e.target.value)}
            min="10"
            max="100"
            disabled={isRunning}
          />
        </div>

        <div className="fgn-control-group">
          <label htmlFor="dataPath">Data Path:</label>
          <div className="fgn-folder-selector">
            <input
              type="text"
              id="dataPath"
              value={dataPath}
              onChange={(e) => setDataPath(e.target.value)}
              disabled={isRunning}
              placeholder="Enter folder name or use browse button"
            />
            <input
              type="file"
              id="folderSelector"
              style={{ display: 'none' }}
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleFolderSelect}
              disabled={isRunning}
            />
            <button
              type="button"
              className="fgn-folder-btn"
              onClick={selectFolder}
              disabled={isRunning}
              title="Browse for data folder"
            >
              📁 Browse
            </button>
          </div>
          <div className="fgn-browse-note">
            💡 Browse only selects folder path - no files are uploaded
          </div>
        </div>

        <div className="fgn-control-buttons">
          <button
            className="fgn-start-btn"
            onClick={startInference}
            disabled={isRunning}
          >
            Start Inference
          </button>
          <button
            className="fgn-stop-btn"
            onClick={stopInference}
            disabled={!isRunning}
          >
            Stop
          </button>
          <button
            className="fgn-clear-btn"
            onClick={clearLog}
            disabled={isRunning}
            title="Clear log"
          >
            Clear Log
          </button>
        </div>
      </div>

      {status.message && (
        <div className={`fgn-status fgn-status-${status.type}`}>
          {status.message}
        </div>
      )}

      <div className="fgn-progress-log" ref={logContainerRef}>
        {logs.map((log, index) => (
          <div key={index} className={`fgn-log-line ${log.type}`}>
            [{log.timestamp}] {log.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FGNInference
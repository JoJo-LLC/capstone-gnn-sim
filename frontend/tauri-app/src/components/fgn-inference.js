import React, { useState, useRef, useEffect } from 'react'
import './fgn-inference.css'

const FGNInference = ({ onSimulationComplete }) => {
  const [nsteps, setNsteps] = useState(20)
  const [dataPath, setDataPath] = useState('0.4_6')
  const [modelPath, setModelPath] = useState('./model_4_inference/NS5e-4_1e-2_R14_L5N64_PosNsx10/')
  const [modelFile, setModelFile] = useState('model-066000.pt')
  const [detonationXY, setDetonationXY] = useState('0,0')
  const [isRunning, setIsRunning] = useState(false)
  const [status, setStatus] = useState({ message: '', type: '' })
  const [logs, setLogs] = useState([])
  const readerRef = useRef(null)
  const startTimeRef = useRef(null)
  const logContainerRef = useRef(null)

  const [resourceUsage, setResourceUsage] = useState({
    cpu_usage: 0,
    memory_total: 0,
    memory_used: 0,
    memory_free: 0
  })

  const addLogLine = (message, type = '') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { message, type, timestamp }])
  }

  const updateStatus = (message, type) => setStatus({ message, type })

  const selectFolder = () => document.getElementById('folderSelector').click()

  const handleFolderSelect = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const filePath = files[0].webkitRelativePath
      if (filePath) {
        const folderName = filePath.split('/')[0]
        setDataPath(folderName)
        addLogLine(`📁 Selected data folder: ${folderName}`, 'debug')
      }
      // Clear the input to prevent actual file upload
      event.target.value = ''
    }
  }

  const selectModelFolder = () => {
    // Trigger the hidden file input for model folder selection
    document.getElementById('modelFolderSelector').click()
  }

  const handleModelFolderSelect = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // Get the first file and extract folder path from webkitRelativePath
      const filePath = files[0].webkitRelativePath
      if (filePath) {
        // Extract the full folder path (could be nested)
        const pathParts = filePath.split('/')
        pathParts.pop() // Remove filename to get folder path
        const folderPath = './' + pathParts.join('/') + '/'
        setModelPath(folderPath)
        addLogLine(`🧠 Selected model folder: ${folderPath}`, 'debug')
      }
      event.target.value = ''
    }
  }

  const selectModelFile = () => {
    // Trigger the hidden file input for .pt file selection
    document.getElementById('modelFileSelector').click()
  }

  const handleModelFileSelect = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const selectedFile = files[0]

      // Validate it's a .pt file
      if (!selectedFile.name.endsWith('.pt')) {
        alert('Please select a .pt model file')
        event.target.value = ''
        return
      }

      setModelFile(selectedFile.name)
      addLogLine(`🎯 Selected model file: ${selectedFile.name}`, 'debug')

      // Clear the input to prevent actual file upload
      event.target.value = ''
    }
  }

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('http://localhost:8000/system/resource_usage')
          if (res.ok) {
            const data = await res.json()
            setResourceUsage(data)
          }
        } catch {}
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  const bytesToGB = (b) => (b / (1024 ** 3))

  const startInference = async () => {
    if (!nsteps || !dataPath || !modelPath || !modelFile || !detonationXY) {
      alert('Please enter all required fields: steps, data path, model path, model file, and detonation coordinates')
      return
    }

    // Validate detonation_xy format (should be "x,y")
    const detonationPattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/
    if (!detonationPattern.test(detonationXY)) {
      alert('Detonation XY must be in format "x,y" (e.g., "0,0" or "10.5,-5.2")')
      return
    }

    // Reset UI
    setLogs([])
    setIsRunning(true)
    startTimeRef.current = Date.now()
    updateStatus(`Starting FGN inference (${nsteps} steps)...`, 'running')
    addLogLine(`🚀 Starting inference with ${nsteps} steps on ${dataPath}`, 'case')
    addLogLine(`🧠 Using model: ${modelPath}${modelFile}`, 'debug')
    addLogLine(`💥 Detonation coordinates: ${detonationXY}`, 'debug')

    try {
      const url = `http://localhost:8000/run-npz-inference-progress/?data_path=${dataPath}&nsteps=${nsteps}&detonation_xy=${encodeURIComponent(detonationXY)}&expanded_search=false&model_path=${encodeURIComponent(modelPath)}&model_file=${encodeURIComponent(modelFile)}`

      const response = await fetch(url, {
        method: 'POST',
        headers: { Accept: 'text/event-stream', 'Cache-Control': 'no-cache' }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const reader = response.body.getReader()
      readerRef.current = reader
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) { setIsRunning(false); break }
        const text = decoder.decode(value)
        const lines = text.split('\n')
        for (let line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.substring(6).trim()
          if (data === 'COMPLETE') {
            const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1)
            updateStatus(`✅ Inference completed in ${elapsed}s`, 'complete')
            addLogLine('🎉 Inference completed successfully!', 'complete')
            setIsRunning(false)
            const gifUrl = `http://localhost:8000/gallery/${dataPath}/gif?cacheBust=${Date.now()}`
            if (onSimulationComplete) onSimulationComplete(gifUrl)
            return
          } else if (data === 'ERROR') {
            updateStatus('❌ Inference failed', 'error')
            addLogLine('❌ Inference failed with errors', 'error')
            setIsRunning(false)
            return
          } else if (data) {
            addLogLine(data, /PROGRESS:/.test(data) ? 'progress' : '')
          }
        }
      }
    } catch (error) {
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

  const memUsedGB = bytesToGB(resourceUsage.memory_used)
  const memTotalGB = bytesToGB(resourceUsage.memory_total)
  const memPct = resourceUsage.memory_total
    ? ((resourceUsage.memory_used / resourceUsage.memory_total) * 100)
    : 0

  return (
    <div className="fgn-inference-container">
      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          padding: '8px 12px',
          background: 'rgba(20,20,20,0.9)',
          color: '#fff',
          fontSize: 12,
          borderRadius: 8,
          zIndex: 1000,
          lineHeight: 1.4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
        }}
      >
        <div>CPU: {Number(resourceUsage.cpu_usage || 0).toFixed(1)}%</div>
        <div>MEM: {memUsedGB.toFixed(1)}/{memTotalGB.toFixed(1)} GB ({memPct.toFixed(1)}%)</div>
      </div>

      <h3 className="fgn-inference-title">FGN Inference</h3>

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
          <label htmlFor="detonationXY">Detonation XY:</label>
          <input
            type="text"
            id="detonationXY"
            value={detonationXY}
            onChange={(e) => setDetonationXY(e.target.value)}
            disabled={isRunning}
            placeholder="Enter coordinates (e.g., 0,0 or 10,5)"
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
        </div>

        <div className="fgn-control-group">
          <label htmlFor="modelPath">Model Path:</label>
          <div className="fgn-folder-selector">
            <input
              type="text"
              id="modelPath"
              value={modelPath}
              onChange={(e) => setModelPath(e.target.value)}
              disabled={isRunning}
              placeholder="Enter model folder path or use browse button"
            />
            <input
              type="file"
              id="modelFolderSelector"
              style={{ display: 'none' }}
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleModelFolderSelect}
              disabled={isRunning}
            />
            <button
              type="button"
              className="fgn-folder-btn"
              onClick={selectModelFolder}
              disabled={isRunning}
              title="Browse for model folder"
            >
              📁 Browse
            </button>
          </div>
          <div className="fgn-browse-note">
            💡 Browse only selects folder path - no files are uploaded
          </div>
        </div>

        <div className="fgn-control-group">
          <label htmlFor="modelFile">Model File:</label>
          <div className="fgn-folder-selector">
            <input
              type="text"
              id="modelFile"
              value={modelFile}
              onChange={(e) => setModelFile(e.target.value)}
              disabled={isRunning}
              placeholder="Enter .pt filename or use browse button"
            />
            <input
              type="file"
              id="modelFileSelector"
              style={{ display: 'none' }}
              accept=".pt"
              onChange={handleModelFileSelect}
              disabled={isRunning}
            />
            <button
              type="button"
              className="fgn-folder-btn"
              onClick={selectModelFile}
              disabled={isRunning}
              title="Browse for .pt model file"
            >
              📁 Browse
            </button>
          </div>
          <div className="fgn-browse-note">
            💡 Browse selects .pt file - verify model path matches the file location
          </div>
        </div>

        <div className="fgn-control-buttons">
          <button className="fgn-start-btn" onClick={startInference} disabled={isRunning}>
            Start Inference
          </button>
          <button className="fgn-stop-btn" onClick={stopInference} disabled={!isRunning}>
            Stop
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

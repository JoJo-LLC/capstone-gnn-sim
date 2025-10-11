import React, { useState, useRef, useEffect } from 'react'
import './fgn-inference.css'

const FGNInference = ({ onSimulationComplete, onLogMessage, onStatusChange, onRunningStateChange, onProgressUpdate }) => {
  const [nsteps, setNsteps] = useState(20)
  const [dataPath, setDataPath] = useState('0.4_6')
  const [modelPath, setModelPath] = useState('./model_4_inference/NS5e-4_1e-2_R14_L5N64_PosNsx10/')
  const [modelFile, setModelFile] = useState('model-066000.pt')
  const [detonationXY, setDetonationXY] = useState('0,0')
  const [unlimitedMode, setUnlimitedMode] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [status, setStatus] = useState({ message: '', type: '' })
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const readerRef = useRef(null)
  const startTimeRef = useRef(null)

  const [resourceUsage, setResourceUsage] = useState({
    cpu_usage: 0,
    memory_total: 0,
    memory_used: 0,
    memory_free: 0
  })

  const addLogLine = (message, type = '') => {
    if (onLogMessage) {
      onLogMessage(message, type)
    }
  }

  const updateStatus = (message, type) => {
    setStatus({ message, type })
    if (onStatusChange) {
      onStatusChange({ message, type })
    }
  }

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

  // Notify parent component when running state changes
  useEffect(() => {
    if (onRunningStateChange) {
      onRunningStateChange(isRunning)
    }
  }, [isRunning, onRunningStateChange])

  // Notify parent component when progress changes
  // Progress breakdown: Initialization (5%) + Rollout steps (85%) + Post-processing (10%)
  useEffect(() => {
    if (onProgressUpdate && totalSteps > 0) {
      let percentage = 0

      if (currentStep === 0) {
        // Initialization phase
        percentage = 5
      } else if (currentStep > 0 && currentStep < totalSteps) {
        // Rollout phase: 5% + (step progress × 85%)
        const rolloutProgress = (currentStep / totalSteps) * 85
        percentage = 5 + rolloutProgress
      } else if (currentStep === totalSteps) {
        // Post-processing phase
        percentage = 90
      }

      onProgressUpdate(percentage, currentStep, totalSteps)
    }
  }, [currentStep, totalSteps, onProgressUpdate])


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

    // Convert nsteps to number
    const nstepsNum = parseInt(nsteps, 10)
    if (isNaN(nstepsNum)) {
      alert('Steps must be a valid number')
      return
    }

    // Reset UI
    setIsRunning(true)
    setCurrentStep(0)
    setTotalSteps(nstepsNum)
    startTimeRef.current = Date.now()
    updateStatus(`Starting FGN inference (${nstepsNum} steps)...`, 'running')
    addLogLine(`🚀 Starting inference with ${nstepsNum} steps on ${dataPath}`, 'case')
    addLogLine(`🧠 Using model: ${modelPath}${modelFile}`, 'debug')
    addLogLine(`💥 Detonation coordinates: ${detonationXY}`, 'debug')
    if (unlimitedMode) {
      addLogLine(`⚠️ Unlimited Mode: No timeout, no step limit`, 'debug')
    }

    try {
      const url = `http://localhost:8000/run-npz-inference-progress/?data_path=${dataPath}&nsteps=${nstepsNum}&detonation_xy=${encodeURIComponent(detonationXY)}&expanded_search=false&model_path=${encodeURIComponent(modelPath)}&model_file=${encodeURIComponent(modelFile)}&unlimited_mode=${unlimitedMode}`

      const response = await fetch(url, {
        method: 'POST',
        headers: { Accept: 'text/event-stream', 'Cache-Control': 'no-cache' }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      // Check if response is JSON (duplicate detection) before reading as stream
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const jsonResponse = await response.json()
        if (jsonResponse.status === 'duplicate_found') {
          // Handle duplicate simulation
          const existingSim = jsonResponse.existing_simulation
          const execDate = existingSim.execution_date ? new Date(existingSim.execution_date).toLocaleString() : 'Unknown'
          const execTime = existingSim.execution_time ? existingSim.execution_time.toFixed(1) : 'Unknown'

          updateStatus('ℹ️ Duplicate simulation detected', 'info')
          addLogLine('🔍 Duplicate simulation detected in database', 'info')
          addLogLine(`📋 Data Path: ${existingSim.data_path}`, 'debug')
          addLogLine(`⚙️ Parameters: Steps=${existingSim.parameters.nsteps}, Detonation=${existingSim.parameters.detonation_xy}`, 'debug')
          addLogLine(`📅 Previously run on: ${execDate}`, 'debug')
          addLogLine(`⏱️ Execution time: ${execTime}s`, 'debug')
          addLogLine('💡 This configuration has already been processed. Results are available in the database.', 'info')

          setIsRunning(false)

          // Load the existing results
          const gifUrl = `http://localhost:8000/gallery/${dataPath}/gif?cacheBust=${Date.now()}`
          const mp4Url = `http://localhost:8000/gallery/${encodeURIComponent(dataPath)}/mp4?cacheBust=${Date.now()}`
          const fragmentGifUrl = `http://localhost:8000/gallery/${encodeURIComponent(dataPath)}/fragment_gif?cacheBust=${Date.now()}`
          if (onSimulationComplete) onSimulationComplete({ gifUrl, mp4Url, fragmentGifUrl })

          return
        }
      }

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
            // Set to 100% before completing
            if (onProgressUpdate) {
              onProgressUpdate(100, totalSteps, totalSteps)
            }
            const elapsed = ((Date.now() - startTimeRef.current) / 1000).toFixed(1)
            updateStatus(`✅ Inference completed in ${elapsed}s`, 'complete')
            addLogLine('🎉 Inference completed successfully!', 'complete')
            setIsRunning(false)
            const gifUrl = `http://localhost:8000/gallery/${dataPath}/gif?cacheBust=${Date.now()}`
           const mp4Url = `http://localhost:8000/gallery/${encodeURIComponent(dataPath)}/mp4?cacheBust=${Date.now()}`
            const fragmentGifUrl = `http://localhost:8000/gallery/${encodeURIComponent(dataPath)}/fragment_gif?cacheBust=${Date.now()}`
            if (onSimulationComplete) onSimulationComplete({ gifUrl, mp4Url, fragmentGifUrl })
            return
          } else if (data === 'ERROR') {
            updateStatus('❌ Inference failed', 'error')
            addLogLine('❌ Inference failed with errors', 'error')
            setIsRunning(false)
            return
          } else if (data) {
            // Extract step progress from messages like "Step 5/20 completed"
            const stepMatch = data.match(/Step (\d+)\/(\d+)/)
            if (stepMatch) {
              const step = parseInt(stepMatch[1], 10)
              const total = parseInt(stepMatch[2], 10)
              setCurrentStep(step)
              setTotalSteps(total)
            }

            // Detect post-processing phase
            if (data.includes('Post-processing') || data.includes('Generating visualization')) {
              // Set to post-processing state (will show 90%+)
              if (totalSteps > 0) {
                setCurrentStep(totalSteps)
              }
            }

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
    setCurrentStep(0)
    setTotalSteps(0)
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 className="fgn-inference-title" style={{ margin: 0 }}>FGN Inference</h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={unlimitedMode}
            onChange={(e) => setUnlimitedMode(e.target.checked)}
            disabled={isRunning}
            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
          />
          <span>Unlimited Mode (no timeout, unlimited steps)</span>
        </label>
      </div>

      <div className="fgn-inference-controls">
        <div className="fgn-control-group">
          <label htmlFor="nsteps">Steps:</label>
          <input
            type="number"
            id="nsteps"
            value={nsteps}
            onChange={(e) => setNsteps(e.target.value)}
            min="10"
            max={unlimitedMode ? undefined : "1000"}
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
           <div className="fgn-browse-note">
            💡 Browse only selects folder path - no files are uploaded 
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
            Start
          </button>
          <button className="fgn-stop-btn" onClick={stopInference} disabled={!isRunning}>
            Stop
          </button>
        </div>
      </div>


    </div>
  )
}

export default FGNInference

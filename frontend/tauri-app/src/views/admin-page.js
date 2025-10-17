import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Navbar8 from '../components/navbar8'
import Footer4 from '../components/footer4'
import './admin-page.css'

const BASE = 'http://localhost:8000'

const AdminPage = () => {
  const [simulations, setSimulations] = useState([])
  const [selectedSim, setSelectedSim] = useState(null)
  const [loading, setLoading] = useState(true)
  const [gifUrl, setGifUrl] = useState(null)
  const [fragmentGifUrl, setFragmentGifUrl] = useState(null)
  const [ensuringGif, setEnsuringGif] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`${BASE}/fgn-simulations/`)
      .then(res => res.json())
      .then(data => {
        setSimulations(data.simulations || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch simulations:', err)
        setLoading(false)
      })
  }, [])

  const ensureGifAndGetUrl = async (sim) => {
    const key = sim.simulation_key

    // Check if path is stored in database
    const storedPath = sim.fgn_execution?.results?.gif_file?.path
    if (storedPath) {
      const directUrl = `${BASE}${storedPath}`
      try {
        const head = await fetch(directUrl, { method: 'HEAD' })
        if (head.ok) return `${directUrl}?t=${Date.now()}`
      } catch (_) {}
    }

    // Fallback: try constructing path from simulation_key
    const fallbackUrl = `${BASE}/output/${encodeURIComponent(key)}/eps/${encodeURIComponent(key)}.gif`
    try {
      const head = await fetch(fallbackUrl, { method: 'HEAD' })
      if (head.ok) return `${fallbackUrl}?t=${Date.now()}`
    } catch (_) {}

    // Generate on demand if doesn't exist
    const genUrl = `${BASE}/gallery/${encodeURIComponent(sim.data_path)}/gif?sim_key=${encodeURIComponent(key)}`
    await fetch(genUrl)
    return `${fallbackUrl}?t=${Date.now()}`
  }

  const ensureFragmentGifAndGetUrl = async (sim) => {
    try {
      const key = sim.simulation_key

      // Check if path is stored in database
      const storedPath = sim.fgn_execution?.results?.fragment_gif_file?.path
      if (storedPath) {
        const directUrl = `${BASE}${storedPath}`
        try {
          const head = await fetch(directUrl, { method: 'HEAD' })
          if (head.ok) return `${directUrl}?t=${Date.now()}`
        } catch (_) {}
      }

      // Fallback: try constructing path from simulation_key
      const fallbackUrl = `${BASE}/output/${encodeURIComponent(key)}/fragment/${encodeURIComponent(key)}_fragment.gif`
      try {
        const head = await fetch(fallbackUrl, { method: 'HEAD' })
        if (head.ok) return `${fallbackUrl}?t=${Date.now()}`
      } catch (_) {}

      // Generate on demand if doesn't exist
      const genUrl = `${BASE}/gallery/${encodeURIComponent(sim.data_path)}/fragment_gif?sim_key=${encodeURIComponent(key)}`
      await fetch(genUrl)
      return `${fallbackUrl}?t=${Date.now()}`
    } catch (e) {
      console.error('Failed to fetch fragment GIF:', e)
      return null
    }
  }

  const handleRowClick = async (sim) => {
    setSelectedSim(null)
    setGifUrl(null)
    setFragmentGifUrl(null)
    setEnsuringGif(true)

    try {
      const res = await fetch(`${BASE}/fgn-simulation-by-key/${encodeURIComponent(sim.simulation_key)}`)
      const data = await res.json()
      setSelectedSim(data.simulation)

      const url = await ensureGifAndGetUrl(sim)
      setGifUrl(url)

      const fragmentUrl = await ensureFragmentGifAndGetUrl(sim)
      setFragmentGifUrl(fragmentUrl)
    } catch (e) {
      console.error('Failed to fetch simulation details or GIFs:', e)
    } finally {
      setEnsuringGif(false)
    }
  }

  const getStatusColor = (sim) => {
    if (sim.fgn_execution?.status === 'completed') return '#4ade80'
    if (sim.fgn_execution?.status === 'failed') return '#ef4444'
    return '#fbbf24'
  }

  const handleDelete = async () => {
    if (!selectedSim) return

    const confirmed = window.confirm(
      `Are you sure you want to delete simulation "${selectedSim.data_path}" (${selectedSim.simulation_key})?\n\nThis will permanently remove:\n- Database record\n- All output files (GIFs, PNGs, CSVs)\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    setDeleting(true)
    try {
      const response = await fetch(
        `${BASE}/fgn-simulation/${encodeURIComponent(selectedSim.simulation_key)}`,
        { method: 'DELETE' }
      )

      const data = await response.json()

      if (response.ok && data.status === 'success') {
        alert(`Successfully deleted simulation: ${selectedSim.data_path}`)

        // Remove from simulations list
        setSimulations(simulations.filter(sim => sim._id !== selectedSim._id))

        // Clear selection
        setSelectedSim(null)
        setGifUrl(null)
        setFragmentGifUrl(null)
      } else {
        alert(`Failed to delete simulation: ${data.detail || data.message}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert(`Error deleting simulation: ${error.message}`)
    } finally {
      setDeleting(false)
    }
  }

  const handleDownload = async (type) => {
    if (!selectedSim) return

    const key = selectedSim.simulation_key
    let url

    switch (type) {
      case 'gifs':
        url = `${BASE}/export/${encodeURIComponent(selectedSim.data_path)}/gifs_all?sim_key=${encodeURIComponent(key)}`
        break
      case 'mp4s':
        url = `${BASE}/export/${encodeURIComponent(selectedSim.data_path)}/mp4s_all?sim_key=${encodeURIComponent(key)}`
        break
      case 'csv':
        url = `${BASE}/export/${encodeURIComponent(selectedSim.data_path)}/csv_all?sim_key=${encodeURIComponent(key)}`
        break
      default:
        return
    }

    try {
      // Trigger download by creating temporary link
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedSim.data_path}_${type}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert(`Error downloading ${type}: ${error.message}`)
    }
  }

  return (
    <div className="admin-page-container">
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>

      <Navbar8
        link1="Researcher"
        link2="Visitor"
        link3="Admin"
        link1Url="/researcher-page"
        link2Url="/visitor-page"
        link3Url="/admin-page"
      />

      <div className="admin-content">
        <h1 className="admin-title">Simulation History</h1>

        <div className="split-container">
          <div className="left-panel">
            {loading ? (
              <p>Loading simulations...</p>
            ) : simulations.length === 0 ? (
              <p>No simulations found. Run a simulation first.</p>
            ) : (
              <table className="sim-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Data Path</th>
                    <th>Date</th>
                    <th>Time (s)</th>
                    <th>Steps</th>
                  </tr>
                </thead>
                <tbody>
                  {simulations.map((sim) => (
                    <tr
                      key={sim._id}
                      onClick={() => handleRowClick(sim)}
                      className={selectedSim?._id === sim._id ? 'selected' : ''}
                    >
                      <td>
                        <span
                          className="status-indicator"
                          style={{ backgroundColor: getStatusColor(sim) }}
                        />
                      </td>
                      <td>{sim.data_path}</td>
                      <td>
                        {sim.fgn_execution?.execution_date
                          ? new Date(sim.fgn_execution.execution_date).toLocaleString('en-AU', {
                              timeZone: 'Australia/Perth'
                            })
                          : 'N/A'}
                      </td>
                      <td>
                        {sim.fgn_execution?.results?.execution_time_seconds != null
                          ? Number(sim.fgn_execution.results.execution_time_seconds).toFixed(1)
                          : 'N/A'}
                      </td>
                      <td>{sim.fgn_execution?.parameters?.nsteps ?? 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="right-panel">
            {!selectedSim ? (
              <div className="empty-state">
                <p>Select a simulation to view details</p>
              </div>
            ) : (
              <div className="details-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0 }}>{selectedSim.data_path}</h2>
                  <div className="action-buttons" style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleDownload('gifs')} className="download-btn" title="Download EPS and Fragment GIFs">
                      Download GIFs
                    </button>
                    <button onClick={() => handleDownload('mp4s')} className="download-btn" title="Download EPS and Fragment MP4s">
                      Download MP4s
                    </button>
                    <button onClick={() => handleDownload('csv')} className="download-btn" title="Download all CSV property files">
                      Download CSVs
                    </button>
                    <button
                      onClick={handleDelete}
                      className="delete-btn"
                      disabled={deleting}
                      title="Delete this simulation and all its files"
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>

                <div className="gif-section">
                  <div className="gif-container" style={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3>EPS Output</h3>
                    {ensuringGif ? (
                      <p>Preparing preview…</p>
                    ) : gifUrl ? (
                      <img src={gifUrl} alt={`${selectedSim.data_path} EPS animation`} className="sim-gif" />
                    ) : (
                      <p>No EPS GIF available for this simulation</p>
                    )}
                  </div>

                  <div className="gif-container" style={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                    <h3>Fragment Output</h3>
                    {ensuringGif ? (
                      <p>Preparing preview…</p>
                    ) : fragmentGifUrl ? (
                      <img src={fragmentGifUrl} alt={`${selectedSim.data_path} Fragment animation`} className="sim-gif" />
                    ) : (
                      <p>No Fragment GIF available for this simulation</p>
                    )}
                  </div>
                </div>

                <div className="details-section">
                  <h3>Simulation Info</h3>
                  <p><strong>Simulation Key:</strong> <code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '3px', fontSize: '0.9em' }}>{selectedSim.simulation_key}</code></p>
                  <p><strong>Parameter Hash:</strong> <code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '3px', fontSize: '0.9em' }}>{selectedSim.fgn_execution?.parameter_hash || 'N/A'}</code></p>
                </div>

                <div className="details-section">
                  <h3>Parameters</h3>
                  <p><strong>Steps:</strong> {selectedSim.fgn_execution?.parameters?.nsteps}</p>
                  <p><strong>Detonation XY:</strong> {selectedSim.fgn_execution?.parameters?.detonation_xy}</p>
                  <p><strong>Expanded Search:</strong> {selectedSim.fgn_execution?.parameters?.expanded_search ? 'Yes' : 'No'}</p>
                </div>

                <div className="details-section">
                  <h3>Results</h3>
                  <p><strong>Execution Time:</strong> {selectedSim.fgn_execution?.results?.execution_time_seconds != null ? Number(selectedSim.fgn_execution.results.execution_time_seconds).toFixed(2) : 'N/A'}s</p>
                  <p><strong>Generated Files:</strong></p>
                  <ul>
                    {Object.entries(selectedSim.fgn_execution?.results?.generated_files || {}).map(([key, count]) => (
                      <li key={key}>{key}: {count}</li>
                    ))}
                  </ul>
                </div>

                {selectedSim.activity_log?.length > 0 && (
                  <div className="details-section">
                    <h3>Activity Log</h3>
                    {selectedSim.activity_log.map((log, idx) => (
                      <p key={idx}>
                        <strong>{log.action}</strong> by {log.user} at {new Date(log.timestamp).toLocaleString('en-AU', { timeZone: 'Australia/Perth' })}
                      </p>
                    ))}
                  </div>
                )}

                {selectedSim.error_log?.error_message && (
                  <div className="details-section error-section">
                    <h3>Error Details</h3>
                    <p><strong>Type:</strong> {selectedSim.error_log.error_type}</p>
                    <p><strong>Message:</strong> {selectedSim.error_log.error_message}</p>
                    <p><strong>Time:</strong> {new Date(selectedSim.error_log.timestamp).toLocaleString('en-AU', { timeZone: 'Australia/Perth' })}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer4
        link1="About Us"
        link2="Contact Us"
        link3="FAQs"
        link4="Support"
        termsLink="Terms of Service"
        privacyLink="Privacy Policy"
      />
    </div>
  )
}

export default AdminPage

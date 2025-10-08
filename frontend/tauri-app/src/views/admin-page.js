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
  const [ensuringGif, setEnsuringGif] = useState(false)

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
    const directUrl = `${BASE}/gifs/${key}.gif`

    try {
      const head = await fetch(directUrl, { method: 'HEAD' })
      if (head.ok) return `${directUrl}?t=${Date.now()}`
    } catch (_) {}

    const genUrl = `${BASE}/gallery/${encodeURIComponent(sim.data_path)}/gif?sim_key=${encodeURIComponent(key)}`
    await fetch(genUrl) // generate on demand
    return `${directUrl}?t=${Date.now()}`
  }

  const handleRowClick = async (sim) => {
    setSelectedSim(null)
    setGifUrl(null)
    setEnsuringGif(true)

    try {
      const res = await fetch(`${BASE}/fgn-simulation-by-key/${encodeURIComponent(sim.simulation_key)}`)
      const data = await res.json()
      setSelectedSim(data.simulation)

      const url = await ensureGifAndGetUrl(sim)
      setGifUrl(url)
    } catch (e) {
      console.error('Failed to fetch simulation details or GIF:', e)
    } finally {
      setEnsuringGif(false)
    }
  }

  const getStatusColor = (sim) => {
    if (sim.fgn_execution?.status === 'completed') return '#4ade80'
    if (sim.fgn_execution?.status === 'failed') return '#ef4444'
    return '#fbbf24'
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
                <h2>{selectedSim.data_path}</h2>

                <div className="gif-container" style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {ensuringGif ? (
                    <p>Preparing preview…</p>
                  ) : gifUrl ? (
                    <img src={gifUrl} alt={`${selectedSim.data_path} animation`} className="sim-gif" />
                  ) : (
                    <p>No GIF available for this simulation</p>
                  )}
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

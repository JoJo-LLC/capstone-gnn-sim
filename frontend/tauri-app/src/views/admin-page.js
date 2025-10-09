import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Navbar8 from '../components/navbar8'
import Footer4 from '../components/footer4'
import './admin-page.css'

const AdminPage = () => {
  const [simulations, setSimulations] = useState([])
  const [selectedSim, setSelectedSim] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch simulation list on mount
  useEffect(() => {
    fetch('http://localhost:8000/fgn-simulations/')
      .then(res => res.json())
      .then(data => {
        setSimulations(data.simulations)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch simulations:', err)
        setLoading(false)
      })
  }, [])

  // Fetch details when simulation is selected using simulation_key
  const handleRowClick = (simulation) => {
    fetch(`http://localhost:8000/fgn-simulation-by-key/${simulation.simulation_key}`)
      .then(res => res.json())
      .then(data => setSelectedSim(data.simulation))
      .catch(err => console.error('Failed to fetch simulation details:', err))
  }

  // Get status color
  const getStatusColor = (sim) => {
    if (sim.fgn_execution?.status === 'completed') return '#4ade80' // green
    if (sim.fgn_execution?.status === 'failed') return '#ef4444' // red
    return '#fbbf24' // yellow
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
          {/* LEFT PANEL - Simulation Records Table */}
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
                      onClick={() => handleRowClick(sim)}  // Pass the whole sim object
                      className={selectedSim?._id === sim._id ? 'selected' : ''}  // Compare by _id
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
                        {sim.fgn_execution?.results?.execution_time_seconds?.toFixed(1) || 'N/A'}
                      </td>
                      <td>{sim.fgn_execution?.parameters?.nsteps || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* RIGHT PANEL - Details/GIF Display */}
          <div className="right-panel">
            {!selectedSim ? (
              <div className="empty-state">
                <p>Select a simulation to view details</p>
              </div>
            ) : (
              <div className="details-container">
                <h2>{selectedSim.data_path}</h2>
                
                {/* GIF Display */}
                {selectedSim.fgn_execution?.results?.gif_file?.path ? (
                  <div className="gif-container">
                    <img 
                      src={`http://localhost:8000/gallery/${selectedSim.data_path}/gif`}
                      alt={`${selectedSim.data_path} animation`}
                      className="sim-gif"
                    />
                  </div>
                ) : (
                  <div className="gif-container">
                  <p>No GIF available for this simulation</p>
                  </div>
                )}

                {/* Simulation Parameters */}
                <div className="details-section">
                  <h3>Parameters</h3>
                  <p><strong>Steps:</strong> {selectedSim.fgn_execution?.parameters?.nsteps}</p>
                  <p><strong>Detonation XY:</strong> {selectedSim.fgn_execution?.parameters?.detonation_xy}</p>
                  <p><strong>Expanded Search:</strong> {selectedSim.fgn_execution?.parameters?.expanded_search ? 'Yes' : 'No'}</p>
                </div>

                {/* Results */}
                <div className="details-section">
                  <h3>Results</h3>
                  <p><strong>Execution Time:</strong> {selectedSim.fgn_execution?.results?.execution_time_seconds?.toFixed(2)}s</p>
                  <p><strong>Generated Files:</strong></p>
                  <ul>
                    {Object.entries(selectedSim.fgn_execution?.results?.generated_files || {}).map(([key, count]) => (
                      <li key={key}>{key}: {count}</li>
                    ))}
                  </ul>
                </div>

                {/* Activity Log */}
                {selectedSim.activity_log?.length > 0 && (
                  <div className="details-section">
                    <h3>Activity Log</h3>
                    {selectedSim.activity_log.map((log, idx) => (
                      <p key={idx}>
                        <strong>{log.action}</strong> by {log.user} at {new Date(log.timestamp).toLocaleString()}
                      </p>
                    ))}
                  </div>
                )}

                {/* Error Log */}
                {selectedSim.error_log?.error_message && (
                  <div className="details-section error-section">
                    <h3>Error Details</h3>
                    <p><strong>Type:</strong> {selectedSim.error_log.error_type}</p>
                    <p><strong>Message:</strong> {selectedSim.error_log.error_message}</p>
                    <p><strong>Time:</strong> {new Date(selectedSim.error_log.timestamp).toLocaleString()}</p>
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
import React from 'react'
import UserTable from './UserTable'
import DataLogs from './DataLogs'

import './admin-dashboard.css'

const AdminDashboard = () => {
  return (
    <div className="thq-section-padding thq-section-max-width">
      <h2 className="thq-heading-2">Admin Dashboard</h2>

      <section className="thq-flex-column">
        <h3 className="thq-heading-3">User Role Management</h3>
        <UserTable />
      </section>

      <section className="thq-flex-column" style={{ marginTop: '40px' }}>
        <h3 className="thq-heading-3">Simulation Data Logs</h3>
        <DataLogs />
      </section>
    </div>
  )
}

export default AdminDashboard
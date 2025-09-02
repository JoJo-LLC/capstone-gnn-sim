import React from 'react'
import './user-table.css'

const UserTable = () => {
  const users = [
    { name: 'John Doe', role: 'Researcher', status: 'Active' },
    { name: 'Jane Smith', role: 'Visitor', status: 'Pending' },
    { name: 'Admin Joe', role: 'Admin', status: 'Active' },
  ]

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u, index) => (
          <tr key={index}>
            <td>{u.name}</td>
            <td>{u.role}</td>
            <td>{u.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default UserTable
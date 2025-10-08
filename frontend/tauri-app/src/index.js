import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import './style.css'
import Home from './views/home'
import VisitorPage from './views/visitor-page'
import AdminPage from './views/admin-page'
import ResearcherPage from './views/researcher-page'
import NotFound from './views/not-found'
import StartupModal from './components/StartupModal'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visitor-page" element={<VisitorPage />} />
        <Route path="/admin-page" element={<AdminPage />} />
        <Route path="/researcher-page" element={<ResearcherPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="**" element={<Navigate to="*" />} />
      </Routes>
    </Router>
  )
}


const Root = () => {
  const [modeSelected, setModeSelected] = useState(false)

  const handleModeSelect = (selectedMode) => {
    setModeSelected(true)
    console.log('Selected execution mode:', selectedMode)
  }

  return (
    <>
      {!modeSelected && <StartupModal onSelect={handleModeSelect} />}
      {modeSelected && <App />}
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(<Root />)

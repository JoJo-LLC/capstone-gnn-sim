import React, { Fragment, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useLocation } from 'react-router-dom'

import Navbar8 from '../components/navbar8'
import ResearcherTools from '../components/researcher-tools'

import './researcher-page.css'

const ResearcherPage = (props) => {
  const [mode, setMode] = useState('cpu')
  const [isInferenceRunning, setIsInferenceRunning] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Block navigation when inference is running
  useEffect(() => {
    const handleNavigation = (e) => {
      if (isInferenceRunning) {
        const confirmLeave = window.confirm(
          '⚠️ FGN Inference is running. Leaving this page will stop the process.\n\nAre you sure you want to leave?'
        )
        if (!confirmLeave) {
          e.preventDefault()
          // Stay on current page
          window.history.pushState(null, '', location.pathname)
        }
      }
    }

    // Intercept all link clicks when inference is running
    const handleLinkClick = (e) => {
      if (isInferenceRunning) {
        // Check if clicked element or its parent is a link
        const link = e.target.closest('a')
        if (link && link.getAttribute('href')) {
          const href = link.getAttribute('href')
          // Only intercept if navigating away from current page
          if (href !== location.pathname) {
            const confirmLeave = window.confirm(
              '⚠️ FGN Inference is running. Leaving this page will stop the process.\n\nAre you sure you want to leave?'
            )
            if (!confirmLeave) {
              e.preventDefault()
              e.stopPropagation()
            }
          }
        }
      }
    }

    // Listen for popstate (back/forward button)
    window.addEventListener('popstate', handleNavigation)
    // Intercept link clicks
    document.addEventListener('click', handleLinkClick, true)

    // Prevent navigation by pushing current state when trying to leave
    if (isInferenceRunning) {
      window.history.pushState(null, '', location.pathname)
    }

    return () => {
      window.removeEventListener('popstate', handleNavigation)
      document.removeEventListener('click', handleLinkClick, true)
    }
  }, [isInferenceRunning, location.pathname])

  return (
    <div className="researcher-page">
      <Helmet>
        <title>Researcher Dashboard</title>
        <meta property="og:title" content="Researcher Dashboard" />
      </Helmet>

      <Navbar8
        link1={<Fragment><span className="researcher-page-text10">Researcher</span></Fragment>}
        link2={<Fragment><span className="researcher-page-text11">Visitor</span></Fragment>}
        link3={<Fragment><span className="researcher-page-text12">Admin</span></Fragment>}
        link4={<Fragment><span className="researcher-page-text13">Info</span></Fragment>}
        page1={<Fragment><span className="researcher-page-text14">Researcher Dashboard</span></Fragment>}
        page2={<Fragment><span className="researcher-page-text15">Visitor Dashboard</span></Fragment>}
        page3={<Fragment><span className="researcher-page-text16">Admin Dashboard</span></Fragment>}
        page4={<Fragment><span className="researcher-page-text17">Page Four</span></Fragment>}
        page1Description={<Fragment><span className="researcher-page-text18">Access tools for uploading files, toggling CPU/GPU, selecting visualization mode, and exporting results.</span></Fragment>}
        page2Description={<Fragment><span className="researcher-page-text19">Explore sample simulations in a grid gallery format.</span></Fragment>}
        page3Description={<Fragment><span className="researcher-page-text20">Manage user roles, permissions, and simulation data.</span></Fragment>}
        page4Description={<Fragment><span className="researcher-page-text21">Page Four Description</span></Fragment>}
        link1Url="/researcher-page"
        link2Url="/visitor-page"
        link3Url="/admin-page"
      />

      <div className="researcher-main-container">
        <ResearcherTools
          mode={mode}
          setMode={setMode}
          isInferenceRunning={isInferenceRunning}
          setIsInferenceRunning={setIsInferenceRunning}
        />
      </div>

    </div>
  )
}

export default ResearcherPage
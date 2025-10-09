import React, { Fragment, useState } from 'react'
import { Helmet } from 'react-helmet'

import Navbar8 from '../components/navbar8'
import ResearcherTools from '../components/researcher-tools'

import './researcher-page.css'

const ResearcherPage = (props) => {
  const [mode, setMode] = useState('cpu');
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
        <ResearcherTools mode={mode} setMode={setMode} />
      </div>

    </div>
  )
}

export default ResearcherPage
import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'

import Navbar8 from '../components/navbar8'
import Footer4 from '../components/footer4'
import ResearcherTools from '../components/researcher-tools'

import './researcher-page.css'

const ResearcherPage = (props) => {
  return (
    <div className="researcher-page-container">
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

      <ResearcherTools />

      <Footer4
        link1={<Fragment><span className="researcher-page-text26">About Us</span></Fragment>}
        link2={<Fragment><span className="researcher-page-text27">Contact Us</span></Fragment>}
        link3={<Fragment><span className="researcher-page-text28">FAQs</span></Fragment>}
        link4={<Fragment><span className="researcher-page-text29">Support</span></Fragment>}
        link5={<Fragment><span className="researcher-page-text30">Blog</span></Fragment>}
        termsLink={<Fragment><span className="researcher-page-text31">Terms of Service</span></Fragment>}
        cookiesLink={<Fragment><span className="researcher-page-text32">Cookies Policy</span></Fragment>}
        privacyLink={<Fragment><span className="researcher-page-text33">Privacy Policy</span></Fragment>}
        logoSrc="https://images.unsplash.com/photo-1521058001910-55b77aba2203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0MjcwN3w&ixlib=rb-4.1.0&q=80&w=1080"
      />
    </div>
  )
}

export default ResearcherPage
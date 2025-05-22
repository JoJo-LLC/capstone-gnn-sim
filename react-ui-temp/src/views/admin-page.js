import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'

import Navbar8 from '../components/navbar8'
import CTA1 from '../components/cta1'
import ContentList1 from '../components/content-list1'
import Footer4 from '../components/footer4'
import './admin-page.css'

const AdminPage = (props) => {
  return (
    <div className="admin-page-container">
      <Helmet>
        <title>Admin-Page - Low Worthy Emu</title>
        <meta property="og:title" content="Admin-Page - Low Worthy Emu" />
      </Helmet>
      <Navbar8
        link1={
          <Fragment>
            <span className="admin-page-text10">Researcher</span>
          </Fragment>
        }
        link2={
          <Fragment>
            <span className="admin-page-text11">Visitor</span>
          </Fragment>
        }
        link3={
          <Fragment>
            <span className="admin-page-text12">Admin</span>
          </Fragment>
        }
        link4={
          <Fragment>
            <span className="admin-page-text13">Info</span>
          </Fragment>
        }
        page1={
          <Fragment>
            <span className="admin-page-text14">Researcher Dashboard</span>
          </Fragment>
        }
        page2={
          <Fragment>
            <span className="admin-page-text15">Visitor Dashboard</span>
          </Fragment>
        }
        page3={
          <Fragment>
            <span className="admin-page-text16">Admin Dashboard</span>
          </Fragment>
        }
        page4={
          <Fragment>
            <span className="admin-page-text17">Page Four</span>
          </Fragment>
        }
        page1Description={
          <Fragment>
            <span className="admin-page-text18">
              Access tools for uploading files, toggling CPU/GPU, selecting
              visualization mode, and exporting results.
            </span>
          </Fragment>
        }
        page2Description={
          <Fragment>
            <span className="admin-page-text19">
              Explore sample simulations in a grid gallery format.
            </span>
          </Fragment>
        }
        page3Description={
          <Fragment>
            <span className="admin-page-text20">
              Manage user roles, permissions, and simulation data.
            </span>
          </Fragment>
        }
        page4Description={
          <Fragment>
            <span className="admin-page-text21">Page Four Description</span>
          </Fragment>
        }
        link1Url="/researcher-page"
        link2Url="/visitor-page"
        link3Url="/admin-page"
      ></Navbar8>
      <CTA1
        action1={
          <Fragment>
            <span className="admin-page-text22">Main action</span>
          </Fragment>
        }
        heading1={
          <Fragment>
            <span className="admin-page-text23">
              Call to action that excites the visitor to try your product
            </span>
          </Fragment>
        }
        content1={
          <Fragment>
            <span className="admin-page-text24">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat.
            </span>
          </Fragment>
        }
        action2={
          <Fragment>
            <span className="admin-page-text25">Learn More</span>
          </Fragment>
        }
      ></CTA1>
      <ContentList1
        content4={
          <Fragment>
            <span className="admin-page-text26">
              The platform allows users to export simulation results in various
              formats for further analysis or sharing with colleagues.
            </span>
          </Fragment>
        }
        content3={
          <Fragment>
            <span className="admin-page-text27">
              Users can easily upload files for simulations and customize
              visualizations to analyze and interpret results effectively.
            </span>
          </Fragment>
        }
        content6={
          <Fragment>
            <span className="admin-page-text28">
              Organize and store simulation data efficiently within the
              platform, making it easy to track and retrieve information as
              needed.
            </span>
          </Fragment>
        }
        heading5={
          <Fragment>
            <span className="admin-page-text29">User Role Management</span>
          </Fragment>
        }
        content1={
          <Fragment>
            <span className="admin-page-text30">
              Our platform offers cutting-edge tools for advanced structural
              simulations, catering to the needs of researchers, visitors, and
              admins.
            </span>
          </Fragment>
        }
        content2={
          <Fragment>
            <span className="admin-page-text31">
              Each user role - Researcher, Visitor, and Admin - has a dedicated
              dashboard tailored to their specific needs and requirements.
            </span>
          </Fragment>
        }
        heading4={
          <Fragment>
            <span className="admin-page-text32">Export Simulation Results</span>
          </Fragment>
        }
        content5={
          <Fragment>
            <span className="admin-page-text33">
              Effortlessly manage user roles, permissions, and access levels to
              ensure smooth collaboration and data security.
            </span>
          </Fragment>
        }
        heading1={
          <Fragment>
            <span className="admin-page-text34">
              Welcome to our Advanced Structural Simulations Platform
            </span>
          </Fragment>
        }
        heading3={
          <Fragment>
            <span className="admin-page-text35">
              File Upload and Visualization Customization
            </span>
          </Fragment>
        }
        heading6={
          <Fragment>
            <span className="admin-page-text36">
              Simulation Data Management
            </span>
          </Fragment>
        }
        heading2={
          <Fragment>
            <span className="admin-page-text37">User-Specific Dashboards</span>
          </Fragment>
        }
      ></ContentList1>
      <Footer4
        link1={
          <Fragment>
            <span className="admin-page-text38">About Us</span>
          </Fragment>
        }
        link2={
          <Fragment>
            <span className="admin-page-text39">Contact Us</span>
          </Fragment>
        }
        link3={
          <Fragment>
            <span className="admin-page-text40">FAQs</span>
          </Fragment>
        }
        link4={
          <Fragment>
            <span className="admin-page-text41">Support</span>
          </Fragment>
        }
        link5={
          <Fragment>
            <span className="admin-page-text42">Blog</span>
          </Fragment>
        }
        termsLink={
          <Fragment>
            <span className="admin-page-text43">Terms of Service</span>
          </Fragment>
        }
        cookiesLink={
          <Fragment>
            <span className="admin-page-text44">Cookies Policy</span>
          </Fragment>
        }
        privacyLink={
          <Fragment>
            <span className="admin-page-text45">Privacy Policy</span>
          </Fragment>
        }
        logoSrc="https://images.unsplash.com/photo-1521058001910-55b77aba2203?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0MjcwN3w&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080"
      ></Footer4>
    </div>
  )
}

export default AdminPage

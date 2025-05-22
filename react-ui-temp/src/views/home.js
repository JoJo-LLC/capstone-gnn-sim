import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'

import Navbar8 from '../components/navbar8'
import Hero17 from '../components/hero17'
import Steps2 from '../components/steps2'
import Features24 from '../components/features24'
import Features25 from '../components/features25'
import CTA26 from '../components/cta26'
import Contact10 from '../components/contact10'
import Footer4 from '../components/footer4'
import './home.css'

const Home = (props) => {
  return (
    <div className="home-container">
      <Helmet>
        <title>Low Worthy Emu</title>
        <meta property="og:title" content="Low Worthy Emu" />
      </Helmet>
      <Navbar8
        link1={
          <Fragment>
            <span className="home-text10">Researcher</span>
          </Fragment>
        }
        link2={
          <Fragment>
            <span className="home-text11">Visitor</span>
          </Fragment>
        }
        link3={
          <Fragment>
            <span className="home-text12">Admin</span>
          </Fragment>
        }
        link4={
          <Fragment>
            <span className="home-text13">Info</span>
          </Fragment>
        }
        page1={
          <Fragment>
            <span className="home-text14">Researcher Dashboard</span>
          </Fragment>
        }
        page2={
          <Fragment>
            <span className="home-text15">Visitor Dashboard</span>
          </Fragment>
        }
        page3={
          <Fragment>
            <span className="home-text16">Admin Dashboard</span>
          </Fragment>
        }
        page4={
          <Fragment>
            <span className="home-text17">Page Four</span>
          </Fragment>
        }
        page1Description={
          <Fragment>
            <span className="home-text18">
              Access tools for uploading files, toggling CPU/GPU, selecting
              visualization mode, and exporting results.
            </span>
          </Fragment>
        }
        page2Description={
          <Fragment>
            <span className="home-text19">
              Explore sample simulations in a grid gallery format.
            </span>
          </Fragment>
        }
        page3Description={
          <Fragment>
            <span className="home-text20">
              Manage user roles, permissions, and simulation data.
            </span>
          </Fragment>
        }
        page4Description={
          <Fragment>
            <span className="home-text21">Page Four Description</span>
          </Fragment>
        }
        link1Url="/researcher-page"
        link2Url="/visitor-page"
        link3Url="/admin-page"
      ></Navbar8>
      <Hero17
        action1={
          <Fragment>
            <span className="home-text22">Explore as Researcher</span>
          </Fragment>
        }
        action2={
          <Fragment>
            <span className="home-text23">Explore as Visitor</span>
          </Fragment>
        }
        content1={
          <Fragment>
            <span className="home-text24">
              Experience advanced structural simulations with our cutting-edge
              app. Choose your role below to get started.
            </span>
          </Fragment>
        }
        heading1={
          <Fragment>
            <span className="home-text25">
              Welcome to Structural Simulation App
            </span>
          </Fragment>
        }
        image1Src="https://images.unsplash.com/photo-1675573206424-36f844f7627a?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0MTAxOHw&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080"
        rootClassName="hero17root-class-name"
      ></Hero17>
      <Steps2
        step1Title={
          <Fragment>
            <span className="home-text26">Choose Your Role</span>
          </Fragment>
        }
        step2Title={
          <Fragment>
            <span className="home-text27">Upload Files</span>
          </Fragment>
        }
        step3Title={
          <Fragment>
            <span className="home-text28">Customize Visualization</span>
          </Fragment>
        }
        step4Title={
          <Fragment>
            <span className="home-text29">Export Results</span>
          </Fragment>
        }
        step1Description={
          <Fragment>
            <span className="home-text30">
              Select one of the following roles: Researcher, Visitor, or Admin
              to access the respective dashboard.
            </span>
          </Fragment>
        }
        step2Description={
          <Fragment>
            <span className="home-text31">
              Upload the necessary .npz files for GNN input and LS-DYNA ground
              truth data.
            </span>
          </Fragment>
        }
        step3Description={
          <Fragment>
            <span className="home-text32">
              Toggle between CPU and GPU processing, select visualization mode,
              adjust frame settings, and preview the simulation.
            </span>
          </Fragment>
        }
        step4Description={
          <Fragment>
            <span className="home-text33">
              Export the simulation results in GIF, MP4, or CSV format for
              further analysis.
            </span>
          </Fragment>
        }
      ></Steps2>
      <Features24
        feature1Title={
          <Fragment>
            <span className="home-text34">Upload GNN Input</span>
          </Fragment>
        }
        feature2Title={
          <Fragment>
            <span className="home-text35">CPU/GPU Toggle</span>
          </Fragment>
        }
        feature3Title={
          <Fragment>
            <span className="home-text36">Export Data</span>
          </Fragment>
        }
        feature1Description={
          <Fragment>
            <span className="home-text37">
              Upload LS-DYNA ground truth .npz file
            </span>
          </Fragment>
        }
        feature2Description={
          <Fragment>
            <span className="home-text38">
              Toggle between CPU and GPU for simulation processing
            </span>
          </Fragment>
        }
        feature3Description={
          <Fragment>
            <span className="home-text39">
              Export simulation results in CSV format
            </span>
          </Fragment>
        }
      ></Features24>
      <Features25
        feature1Title={
          <Fragment>
            <span className="home-text40">Feature #1</span>
          </Fragment>
        }
        feature2Title={
          <Fragment>
            <span className="home-text41">Feature #2</span>
          </Fragment>
        }
        feature3Title={
          <Fragment>
            <span className="home-text42">Feature #3</span>
          </Fragment>
        }
        feature1Description={
          <Fragment>
            <span className="home-text43">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat.
            </span>
          </Fragment>
        }
        feature2Description={
          <Fragment>
            <span className="home-text44">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat.
            </span>
          </Fragment>
        }
        feature3Description={
          <Fragment>
            <span className="home-text45">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat.
            </span>
          </Fragment>
        }
      ></Features25>
      <CTA26
        action1={
          <Fragment>
            <span className="home-text46">Get Started</span>
          </Fragment>
        }
        content1={
          <Fragment>
            <span className="home-text47">
              Choose your role and get started now.
            </span>
          </Fragment>
        }
        heading1={
          <Fragment>
            <span className="home-text48">
              Ready to explore structural simulations?
            </span>
          </Fragment>
        }
      ></CTA26>
      <Contact10
        content1={
          <Fragment>
            <span className="home-text49">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in ero.
            </span>
          </Fragment>
        }
        heading1={
          <Fragment>
            <span className="home-text50">Github Repository</span>
          </Fragment>
        }
        location1={
          <Fragment>
            <span className="home-text51">GNS Repo</span>
          </Fragment>
        }
        location2={
          <Fragment>
            <span className="home-text52">Main Program Repo</span>
          </Fragment>
        }
        location1Description={
          <Fragment>
            <span className="home-text53">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in ero.
            </span>
          </Fragment>
        }
        location2Description={
          <Fragment>
            <span className="home-text54">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in ero.
            </span>
          </Fragment>
        }
        rootClassName="contact10root-class-name"
      ></Contact10>
      <Footer4
        link1={
          <Fragment>
            <span className="home-text55">About Us</span>
          </Fragment>
        }
        link2={
          <Fragment>
            <span className="home-text56">Contact Us</span>
          </Fragment>
        }
        link3={
          <Fragment>
            <span className="home-text57">FAQs</span>
          </Fragment>
        }
        link4={
          <Fragment>
            <span className="home-text58">Support</span>
          </Fragment>
        }
        link5={
          <Fragment>
            <span className="home-text59">Blog</span>
          </Fragment>
        }
        termsLink={
          <Fragment>
            <span className="home-text60">Terms of Service</span>
          </Fragment>
        }
        cookiesLink={
          <Fragment>
            <span className="home-text61">Cookies Policy</span>
          </Fragment>
        }
        privacyLink={
          <Fragment>
            <span className="home-text62">Privacy Policy</span>
          </Fragment>
        }
        logoSrc="https://images.unsplash.com/photo-1521058001910-55b77aba2203?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0MjcwN3w&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080"
      ></Footer4>
    </div>
  )
}

export default Home

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

const Home = () => {
  return (
    <div className="home-container">
      <Helmet>
        <title>Structural Response Simulation System — Capstone</title>
        <meta
          property="og:title"
          content="Structural Response Simulation System — Capstone"
        />
      </Helmet>

      <Navbar8
        link1={<Fragment><span className="home-text10">Researcher</span></Fragment>}
        link2={<Fragment><span className="home-text11">Visitor</span></Fragment>}
        link3={<Fragment><span className="home-text12">Admin</span></Fragment>}
        link4={<Fragment><span className="home-text13">About</span></Fragment>}
        page1={<Fragment><span className="home-text14">Researcher Dashboard</span></Fragment>}
        page2={<Fragment><span className="home-text15">Visitor Dashboard</span></Fragment>}
        page3={<Fragment><span className="home-text16">Admin Dashboard</span></Fragment>}
        page4={<Fragment><span className="home-text17">Project Overview</span></Fragment>}
        page1Description={
          <Fragment>
            <span className="home-text18">
              Upload .npz files, toggle CPU/GPU, choose visualization modes, and export results for analysis.
            </span>
          </Fragment>
        }
        page2Description={
          <Fragment>
            <span className="home-text19">
              Browse preloaded example simulations in a gallery and preview frames interactively.
            </span>
          </Fragment>
        }
        page3Description={
          <Fragment>
            <span className="home-text20">
              Manage roles, permissions, and stored simulation datasets.
            </span>
          </Fragment>
        }
        page4Description={
          <Fragment>
            <span className="home-text21">
              Learn about the Capstone, tech stack, and documentation links.
            </span>
          </Fragment>
        }
        link1Url="/researcher-page"
        link2Url="/visitor-page"
        link3Url="/admin-page"
      />

      <Hero17
        action1={<Fragment><span className="home-text22">Explore as Researcher</span></Fragment>}
        action2={<Fragment><span className="home-text23">Explore as Visitor</span></Fragment>}
        content1={
          <Fragment>
            <span className="home-text24">
              Run fast structural simulations powered by a Graph Neural Network. Choose your role to get started.
            </span>
          </Fragment>
        }
        heading1={
          <Fragment>
            <span className="home-text25">Structural Response Simulation System (Capstone)</span>
          </Fragment>
        }
        image1Src="https://images.unsplash.com/photo-1675573206424-36f844f7627a?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0MTAxOHw&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080"
        rootClassName="hero17root-class-name"
      />

      <Steps2
        step1Title={<Fragment><span className="home-text26">Choose Your Role</span></Fragment>}
        step2Title={<Fragment><span className="home-text27">Upload Files</span></Fragment>}
        step3Title={<Fragment><span className="home-text28">Customize Visualization</span></Fragment>}
        step4Title={<Fragment><span className="home-text29">Export Results</span></Fragment>}
        step1Description={
          <Fragment>
            <span className="home-text30">
              Use Researcher, Visitor, or Admin to access the relevant dashboard and features.
            </span>
          </Fragment>
        }
        step2Description={
          <Fragment>
            <span className="home-text31">
              Provide GNN inputs and (optionally) LS‑DYNA ground truth in .npz format.
            </span>
          </Fragment>
        }
        step3Description={
          <Fragment>
            <span className="home-text32">
              Switch CPU/GPU, select single, frame‑by‑frame, or side‑by‑side modes, and scrub through frames.
            </span>
          </Fragment>
        }
        step4Description={
          <Fragment>
            <span className="home-text33">
              Save outputs as GIF, MP4, or CSV for reporting and further analysis.
            </span>
          </Fragment>
        }
      />

      <Features24
        feature1Title={<Fragment><span className="home-text34">Upload .npz Inputs</span></Fragment>}
        feature2Title={<Fragment><span className="home-text35">CPU/GPU Toggle</span></Fragment>}
        feature3Title={<Fragment><span className="home-text36">Export Results</span></Fragment>}
        feature1Description={
          <Fragment>
            <span className="home-text37">Load simulation inputs and optional LS‑DYNA reference data.</span>
          </Fragment>
        }
        feature2Description={
          <Fragment>
            <span className="home-text38">Run locally on CPU or accelerate on GPU when available.</span>
          </Fragment>
        }
        feature3Description={
          <Fragment>
            <span className="home-text39">Download results in CSV, with animation export to GIF/MP4.</span>
          </Fragment>
        }
      />

      <Features25
        feature1Title={<Fragment><span className="home-text40">Rapid Iteration</span></Fragment>}
        feature2Title={<Fragment><span className="home-text41">Local‑First Desktop App</span></Fragment>}
        feature3Title={<Fragment><span className="home-text42">3D Visualization</span></Fragment>}
        feature1Description={
          <Fragment>
            <span className="home-text43">
              GNN‑based predictions return in minutes, enabling quick design cycles.
            </span>
          </Fragment>
        }
        feature2Description={
          <Fragment>
            <span className="home-text44">
              Built with Tauri + React; works offline on standard hardware.
            </span>
          </Fragment>
        }
        feature3Description={
          <Fragment>
            <span className="home-text45">
              Interactive viewing with single, frame‑by‑frame, and side‑by‑side modes.
            </span>
          </Fragment>
        }
      />

      <CTA26
        action1={<Fragment><span className="home-text46">Get Started</span></Fragment>}
        content1={
          <Fragment>
            <span className="home-text47">
              Choose your role to explore example simulations or run your own.
            </span>
          </Fragment>
        }
        heading1={<Fragment><span className="home-text48">Ready to run a simulation?</span></Fragment>}
      />

      <Contact10
        content1={
          <Fragment>
            <span className="home-text49">
              Repositories and docs for the Capstone project are available to contributors.
            </span>
          </Fragment>
        }
        heading1={<Fragment><span className="home-text50">Project Repositories</span></Fragment>}
        location1={<Fragment><span className="home-text51">GNN / Model Serving</span></Fragment>}
        location2={<Fragment><span className="home-text52">Desktop App (Tauri + React)</span></Fragment>}
        location1Description={
          <Fragment>
            <span className="home-text53">FastAPI + PyTorch backend, Dockerized environment, and dataset handling.</span>
          </Fragment>
        }
        location2Description={
          <Fragment>
            <span className="home-text54">Local‑first UI with role‑based access and export utilities.</span>
          </Fragment>
        }
        rootClassName="contact10root-class-name"
      />

      <Footer4
        link1={<Fragment><span className="home-text55">About</span></Fragment>}
        link2={<Fragment><span className="home-text56">Contact</span></Fragment>}
        link3={<Fragment><span className="home-text57">FAQs</span></Fragment>}
        link4={<Fragment><span className="home-text58">Support</span></Fragment>}
        link5={<Fragment><span className="home-text59">Blog</span></Fragment>}
        termsLink={<Fragment><span className="home-text60">Terms of Service</span></Fragment>}
        cookiesLink={<Fragment><span className="home-text61">Cookies Policy</span></Fragment>}
        privacyLink={<Fragment><span className="home-text62">Privacy Policy</span></Fragment>}
        logoSrc="https://images.unsplash.com/photo-1521058001910-55b77aba2203?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0MjcwN3w&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080"
      />
    </div>
  )
}

export default Home

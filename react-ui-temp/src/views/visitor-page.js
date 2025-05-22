import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'

import Navbar8 from '../components/navbar8'
import CTA263 from '../components/cta263'
import Footer4 from '../components/footer4'
import './visitor-page.css'

const VisitorPage = (props) => {
  return (
    <div className="visitor-page-container">
      <Helmet>
        <title>Visitor-Page - Low Worthy Emu</title>
        <meta property="og:title" content="Visitor-Page - Low Worthy Emu" />
      </Helmet>
      <Navbar8
        link1={
          <Fragment>
            <span className="visitor-page-text10">Researcher</span>
          </Fragment>
        }
        link2={
          <Fragment>
            <span className="visitor-page-text11">Visitor</span>
          </Fragment>
        }
        link3={
          <Fragment>
            <span className="visitor-page-text12">Admin</span>
          </Fragment>
        }
        link4={
          <Fragment>
            <span className="visitor-page-text13">Info</span>
          </Fragment>
        }
        page1={
          <Fragment>
            <span className="visitor-page-text14">Researcher Dashboard</span>
          </Fragment>
        }
        page2={
          <Fragment>
            <span className="visitor-page-text15">Visitor Dashboard</span>
          </Fragment>
        }
        page3={
          <Fragment>
            <span className="visitor-page-text16">Admin Dashboard</span>
          </Fragment>
        }
        page4={
          <Fragment>
            <span className="visitor-page-text17">Page Four</span>
          </Fragment>
        }
        page1Description={
          <Fragment>
            <span className="visitor-page-text18">
              Access tools for uploading files, toggling CPU/GPU, selecting
              visualization mode, and exporting results.
            </span>
          </Fragment>
        }
        page2Description={
          <Fragment>
            <span className="visitor-page-text19">
              Explore sample simulations in a grid gallery format.
            </span>
          </Fragment>
        }
        page3Description={
          <Fragment>
            <span className="visitor-page-text20">
              Manage user roles, permissions, and simulation data.
            </span>
          </Fragment>
        }
        page4Description={
          <Fragment>
            <span className="visitor-page-text21">Page Four Description</span>
          </Fragment>
        }
        link1Url="/researcher-page"
        link2Url="/visitor-page"
        link3Url="/admin-page"
      ></Navbar8>
      <CTA263
        heading1={
          <Fragment>
            <span className="visitor-page-text22">
              Ready to revolutionize your structural simulations?
            </span>
          </Fragment>
        }
        content1={
          <Fragment>
            <span className="visitor-page-text23">
              Sign up now to access advanced tools and features for your
              research projects.
            </span>
          </Fragment>
        }
        action1={
          <Fragment>
            <span className="visitor-page-text24">Get Started</span>
          </Fragment>
        }
      ></CTA263>
      <Footer4
        link1={
          <Fragment>
            <span className="visitor-page-text25">About Us</span>
          </Fragment>
        }
        link2={
          <Fragment>
            <span className="visitor-page-text26">Contact Us</span>
          </Fragment>
        }
        link3={
          <Fragment>
            <span className="visitor-page-text27">FAQs</span>
          </Fragment>
        }
        link4={
          <Fragment>
            <span className="visitor-page-text28">Support</span>
          </Fragment>
        }
        link5={
          <Fragment>
            <span className="visitor-page-text29">Blog</span>
          </Fragment>
        }
        termsLink={
          <Fragment>
            <span className="visitor-page-text30">Terms of Service</span>
          </Fragment>
        }
        cookiesLink={
          <Fragment>
            <span className="visitor-page-text31">Cookies Policy</span>
          </Fragment>
        }
        privacyLink={
          <Fragment>
            <span className="visitor-page-text32">Privacy Policy</span>
          </Fragment>
        }
        logoSrc="https://images.unsplash.com/photo-1521058001910-55b77aba2203?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0MjcwN3w&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080"
      ></Footer4>
    </div>
  )
}

export default VisitorPage

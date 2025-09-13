import React from 'react'
import { Helmet } from 'react-helmet'

import Navbar8 from '../components/navbar8'
import Footer4 from '../components/footer4'
import AdminDashboard from '../components/AdminDashboard'

import './admin-page.css'

const AdminPage = () => {
  return (
    <div className="admin-page-container">
      <Helmet>
        <title>Admin Dashboard</title>
        <meta property="og:title" content="Admin Dashboard" />
      </Helmet>
      <Navbar8
        link1="Researcher"
        link2="Visitor"
        link3="Admin"
        link4="Info"
        page1="Researcher Dashboard"
        page2="Visitor Dashboard"
        page3="Admin Dashboard"
        page4="Info Page"
        page1Description="Upload, toggle mode, and export simulations"
        page2Description="Browse simulation gallery"
        page3Description="Manage users and data access"
        page4Description="Info placeholder"
        link1Url="/researcher-page"
        link2Url="/visitor-page"
        link3Url="/admin-page"
      />
      <div className="admin-overlay">
        <AdminDashboard />
      </div>
      <Footer4
        link1="About Us"
        link2="Contact Us"
        link3="FAQs"
        link4="Support"
        link5="Blog"
        termsLink="Terms of Service"
        cookiesLink="Cookies Policy"
        privacyLink="Privacy Policy"
        logoSrc="https://images.unsplash.com/photo-1521058001910-55b77aba2203"
      />
    </div>
  )
}

export default AdminPage
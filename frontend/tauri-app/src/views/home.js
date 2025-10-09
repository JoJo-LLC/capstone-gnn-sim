// FILE: src/views/home.js
import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import Navbar8 from '../components/navbar8';
import Hero17 from '../components/hero17';
import Steps2 from '../components/steps2';
import Features24 from '../components/features24';
import Features25 from '../components/features25';
import CTA26 from '../components/cta26';
import Contact10 from '../components/contact10';
import Footer4 from '../components/footer4';

import './home.css';   // Page-specific styling

const Home = () => {
  return (
    <div className="home-container">
      <Helmet>
        <title>Structural Response Simulation System — Capstone</title>
        <meta
          name="description"
          content="Run fast, accurate structural simulations powered by Graph Neural Networks. Explore example runs, upload .npz inputs, visualize in 3D, and export results — all from a local-first desktop app."
        />
      </Helmet>

      {/* NAVBAR */}
      <section className="fullwidth">
        <Navbar8
          link1="Researcher"
          link2="Visitor"
          link3="Admin"
          link4="About"
          link1Url="/researcher-page"
          link2Url="/visitor-page"
          link3Url="/admin-page"
        />
      </section>

      {/* HERO */}
      <section className="fullwidth">
        <Hero17
          action1="Explore as Researcher"
          action2="Explore as Visitor"
          content1="Run fast structural simulations powered by a Graph Neural Network. Choose your role to get started."
          heading1="Structural Response Simulation System (Capstone)"
          image1Src="https://images.unsplash.com/photo-1675573206424-36f844f7627a"
        />
      </section>

      {/* STEPS (Orange Background) */}
      <section className="steps-section fullwidth">
        <Steps2
          step1Title="Choose Your Role"
          step1Description="Select Researcher, Visitor, or Admin to access the relevant dashboard and features."
          step2Title="Upload Files"
          step2Description="Provide GNN inputs and LS-DYNA ground truth in .npz format."
          step3Title="Customize Visualization"
          step3Description="Switch between CPU/GPU, choose visualization mode, and scrub through frames interactively."
          step4Title="Export Results"
          step4Description="Save results as GIF, MP4, or CSV for reporting and further analysis."
        />
      </section>

      {/* FEATURES 1 */}
      <section className="fullwidth">
        <Features24
          feature1Title="Upload .npz Inputs"
          feature2Title="CPU/GPU Toggle"
          feature3Title="Export Results"
          feature1Description="Load simulation inputs and optional LS-DYNA reference data."
          feature2Description="Run locally on CPU or accelerate on GPU when available."
          feature3Description="Download results in CSV, with animation export to GIF/MP4."
        />
      </section>

      {/* FEATURES 2 */}
      <section className="fullwidth">
        <Features25
          feature1Title="Rapid Iteration"
          feature2Title="Local-First Desktop App"
          feature3Title="3D Visualization"
          feature1Description="GNN-based predictions return in minutes, enabling quick design cycles."
          feature2Description="Built with Tauri + React; works offline on standard hardware."
          feature3Description="Interactive viewing with single, frame-by-frame, and side-by-side modes."
        />
      </section>

      {/* CTA */}
      <section className="fullwidth">
        <CTA26
          action1="Get Started"
          content1="Choose your role to explore example simulations or run your own."
          heading1="Ready to run a simulation?"
        />
      </section>

      {/* CONTACT / REPOSITORIES */}
      <section className="fullwidth">
        <Contact10
          content1="Repositories and docs for the Capstone project are available to contributors."
          heading1="Project Repositories"
          location1="GNN / Model Serving"
          location2="Desktop App (Tauri + React)"
          location1Description="FastAPI + PyTorch backend, Dockerized environment, and dataset handling."
          location2Description="Local-first UI with role-based access and export utilities."
        />
      </section>

      {/* FOOTER */}
      <section className="fullwidth">
        <Footer4
          link1="About"
          link2="Contact"
          link3="FAQs"
          link4="Support"
          link5="Blog"
          termsLink="Terms of Service"
          cookiesLink="Cookies Policy"
          privacyLink="Privacy Policy"
        />
      </section>
    </div>
  );
};

export default Home;

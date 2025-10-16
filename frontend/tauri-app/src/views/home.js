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
        <title>Structural Response Simulation System</title>
        <meta
          name="description"
          content="Run fast, accurate structural simulations powered by Graph Neural Networks. Explore example runs, upload .npz inputs, visualize in 3D, and export results — all from a local-first desktop app."
        />
      </Helmet>

      {/* NAVBAR */}
      <section className="bg-brand--white fullwidth">
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
      <section className="bg-brand--white fullwidth">
        <Hero17
          content1="Welcome to our simulation platform — simple, private, and powerful."
          heading1="Structural Response Simulation System"
          image1Src="https://images.unsplash.com/photo-1675573206424-36f844f7627a"
        />
      </section>

      {/* STEPS (Orange Background) */}
      <section className="steps-section fullwidth">
        <Steps2
          step1Title="Choose Your Role"
          step1Description="Select Researcher, Visitor, or Admin to access the relevant dashboard and features."
          step2Title="Data Preprocessing"
          step2Description="Upload your LS-DYNA simulation folder and convert it into NPZ format using the built-in tool. Progress is shown beneath the button."
          step3Title="FGN Inference"
          step3Description="Configure inference parameters and run the simulation using the selected model. Track real-time progress in the log panel."
          step4Title="View Results"
          step4Description="Visualisation appears in top right panel\nUse mode selector to change between GIF, MP4, and comparison views"
        />
      </section>

      {/* FEATURES 1 */}
      <section className="bg-brand--white fullwidth">
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
      <section className="bg-brand--white fullwidth">
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
      <section className="bg-brand--white fullwidth">
        <CTA26
          action1="Get Started"
          content1="Let's take you to the dashboard to run your first simulation."
          heading1="Ready to run a simulation?"
        />
      </section>

      {/* CONTACT / REPOSITORIES */}
      <section className="bg-brand--white fullwidth">
        <Contact10
          content1="Repositories and docs for the application are available to contributors."
          heading1="Project Repositories"
          location1="GNN / Model Serving"
          location2="Desktop App (Tauri + React)"
          location1Description="FastAPI + PyTorch backend, Dockerized environment, and dataset handling."
          location2Description="Local-first UI with role-based access and export utilities."
        />
      </section>

      {/* FOOTER */}
      <section className="bg-brand--white fullwidth">
        <Footer4
          termsLink="Terms of Service"
          cookiesLink="Cookies Policy"
          privacyLink="Privacy Policy"
          hideExtraLinks={true}
          hideLogo={true}
        />
      </section>
    </div>
  );
};

export default Home;

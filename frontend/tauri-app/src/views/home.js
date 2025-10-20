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
          action1="Explore as Researcher"
          action2="Explore as Visitor"
          content1="Run fast structural simulations powered by a Graph Neural Network. Choose your role to get started."
          heading1="Structural Response Simulation System"
         //image1Src="https://images.unsplash.com/photo-1675573206424-36f844f7627a"
           image1Src="/assets/1.png"
           image2Src="/assets/2.png"
           image3Src="/assets/3.png"
           image4Src="/assets/4.png"
           image5Src="/assets/5.png"
           image6Src="/assets/6.png"
           image7Src="/assets/7.png"
           image8Src="/assets/8.png"
           image9Src="/assets/9.png"
           image10Src="/assets/10.png"
           image11Src="/assets/11.png"
           image12Src="/assets/12.png"
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
      <section className="bg-brand--white fullwidth">
        <Features24
          feature1Title="Upload .npz Inputs"
          feature2Title="CPU/GPU Toggle"
          feature3Title="Export Results"
          feature1Description="Load simulation inputs and optional FEA reference data."
          feature2Description="Run locally on CPU or accelerate on GPU when available."
          feature3Description="Download results in CSV, with animation export to GIF/MP4."
           feature1ImgSrc="/assets/14.png"
            feature2ImgSrc="/assets/15.png"
            feature3ImgSrc="/assets/16.png"
           
        />
      </section>

      {/* FEATURES 2 */}
      <section className="bg-brand--white fullwidth">
        <Features25
          feature1Title="Fast GNN Predictions"
          feature2Title="Local-First Desktop App"
          feature3Title="Multiple Visualization Modes"
          feature1Description="GNN-based predictions return in minutes, enabling quick design cycles."
          feature2Description="Built with Tauri + React; works offline on standard hardware."
          feature3Description="Interactive viewing with eps, eps frame by frame and fragment view."
          feature3ImgSrc="/assets/21.png"
          feature2ImgSrc="/assets/18.png"
          feature1ImgSrc="/assets/19.png"
        />
      </section>

      {/* CTA */}
      <section className="bg-brand--white fullwidth">
        <CTA26
          action1="Get Started"
          content1="Choose your role to explore example simulations or run your own."
          heading1="Ready to run a simulation?"
        />
      </section>

      {/* CONTACT / REPOSITORIES */}
      <section className="bg-brand--white fullwidth">
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
      <section className="bg-brand--white fullwidth">
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

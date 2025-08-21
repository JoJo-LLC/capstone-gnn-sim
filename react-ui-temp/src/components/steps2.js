import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './steps2.css'

const Steps2 = (props) => {
  return (
    <div className="steps2-container1 thq-section-padding">
      <div className="steps2-max-width thq-section-max-width">
        <div className="steps2-container2 thq-grid-2">
          {/* Section Header */}
          <div className="steps2-section-header">
            <h2 className="thq-heading-2">
              Discover the Power of Our Simulation Platform
            </h2>
            <p className="thq-body-large">
              Our Structural Response Simulation System harnesses Graph Neural Network technology 
              to deliver rapid, accurate predictions of structural behavior. Whether you’re a researcher, 
              visitor, or admin, you can explore detailed 3D visualizations, compare results with LS-DYNA, 
              and run simulations offline on standard hardware — all within minutes.
            </p>
            <div className="steps2-actions">
              <button className="thq-button-animated thq-button-filled steps2-button">
                <span className="thq-body-small">Watch Demo Video</span>
              </button>
            </div>
          </div>

          {/* Steps Cards */}
          <div className="steps2-container3">
            <div className="steps2-container4 thq-card">
              <h2 className="thq-heading-2">
                {props.step1Title ?? (
                  <Fragment>
                    <span className="steps2-text30">Choose Your Role</span>
                  </Fragment>
                )}
              </h2>
              <span className="steps2-text14 thq-body-small">
                {props.step1Description ?? (
                  <Fragment>
                    <span className="steps2-text32">
                      Select Researcher, Visitor, or Admin to access the relevant dashboard and features.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps2-text15 thq-heading-3">01</label>
            </div>

            <div className="steps2-container5 thq-card">
              <h2 className="thq-heading-2">
                {props.step2Title ?? (
                  <Fragment>
                    <span className="steps2-text28">Upload Files</span>
                  </Fragment>
                )}
              </h2>
              <span className="steps2-text17 thq-body-small">
                {props.step2Description ?? (
                  <Fragment>
                    <span className="steps2-text29">
                      Upload .npz GNN inputs and optional LS-DYNA reference data for comparison.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps2-text18 thq-heading-3">02</label>
            </div>

            <div className="steps2-container6 thq-card">
              <h2 className="thq-heading-2">
                {props.step3Title ?? (
                  <Fragment>
                    <span className="steps2-text31">Customize Visualization</span>
                  </Fragment>
                )}
              </h2>
              <span className="steps2-text20 thq-body-small">
                {props.step3Description ?? (
                  <Fragment>
                    <span className="steps2-text27">
                      Toggle CPU/GPU, switch between single, frame-by-frame, and side-by-side modes, 
                      and scrub through simulation frames.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps2-text21 thq-heading-3">03</label>
            </div>

            <div className="steps2-container7 thq-card">
              <h2 className="thq-heading-2">
                {props.step4Title ?? (
                  <Fragment>
                    <span className="steps2-text26">Export Results</span>
                  </Fragment>
                )}
              </h2>
              <span className="steps2-text23 thq-body-small">
                {props.step4Description ?? (
                  <Fragment>
                    <span className="steps2-text25">
                      Export your simulation results as GIF, MP4, or CSV for reports, 
                      analysis, and sharing.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps2-text24 thq-heading-3">04</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Steps2.defaultProps = {
  step4Description: undefined,
  step4Title: undefined,
  step3Description: undefined,
  step2Title: undefined,
  step2Description: undefined,
  step1Title: undefined,
  step3Title: undefined,
  step1Description: undefined,
}

Steps2.propTypes = {
  step4Description: PropTypes.element,
  step4Title: PropTypes.element,
  step3Description: PropTypes.element,
  step2Title: PropTypes.element,
  step2Description: PropTypes.element,
  step1Title: PropTypes.element,
  step3Title: PropTypes.element,
  step1Description: PropTypes.element,
}

export default Steps2

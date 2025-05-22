import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './steps22.css'

const Steps22 = (props) => {
  return (
    <div className="steps22-container1 thq-section-padding">
      <div className="steps22-max-width thq-section-max-width">
        <div className="steps22-container2 thq-grid-2">
          <div className="steps22-section-header">
            <h2 className="thq-heading-2">
              Discover the Power of Our Products
            </h2>
            <p className="thq-body-large">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat.
            </p>
            <div className="steps22-actions">
              <button className="thq-button-animated thq-button-filled steps22-button">
                <span className="thq-body-small">Main action</span>
              </button>
            </div>
          </div>
          <div className="steps22-container3">
            <div className="steps22-container4 thq-card">
              <h2 className="thq-heading-2">
                {props.step1Title ?? (
                  <Fragment>
                    <span className="steps22-text29">Upload Files</span>
                  </Fragment>
                )}
              </h2>
              <span className="steps22-text14 thq-body-small">
                {props.step1Description ?? (
                  <Fragment>
                    <span className="steps22-text25">
                      Easily upload your structural simulation files to the
                      platform.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps22-text15 thq-heading-3">01</label>
            </div>
            <div className="steps22-container5 thq-card">
              <h2 className="thq-heading-2">
                {props.step2Title ?? (
                  <Fragment>
                    <span className="steps22-text27">Manage Data</span>
                  </Fragment>
                )}
              </h2>
              <span className="steps22-text17 thq-body-small">
                {props.step2Description ?? (
                  <Fragment>
                    <span className="steps22-text28">
                      Organize and manage your simulation data efficiently with
                      our intuitive tools.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps22-text18 thq-heading-3">02</label>
            </div>
            <div className="steps22-container6 thq-card">
              <h2 className="thq-heading-2">
                {props.step3Title ?? (
                  <Fragment>
                    <span className="steps22-text30">
                      Customize Visualizations
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="steps22-text20 thq-body-small">
                {props.step3Description ?? (
                  <Fragment>
                    <span className="steps22-text26">
                      Tailor the visual representation of your simulations to
                      gain deeper insights.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps22-text21 thq-heading-3">03</label>
            </div>
            <div className="steps22-container7 thq-card">
              <h2 className="thq-heading-2">
                {props.step4Title ?? (
                  <Fragment>
                    <span className="steps22-text32">
                      Access Specific Dashboards
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="steps22-text23 thq-body-small">
                {props.step4Description ?? (
                  <Fragment>
                    <span className="steps22-text31">
                      Choose your role to access specialized dashboards and
                      features for seamless simulation processing.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps22-text24 thq-heading-3">04</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Steps22.defaultProps = {
  step1Description: undefined,
  step3Description: undefined,
  step2Title: undefined,
  step2Description: undefined,
  step1Title: undefined,
  step3Title: undefined,
  step4Description: undefined,
  step4Title: undefined,
}

Steps22.propTypes = {
  step1Description: PropTypes.element,
  step3Description: PropTypes.element,
  step2Title: PropTypes.element,
  step2Description: PropTypes.element,
  step1Title: PropTypes.element,
  step3Title: PropTypes.element,
  step4Description: PropTypes.element,
  step4Title: PropTypes.element,
}

export default Steps22

import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './steps23.css'

const Steps23 = (props) => {
  return (
    <div className="steps23-container1 thq-section-padding">
      <div className="steps23-max-width thq-section-max-width">
        <div className="steps23-container2 thq-grid-2">
          <div className="steps23-section-header">
            <h2 className="thq-heading-2">
              Discover the Power of Our Products
            </h2>
            <p className="thq-body-large">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat.
            </p>
            <div className="steps23-actions">
              <button className="thq-button-animated thq-button-filled steps23-button">
                <span className="thq-body-small">Main action</span>
              </button>
            </div>
          </div>
          <div className="steps23-container3">
            <div className="steps23-container4 thq-card">
              <h2 className="thq-heading-2">
                {props.step1Title ?? (
                  <Fragment>
                    <span className="steps23-text29">Choose Your Role</span>
                  </Fragment>
                )}
              </h2>
              <span className="steps23-text14 thq-body-small">
                {props.step1Description ?? (
                  <Fragment>
                    <span className="steps23-text25">
                      Select if you want to be a researcher, visitor, or admin
                      to access specific features.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps23-text15 thq-heading-3">01</label>
            </div>
            <div className="steps23-container5 thq-card">
              <h2 className="thq-heading-2">
                {props.step2Title ?? (
                  <Fragment>
                    <span className="steps23-text27">
                      Upload Files and Customize
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="steps23-text17 thq-body-small">
                {props.step2Description ?? (
                  <Fragment>
                    <span className="steps23-text28">
                      Researchers can upload files, customize visualization
                      settings, and set parameters for simulations.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps23-text18 thq-heading-3">02</label>
            </div>
            <div className="steps23-container6 thq-card">
              <h2 className="thq-heading-2">
                {props.step3Title ?? (
                  <Fragment>
                    <span className="steps23-text30">
                      Explore Sample Simulations
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="steps23-text20 thq-body-small">
                {props.step3Description ?? (
                  <Fragment>
                    <span className="steps23-text26">
                      Visitors can browse through pre-loaded sample simulations
                      to see the capabilities of the app.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps23-text21 thq-heading-3">03</label>
            </div>
            <div className="steps23-container7 thq-card">
              <h2 className="thq-heading-2">
                {props.step4Title ?? (
                  <Fragment>
                    <span className="steps23-text32">
                      Manage Users and Data
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="steps23-text23 thq-body-small">
                {props.step4Description ?? (
                  <Fragment>
                    <span className="steps23-text31">
                      Admins have the ability to manage user roles, access
                      control, and data within the app.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps23-text24 thq-heading-3">04</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Steps23.defaultProps = {
  step1Description: undefined,
  step3Description: undefined,
  step2Title: undefined,
  step2Description: undefined,
  step1Title: undefined,
  step3Title: undefined,
  step4Description: undefined,
  step4Title: undefined,
}

Steps23.propTypes = {
  step1Description: PropTypes.element,
  step3Description: PropTypes.element,
  step2Title: PropTypes.element,
  step2Description: PropTypes.element,
  step1Title: PropTypes.element,
  step3Title: PropTypes.element,
  step4Description: PropTypes.element,
  step4Title: PropTypes.element,
}

export default Steps23

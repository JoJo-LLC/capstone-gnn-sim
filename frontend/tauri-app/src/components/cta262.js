import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './cta262.css'

const CTA262 = (props) => {
  return (
    <div className="thq-section-padding">
      <div className="thq-section-max-width">
        <div className="cta262-accent2-bg">
          <div className="cta262-accent1-bg">
            <div className="cta262-container2">
              <div className="cta262-content">
                <span className="thq-heading-2">
                  {props.heading1 ?? (
                    <Fragment>
                      <span className="cta262-text4">
                        Start Simulating Today
                      </span>
                    </Fragment>
                  )}
                </span>
                <p className="thq-body-large">
                  {props.content1 ?? (
                    <Fragment>
                      <span className="cta262-text5">
                        Join our platform to access advanced structural
                        simulation tools and enhance your research.
                      </span>
                    </Fragment>
                  )}
                </p>
              </div>
              <div className="cta262-actions">
                <button
                  type="button"
                  className="thq-button-filled cta262-button"
                >
                  <span>
                    {props.action1 ?? (
                      <Fragment>
                        <span className="cta262-text6">Get Started</span>
                      </Fragment>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CTA262.defaultProps = {
  heading1: undefined,
  content1: undefined,
  action1: undefined,
}

CTA262.propTypes = {
  heading1: PropTypes.element,
  content1: PropTypes.element,
  action1: PropTypes.element,
}

export default CTA262

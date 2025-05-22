import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './cta263.css'

const CTA263 = (props) => {
  return (
    <div className="thq-section-padding">
      <div className="thq-section-max-width">
        <div className="cta263-accent2-bg">
          <div className="cta263-accent1-bg">
            <div className="cta263-container2">
              <div className="cta263-content">
                <span className="thq-heading-2">
                  {props.heading1 ?? (
                    <Fragment>
                      <span className="cta263-text4">
                        Ready to revolutionize your structural simulations?
                      </span>
                    </Fragment>
                  )}
                </span>
                <p className="thq-body-large">
                  {props.content1 ?? (
                    <Fragment>
                      <span className="cta263-text5">
                        Sign up now to access advanced tools and features for
                        your research projects.
                      </span>
                    </Fragment>
                  )}
                </p>
              </div>
              <div className="cta263-actions">
                <button
                  type="button"
                  className="thq-button-filled cta263-button"
                >
                  <span>
                    {props.action1 ?? (
                      <Fragment>
                        <span className="cta263-text6">Get Started</span>
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

CTA263.defaultProps = {
  heading1: undefined,
  content1: undefined,
  action1: undefined,
}

CTA263.propTypes = {
  heading1: PropTypes.element,
  content1: PropTypes.element,
  action1: PropTypes.element,
}

export default CTA263

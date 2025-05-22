import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './cta1.css'

const CTA1 = (props) => {
  return (
    <div className="cta1-container thq-section-padding">
      <div className="cta1-max-width thq-section-max-width">
        <div className="cta1-content">
          <h2 className="cta1-heading1 thq-heading-2">
            {props.heading1 ?? (
              <Fragment>
                <span className="cta1-text2">
                  Call to action that excites the visitor to try your product
                </span>
              </Fragment>
            )}
          </h2>
          <p className="cta1-content1 thq-body-large">
            {props.content1 ?? (
              <Fragment>
                <span className="cta1-text3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse varius enim in eros elementum tristique. Duis
                  cursus, mi quis viverra ornare, eros dolor interdum nulla, ut
                  commodo diam libero vitae erat.
                </span>
              </Fragment>
            )}
          </p>
          <div className="cta1-actions">
            <button className="thq-button-filled cta1-button1">
              <span className="cta1-action1 thq-body-small">
                {props.action1 ?? (
                  <Fragment>
                    <span className="cta1-text1">Main action</span>
                  </Fragment>
                )}
              </span>
            </button>
            <button className="thq-button-outline cta1-button2">
              <span className="cta1-action2 thq-body-small">
                {props.action2 ?? (
                  <Fragment>
                    <span className="cta1-text4">Learn More</span>
                  </Fragment>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

CTA1.defaultProps = {
  action1: undefined,
  heading1: undefined,
  content1: undefined,
  action2: undefined,
}

CTA1.propTypes = {
  action1: PropTypes.element,
  heading1: PropTypes.element,
  content1: PropTypes.element,
  action2: PropTypes.element,
}

export default CTA1

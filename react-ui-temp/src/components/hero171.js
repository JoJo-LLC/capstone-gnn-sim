import React, { Fragment } from 'react'

import Script from 'dangerous-html/react'
import PropTypes from 'prop-types'

import './hero171.css'

const Hero171 = (props) => {
  return (
    <div className="hero171-header78">
      <div className="hero171-column thq-section-padding thq-section-max-width">
        <div className="hero171-content1">
          <h1 className="hero171-text1 thq-heading-1">
            {props.heading1 ?? (
              <Fragment>
                <span className="hero171-text7">
                  Welcome to Advanced Structural Simulations Platform
                </span>
              </Fragment>
            )}
          </h1>
          <p className="hero171-text2 thq-body-large">
            {props.content1 ?? (
              <Fragment>
                <span className="hero171-text8">
                  Empowering researchers with cutting-edge tools for structural
                  simulations
                </span>
              </Fragment>
            )}
          </p>
        </div>
        <div className="hero171-actions">
          <button className="thq-button-filled hero171-button1">
            <span className="thq-body-small">
              {props.action1 ?? (
                <Fragment>
                  <span className="hero171-text6">Get Started</span>
                </Fragment>
              )}
            </span>
          </button>
          <button className="thq-button-outline hero171-button2">
            <span className="thq-body-small">
              {props.action2 ?? (
                <Fragment>
                  <span className="hero171-text5">Learn More</span>
                </Fragment>
              )}
            </span>
          </button>
        </div>
      </div>
      <div className="hero171-content2"></div>
      <div>
        <div className="hero171-container2">
          <Script
            html={`<style>
  @keyframes scroll-x {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - 16px));
    }
  }

  @keyframes scroll-y {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-100% - 16px));
    }
  }
</style>
`}
          ></Script>
        </div>
      </div>
    </div>
  )
}

Hero171.defaultProps = {
  action2: undefined,
  action1: undefined,
  heading1: undefined,
  content1: undefined,
}

Hero171.propTypes = {
  action2: PropTypes.element,
  action1: PropTypes.element,
  heading1: PropTypes.element,
  content1: PropTypes.element,
}

export default Hero171

import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './contact102.css'

const Contact102 = (props) => {
  return (
    <div className="contact102-container1 thq-section-padding">
      <div className="contact102-max-width thq-section-max-width">
        <div className="contact102-content1 thq-flex-row">
          <div className="contact102-content2">
            <h2 className="thq-heading-2">
              {props.heading1 ?? (
                <Fragment>
                  <span className="contact102-text18">Locations</span>
                </Fragment>
              )}
            </h2>
            <p className="thq-body-large">
              {props.content1 ?? (
                <Fragment>
                  <span className="contact102-text16">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in ero.
                  </span>
                </Fragment>
              )}
            </p>
          </div>
        </div>
        <div className="contact102-content3 thq-flex-row">
          <div className="contact102-container2">
            <img
              alt={props.location1ImageAlt}
              src={props.location1ImageSrc}
              className="contact102-image1 thq-img-ratio-16-9"
            />
            <h3 className="contact102-text12 thq-heading-3">
              {props.location1 ?? (
                <Fragment>
                  <span className="contact102-text20">Bucharest</span>
                </Fragment>
              )}
            </h3>
            <p className="thq-body-large">
              {props.location1Description ?? (
                <Fragment>
                  <span className="contact102-text17">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in ero.
                  </span>
                </Fragment>
              )}
            </p>
            <div className="contact102-container3">
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-button-flat thq-body-small"
              >
                Get directions
              </a>
            </div>
          </div>
          <div className="contact102-container4">
            <img
              alt={props.location2ImageAlt}
              src={props.location2ImageSrc}
              className="contact102-image2 thq-img-ratio-16-9"
            />
            <h3 className="contact102-text14 thq-heading-3">
              {props.location2 ?? (
                <Fragment>
                  <span className="contact102-text21">Cluj - Napoca</span>
                </Fragment>
              )}
            </h3>
            <p className="thq-body-large">
              {props.location2Description ?? (
                <Fragment>
                  <span className="contact102-text19">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in ero.
                  </span>
                </Fragment>
              )}
            </p>
            <div className="contact102-container5">
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-button-flat thq-body-small"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Contact102.defaultProps = {
  content1: undefined,
  location2ImageSrc:
    'https://images.unsplash.com/photo-1697971741569-b9009f2847cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0Njg3NHw&ixlib=rb-4.1.0&q=80&w=1080',
  location1ImageSrc:
    'https://images.unsplash.com/photo-1631889993877-71e193bf79b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0Njg3NXw&ixlib=rb-4.1.0&q=80&w=1080',
  location1Description: undefined,
  location2ImageAlt: 'image2Alt',
  heading1: undefined,
  location2Description: undefined,
  location1ImageAlt: 'image1Alt',
  location1: undefined,
  location2: undefined,
}

Contact102.propTypes = {
  content1: PropTypes.element,
  location2ImageSrc: PropTypes.string,
  location1ImageSrc: PropTypes.string,
  location1Description: PropTypes.element,
  location2ImageAlt: PropTypes.string,
  heading1: PropTypes.element,
  location2Description: PropTypes.element,
  location1ImageAlt: PropTypes.string,
  location1: PropTypes.element,
  location2: PropTypes.element,
}

export default Contact102

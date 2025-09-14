import React, { useState, Fragment } from 'react'

import PropTypes from 'prop-types'

import './features243.css'

const Features243 = (props) => {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <div className="thq-section-padding">
      <div className="features243-container2 thq-section-max-width">
        <div className="features243-image-container">
          {activeTab === 0 && (
            <img
              alt={props.feature1ImgAlt}
              src={props.feature1ImgSrc}
              className="features243-image1 thq-img-ratio-16-9"
            />
          )}
          {activeTab === 1 && (
            <img
              alt={props.feature2ImgAlt}
              src={props.feature2ImgSrc}
              className="features243-image2 thq-img-ratio-16-9"
            />
          )}
          {activeTab === 2 && (
            <img
              alt={props.feature3ImgAlt}
              src={props.feature3ImgSrc}
              className="features243-image3 thq-img-ratio-16-9"
            />
          )}
        </div>
        <div className="features243-tabs-menu">
          <div
            onClick={() => setActiveTab(0)}
            className="features243-tab-horizontal1"
          >
            <div className="features243-divider-container1">
              {activeTab === 0 && (
                <div className="features243-container3"></div>
              )}
            </div>
            <div className="features243-content1">
              <h2 className="thq-heading-2">
                {props.feature1Title ?? (
                  <Fragment>
                    <span className="features243-text4">
                      Advanced Structural Simulations
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.feature1Description ?? (
                  <Fragment>
                    <span className="features243-text5">
                      Perform complex structural simulations with advanced tools
                      and algorithms.
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
          <div
            onClick={() => setActiveTab(1)}
            className="features243-tab-horizontal2"
          >
            <div className="features243-divider-container2">
              {activeTab === 1 && (
                <div className="features243-container4"></div>
              )}
            </div>
            <div className="features243-content2">
              <h2 className="thq-heading-2">
                {props.feature2Title ?? (
                  <Fragment>
                    <span className="features243-text6">
                      Customizable Visualizations
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.feature2Description ?? (
                  <Fragment>
                    <span className="features243-text3">
                      Tailor visualizations to your preferences and requirements
                      for better insights.
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
          <div
            onClick={() => setActiveTab(2)}
            className="features243-tab-horizontal3"
          >
            <div className="features243-divider-container3">
              {activeTab === 2 && (
                <div className="features243-container5"></div>
              )}
            </div>
            <div className="features243-content3">
              <h2 className="thq-heading-2">
                {props.feature3Title ?? (
                  <Fragment>
                    <span className="features243-text2">
                      User Role Management
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.feature3Description ?? (
                  <Fragment>
                    <span className="features243-text1">
                      Effortlessly manage user roles, permissions, and access
                      levels for seamless collaboration.
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Features243.defaultProps = {
  feature1ImgAlt: 'Advanced Structural Simulations Image',
  feature3Description: undefined,
  feature3Title: undefined,
  feature3ImgSrc:
    'https://images.unsplash.com/photo-1514793011838-f19fbcc1fe04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0Njg3M3w&ixlib=rb-4.1.0&q=80&w=1080',
  feature1ImgSrc:
    'https://images.unsplash.com/photo-1707944746058-4da338d0f827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0Njg3NHw&ixlib=rb-4.1.0&q=80&w=1080',
  feature2Description: undefined,
  feature1Title: undefined,
  feature3ImgAlt: 'User Role Management Image',
  feature1Description: undefined,
  feature2ImgSrc:
    'https://images.unsplash.com/photo-1632616428087-bc0aeb7af242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0Njg3NHw&ixlib=rb-4.1.0&q=80&w=1080',
  feature2ImgAlt: 'Customizable Visualizations Image',
  feature2Title: undefined,
}

Features243.propTypes = {
  feature1ImgAlt: PropTypes.string,
  feature3Description: PropTypes.element,
  feature3Title: PropTypes.element,
  feature3ImgSrc: PropTypes.string,
  feature1ImgSrc: PropTypes.string,
  feature2Description: PropTypes.element,
  feature1Title: PropTypes.element,
  feature3ImgAlt: PropTypes.string,
  feature1Description: PropTypes.element,
  feature2ImgSrc: PropTypes.string,
  feature2ImgAlt: PropTypes.string,
  feature2Title: PropTypes.element,
}

export default Features243

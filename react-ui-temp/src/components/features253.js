import React, { useState, Fragment } from 'react'

import PropTypes from 'prop-types'

import './features253.css'

const Features253 = (props) => {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <div className="thq-section-padding">
      <div className="features253-container2 thq-section-max-width">
        <div className="features253-tabs-menu">
          <div
            onClick={() => setActiveTab(0)}
            className="features253-tab-horizontal1"
          >
            <div className="features253-divider-container1">
              {activeTab === 0 && (
                <div className="features253-container3"></div>
              )}
            </div>
            <div className="features253-content1">
              <h2 className="thq-heading-2">
                {props.feature1Title ?? (
                  <Fragment>
                    <span className="features253-text4">File Upload</span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.feature1Description ?? (
                  <Fragment>
                    <span className="features253-text2">
                      Easily upload structural simulation files for analysis
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
          <div
            onClick={() => setActiveTab(1)}
            className="features253-tab-horizontal2"
          >
            <div className="features253-divider-container2">
              {activeTab === 1 && (
                <div className="features253-container4"></div>
              )}
            </div>
            <div className="features253-content2">
              <h2 className="thq-heading-2">
                {props.feature2Title ?? (
                  <Fragment>
                    <span className="features253-text3">
                      Customizable Visualizations
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.feature2Description ?? (
                  <Fragment>
                    <span className="features253-text5">
                      Customize visual representations of simulation results
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
          <div
            onClick={() => setActiveTab(2)}
            className="features253-tab-horizontal3"
          >
            <div className="features253-divider-container3">
              {activeTab === 2 && (
                <div className="features253-container5"></div>
              )}
            </div>
            <div className="features253-content3">
              <h2 className="thq-heading-2">
                {props.feature3Title ?? (
                  <Fragment>
                    <span className="features253-text6">Export Results</span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.feature3Description ?? (
                  <Fragment>
                    <span className="features253-text1">
                      Export simulation results for further analysis or sharing
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="features253-image-container">
          {activeTab === 0 && (
            <img
              alt={props.feature1ImgAlt}
              src={props.feature1ImgSrc}
              className="features253-image1 thq-img-ratio-16-9"
            />
          )}
          {activeTab === 1 && (
            <img
              alt={props.feature2ImgAlt}
              src={props.feature2ImgSrc}
              className="features253-image2 thq-img-ratio-16-9"
            />
          )}
          {activeTab === 2 && (
            <img
              alt={props.feature3ImgAlt}
              src={props.feature3ImgSrc}
              className="features253-image3 thq-img-ratio-16-9"
            />
          )}
        </div>
      </div>
    </div>
  )
}

Features253.defaultProps = {
  feature3Description: undefined,
  feature1ImgAlt: 'File Upload Image',
  feature1Description: undefined,
  feature3ImgAlt: 'Export Results Image',
  feature2Title: undefined,
  feature1Title: undefined,
  feature1ImgSrc:
    'https://images.unsplash.com/photo-1679832634590-246229358de2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0Njg3M3w&ixlib=rb-4.1.0&q=80&w=1080',
  feature3ImgSrc:
    'https://images.unsplash.com/photo-1678911057933-62fd9e2a5fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0Njg3NHw&ixlib=rb-4.1.0&q=80&w=1080',
  feature2Description: undefined,
  feature3Title: undefined,
  feature2ImgAlt: 'Customizable Visualizations Image',
  feature2ImgSrc:
    'https://images.unsplash.com/photo-1554224155-380177dc24a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0Nzk0Njg3NHw&ixlib=rb-4.1.0&q=80&w=1080',
}

Features253.propTypes = {
  feature3Description: PropTypes.element,
  feature1ImgAlt: PropTypes.string,
  feature1Description: PropTypes.element,
  feature3ImgAlt: PropTypes.string,
  feature2Title: PropTypes.element,
  feature1Title: PropTypes.element,
  feature1ImgSrc: PropTypes.string,
  feature3ImgSrc: PropTypes.string,
  feature2Description: PropTypes.element,
  feature3Title: PropTypes.element,
  feature2ImgAlt: PropTypes.string,
  feature2ImgSrc: PropTypes.string,
}

export default Features253

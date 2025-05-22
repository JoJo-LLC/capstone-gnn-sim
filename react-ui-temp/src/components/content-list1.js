import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './content-list1.css'

const ContentList1 = (props) => {
  return (
    <div className="content-list1-container thq-section-padding">
      <div className="content-list1-max-width thq-section-max-width">
        <div className="content-list1-content thq-flex-column">
          <ul className="content-list1-ul thq-flex-column">
            <li className="list-item thq-flex-column">
              <h2 className="content-list1-heading1 thq-heading-2">
                {props.heading1 ?? (
                  <Fragment>
                    <span className="content-list1-text18">
                      Welcome to our Advanced Structural Simulations Platform
                    </span>
                  </Fragment>
                )}
              </h2>
              <p className="thq-body-small">
                {props.content1 ?? (
                  <Fragment>
                    <span className="content-list1-text14">
                      Our platform offers cutting-edge tools for advanced
                      structural simulations, catering to the needs of
                      researchers, visitors, and admins.
                    </span>
                  </Fragment>
                )}
              </p>
            </li>
            <li className="list-item">
              <h3 className="thq-heading-3">
                {props.heading2 ?? (
                  <Fragment>
                    <span className="content-list1-text21">
                      User-Specific Dashboards
                    </span>
                  </Fragment>
                )}
              </h3>
              <p className="thq-body-small">
                {props.content2 ?? (
                  <Fragment>
                    <span className="content-list1-text15">
                      Each user role - Researcher, Visitor, and Admin - has a
                      dedicated dashboard tailored to their specific needs and
                      requirements.
                    </span>
                  </Fragment>
                )}
              </p>
            </li>
            <li className="list-item">
              <h3 className="thq-heading-3">
                {props.heading3 ?? (
                  <Fragment>
                    <span className="content-list1-text19">
                      File Upload and Visualization Customization
                    </span>
                  </Fragment>
                )}
              </h3>
              <p className="thq-body-small">
                {props.content3 ?? (
                  <Fragment>
                    <span className="content-list1-text11">
                      Users can easily upload files for simulations and
                      customize visualizations to analyze and interpret results
                      effectively.
                    </span>
                  </Fragment>
                )}
              </p>
            </li>
            <li className="list-item">
              <h3 className="thq-heading-3">
                {props.heading4 ?? (
                  <Fragment>
                    <span className="content-list1-text16">
                      Export Simulation Results
                    </span>
                  </Fragment>
                )}
              </h3>
              <p className="thq-body-small">
                {props.content4 ?? (
                  <Fragment>
                    <span className="content-list1-text10">
                      The platform allows users to export simulation results in
                      various formats for further analysis or sharing with
                      colleagues.
                    </span>
                  </Fragment>
                )}
              </p>
            </li>
            <li className="list-item">
              <h3 className="thq-heading-3">
                {props.heading5 ?? (
                  <Fragment>
                    <span className="content-list1-text13">
                      User Role Management
                    </span>
                  </Fragment>
                )}
              </h3>
              <p className="thq-body-small">
                {props.content5 ?? (
                  <Fragment>
                    <span className="content-list1-text17">
                      Effortlessly manage user roles, permissions, and access
                      levels to ensure smooth collaboration and data security.
                    </span>
                  </Fragment>
                )}
              </p>
            </li>
            <li className="list-item">
              <h3 className="thq-heading-3">
                {props.heading6 ?? (
                  <Fragment>
                    <span className="content-list1-text20">
                      Simulation Data Management
                    </span>
                  </Fragment>
                )}
              </h3>
              <p className="thq-body-small">
                {props.content6 ?? (
                  <Fragment>
                    <span className="content-list1-text12">
                      Organize and store simulation data efficiently within the
                      platform, making it easy to track and retrieve information
                      as needed.
                    </span>
                  </Fragment>
                )}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

ContentList1.defaultProps = {
  content4: undefined,
  content3: undefined,
  content6: undefined,
  heading5: undefined,
  content1: undefined,
  content2: undefined,
  heading4: undefined,
  content5: undefined,
  heading1: undefined,
  heading3: undefined,
  heading6: undefined,
  heading2: undefined,
}

ContentList1.propTypes = {
  content4: PropTypes.element,
  content3: PropTypes.element,
  content6: PropTypes.element,
  heading5: PropTypes.element,
  content1: PropTypes.element,
  content2: PropTypes.element,
  heading4: PropTypes.element,
  content5: PropTypes.element,
  heading1: PropTypes.element,
  heading3: PropTypes.element,
  heading6: PropTypes.element,
  heading2: PropTypes.element,
}

export default ContentList1

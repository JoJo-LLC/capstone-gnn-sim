import React, { useState, Fragment } from 'react'

import PropTypes from 'prop-types'

import './pricing142.css'

const Pricing142 = (props) => {
  const [isMonthly, setIsMonthly] = useState(true)
  return (
    <div className="pricing142-pricing23 thq-section-padding">
      <div className="pricing142-max-width thq-section-max-width">
        <div className="pricing142-section-title">
          <span className="pricing142-text100 thq-body-small">
            {props.content1 ?? (
              <Fragment>
                <span className="pricing142-text178">
                  Choose the perfect plan for you
                </span>
              </Fragment>
            )}
          </span>
          <div className="pricing142-content">
            <h2 className="pricing142-text101 thq-heading-2">
              {props.heading1 ?? (
                <Fragment>
                  <span className="pricing142-text180">Pricing plan</span>
                </Fragment>
              )}
            </h2>
            <p className="pricing142-text102 thq-body-large">
              {props.content2 ?? (
                <Fragment>
                  <span className="pricing142-text202">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                </Fragment>
              )}
            </p>
          </div>
        </div>
        <div className="pricing142-tabs">
          {isMonthly && (
            <button
              onClick={() => setIsMonthly(true)}
              className="pricing142-button10 thq-button-animated thq-button-filled"
            >
              <span className="thq-body-small">Monthly</span>
            </button>
          )}
          {!isMonthly && (
            <button
              onClick={() => setIsMonthly(true)}
              className="pricing142-button11 thq-button-outline thq-button-animated"
            >
              <span className="thq-body-small">Monthly</span>
            </button>
          )}
          {!isMonthly && (
            <button
              onClick={() => setIsMonthly(false)}
              className="pricing142-button12 thq-button-animated thq-button-filled"
            >
              <span className="thq-body-small">Yearly</span>
            </button>
          )}
          {isMonthly && (
            <button
              onClick={() => setIsMonthly(false)}
              className="pricing142-button13 thq-button-outline thq-button-animated"
            >
              <span className="thq-body-small">Yearly</span>
            </button>
          )}
        </div>
        {isMonthly && (
          <div className="pricing142-container1">
            <div className="pricing142-column1 thq-card">
              <div className="pricing142-price10">
                <div className="pricing142-price11">
                  <p className="pricing142-text107 thq-body-large">
                    {props.plan1 ?? (
                      <Fragment>
                        <span className="pricing142-text182">$9.99/month</span>
                      </Fragment>
                    )}
                  </p>
                  <h3 className="pricing142-text108 thq-heading-3">
                    {props.plan1Price ?? (
                      <Fragment>
                        <span className="pricing142-text204">Monthly</span>
                      </Fragment>
                    )}
                  </h3>
                  <p className="thq-body-large">
                    {props.plan1Yearly ?? (
                      <Fragment>
                        <span className="pricing142-text199">$99.99/year</span>
                      </Fragment>
                    )}
                  </p>
                </div>
                <div className="pricing142-list1">
                  <div className="pricing142-list-item10">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan1Feature1 ?? (
                        <Fragment>
                          <span className="pricing142-text200">
                            File Upload
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item11">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan1Feature2 ?? (
                        <Fragment>
                          <span className="pricing142-text161">
                            Custom Visualization
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item12">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan1Feature3 ?? (
                        <Fragment>
                          <span className="pricing142-text198">
                            Export Results
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing142-button14 thq-button-outline thq-button-animated">
                <span className="thq-body-small">
                  {props.plan1Action ?? (
                    <Fragment>
                      <span className="pricing142-text158">Sign Up Now</span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
            <div className="pricing142-column2 thq-card">
              <div className="pricing142-price12">
                <div className="pricing142-price13">
                  <p className="pricing142-text114 thq-body-large">
                    {props.plan2 ?? (
                      <Fragment>
                        <span className="pricing142-text174">
                          Business plan
                        </span>
                      </Fragment>
                    )}
                  </p>
                  <h3 className="pricing142-text115 thq-heading-3">
                    {props.plan2Price ?? (
                      <Fragment>
                        <span className="pricing142-text188">$29/mo</span>
                      </Fragment>
                    )}
                  </h3>
                  <p className="thq-body-large">
                    {props.plan2Yearly ?? (
                      <Fragment>
                        <span className="pricing142-text168">
                          or $299 yearly
                        </span>
                      </Fragment>
                    )}
                  </p>
                </div>
                <div className="pricing142-list2">
                  <div className="pricing142-list-item13">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan2Feature1 ?? (
                        <Fragment>
                          <span className="pricing142-text179">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item14">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan2Feature2 ?? (
                        <Fragment>
                          <span className="pricing142-text165">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item15">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan2Feature3 ?? (
                        <Fragment>
                          <span className="pricing142-text172">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item16">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan2Feature4 ?? (
                        <Fragment>
                          <span className="pricing142-text167">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing142-button15 thq-button-animated thq-button-filled">
                <span className="thq-body-small">
                  {props.plan2Action ?? (
                    <Fragment>
                      <span className="pricing142-text170">Get started</span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
            <div className="pricing142-column3 thq-card">
              <div className="pricing142-price14">
                <div className="pricing142-price15">
                  <p className="pricing142-text122 thq-body-large">
                    {props.plan3 ?? (
                      <Fragment>
                        <span className="pricing142-text205">
                          Enterprise plan
                        </span>
                      </Fragment>
                    )}
                  </p>
                  <h3 className="pricing142-text123 thq-heading-3">
                    {props.plan3Price ?? (
                      <Fragment>
                        <span className="pricing142-text155">$49/mo</span>
                      </Fragment>
                    )}
                  </h3>
                  <p className="thq-body-large">
                    {props.plan3Yearly ?? (
                      <Fragment>
                        <span className="pricing142-text194">
                          or $499 yearly
                        </span>
                      </Fragment>
                    )}
                  </p>
                </div>
                <div className="pricing142-list3">
                  <div className="pricing142-list-item17">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan3Feature1 ?? (
                        <Fragment>
                          <span className="pricing142-text171">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item18">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan3Feature2 ?? (
                        <Fragment>
                          <span className="pricing142-text177">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item19">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan3Feature3 ?? (
                        <Fragment>
                          <span className="pricing142-text201">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item20">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan3Feature4 ?? (
                        <Fragment>
                          <span className="pricing142-text195">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item21">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan3Feature5 ?? (
                        <Fragment>
                          <span className="pricing142-text186">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing142-button16 thq-button-animated thq-button-filled">
                <span className="thq-body-small">
                  {props.plan3Action ?? (
                    <Fragment>
                      <span className="pricing142-text156">Get started</span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
          </div>
        )}
        {!isMonthly && (
          <div className="pricing142-container2">
            <div className="pricing142-column4 thq-card">
              <div className="pricing142-price16">
                <div className="pricing142-price17">
                  <span className="pricing142-text131 thq-body-large">
                    {props.plan11 ?? (
                      <Fragment>
                        <span className="pricing142-text157">Basic plan</span>
                      </Fragment>
                    )}
                  </span>
                  <h3 className="pricing142-text132 thq-heading-3">
                    {props.plan1Price1 ?? (
                      <Fragment>
                        <span className="pricing142-text173">Yearly</span>
                      </Fragment>
                    )}
                  </h3>
                  <span className="thq-body-large">
                    {props.plan1Yearly1 ?? (
                      <Fragment>
                        <span className="pricing142-text192">
                          or $20 monthly
                        </span>
                      </Fragment>
                    )}
                  </span>
                </div>
                <div className="pricing142-list4">
                  <div className="pricing142-list-item22">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan1Feature11 ?? (
                        <Fragment>
                          <span className="pricing142-text184">
                            Sample Simulations
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item23">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan1Feature21 ?? (
                        <Fragment>
                          <span className="pricing142-text185">
                            User Role Management
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item24">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan1Feature31 ?? (
                        <Fragment>
                          <span className="pricing142-text197">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing142-button17 thq-button-outline thq-button-animated">
                <span className="thq-body-small">
                  {props.plan1Action1 ?? (
                    <Fragment>
                      <span className="pricing142-text169">Sign Up Now</span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
            <div className="pricing142-column5 thq-card">
              <div className="pricing142-price18">
                <div className="pricing142-price19">
                  <span className="pricing142-text138 thq-body-large">
                    {props.plan21 ?? (
                      <Fragment>
                        <span className="pricing142-text183">
                          Business plan
                        </span>
                      </Fragment>
                    )}
                  </span>
                  <h3 className="pricing142-text139 thq-heading-3">
                    {props.plan2Price1 ?? (
                      <Fragment>
                        <span className="pricing142-text193">$299/yr</span>
                      </Fragment>
                    )}
                  </h3>
                  <span className="thq-body-large">
                    {props.plan2Yearly1 ?? (
                      <Fragment>
                        <span className="pricing142-text187">
                          or $29 monthly
                        </span>
                      </Fragment>
                    )}
                  </span>
                </div>
                <div className="pricing142-list5">
                  <div className="pricing142-list-item25">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan2Feature11 ?? (
                        <Fragment>
                          <span className="pricing142-text162">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item26">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan2Feature21 ?? (
                        <Fragment>
                          <span className="pricing142-text175">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item27">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan2Feature31 ?? (
                        <Fragment>
                          <span className="pricing142-text190">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item28">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan2Feature41 ?? (
                        <Fragment>
                          <span className="pricing142-text164">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing142-button18 thq-button-animated thq-button-filled">
                <span className="thq-body-small">
                  {props.plan2Action1 ?? (
                    <Fragment>
                      <span className="pricing142-text176">Get started</span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
            <div className="pricing142-column6 thq-card">
              <div className="pricing142-price20">
                <div className="pricing142-price21">
                  <span className="pricing142-text146 thq-body-large">
                    {props.plan31 ?? (
                      <Fragment>
                        <span className="pricing142-text159">
                          Enterprise plan
                        </span>
                      </Fragment>
                    )}
                  </span>
                  <h3 className="pricing142-text147 thq-heading-3">
                    {props.plan3Price1 ?? (
                      <Fragment>
                        <span className="pricing142-text196">$499/yr</span>
                      </Fragment>
                    )}
                  </h3>
                  <span className="thq-body-large">
                    {props.plan3Yearly1 ?? (
                      <Fragment>
                        <span className="pricing142-text189">
                          or $49 monthly
                        </span>
                      </Fragment>
                    )}
                  </span>
                </div>
                <div className="pricing142-list6">
                  <div className="pricing142-list-item29">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan3Feature11 ?? (
                        <Fragment>
                          <span className="pricing142-text191">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item30">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan3Feature21 ?? (
                        <Fragment>
                          <span className="pricing142-text166">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item31">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan3Feature31 ?? (
                        <Fragment>
                          <span className="pricing142-text181">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item32">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan3Feature41 ?? (
                        <Fragment>
                          <span className="pricing142-text160">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="pricing142-list-item33">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                    </svg>
                    <span className="thq-body-small">
                      {props.plan3Feature51 ?? (
                        <Fragment>
                          <span className="pricing142-text163">
                            Feature text goes here
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button className="pricing142-button19 thq-button-animated thq-button-filled">
                <span className="thq-body-small">
                  {props.plan3Action1 ?? (
                    <Fragment>
                      <span className="pricing142-text203">Get started</span>
                    </Fragment>
                  )}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

Pricing142.defaultProps = {
  plan3Price: undefined,
  plan3Action: undefined,
  plan11: undefined,
  plan1Action: undefined,
  plan31: undefined,
  plan3Feature41: undefined,
  plan1Feature2: undefined,
  plan2Feature11: undefined,
  plan3Feature51: undefined,
  plan2Feature41: undefined,
  plan2Feature2: undefined,
  plan3Feature21: undefined,
  plan2Feature4: undefined,
  plan2Yearly: undefined,
  plan1Action1: undefined,
  plan2Action: undefined,
  plan3Feature1: undefined,
  plan2Feature3: undefined,
  plan1Price1: undefined,
  plan2: undefined,
  plan2Feature21: undefined,
  plan2Action1: undefined,
  plan3Feature2: undefined,
  content1: undefined,
  plan2Feature1: undefined,
  heading1: undefined,
  plan3Feature31: undefined,
  plan1: undefined,
  plan21: undefined,
  plan1Feature11: undefined,
  plan1Feature21: undefined,
  plan3Feature5: undefined,
  plan2Yearly1: undefined,
  plan2Price: undefined,
  plan3Yearly1: undefined,
  plan2Feature31: undefined,
  plan3Feature11: undefined,
  plan1Yearly1: undefined,
  plan2Price1: undefined,
  plan3Yearly: undefined,
  plan3Feature4: undefined,
  plan3Price1: undefined,
  plan1Feature31: undefined,
  plan1Feature3: undefined,
  plan1Yearly: undefined,
  plan1Feature1: undefined,
  plan3Feature3: undefined,
  content2: undefined,
  plan3Action1: undefined,
  plan1Price: undefined,
  plan3: undefined,
}

Pricing142.propTypes = {
  plan3Price: PropTypes.element,
  plan3Action: PropTypes.element,
  plan11: PropTypes.element,
  plan1Action: PropTypes.element,
  plan31: PropTypes.element,
  plan3Feature41: PropTypes.element,
  plan1Feature2: PropTypes.element,
  plan2Feature11: PropTypes.element,
  plan3Feature51: PropTypes.element,
  plan2Feature41: PropTypes.element,
  plan2Feature2: PropTypes.element,
  plan3Feature21: PropTypes.element,
  plan2Feature4: PropTypes.element,
  plan2Yearly: PropTypes.element,
  plan1Action1: PropTypes.element,
  plan2Action: PropTypes.element,
  plan3Feature1: PropTypes.element,
  plan2Feature3: PropTypes.element,
  plan1Price1: PropTypes.element,
  plan2: PropTypes.element,
  plan2Feature21: PropTypes.element,
  plan2Action1: PropTypes.element,
  plan3Feature2: PropTypes.element,
  content1: PropTypes.element,
  plan2Feature1: PropTypes.element,
  heading1: PropTypes.element,
  plan3Feature31: PropTypes.element,
  plan1: PropTypes.element,
  plan21: PropTypes.element,
  plan1Feature11: PropTypes.element,
  plan1Feature21: PropTypes.element,
  plan3Feature5: PropTypes.element,
  plan2Yearly1: PropTypes.element,
  plan2Price: PropTypes.element,
  plan3Yearly1: PropTypes.element,
  plan2Feature31: PropTypes.element,
  plan3Feature11: PropTypes.element,
  plan1Yearly1: PropTypes.element,
  plan2Price1: PropTypes.element,
  plan3Yearly: PropTypes.element,
  plan3Feature4: PropTypes.element,
  plan3Price1: PropTypes.element,
  plan1Feature31: PropTypes.element,
  plan1Feature3: PropTypes.element,
  plan1Yearly: PropTypes.element,
  plan1Feature1: PropTypes.element,
  plan3Feature3: PropTypes.element,
  content2: PropTypes.element,
  plan3Action1: PropTypes.element,
  plan1Price: PropTypes.element,
  plan3: PropTypes.element,
}

export default Pricing142

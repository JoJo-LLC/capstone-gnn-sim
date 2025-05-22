import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import './style.css'
import Home from './views/home'
import VisitorPage from './views/visitor-page'
import AdminPage from './views/admin-page'
import ResearcherPage from './views/researcher-page'
import NotFound from './views/not-found'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route component={Home} exact path="/" />
        <Route component={VisitorPage} exact path="/visitor-page" />
        <Route component={AdminPage} exact path="/admin-page" />
        <Route component={ResearcherPage} exact path="/researcher-page" />
        <Route component={NotFound} path="**" />
        <Redirect to="**" />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))

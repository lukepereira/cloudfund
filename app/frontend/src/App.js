import React from 'react'
import {
    Switch,
    Route,
    Link
} from 'react-router-dom'

import CreateProject from './CreateProject'
import Deployment from './Deployment'
import Project from './Project'
import ProjectList from './ProjectList'
import StripeWrapper from './StripeWrapper'
import './App.css'


const Projects = () => {
    return (    
        <div>
            <ProjectList/>
            <CreateProject />
        </div>
    )
}


const ProjectLayout = ({ match }) => {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to='/'>Projects</Link>
                        </li>
                        <li>
                            <Link to={`${match.url}/project`}>Project</Link>
                        </li>
                        <li>
                            <Link to={`${match.url}/deployment`}>Deployment</Link>
                        </li>
                        <li>
                            <Link to={`${match.url}/payments`}>Payments</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <Route path={`${match.path}/project`} component={Project}/>
            <Route path={`${match.path}/deployment`} component={Deployment}/>
            <Route path={`${match.path}/payments`} component={StripeWrapper}/>
        </div>
    )
}

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Projects}/>
            <Route path='/create' component={Projects}/>
            <Route path='/project/:project_id' component={ProjectLayout}/>
        </Switch>
    </main>
)

const App = () => (
  <div>
    <Main />
  </div>
)

export default App

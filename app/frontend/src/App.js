import React from 'react'
import {
    Switch,
    Route,
} from 'react-router-dom'
import CreateProject from './CreateProject'
import ProjectLayout from './ProjectLayout'
import ProjectList from './ProjectList'
import './App.css'

const Projects = () => {
    return (    
        <div>
            <ProjectList/>
            <CreateProject />
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

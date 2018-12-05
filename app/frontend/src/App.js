import React from 'react'
import {
    Switch,
    Route,
} from 'react-router-dom'
import AppLayout from './AppLayout'
import CreateProject from './CreateProject'
import ProjectContainer from './ProjectContainer'
import ProjectsMenu from './ProjectsMenu'
import ProjectMenu from './ProjectMenu'
import './App.css'

const ProjectsLayout = () => {
    return (    
        <div>
            <AppLayout 
                menuContent={<ProjectsMenu/>} 
                bodyContent={<CreateProject />}
            />
        </div>
    )
}

const ProjectLayout = () => {
    return (    
        <div>
            <AppLayout 
                menuContent={<ProjectMenu/>} 
                bodyContent={<ProjectContainer />} 
            />
        </div>
    )
}

const App = () => (
    <main>
        <Switch>
            <Route exact path='/' component={ProjectsLayout}/>
            <Route path='/create' component={ProjectsLayout}/>
            <Route path='/project/:project_id' component={ProjectLayout}/>
        </Switch>
    </main>
)

export default App

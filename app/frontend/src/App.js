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
import Map from './Map'
import './App.css'

const ProjectsLayout = () => {
    return (    
        <AppLayout 
            menuContent={<ProjectsMenu/>} 
            bodyContent={<CreateProject />}
        />
    )
}

const MapLayout = () => {
    return (    
        <AppLayout 
            menuContent={<ProjectsMenu/>} 
            bodyContent={<Map />}
        />
    )
}

const ProjectLayout = () => {
    return (    
        <AppLayout 
            menuContent={<ProjectMenu/>} 
            bodyContent={<ProjectContainer />} 
        />
    )
}

const App = () => (
    <Switch>
        <Route exact path='/' component={ProjectsLayout}/>
        <Route path='/create' component={ProjectsLayout}/>
        <Route path='/project/:project_id' component={ProjectLayout}/>
        <Route path='/map' component={MapLayout} />
    </Switch>
)

export default App

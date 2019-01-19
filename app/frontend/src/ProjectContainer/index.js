import React from 'react'
import {
    Route,
    withRouter,
} from 'react-router-dom'
import { connect } from 'react-redux'
import Deployment from '../Deployment'
import Project from '../Project'
import StripeWrapper from '../StripeWrapper'

import { getProjectByID } from '../actions/projectActions'

class ProjectContainer extends React.Component {
    
    getProject = () => {
        const project_id = this.props.match && this.props.match.params.project_id
        const project = this.props.projectsList.find( (project) => project.project_id === project_id )

        if (project) {
            return project
        }
        if ( this.props.fetchedProject && this.props.fetchedProject.project.project_id === project_id) {
            return this.props.fetchedProject.project
        }
        else if (this.props.fetchedProject && !this.props.fetchedProject.loading) {
            getProjectByID(project_id)
        }
    }
    
    render() {
        return (
            <div>
                <Route exact path={`${this.props.match.path}/`} render={() => <Project project={this.getProject()} />} />
                <Route path={`${this.props.match.path}/info`} render={() => <Project project={this.getProject()} />} />
                <Route path={`${this.props.match.path}/deployment`} render={() => <Deployment {...this.props} project={this.getProject()} />} />
                <Route path={`${this.props.match.path}/payments`} render={() => <StripeWrapper project={this.getProject()} />} />
            </div>
        )
    }
}


const mapStateToProps = state => ({
    projectsList: state.projectsReducer.projects_list,
    fetchedProject: state.projectReducer
})

export default withRouter(
    connect(mapStateToProps)(ProjectContainer)
)

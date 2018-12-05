import React from 'react'
import {
    Route,
    Link,
    withRouter,
} from 'react-router-dom'
import axios from 'axios'
import AppLayout from '../AppLayout'
import Deployment from '../Deployment'
import Project from '../Project'
import StripeWrapper from '../StripeWrapper'


class ProjectContainer extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            project: null,
        }
    }
    
    getProject = () => {
        const post_url = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/get_project_by_id'    
        const config = { 
            headers: {  
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(
            post_url,
            {
                project_id: this.props.match && this.props.match.params.project_id
            },
            config
        )
        .then((response) => {
            console.log(response.data)
            this.setState({project: response.data})
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    componentDidMount = () => {
        this.getProject()
    }
    
    render() {
        return (
            <div>
                <Route exact path={`${this.props.match.path}/`} render={() => <Project project={this.state.project}/>} />
                <Route path={`${this.props.match.path}/info`} render={() => <Project project={this.state.project}/>} />
                <Route path={`${this.props.match.path}/deployment`} render={() => <Deployment {...this.props} project={this.state.project}/>} />
                <Route path={`${this.props.match.path}/payments`} render={() => <StripeWrapper project={this.state.project}/>} />
            </div>
        )
    }
}

export default withRouter(ProjectContainer)

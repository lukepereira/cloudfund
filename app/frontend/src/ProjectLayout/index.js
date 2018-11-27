import React from 'react'
import {
    Route,
    Link
} from 'react-router-dom'
import axios from 'axios'
import Deployment from '../Deployment'
import Project from '../Project'
import StripeWrapper from '../StripeWrapper'

import './ProjectLayout.css'


class ProjectLayout extends React.Component {
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
    
    getHeader = () => (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to='/'>Projects</Link>
                    </li>
                    <li>
                        <Link to={`${this.props.match.url}/info`}>Info</Link>
                    </li>
                    <li>
                        <Link to={`${this.props.match.url}/deployment`}>Deployment</Link>
                    </li>
                    <li>
                        <Link to={`${this.props.match.url}/payments`}>Payments</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
    
    render() {
        return (
            <div>
                {this.getHeader()}
                <Route exact path={`${this.props.match.path}/`} render={() => <Project project={this.state.project}/>} />
                <Route path={`${this.props.match.path}/info`} render={() => <Project project={this.state.project}/>} />
                <Route path={`${this.props.match.path}/deployment`} render={() => <Deployment {...this.props} project={this.state.project}/>} />
                <Route path={`${this.props.match.path}/payments`} render={() => <StripeWrapper project={this.state.project}/>} />
            </div>
        )
    }
    
}

export default ProjectLayout

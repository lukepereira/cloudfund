import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

class ProjectList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            project_list: []
        }
        this.getProjects = this.getProjects.bind(this)
    }
    
    getProjects = () => {
        const post_url = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/get_projects'    
        const config = { 
            headers: {  
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(
            post_url,
            {},
            config
        )
        .then((response) => {
            console.log(response.data)
            this.setState({project_list: response.data})
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    componentDidMount = () => {
        this.getProjects()
    }
    
    render() {
        return (
            <ul>
                <li key={'create_project'}>
                    <Link to={`/create`}>{`Create`}</Link>
                </li>
                {
                    this.state.project_list
                    && this.state.project_list.map( (project, i) => (
                        <li key={i}>
                            <Link to={`project/${project.project_id}`}>{`${project.project_name}`}</Link>
                        </li>
                    ))
                }
            </ul>
        )
    }
    
}

export default ProjectList
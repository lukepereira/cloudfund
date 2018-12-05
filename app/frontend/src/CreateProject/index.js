import React from 'react'
import axios from 'axios'
import { CLUSTER_JSON_SCHEMA } from '../Deployment/constants.js'
import { withRouter } from 'react-router-dom'
import SimpleListMenu from '../components/SimpleListMenu'
import SimpleSelect from '../components/SimpleSelect'

import './CreateProject.css'

class CreateProject extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            projectName: '',
            projectURL: '',
            clusterFile: '',
            deploymentFile: '',
            cost: {
                monthly_cost: 0,
                hourly_cost: 0,
            },
        }
    }    

    handleName = (event) => this.setState({projectName: event.target.value})
    
    handleRepository = (event) => this.setState({projectURL: event.target.value})    

    handleDeployment = (event) => this.setState({deploymentFile: event.target.value})
    
    handleCluster = (event) => {
        this.setState({clusterFile: event.target.value})
        if (this.isValidJson(event.target.value)) {
            this.getPredictedCost(event.target.value)
        }
    }
    
    isValidJson = (json) => {
        try {
            JSON.parse(json);
            return true;
        } catch (e) {
            return false;
        }
    }
        
    handleSubmit = () => {
        if (
            !this.state.projectName 
            || !this.state.clusterFile
            || !this.state.deploymentFile
        ){
            return
        }
        
        const post_url = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/create_project'    
        const config = { 
            headers: {  
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(
            post_url,
            {
                project_name: this.state.projectName,
                project_url: this.state.projectURL,
                cluster: {
                    format: 'json', 
                    content: this.state.clusterFile,
                },
                deployment: {
                    format: 'yaml', 
                    content: this.state.deploymentFile,
                },
            },
            config
        )
        .then(function (response) {
            console.log(response);
            const project_id = response.data
            this.props.history.push(`project/${project_id}`)
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    getPredictedCost = (cluster_json) => {
        if (!cluster_json){
            return 
        }
        
        const post_url = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/get_predicted_cost_from_json'    
        const config = { 
            headers: {  
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(
            post_url,
            {
                cluster: {
                    format: 'json', 
                    content: cluster_json,
                },
            },
            config
        )
        .then((response) => {
            console.log(response)
            this.setState({ cost: response.data })
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    getPredictedCostSection = () => (
        this.state.cost &&
        <div>
                <div>
                    {`Monthly Cost: $${this.state.cost.monthly_cost} USD`}
                </div>
                <div>
                    {`Hourly Cost: $${this.state.cost.hourly_cost} USD`}
                </div>
        </div>
        
    )
    
    render() {
        return (
            <div className="CreateProject">
                <div>
                    <h1>Create Project</h1>
                    
                    <SimpleListMenu
                        options={[
                            'Cluster Template',
                            'Cluster JSON',
                        ]}
                    />
                    
                    <SimpleSelect
                        name={'test'}
                        options={[
                            { val: 'a', label: 'a'},
                            { val: 'b', label: 'b'},
                        ]}
                    />
                    <label>
                        Name
                        <input 
                            placeholder="My Project" 
                            onChange={this.handleName}>
                        </input>
                    </label>
                    {/* <label>
                        Project URL (optional)
                        <input 
                            placeholder="https://github.com/my_repository" 
                            onChange={this.handleRepository}
                            className={'full-width'}
                        >
                        </input>
                    </label> */}
                    {this.getPredictedCostSection()}
                    <label>
                        Cluster JSON
                        <textarea
                            data-gramm_editor='false'
                            placeholder=""
                            rows='12'
                            col='25'
                            onChange={this.handleCluster}
                            className={'full-width'}
                        >
                        </textarea>
                    </label>
                
                    <label>
                        Deployment YAML
                        <textarea
                            data-gramm_editor='false'
                            placeholder=""
                            rows='12'
                            col='25'
                            onChange={this.handleDeployment}
                            className={'full-width'}
                        >
                        </textarea>
                    </label>
                    
                    <button onClick={this.handleSubmit}>Create</button>
                </div>
            </div>
        )
    }
}

export default withRouter(CreateProject)
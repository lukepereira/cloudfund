import React from 'react'
import axios from 'axios'
import { CLUSTER_JSON_SCHEMA } from './constants.js'
import { JsonEditor as Editor } from 'jsoneditor-react'
import Ajv from 'ajv'
import 'jsoneditor-react/es/editor.min.css'
import './Deployment.css'


class Deployment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cluster: {},
            deployment: '',
        }
    }    
    
    componentDidMount = () => {
        this.getConfigurations()
    }
    
    handleClusterUpdate = (event) => this.setState({cluster: event.target.value})
    
    handleDeploymentUpdate = (event) => this.setState({deployment: event.target.value})    

    getConfigurations = () => {
        const post_url = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/get_project_configurations'    
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
            console.log(response.data.cluster)
            const cluster =  response.data.cluster //JSON.stringify(response.data.cluster, null, 2)
            const deployment = response.data.deployment
            this.setState({cluster, deployment})
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    render() {
        return (
            <div className="Deployment">
                <form  onSubmit={this.handleSubmit}>
                    <h1>Deployment</h1>
                    
                    {
                        this.state.cluster.cluster &&
                        <label>
                            Cluster JSON
                            <Editor
                                value={this.state.cluster}
                                onChange={this.handleClusterUpdate}
                                schema={CLUSTER_JSON_SCHEMA}
                                theme="ace/theme/github"
                                ajv={Ajv({ allErrors: true, verbose: true })}
                            />
                        </label>
                    }
                    
                    <label>
                        Deployment YAML
                        <textarea 
                            value={this.state.deployment}
                            placeholder=""
                            rows='12'
                            col='25'
                            onChange={this.handleDeploymentUpdate}
                            className={'full-width'}
                        >
                        </textarea>
                    </label>
                    
                    <button>Deploy</button>
                </form>
            </div>
        )
    }
}

export default Deployment
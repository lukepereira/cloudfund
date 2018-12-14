import React from 'react'
import axios from 'axios'
import './Deployment.css'


class Deployment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cluster: 'loading...',
            deployment: 'loading...',
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
            const cluster = JSON.stringify(response.data.cluster, null, 2)
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
                    <label>
                        Deployment YAML
                        <textarea 
                            value={this.state.cluster}
                            placeholder=""
                            rows='12'
                            col='25'
                            onChange={this.handleClusterUpdate}
                            className={'full-width'}
                        >
                        </textarea>
                    </label>
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
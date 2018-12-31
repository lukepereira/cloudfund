import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { CLUSTER_FORMS, CLUSTER_LOCATION_TYPES, REGIONS, MACHINE_TYPES, ZONES } from './constants'
import { withRouter } from 'react-router-dom'
import SimpleListMenu from '../components/SimpleListMenu'
import SimpleSelect from '../components/SimpleSelect'
import TextField from '../components/TextField'
import { createProjectFormUpdate } from '../actions/projectActions'
import { formatDollar } from '../helpers'

import './CreateProject.css'

class CreateProject extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            projectName: '',
            projectURL: '',
            clusterFile: '',
            deploymentFile: '',
            cost: null,
        }
    }    

    componentWillReceiveProps = (nextProps) => {
        if (
            this.props.formState.location !== nextProps.formState.location
            || this.props.formState.machineType !== nextProps.formState.machineType
            || this.props.formState.nodeCount !== nextProps.formState.nodeCount
        ){
            this.getPredictedCostFromTemplate(nextProps)
        }
        
    }

    handleFormUpdate = (fieldName, value) => {
        this.props.createProjectFormUpdate(fieldName, value)
    } 

    handleDeployment = (event) => this.setState({deploymentFile: event.target.value})
    
    handleCluster = (event) => {
        this.setState({clusterFile: event.target.value})
        if (this.isValidJson(event.target.value)) {
            this.getPredictedCostFromJSON(event.target.value)
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
        .then((response) => {
            console.log(response);
            const project_id = response.data
            this.props.history.push(`project/${project_id}`)
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    getPredictedCostFromJSON = (cluster_json) => {
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
    
    
    getPredictedCostFromTemplate = (props) => {
        console.log("^^^^", this.props.formState )
        if (
            !props.formState.location 
            || !props.formState.machineType
            || !props.formState.nodeCount
        ){
            return
        }
        
        const nodeCount = props.formState.locationType === CLUSTER_LOCATION_TYPES.REGIONAL
            ? parseInt(props.formState.nodeCount * 3)
            : parseInt(props.formState.nodeCount)

        const clusterJSON = {
            cluster: {
                location: props.formState.location,
                nodePools: [ {
                    initialNodeCount: nodeCount,
                    config: {
                        'machineType': props.formState.machineType,
                    },
                } ],
            },
        }
        this.getPredictedCostFromJSON(JSON.stringify(clusterJSON))
    }
    
    getPredictedCostSection = () => (
        this.state.cost &&
        <div>
            <div>
                {`Monthly Cost: ${formatDollar(this.state.cost.monthly_cost)}`}
            </div>
            <div>
                {`Hourly Cost: ${formatDollar(this.state.cost.hourly_cost)}`}
            </div>
        </div>
    )
    
    getLocationField = () => {
        if (this.props.formState.locationType === CLUSTER_LOCATION_TYPES.REGIONAL) {
            return (
                <SimpleSelect
                    name={'location'}
                    inputLabel={'Region'}
                    options={REGIONS}
                    value={this.props.formState.location}
                    onChange={(event) => {this.handleFormUpdate(event.target.name, event.target.value)} }
                />
            )
        }
        return (
            <SimpleSelect
                name={'location'}
                inputLabel={'Zone'}
                options={ZONES}
                value={this.props.formState.location}
                onChange={(event) => {this.handleFormUpdate(event.target.name, event.target.value)} }
            />
        )
    }
    
    getNodeCountField = () => {
        if (this.props.formState.locationType === CLUSTER_LOCATION_TYPES.REGIONAL) {
            const nodeCount = this.props.formState.nodeCount && this.props.formState.nodeCount > 0 && this.props.formState.nodeCount * 3
            return (
                <div className={'flexField'}>
                    <div className={'flexFieldColumn'}>
                        <TextField
                            name={'nodeCount'}
                            label={'Number of Nodes (per zone)'}
                            placeholder={''}
                            type={'number'}
                            value={this.props.formState.nodeCount}
                            onChange={(event) => this.handleFormUpdate(event.target.name, event.target.value)}
                        />
                    </div>
                    <div className={'flexFieldColumn'} style={{textAlign: 'center'}}> 
                        { `Total (in all zones): ${nodeCount || 0}`}
                    </div>
                </div>
            )
        }
        return (
            <TextField
                name={'nodeCount'}
                label={'Number of Nodes'}
                placeholder={''}
                type={'number'}
                value={this.props.formState.nodeCount}
                onChange={(event) => this.handleFormUpdate(event.target.name, event.target.value)}
            />    
        )
    }
    
    getClusterTemplateForm = () => (
        <div>
            <div className={'fieldRow'}>
                <SimpleListMenu
                    options={[
                        CLUSTER_LOCATION_TYPES.REGIONAL,
                        CLUSTER_LOCATION_TYPES.ZONAL,
                    ]}
                    placeholder={'Location type is permanent'}
                    value={this.props.formState.formType}
                    onChange={(selectedOption) => this.handleFormUpdate('locationType', selectedOption) }
                />
            </div>
            <div className={'fieldRow'}>
                { this.getLocationField() }
            </div>
            
            <div className={'fieldRow'}>
                { this.getNodeCountField() }
            </div>
            
            <div className={'fieldRow'}>
                <SimpleSelect
                    name={'machineType'}
                    inputLabel={'Machine Type'}
                    options={MACHINE_TYPES}
                    value={this.props.formState.machineType}
                    onChange={(event) => this.handleFormUpdate(event.target.name, event.target.value)}
                />
            </div>
        </div>
    )
    
    getClusterJSONForm = () => (
        <div className={'fieldRow'}>
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
        </div>
    )
    
    render() {
        return (
            <div className="CreateProject">
                <div className="container">
                    <h1>Create</h1>
                    
                    { this.getPredictedCostSection() }
                    
                    <div className={'fieldRow'}>
                        <SimpleListMenu
                            options={[
                                CLUSTER_FORMS.TEMPLATE_FORM ,
                                CLUSTER_FORMS.JSON_FORM,
                            ]}
                            value={this.props.formState.formType}
                            onChange={(selectedOption) => this.handleFormUpdate('formType', selectedOption) }
                        />
                    </div>
                    
                    {
                        this.props.formState.formType === CLUSTER_FORMS.TEMPLATE_FORM &&
                        this.getClusterTemplateForm()
                    }
                    {
                        this.props.formState.formType === CLUSTER_FORMS.JSON_FORM &&
                        this.getClusterJSONForm()
                    }
                    <div className={'fieldRow deploymentTextArea'}>
                        <label>
                            Kubernetes Deployment YAML
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
                    </div>
                    <div className={'fieldRow'}>
                        <button onClick={this.handleSubmit}>Create</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    formState: state.createProjectReducer.formState
})

const mapDispatchToProps = dispatch => ({
    createProjectFormUpdate: (field, value) => dispatch(createProjectFormUpdate(field, value))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CreateProject)
)
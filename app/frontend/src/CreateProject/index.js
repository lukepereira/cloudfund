import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { CLUSTER_FORMS, CLUSTER_LOCATION_TYPES, REGIONS, MACHINE_TYPES, ZONES } from './constants'
import { withRouter } from 'react-router-dom'
import SimpleListMenu from '../components/SimpleListMenu'
import SimpleSelect from '../components/SimpleSelect'
import TextField from '../components/TextField'
import AlertDialog from '../components/AlertDialog'
import { createProject, createProjectFormUpdate, getPredictedCost } from '../actions/projectActions'
import { formatDollar } from '../helpers'

import './CreateProject.css'

class CreateProject extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            clusterFile: '',
            deploymentFile: '',
            cost: null,
            alertDialogIsOpen: false,
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (
            this.props.formState.location !== nextProps.formState.location
            || this.props.formState.machineType !== nextProps.formState.machineType
            || this.props.formState.initialNodeCount !== nextProps.formState.initialNodeCount
        ){
            this.getPredictedCostFromTemplate(nextProps)
        }

    }

    handleFormUpdate = (fieldName, value) => {
        this.props.createProjectFormUpdate(fieldName, value)
    }

    handleDeployment = (event) => this.handleFormUpdate('deploymentFile', event.target.value)

    handleCluster = (event) => {
        this.handleFormUpdate('JSONclusterFile', event.target.value)
        if (this.isValidJson(event.target.value)) {
            this.props.getPredictedCost(event.target.value)
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

    getCluster = () => {
        if (this.props.formState.formType === CLUSTER_FORMS.JSON_FORM){
            return {
                format: 'json',
                content: this.props.formState.JSONClusterFile,
            }
        }
        if (this.props.formState.formType === CLUSTER_FORMS.TEMPLATE_FORM) {
            return {
                format: 'template',
                content: this.props.formState
            }
        }
    }

    validateSubmit = () => {
        if (
            !this.props.formState.deploymentFile
            || !this.props.formState.projectName
        ) {
            return false
        }

        if (
            this.props.formState.formType === CLUSTER_FORMS.JSON_FORM
            && !this.props.formState.JSONClusterFile
        ) {
            return false
        }

        if (
            this.props.formState.formType === CLUSTER_FORMS.TEMPLATE_FORM
            && (
                !this.props.formState.location
                || !this.props.formState.machineType
                || !this.props.formState.initialNodeCount
            )
        ) {
            return false
        }

        if (
            this.props.formState.locationType === CLUSTER_LOCATION_TYPES.ZONAL
            && this.props.formState.machineType === 'f1-micro'
            && this.props.formState.initialNodeCount < 3
        ){
            return false
        }

        return true
    }


    handleSubmit = () => {
        if (!this.validateSubmit()){
            return
        }
        const postContent = {
            project_name: this.props.formState.projectName,
            cluster: this.getCluster(),
            deployment: {
                format: 'yaml',
                content: this.props.formState.deploymentFile,
            },
        }
        this.props.createProject(
            this.props.history,
            postContent,
        )
    }

    openAlert = () => {
        if (!this.validateSubmit()){
            return
        }

        this.setState({alertDialogIsOpen: true})
    }

    closeAlert = () => this.setState({alertDialogIsOpen: false})


    getPredictedCostFromTemplate = (props) => {
        if (
            !props.formState.location
            || !props.formState.machineType
            || !props.formState.initialNodeCount
        ){
            return
        }

        const clusterJSON = {
            cluster: {
                location: props.formState.location,
                nodePools: [ {
                    initialNodeCount: parseInt(props.formState.initialNodeCount, 10),
                    config: {
                        'machineType': props.formState.machineType,
                    },
                } ],
            },
        }
        this.props.getPredictedCost(JSON.stringify(clusterJSON))
    }

    getPredictedCostSection = () => {
        const monthlyCost = this.props.predictedCost ? formatDollar(this.props.predictedCost.monthly_cost) : 0
        const hourlyCost = this.props.predictedCost ? formatDollar(this.props.predictedCost.hourly_cost) : 0
        return(
            <div className={'costContainer'}>
                <div>
                    {`Monthly Cost: ${monthlyCost}`}
                </div>
                <div>
                    {`Hourly Cost: ${hourlyCost}`}
                </div>
            </div>
        )
    }

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
            const totalNodeCount = this.props.formState.initialNodeCount && this.props.formState.initialNodeCount > 0 && this.props.formState.initialNodeCount * 3
            return (
                <div className={'flexField'}>
                    <div className={'flexFieldColumn'}>
                        <TextField
                            error={this.props.formState.initialNodeCount < 0}
                            name={'initialNodeCount'}
                            label={'Number of Nodes (per zone)'}
                            placeholder={''}
                            type={'number'}
                            value={this.props.formState.initialNodeCount}
                            onChange={(event) => this.handleFormUpdate(event.target.name, event.target.value)}
                            inputProps={{min: 0, max: 15}}
                        />
                    </div>
                    <div className={'flexFieldColumn'} style={{textAlign: 'center'}}>
                        { `Total (in all zones): ${totalNodeCount || 0}`}
                    </div>
                </div>
            )
        }
        if (this.props.formState.locationType === CLUSTER_LOCATION_TYPES.ZONAL) {
            const error = this.props.formState.machineType === 'f1-micro' && this.props.formState.initialNodeCount < 3
            const helperText = error
                ? 'The total number of nodes in the cluster must be at least 3 when all the node pools have machine type "f1-micro":'
                : ''
            return (
                <TextField
                    error={error || this.props.formState.initialNodeCount < 0}
                    name={'initialNodeCount'}
                    label={'Number of Nodes'}
                    placeholder={''}
                    type={'number'}
                    helperText={helperText}
                    value={this.props.formState.initialNodeCount}
                    onChange={(event) => this.handleFormUpdate(event.target.name, event.target.value)}
                    inputProps={{min: 0, max: 15}}
                />
            )
        }
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
                        <TextField
                            name={'projectName'}
                            label={'Project Name'}
                            placeholder={''}
                            value={this.props.formState.projectName}
                            onChange={(event) => this.handleFormUpdate(event.target.name, event.target.value)}
                        />
                    </div>

                    {/* <div className={'fieldRow'}>
                        <SimpleListMenu
                            options={[
                                CLUSTER_FORMS.TEMPLATE_FORM ,
                                CLUSTER_FORMS.JSON_FORM,
                            ]}
                            value={this.props.formState.formType}
                            onChange={(selectedOption) => this.handleFormUpdate('formType', selectedOption) }
                        />
                    </div> */}

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
                                placeholder=''
                                rows='12'
                                col='25'
                                onChange={this.handleDeployment}
                                className={'full-width'}
                            >
                            </textarea>
                        </label>
                    </div>
                    <div className={'fieldRow'}>
                        <button onClick={this.openAlert}>Create</button>

                        <AlertDialog
                            title={'Are you sure?'}
                            message={[
                                'Cloudfound is still in its beta version and things may break or drasitcally change during development.',
                                ' There is no guarantee your deployment will work as expected.',
                                ' If you encounter any issues, please open an ',
                                <a target="_blank" href='https://github.com/lukepereira/cloudfound/issues'>issue</a>,
                                ' on Github or help contribute a fix.'
                            ]}
                            open={this.state.alertDialogIsOpen}
                            // onAgreeText={'Close'}
                            // onAgree={this.closeAlert}
                            onAgree={this.handleSubmit}
                            onDisagree={this.closeAlert}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    formState: state.createProjectReducer.formState,
    predictedCost: state.createProjectReducer.predictedCost,
})

const mapDispatchToProps = dispatch => ({
    createProject: (history, postContent) => dispatch(createProject(history, postContent)),
    createProjectFormUpdate: (field, value) => dispatch(createProjectFormUpdate(field, value)),
    getPredictedCost: (cluster) => dispatch(getPredictedCost(cluster)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CreateProject)
)

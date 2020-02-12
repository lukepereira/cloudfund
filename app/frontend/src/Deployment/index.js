import React from 'react'
import EmbedCode from '../components/EmbedCode'

import './Deployment.css'

class Deployment extends React.Component {
    getClusterConfig = () => {
        if (!this.props.project) {
            return
        }
        const baseSourceUrl = 'https://github.com/lukepereira/cloudfound'
        const baseGistURL = 'https://gist-it.appspot.com/github.com/lukepereira/cloudfund'

        const gistURL = `${baseGistURL}/blob/${this.props.project.sha}/clusters/${this.props.project.project_id}.json?footer=no&slice=`
        const sourceURL = `${baseSourceUrl}/blob/${this.props.project.sha}/clusters/${this.props.project.project_id}.json`
        return (
            <div className={'configContainer'}>
                <div className={'configHeader'}> Cluster Configuration JSON </div>
                <div className={'codeSnippet'}>
                    <EmbedCode html={`<script src="${gistURL}"></script>`} />
                </div>
                <div className={'sourceOutlink'}>
                    <a href={sourceURL} target={'_blank'}> View Source</a>
                </div>
            </div>
        )
    }

    getDeploymentConfig = () => {
        if (!this.props.project) {
            return
        }
        const baseSourceUrl = 'https://github.com/lukepereira/cloudfund'
        const baseGistURL = 'https://gist-it.appspot.com/github.com/lukepereira/cloudfund'

        const gistURL = this.props.project && `${baseGistURL}/blob/${this.props.project.sha}/deployments/${this.props.project.project_id}.yaml?footer=no&slice=`
        const sourceURL = `${baseSourceUrl}/blob/${this.props.project.sha}/clusters/${this.props.project.project_id}.json`

        return (
            <div className={'configContainer'}>
                <div className={'configHeader'}> Kubernetes Deployment YAML </div>
                <div className={'codeSnippet'}>
                    <EmbedCode html={`<script src="${gistURL}"></script>`} />
                </div>
                <div className={'sourceOutlink'}>
                    <a href={sourceURL} target={'_blank'}> View Source</a>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="Deployment">
                <form onSubmit={this.handleSubmit}>
                    <h1>Deployment</h1>
                    {this.getClusterConfig()}
                    {this.getDeploymentConfig()}
                </form>
            </div>
        )
    }
}

export default Deployment
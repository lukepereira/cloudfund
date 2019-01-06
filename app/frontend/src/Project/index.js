import React from 'react'
import './Project.css'
import { formatDollar } from '../helpers'

class Project extends React.Component {
    getProjectInfoTable = () => {
        const display_rows = this.props.project ? [
            { 
                display_content: this.props.project['date_created'],
                display_name: 'Date Created'
            },
            {
                display_content: this.props.project['project_id'],
                display_name: 'Project ID', 
            },
            {
                display_content: this.props.project['pull_request_url'],
                display_name: 'Pull Request URL',
            },
            {
                display_content: this.props.project['status'],
                display_name: 'Status',
            },
            {
                display_content: formatDollar(this.props.project['revenue']),
                display_name: 'Revenue',
            },
            {
                display_content: formatDollar(this.props.project['cumulative_cost']),
                display_name: 'Cumulative Cost',
            },
            {
                display_content: formatDollar(this.props.project['wallet']),
                display_name: 'Wallet',
            },
            {
                display_content: formatDollar(this.props.project['predicted_cost']['monthly_cost']),
                display_name: 'Predicted Monthly Cost'
            },
            {
                display_content: formatDollar(this.props.project['predicted_cost']['hourly_cost']),
                display_name: 'Predicted Hourly Cost'
            },
        ]
        : []
        return (
            this.props.project &&
            display_rows.map((row, i) => (
                <div className={'projectTableRow'} key={i}>
                    <div className={'projectTableKey'}>{row.display_name}:</div> 
                    <div className={'projectTableValue'}>{row.display_content}</div>
                </div>
            ))
        )
    }
    
    render() {
        return (
            <div className="Project">
                <form  onSubmit={this.handleSubmit}>
                    <h1> 
                        {
                            this.props.project
                            ? this.props.project.project_name
                            : 'Loading...'
                        }
                    </h1>
                    {
                        this.getProjectInfoTable()
                    }
                </form>
            </div>
        )
    }
}

export default Project
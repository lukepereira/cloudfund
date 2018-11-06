import React from 'react'
import './Project.css'


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
                display_content: this.props.project['project_url'],
                display_name: 'Project URL',
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
                display_content: this.props.project['wallet'],
                display_name: 'Wallet',
            },
            {
                display_content: this.props.project['cost']['monthly_cost'],
                display_name: 'Monthly Cost'
            },
            {
                display_content: this.props.project['cost']['hourly_cost'],
                display_name: 'Hourly Cost'
            },
        ]
        : []
        return (
            this.props.project &&
            display_rows.map((row, i) => (
                <div key={i}>
                    {row.display_name}: {row.display_content}
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
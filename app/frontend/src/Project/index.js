import React from 'react'
import './Project.css'
import { formatDollar } from '../helpers'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'

import EmbedCode from '../components/EmbedCode'

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} >
      {children}
    </Typography>
  )
}

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
})

class Project extends React.Component {
    
    state = {
      value: 0,
    }
    static propTypes = {
      classes: PropTypes.object.isRequired,
      theme: PropTypes.object.isRequired,
    }

    handleChange = (event, value) => {
      this.setState({ value })
    }

    handleChangeIndex = index => {
      this.setState({ value: index })
    }
    
    
    getProjectInfo = () => {
        const display_rows = this.props.project ? [            
            { 
                display_content: this.props.project['date_created'],
                display_name: 'Date Created'
            },
            {
                display_content: this.props.project['status'],
                display_name: 'Status',
            },
            {
                display_content: this.props.project['project_id'],
                display_name: 'Project ID', 
            },
            {
                display_content: this.props.project['pull_request_url'],
                display_name: 'Pull Request URL',
            },
        ]
        : []
        
        return (
            this.props.project &&
            <div className={'Project'}>
                <h1> {this.props.project.project_name} </h1>
                {
                    display_rows.map((row, i) => (
                        <div className={'projectTableRow'} key={i}>
                            <div className={'projectTableKey'}>{row.display_name}:</div> 
                            <div className={'projectTableValue'}>{row.display_content}</div>
                        </div>
                    ))
                }
            </div>
        )
    }
    
    getClusterInfo = () => {
        const display_rows = this.props.project ? [
            {
                display_content: this.props.project.cluster_location ,
                display_name: 'Location',
            },
            {
                display_content: this.props.project.endpoint,
                display_name: 'Endpoint',
            }
        ]
        : []
        return (    
            this.props.project &&
            <div className={'Project'}>
                {
                    display_rows.map((row, i) => (
                        <div className={'projectTableRow'} key={i}>
                            <div className={'projectTableKey'}>{row.display_name}:</div> 
                            <div className={'projectTableValue'}>{row.display_content}</div>
                        </div>
                    ))
                }    
            </div>

        )
    }
    getFundsInfo = () => {
        const display_rows = this.props.project ? [
            {
                display_content: formatDollar(this.props.project['predicted_cost']['monthly_cost']),
                display_name: 'Predicted Monthly Cost'
            },
            {
                display_content: formatDollar(this.props.project['predicted_cost']['hourly_cost']),
                display_name: 'Predicted Hourly Cost'
            },
            {
                display_content: formatDollar(this.props.project['cumulative_cost']),
                display_name: 'Cumulative Billed Cost',
            },
            {
                display_content: formatDollar(this.props.project['revenue']),
                display_name: 'Revenue',
            },
            {
                display_content: formatDollar(this.props.project['wallet']),
                display_name: 'Wallet',
            },

        ]
        : []
        return (
            this.props.project &&
            <div className={'Project'}>
                {
                    display_rows.map((row, i) => (
                        <div className={'projectTableRow'} key={i}>
                            <div className={'projectTableKey'}>{row.display_name}:</div> 
                            <div className={'projectTableValue'}>{row.display_content}</div>
                        </div>
                    ))
                }
            </div>
        )
    }
    
    render() {
        const { classes, theme } = this.props

        return (
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        centered
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="Project" />
                        <Tab label="Cluster" />
                        <Tab label="Funds" />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.value}
                    onChangeIndex={this.handleChangeIndex}
                    
                >
                    <TabContainer dir={theme.direction}>
                        {this.getProjectInfo()}
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        {this.getClusterInfo()}
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        {this.getFundsInfo()}
                    </TabContainer>
                </SwipeableViews>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Project)

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

class ProjectMenu extends React.Component {
    
    isPageSelected = (pageName) => {
        const paths = this.props.location.pathname.split('/')
        const currentPath = paths[paths.length - 1]

        return currentPath === pageName || 
            (pageName === 'info' && paths.length === 3)
    }
    
    render() {
        console.log("^^^", this.props)
        return (
            <div className={this.props.classes.root}>
              <List component="nav">
                <ListItem
                    button
                    onClick={() => {
                        this.props.history.push('/') 
                    }}>
                    <ListItemText  primary="Projects"/>
                </ListItem>
                <ListItem 
                    button
                    selected={this.isPageSelected('info')}
                    onClick={() => {
                        this.props.history.push(`${this.props.match.url}/info`) 
                    }} >
                    <ListItemText primary="Info" />
                </ListItem>
                <ListItem 
                    button
                    selected={this.isPageSelected('deployment')}
                    onClick={() => {
                        this.props.history.push(`${this.props.match.url}/deployment`) 
                    }} >
                    <ListItemText primary="Deployment" />
                </ListItem>
                <ListItem
                    button
                    selected={this.isPageSelected('payments')}
                    onClick={() => {
                        this.props.history.push(`${this.props.match.url}/payments`) 
                    }} >
                    <ListItemText primary="Payments" />
                </ListItem>
            </List>
        </div>
        )
    }
}

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
})

ProjectMenu.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles)(ProjectMenu))

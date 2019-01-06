import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


class ProjectsMenu extends React.Component {
    
    isListItemSelected = (path) => {
        return this.props.match.path === path ||
            (this.props.match.path === '/' && path === '/map') 
    }
    
    render() {
        return (
            <div className={this.props.classes.root}>
                <List component="nav">
                    
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={this.props.classes.heading}>All Projects</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={this.props.classes.expansionContainer}>
                            {
                                this.props.projects_list
                                && this.props.projects_list.map( (project, i) => (
                                    <ListItem
                                        key={project.project_id}
                                        button 
                                        component="a" 
                                        onClick={() => {
                                            this.props.history.push(`project/${project.project_id}`) 
                                        }}
                                    >
                                        <ListItemText primary={`${project.project_name}`} />
                                    </ListItem>
                                ))
                            }
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    
                    <ListItem 
                        button
                        selected={this.isListItemSelected('/map')}
                        onClick={() => {
                            this.props.history.push('/map') 
                        }}
                    >
                        <ListItemText primary="Map"/> 
                    </ListItem>
                    
                    <ListItem 
                        button
                        selected={this.isListItemSelected('/create')}
                        onClick={() => {
                            this.props.history.push('/create') 
                        }}
                        >
                        <ListItemText primary="Create"/> 
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expansionContainer: {
      display: 'flex',
      flexDirection: 'column',
      padding: '8px 0',
  }
})

ProjectsMenu.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    projects_list: state.projectsReducer.projects_list
})

export default withRouter(withStyles(styles)(
    connect(mapStateToProps) (ProjectsMenu)
))

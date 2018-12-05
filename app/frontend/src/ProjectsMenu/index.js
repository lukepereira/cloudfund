import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

class ProjectsMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            project_list: []
        }
        this.getProjects = this.getProjects.bind(this)
    }
    
    getProjects = () => {
        const post_url = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/get_projects'    
        const config = { 
            headers: {  
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(
            post_url,
            {},
            config
        )
        .then((response) => {
            console.log(response.data)
            this.setState({project_list: response.data})
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    componentDidMount = () => {
        this.getProjects()
    }
    
    render() {
        return (
            <div className={this.props.classes.root}>
              <List component="nav">
                <ListItem 
                    button
                    selected={true}
                    onClick={() => {
                        this.props.history.push('/create') 
                    }}
                >
                  <ListItemText primary="Create"/> 
                </ListItem>
                {
                    this.state.project_list
                    && this.state.project_list.map( (project, i) => (
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

ProjectsMenu.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles)(ProjectsMenu))

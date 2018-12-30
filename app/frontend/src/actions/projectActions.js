import axios from 'axios'

export const getProjectsActionTypes = Object.freeze({
    GET_PROJECTS_REQUESTED: 'GET_PROJECTS_REQUESTED',
    GET_PROJECTS_SUCCEEDED: 'GET_PROJECTS_SUCCEEDED',
    GET_PROJECTS_FAILED: 'GET_PROJECTS_FAILED',
 })

export const getProjects = () => 
    dispatch => {
        dispatch({type: getProjectsActionTypes.GET_PROJECTS_REQUESTED})
        
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
            dispatch({
                type: getProjectsActionTypes.GET_PROJECTS_SUCCEEDED,
                payload: {
                    projects_list: response.data
                }
            })
        })
        .catch((error) => {
            dispatch({
                type: getProjectsActionTypes.GET_PROJECTS_FAILED,
                payload: {
                    error
                }
            })
        })
    }



export const createProjectFormUpdateActionTypes = Object.freeze({
    CREATE_PROJECT_FORM_UPDATED: 'CREATE_PROJECT_FORM_UPDATED',
 })

export const createProjectFormUpdate = (field, value) => 
    dispatch => {
        dispatch({
            type: createProjectFormUpdateActionTypes.CREATE_PROJECT_FORM_UPDATED,
            payload: {
                field,
                value,
            }
        })
    }

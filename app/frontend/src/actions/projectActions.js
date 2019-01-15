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


export const createProjectActionTypes = Object.freeze({
    CREATE_PROJECT_REQUESTED: 'CREATE_PROJECT_REQUESTED',
    CREATE_PROJECT_SUCCESSFUL: 'CREATE_PROJECT_SUCCESSFUL',
    CREATE_PROJECT_FAILED: 'CREATE_PROJECT_FAILED',
})

export const createProject = (history, postContent) => 
    dispatch => {
        dispatch({type: createProjectActionTypes.CREATE_PROJECT_REQUESTED})
        
        const postUrl = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/create_project'    
        const config = { 
            headers: {  
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(
            postUrl,
            postContent,
            config,
        )
        .then((response) => {
            dispatch({type: createProjectActionTypes.CREATE_PROJECT_SUCCESSFUL})
            const project_id = response.data
            history.push(`project/${project_id}`)
        })
        .catch((error) => {
            console.log(error)
            dispatch({type: createProjectActionTypes.CREATE_PROJECT_FAILED})
        })
    }
    
export const getPredictedCostActionTypes = Object.freeze({
    GET_PREDICTED_COST_REQUESTED: 'GET_PREDICTED_COST_REQUESTED',
    GET_PREDICTED_COST_SUCCEEDED: 'GET_PREDICTED_COST_SUCCEEDED',
    GET_PREDICTED_COST_FAILED: 'GET_PREDICTED_COST_FAILED',
})    

export const getPredictedCost = (cluster_json) => 
    dispatch => {
        dispatch({type: getPredictedCostActionTypes.GET_PREDICTED_COST_REQUESTED})
        
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
            dispatch({
                type: getPredictedCostActionTypes.GET_PREDICTED_COST_SUCCEEDED,
                payload: {
                    cost: response.data,
                    hourly_cost: response.data.hourly_cost,
                    monthly_cost: response.data.monthly_cost
                }
            })
        })
        .catch((error) => {
            dispatch({
                type: getPredictedCostActionTypes.GET_PREDICTED_COST_FAILED,
                payload: {
                    error
                }
            })
        })
    }

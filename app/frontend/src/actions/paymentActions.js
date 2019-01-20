import axios from 'axios'
import { getProjectByID } from './projectActions'

export const projectChargeActionTypes = Object.freeze({
    CREATE_PROJECT_CHARGE_REQUESTED: 'CREATE_PROJECT_CHARGE_REQUESTED',
    CREATE_PROJECT_CHARGE_SUCCEEDED: 'CREATE_PROJECT_CHARGE_SUCCEEDED',
    CREATE_PROJECT_CHARGE_FAILED: 'CREATE_PROJECT_CHARGE_FAILED',
})

export const createProjectCharge = (postBody) =>
    dispatch => {
        dispatch({type: projectChargeActionTypes.GET_PROJECTS_REQUESTED})
        
        const postURL = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/handle_charge'    
        const config = { 
            headers: {  
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(
            postURL, 
            postBody,
            config,
        )
        .then((response) => {
            dispatch({ type: projectChargeActionTypes.GET_PROJECTS_SUCCEEDED })
            dispatch(getProjectByID(postBody.project_id))
        })
        .catch((error) => {
            console.log(error)
            
            dispatch({
                type: projectChargeActionTypes.GET_PROJECTS_FAILED,
                payload: {
                    error
                }
            })
        })
    }
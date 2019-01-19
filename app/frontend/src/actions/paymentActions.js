import axios from 'axios'
import { getProjectByID } from 'projectActions'

export const projectChargeActionTypes = Object.freeze({
    CREATE_PROJECT_CHARGE_REQUESTED: 'CREATE_PROJECT_CHARGE_REQUESTED',
    CREATE_PROJECT_CHARGE_SUCCEEDED: 'CREATE_PROJECT_CHARGE_SUCCEEDED',
    CREATE_PROJECT_CHARGE_FAILED: 'CREATE_PROJECT_CHARGE_FAILED',
})

createProjectCharge = (stripeToken, amount, project_id) =>
    dispatch => {
        dispatch({type: getProjectsActionTypes.GET_PROJECTS_REQUESTED})
        
        const post_url = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/handle_charge'    
        const config = { 
            headers: {  
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(
            post_url, 
            { 
                stripeToken,
                amount,
                project_id,
            },
            config,
        )
        .then((response) => {
            dispatch({ type: getProjectsActionTypes.GET_PROJECTS_SUCCEEDED })
            dispatch(getProjectByID(project_id))
        })
        .catch((error) => {
            console.log(error)
            
            dispatch({
                type: getProjectsActionTypes.GET_PROJECTS_FAILED,
                payload: {
                    error
                }
            })
        })
    }
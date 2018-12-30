import { actionTypes as getProjectsActions } from '../actions/getProjects'

const initialProjectReducerState = {
    loading: false,
    projects_list: [],
}

export default (state=initialProjectReducerState, action) => {
    switch (action.type) {
        case getProjectsActions.GET_PROJECTS_REQUESTED:
            return {
                loading: true,
            }
        case getProjectsActions.GET_PROJECTS_SUCCEEDED:
            return {
                loading: false,
                projects_list: action.payload.projects_list,
            }
        case getProjectsActions.GET_PROJECTS_FAILED:
            return {
                loading: false,
                error: action.payload.error,
            }
        default:
            return state
    }
}
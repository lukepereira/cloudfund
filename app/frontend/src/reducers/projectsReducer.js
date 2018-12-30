import {  getProjectsActionTypes } from '../actions/projectActions'

const initialProjectReducerState = {
    loading: false,
    projects_list: [],
}

export default (state=initialProjectReducerState, action) => {
    switch (action.type) {
        case getProjectsActionTypes.GET_PROJECTS_REQUESTED:
            return {
                ...state,
                loading: true,
            }
        case getProjectsActionTypes.GET_PROJECTS_SUCCEEDED:
            return {
                ...state,
                loading: false,
                projects_list: action.payload.projects_list,
            }
        case getProjectsActionTypes.GET_PROJECTS_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            }
        default:
            return state
    }
}
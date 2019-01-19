import {  getProjectsActionTypes, getProjectByIDActionTypes } from '../actions/projectActions'

const initialProjectReducerState = {
    loading: false,
    projects_list: [],
}

export function getUpdatedProjectsList(projects_list, newProject) {
    if (!projects_list) {
        return [ newProject ]
    }
    
    return projects_list.map( project => {
        if (project.project_id === newProject.project_id) {
            return newProject
        }
        return project
    })
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

        case getProjectByIDActionTypes.GET_PROJECT_REQUESTED:
            return {
                ...state,
                loading: true,
            }
        case getProjectByIDActionTypes.GET_PROJECT_SUCCEEDED:
            const newProjectList = getUpdatedProjectsList(state.project_list, action.payload.project)
            return {
                ...state,
                loading: false,
                project_list: newProjectList,
            }
        case getProjectByIDActionTypes.GET_PROJECT_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            }
        default:
            return state
    }
}
import {  createProjectFormUpdateActionTypes } from '../actions/projectActions'

const initialCreateProjectReducerState = {
    formState: {}
}

export default (state=initialCreateProjectReducerState, action) => {
    switch (action.type) {
        case createProjectFormUpdateActionTypes.CREATE_PROJECT_FORM_UPDATED:
            return {
                ...state,
                formState: {
                    ...state.formState,
                    [action.payload.field]: action.payload.value,
                }
            }

        default:
            return state
    }
}
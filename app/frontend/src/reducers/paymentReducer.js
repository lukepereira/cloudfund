import { projectChargeActionTypes } from '../actions/projectActions'

const initialProjectReducerState = {
    requesting: false,
    error: ''
}

export default (state=initialProjectReducerState, action) => {
    switch (action.type) {
        case projectChargeActionTypes.CREATE_PROJECT_CHARGE_REQUESTED:
            return {
                ...state,
                requesting: true,
            }
        case projectChargeActionTypes.CREATE_PROJECT_CHARGE_SUCCEEDED:
            return {
                ...state,
                requesting: false,
            }
        case projectChargeActionTypes.CREATE_PROJECT_CHARGE_FAILED:
            return {
                ...state,
                requesting: false,
                error: action.payload.error,
            }
        default:
            return state
    }
}
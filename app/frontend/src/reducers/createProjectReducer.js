import {
    createProjectFormUpdateActionTypes,
    getPredictedCostActionTypes,
} from '../actions/projectActions'
import { CLUSTER_FORMS, CLUSTER_LOCATION_TYPES } from '../CreateProject/constants'

const initialCreateProjectReducerState = {
    formState: {
        formType: CLUSTER_FORMS.TEMPLATE_FORM,
        locationType: CLUSTER_LOCATION_TYPES.REGIONAL,
    },
    predictedCost: null,
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
        case getPredictedCostActionTypes.GET_PREDICTED_COST_SUCCEEDED:
            return {
                ...state,
                predictedCost: action.payload.cost,
            }
        default:
            return state
    }
}
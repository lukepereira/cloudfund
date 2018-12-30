import { combineReducers } from 'redux';
import projectsReducer from './projectsReducer';
import createProjectReducer from './createProjectReducer';

export default combineReducers({
    createProjectReducer,
    projectsReducer,
});
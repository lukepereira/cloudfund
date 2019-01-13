import { combineReducers } from 'redux';
import projectsReducer from './projectsReducer';
import createProjectReducer from './createProjectReducer';
import UIReducer from './UIReducer';

export default combineReducers({
    createProjectReducer,
    projectsReducer,
    UIReducer,
});
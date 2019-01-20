import { UIActionTypes } from '../actions/UIActions'
import { isMobileDevice } from '../helpers'

const initialProjectReducerState = {
    isSideMenuOpen: !isMobileDevice(),
}

export default (state=initialProjectReducerState, action) => {
    switch (action.type) {
        case UIActionTypes.SIDE_MENU_OPEN:
            return {
                ...state,
                isSideMenuOpen: true
            }
            
        case UIActionTypes.SIDE_MENU_CLOSE:
            return {
                ...state,
                isSideMenuOpen: false
            }
        
        case UIActionTypes.SIDE_MENU_TOGGLE:
            return {
                ...state,
                isSideMenuOpen: !state.isSideMenuOpen
            }
        default:
            return state
    }
}